// Reproducible, offline derivatives. Original RAWs remain outside the blog.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {decodeDng} from './dng.js';
import {stagePixel,renderRegion,toneMap,encodeSrgb,channelAt,normalizedAt,contributors,reconstruct} from '../../src/lib/photography/pipeline.js';
import {estimateTranslation,mergeFrames} from '../../src/lib/photography/burst.js';
const source=resolve(process.argv[2] || '../phone-photography-talk/public/assets');
const out='public/photography'; mkdirSync(out,{recursive:true});
const json=name=>JSON.parse(readFileSync(`${source}/${name}`));
const manifest=json('manifest.json'),validation=json('burst-validation.json');
const shading=json('shading.json'),matrix=readFileSync(`${source}/rgb2rgb.txt`,'utf8').trim().split(/\s+/).map(Number);
const hash=b=>createHash('sha256').update(b).digest('hex');
const crop={x:2109,y:2009,width:384,height:384};
for(const name of ['manifest.json','validation.json','burst-validation.json','burst-registration.json','rgb2rgb.txt','shading.json'])writeFileSync(`${out}/${name}`,readFileSync(`${source}/${name}`));
const files={};
async function save(name,width,height,data,rotate=true){
 const buffer=await sharp(Buffer.from(data),{raw:{width,height,channels:4}}).rotate(rotate?90:0).webp({lossless:name!=='photograph',quality:88}).toBuffer();
 writeFileSync(`${out}/${name}.webp`,buffer); files[`${name}.webp`]={sha256:hash(buffer),width:rotate?height:width,height:rotate?width:height};
}
function display(f){const data=new Uint8Array(f.width*f.height*4);for(let i=0;i<f.width*f.height;i++){const rgb=toneMap([0,1,2].map(c=>f.data[i*3+c]*4));for(let c=0;c<3;c++)data[i*4+c]=Math.round(Math.max(0,Math.min(1,encodeSrgb(rgb[c])))*255);data[i*4+3]=255;}return data;}
const frames=[];let patch;let sourceSampleStats;
for(let i=0;i<4;i++){
 const b=readFileSync(`${source}/${validation[i].file}`);
 if(hash(b)!==validation[i].sha256)throw Error('Source hash mismatch');
 const f={...decodeDng(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),shading,matrix};
 if(hash(new Uint8Array(f.samples.buffer))!==validation[i].samplesSha256)throw Error('Decoded sample hash mismatch');
 const data=new Float32Array(384*384*3);
 for(let y=0;y<384;y++)for(let x=0;x<384;x++)data.set(stagePixel(f,crop.x+x,crop.y+y,'color'),(y*384+x)*3);
 frames.push({width:384,height:384,data});
 await save(`frame-${i}`,384,384,display(frames[i]));
 if(i===0){
  let maximum=0,saturated=0;for(const value of f.samples){maximum=Math.max(maximum,value);if(value>=f.white)saturated++;}
  sourceSampleStats={maximum,saturated,white:f.white};
  if(maximum!==814||saturated!==0)throw Error('Original sample-range regression');
  const p=renderRegion(f,{step:4});await save('photograph',p.width,p.height,p.data);
  const x=2301,y=2201;
  const cells=[];for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const nx=x+dx,ny=y+dy;cells.push({x:nx,y:ny,c:channelAt(f,nx,ny),dn:f.samples[ny*f.width+nx],value:normalizedAt(f,nx,ny)});}
  const sites=cells.filter(s=>Math.abs(s.x-x)<=1&&Math.abs(s.y-y)<=1).map(s=>({...s,channels:[0,1,2].map(c=>({c,value:reconstruct(f,s.x,s.y,{wb:false,shading:false})[c],sites:contributors(f,s.x,s.y,c).map(p=>({...p,value:normalizedAt(f,p.x,p.y),dn:f.samples[p.y*f.width+p.x]}))}))}));
  patch={x,y,cells,sites,black:f.black,white:f.white,pattern:f.pattern,origin:f.origin};
  // A real 32x32 patch centred on the numerical target. No synthetic RGB sampling.
  const detail=renderRegion(f,{x:x-16,y:y-16,width:32,height:32});await save('detail',32,32,detail.data);
 }
 console.log(`Decoded and verified N00${i}`);
}
const transforms=[{dx:0,dy:0,valid:true},...frames.slice(1).map(f=>estimateTranslation(frames[0],f))];
const expected=json('burst-registration.json');
for(let i=0;i<4;i++)for(const axis of ['dx','dy'])if(transforms[i][axis]!==expected.transforms[i][axis])throw Error('Registration regression');
const merged=mergeFrames(frames,transforms);
if(merged.rejected!==expected.rejected||merged.total!==expected.total)throw Error('Rejection regression');
await save('unaligned',384,384,display(mergeFrames(frames,transforms,{aligned:false,robust:false})));
await save('aligned',384,384,display(mergeFrames(frames,transforms,{robust:false})));
await save('merged',384,384,display(merged));
const mask=new Uint8Array(384*384*4);for(let i=0;i<384*384;i++)mask.set(merged.mask[i]?[169,82,10,255]:[233,238,243,255],i*4);await save('disagreement',384,384,mask);
const record={crop,patch,sourceSampleStats,transforms,rejected:merged.rejected,total:merged.total,files,sourceHashes:validation.map(v=>({file:v.file,sha256:v.sha256,samplesSha256:v.samplesSha256})),viewing:{ev:2,tone:1,encoding:'sRGB',orientation:'90 degrees clockwise',comparison:'identical full 384x384 framing; no independent normalization',locator:'stride 4 native point sampling'},license:manifest.license,attribution:manifest.attribution};
writeFileSync(`${out}/article-data.json`,JSON.stringify(record,null,2));
writeFileSync('src/lib/photography/article-data.json',JSON.stringify(record,null,2));
console.log(`Verified translations and ${merged.rejected}/${merged.total} rejected observations; ${Object.keys(files).length} images generated.`);
