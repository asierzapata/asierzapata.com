// Offline derivatives for the three-cheats article. RAWs stay in .cache; run fetch.mjs first.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import sharp from 'sharp';
import {decodeStripDng,decodeShadingTiff} from './dng-strips.js';
import {BURST,CACHE,FRAMES,REFERENCE,sources} from './fetch.mjs';
import {stagePixel,channelAt,normalizedAt,shadingAt,multiplyMatrix,toneMap,encodeSrgb,decodeSrgb} from '../../../src/lib/photography/pipeline.js';
import {estimateTranslation,mergeFrames} from '../../../src/lib/photography/burst.js';
const out='public/photography/lake';mkdirSync(out,{recursive:true});
const CW=512,CH=384,BIN=4,VIEW_GAIN=24,crop={x:1750,y:1662,width:CW,height:CH};
const matrix=readFileSync(`${CACHE}/rgb2rgb.txt`,'utf8').trim().split(/\s+/).map(Number);
const shading=decodeShadingTiff(readFileSync(`${CACHE}/shading.tiff`));
const order=[REFERENCE,...Array.from({length:FRAMES},(_,i)=>i).filter(i=>i!==REFERENCE)];
const raws=order.map(i=>({...decodeStripDng(readFileSync(`${CACHE}/N00${i}.dng`)),shading,matrix,name:`N00${i}`}));
const ref=raws[0],luma=rgb=>rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722,clamp=v=>Math.max(0,Math.min(1,v));
const byte=v=>Math.round(clamp(encodeSrgb(clamp(v)))*255);
const files={};
// quality 0 means lossless: lossy WebP halves colour resolution, which erases a one-pixel colour checkerboard.
async function save(name,width,height,rgb,quality=90){
 const info=await sharp(Buffer.from(rgb),{raw:{width,height,channels:3}}).webp(quality?{quality}:{lossless:true}).toFile(`${out}/${name}.webp`);
 files[`${name}.webp`]={width,height,bytes:info.size};
}
const paint=(width,height,pixel)=>{const data=new Uint8Array(width*height*3);for(let i=0;i<width*height;i++)data.set(pixel(i).map(byte),i*3);return data;};
const view=rgb=>toneMap(rgb.map(v=>v*VIEW_GAIN));

// 1. The whole frame, binned 4x4. Binning averages real sites; nothing is invented.
const W=ref.width/BIN,H=ref.height/BIN,full=new Float32Array(W*H*3),sensor=new Float32Array(W*H);
for(let j=0;j<H;j++)for(let i=0;i<W;i++){
 const sum=[0,0,0],count=[0,0,0];let grey=0;
 for(let dy=0;dy<BIN;dy++)for(let dx=0;dx<BIN;dx++){
  const x=i*BIN+dx,y=j*BIN+dy,c=channelAt(ref,x,y),v=normalizedAt(ref,x,y);
  grey+=v;sum[c]+=v*ref.wb[c]*shadingAt(ref,x,y);count[c]++;
 }
 sensor[j*W+i]=grey/(BIN*BIN);full.set(multiplyMatrix(sum.map((v,c)=>v/count[c]),matrix),(j*W+i)*3);
}
await save('sensor',W,H,paint(W,H,i=>[sensor[i],sensor[i],sensor[i]]),88);
const stops=[0,1,2,3,4,5];
for(const ev of stops)await save(`ev-${ev}`,W,H,paint(W,H,i=>[0,1,2].map(c=>full[i*3+c]*2**ev)),88);
const phone=await sharp(`${CACHE}/final.jpg`).resize(W,H).removeAlpha().raw().toBuffer();
await sharp(`${CACHE}/final.jpg`).resize(W,H).webp({quality:88}).toFile(`${out}/phone.webp`);files['phone.webp']={width:W,height:H};

// 1b. Our own small version of the trick: render the frame dark and bright, prefer whichever is closer to mid-grey, blend.
// HDR+ fuses two synthetic exposures of the merged frame in the same spirit, with pyramid blending instead of one blurred mask.
const LONG_EV=3,exposed=v=>Math.exp(-((encodeSrgb(clamp(v))-.38)**2)/(2*.15**2));
const pick=new Uint8Array(W*H);
for(let i=0;i<W*H;i++){const l=luma([0,1,2].map(c=>full[i*3+c])),dark=exposed(l),bright=exposed(l*2**LONG_EV);pick[i]=Math.round(255*bright/(bright+dark));}
const mask=await sharp(Buffer.from(pick),{raw:{width:W,height:H,channels:1}}).blur(7).extractChannel(0).raw().toBuffer();
await save('mask',W,H,Uint8Array.from({length:W*H*3},(_,k)=>mask[Math.floor(k/3)]),88);
await save('fused',W,H,paint(W,H,i=>[0,1,2].map(c=>full[i*3+c]*(1+mask[i]/255*(2**LONG_EV-1)))),88);

