/** Translation-only educational registration in reconstructed linear RGB.
 * dx/dy are source sampling offsets: aligned(x,y) = source(x+dx,y+dy). */
export function luminance(frame) {
 const out=new Float32Array(frame.width*frame.height);
 for(let i=0;i<out.length;i++)out[i]=frame.data[i*3]*.2126+frame.data[i*3+1]*.7152+frame.data[i*3+2]*.0722;
 return {width:frame.width,height:frame.height,data:out};
}
function half(f){const width=Math.floor(f.width/2),height=Math.floor(f.height/2),data=new Float32Array(width*height);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=2*y*f.width+2*x;data[y*width+x]=(f.data[p]+f.data[p+1]+f.data[p+f.width]+f.data[p+f.width+1])/4;}return {width,height,data};}
export function sample(data,w,h,x,y,channels=1,c=0){
 if(x<0 || y<0 || x>w-1 || y>h-1)return null;
 const ix=Math.min(w-2,Math.floor(x)),iy=Math.min(h-2,Math.floor(y)),u=x-ix,v=y-iy;
 const at=(a,b)=>data[(b*w+a)*channels+c];
 return (at(ix,iy)*(1-u)+at(ix+1,iy)*u)*(1-v)+(at(ix,iy+1)*(1-u)+at(ix+1,iy+1)*u)*v;
}
function score(a,b,dx,dy,margin=20,step=2){
 let sum=0,n=0;
 for(let y=margin;y<a.height-margin;y+=step)for(let x=margin;x<a.width-margin;x+=step){const other=sample(b.data,b.width,b.height,x+dx,y+dy);if(other===null)continue;const d=other-a.data[y*a.width+x];sum+=Math.min(d*d,.01);n++;}
 return n?sum/n:Infinity;
}
export function estimateTranslation(reference,other,maxShift=20){
 const ap=[luminance(reference)],bp=[luminance(other)];for(let i=0;i<2;i++){ap.push(half(ap.at(-1)));bp.push(half(bp.at(-1)));}
 let dx=0,dy=0,best=Infinity;
 for(let level=2;level>=0;level--){
  dx*=2;dy*=2;const radius=level===2?Math.ceil(maxShift/4):2,baseX=dx,baseY=dy;
  best=Infinity;
  for(let y=-radius;y<=radius;y++)for(let x=-radius;x<=radius;x++){const sx=baseX+x,sy=baseY+y,s=score(ap[level],bp[level],sx,sy,Math.max(3,Math.ceil(maxShift/2**level)+1));if(s<best){best=s;dx=sx;dy=sy;}}
 }
 for(const delta of [.5,.25,.125]){const bx=dx,by=dy;for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){const s=score(ap[0],bp[0],bx+x*delta,by+y*delta);if(s<best){best=s;dx=bx+x*delta;dy=by+y*delta;}}}
 const before=score(ap[0],bp[0],0,0),after=score(ap[0],bp[0],dx,dy);let mean=0,variance=0;for(const v of ap[0].data)mean+=v;mean/=ap[0].data.length;for(const v of ap[0].data)variance+=(v-mean)**2;variance/=ap[0].data.length;
 const valid=Number.isFinite(after)&&variance>1e-6&&Math.abs(dx)<maxShift&&Math.abs(dy)<maxShift&&after<=before*1.05;
 return {dx:valid?dx:0,dy:valid?dy:0,before,after,valid,variance};
}
export function mergeFrames(frames,transforms,{aligned=true,robust=true,count=frames.length}={}){
 const {width,height}=frames[0],data=new Float32Array(width*height*3),mask=new Uint8Array(width*height);let rejected=0,total=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const p=y*width+x,ref=[0,1,2].map(c=>frames[0].data[p*3+c]);const refY=ref[0]*.2126+ref[1]*.7152+ref[2]*.0722;
  let weight=1,sum=[...ref];
  for(let i=1;i<Math.min(count,frames.length);i++){
   if(aligned&&!transforms[i].valid){mask[p]=255;continue;}
   const t=aligned?transforms[i]:{dx:0,dy:0},sx=x+t.dx,sy=y+t.dy;
   const values=[0,1,2].map(c=>sample(frames[i].data,width,height,sx,sy,3,c));if(values[0]===null){mask[p]=255;continue;}
   total++;const ly=values[0]*.2126+values[1]*.7152+values[2]*.0722;
   // Explicit conservative residual rejection; not semantic motion detection.
   if(robust&&Math.abs(ly-refY)>.012+.12*Math.max(0,refY)){mask[p]=255;rejected++;continue;}
   for(let c=0;c<3;c++)sum[c]+=values[c];weight++;
  }
  for(let c=0;c<3;c++)data[p*3+c]=sum[c]/weight;
 }
 return {width,height,data,mask,rejected,total};
}
