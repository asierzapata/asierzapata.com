export const channelAt = (frame,x,y) => frame.pattern[((y+frame.origin[1])&1)*2+((x+frame.origin[0])&1)];
export const siteAt = (f,x,y) => ((y+f.origin[1])&1)*2+((x+f.origin[0])&1);
export const normalizedAt = (f,x,y) => (f.samples[y*f.width+x]-f.black[siteAt(f,x,y)])/(f.white-f.black[siteAt(f,x,y)]);

/** The kernel returns the exact contributors used for every displayed estimate.
 * Borders exclude unavailable sites and renormalize the remaining weights. */
export function contributors(f,x,y,channel) {
  if(channelAt(f,x,y)===channel) return [{x,y,weight:1}];
  const neighbors=[];
  for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
    const nx=x+dx,ny=y+dy;
    if(nx>=0 && ny>=0 && nx<f.width && ny<f.height && channelAt(f,nx,ny)===channel) neighbors.push({x:nx,y:ny});
  }
  return neighbors.map(p=>({...p,weight:1/neighbors.length}));
}
export function shadingAt(f,x,y) {
  if(!f.shading) return 1;
  const s=f.shading, px=x/(f.width-1)*(s.width-1),py=y/(f.height-1)*(s.height-1);
  const ix=Math.min(s.width-2,Math.floor(px)),iy=Math.min(s.height-2,Math.floor(py)),u=px-ix,v=py-iy;
  // Dataset sidecar order: R, G on red row, G on blue row, B.
  const c=channelAt(f,x,y), rowColor=channelAt(f,x^1,y), sc=c===0?0:c===2?3:rowColor===0?1:2;
  const at=(a,b)=>s.data[(b*s.width+a)*4+sc];
  return (at(ix,iy)*(1-u)+at(ix+1,iy)*u)*(1-v)+(at(ix,iy+1)*(1-u)+at(ix+1,iy+1)*u)*v;
}
export function reconstruct(f,x,y,{wb=true,shading=true,gains=f.wb}={}) {
  return [0,1,2].map(c=>contributors(f,x,y,c).reduce((sum,p)=>sum+normalizedAt(f,p.x,p.y)*(wb?gains[c]:1)*(shading?shadingAt(f,p.x,p.y):1)*p.weight,0));
}
export const multiplyMatrix = (rgb,m) => [0,1,2].map(i=>rgb.reduce((s,v,j)=>s+v*m[i*3+j],0));
export const encodeSrgb = v => v<=0.0031308 ? 12.92*v : 1.055*Math.pow(v,1/2.4)-0.055;
export const decodeSrgb = v => v<=0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4;
export function toneMap(rgb,strength=1) {
  const y=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  const gain=y>0 ? 1/(1+strength*y) : 1;
  return rgb.map(v=>v*gain);
}
/** Floating-point stage buffers stay unencoded and unclipped. */
export function stagePixel(f,x,y,stage,{ev=2,tone=1,wb=true,color=true,gains=f.wb}={}) {
  const sample=normalizedAt(f,x,y);
  if(stage==='samples') return [sample,sample,sample];
  if(stage==='balanced') { const v=sample*f.wb[channelAt(f,x,y)]; return [v,v,v]; }
  let rgb=reconstruct(f,x,y,{wb:stage==='reconstruction'?false:wb,shading:stage!=='reconstruction',gains});
  if(stage==='reconstruction') return rgb;
  if(color) rgb=multiplyMatrix(rgb,f.matrix);
  if(stage==='color') return rgb;
  rgb=rgb.map(v=>v*2**ev);
  if(stage==='exposure') return rgb;
  return toneMap(rgb,tone);
}
/** Pure viewing adapter, never writes to any input buffer. Camera RGB uses a
 * fixed reference matrix; every nonfinal stage uses the SAME preview +2 EV,
 * shoulder and sRGB adapter. Samples use fixed scalar mapping, no auto stretch. */
export function inspect(rgb,stage,opts={}) {
  let result=[...rgb];
  if(stage==='samples' || stage==='balanced') result=result.map(v=>v*4);
  else if(stage==='reconstruction') result=toneMap(multiplyMatrix(result,opts.matrix).map(v=>v*4));
  else if(stage==='color') result=toneMap(result.map(v=>v*4));
  else if(stage==='exposure') result=toneMap(result);
  return result.map(v=>Math.round(Math.max(0,Math.min(1,encodeSrgb(v)))*255));
}
export function renderRegion(f,{x=0,y=0,width=f.width,height=f.height,step=1,stage='final',...opts}={}) {
  const w=Math.ceil(width/step),h=Math.ceil(height/step),data=new Uint8ClampedArray(w*h*4);
  for(let j=0;j<h;j++) for(let i=0;i<w;i++) {
    const rgb=inspect(stagePixel(f,x+i*step,y+j*step,stage,opts),stage,{matrix:f.matrix});
    const p=(j*w+i)*4;data.set(rgb,p);data[p+3]=255;
  }
  return {width:w,height:h,data};
}