// 2. How much brighter the phone made each region than a plain, even rendering of the same frame.
const CELL=12,gw=W/CELL,gh=H/CELL,gainEv=new Float32Array(gw*gh);
for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){
 let a=0,b=0;
 for(let dy=0;dy<CELL;dy++)for(let dx=0;dx<CELL;dx++){const p=(j*CELL+dy)*W+i*CELL+dx;a+=luma([0,1,2].map(c=>decodeSrgb(phone[p*3+c]/255)));b+=luma([0,1,2].map(c=>full[p*3+c]));}
 gainEv[j*gw+i]=Math.log2(Math.max(a,1e-6)/Math.max(b,1e-6));
}
const band=(from,to)=>{const v=[];for(let j=Math.floor(gh*from);j<Math.floor(gh*to);j++)for(let i=0;i<gw;i++)v.push(gainEv[j*gw+i]);v.sort((a,b)=>a-b);return v[v.length>>1];};
const sorted=[...gainEv].sort((a,b)=>a-b),half=v=>Math.round(v*2)/2;
const gain={skyEv:band(0,.2),groundEv:band(.6,1)},lo=half(sorted[Math.floor(sorted.length*.02)]),hi=half(sorted[Math.floor(sorted.length*.98)]);
const ramp=[[13,20,40],[52,84,160],[226,120,60],[255,224,130]];
const heat=new Uint8Array(gw*gh*3);
for(let i=0;i<gw*gh;i++){const t=clamp((gainEv[i]-lo)/(hi-lo))*(ramp.length-1),k=Math.min(ramp.length-2,Math.floor(t)),u=t-k;heat.set(ramp[k].map((v,c)=>Math.round(v*(1-u)+ramp[k+1][c]*u)),i*3);}
const heatInfo=await sharp(Buffer.from(heat),{raw:{width:gw,height:gh,channels:3}}).resize(W,H,{kernel:'cubic'}).blur(6).webp({quality:88}).toFile(`${out}/gain.webp`);
files['gain.webp']={width:W,height:H,bytes:heatInfo.size};Object.assign(gain,{scaleEv:[lo,hi],ramp});

// 3. One 512x384 window at native resolution, the same 4:3 shape as the whole frame: what was measured, then what was guessed.
const at=(f,x,y)=>[crop.x+x,crop.y+y];
await save('mosaic-grey',CW,CH,paint(CW,CH,i=>{const [x,y]=at(ref,i%CW,Math.floor(i/CW)),v=normalizedAt(ref,x,y)*shadingAt(ref,x,y);return view([v,v,v]);}),0);
await save('mosaic',CW,CH,paint(CW,CH,i=>{const [x,y]=at(ref,i%CW,Math.floor(i/CW)),c=channelAt(ref,x,y),rgb=[0,0,0];rgb[c]=normalizedAt(ref,x,y)*ref.wb[c]*shadingAt(ref,x,y)*VIEW_GAIN;return rgb;}),0);

// 4. The same window in all eight frames, then aligned and averaged.
const frames=raws.map(f=>{const data=new Float32Array(CW*CH*3);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)data.set(stagePixel(f,crop.x+x,crop.y+y,'color'),(y*CW+x)*3);return {width:CW,height:CH,data};});
const show=f=>paint(CW,CH,i=>view([0,1,2].map(c=>f.data[i*3+c])));
for(const [i,f] of frames.entries())await save(`frame-${i}`,CW,CH,show(f),0);
const transforms=[{dx:0,dy:0,valid:true},...frames.slice(1).map(f=>estimateTranslation(frames[0],f))];
if(transforms.some(t=>!t.valid))throw Error('A frame failed to register.');
// Fine-grain energy of the green channel: a simple stand-in for visible noise.
const grain=f=>{let s=0,n=0;for(let y=1;y<CH-1;y++)for(let x=1;x<CW-1;x++){const p=(y*CW+x)*3+1,l=4*f.data[p]-f.data[p-3]-f.data[p+3]-f.data[p-CW*3]-f.data[p+CW*3];s+=l*l;n++;}return Math.sqrt(s/n);};
const noise=[];let rejected=0,total=0;
for(let count=1;count<=FRAMES;count++){const m=mergeFrames(frames,transforms,{count,robust:false});noise.push(grain(m));await save(`stack-${count}`,CW,CH,show(m),count===1?0:90);}
await save('unaligned',CW,CH,show(mergeFrames(frames,transforms,{aligned:false,robust:false})));
({rejected,total}=mergeFrames(frames,transforms));

const record={burst:BURST,camera:ref.model,frames:raws.map((f,i)=>({name:f.name,exposure:f.exposure,iso:f.iso,dx:transforms[i].dx,dy:transforms[i].dy})),
 sensor:{width:ref.width,height:ref.height,pattern:ref.pattern,white:ref.white},crop,bin:BIN,viewGain:VIEW_GAIN,stops,
 fuse:{longEv:LONG_EV},noise:noise.map(v=>v/noise[0]),robust:{rejected,total},gain,files,sources,
 license:'CC-BY-SA-4.0',attribution:'Hasinoff et al., Burst photography for high dynamic range and low-light imaging on mobile cameras, ACM TOG 35(6), 2016'};
mkdirSync('src/lib/photography/lake',{recursive:true});
writeFileSync('src/lib/photography/lake/data.json',JSON.stringify(record,null,1));
console.log(JSON.stringify({frames:record.frames,noise:record.noise,robust:record.robust,gain:{sky:gain.skyEv,ground:gain.groundEv,scale:gain.scaleEv}},null,1));
