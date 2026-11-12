import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {decodeStripDng,decodeShadingTiff} from '../../scripts/photography/lake/dng-strips.js';
import data from '../../src/lib/photography/lake/data.json' with {type:'json'};

/** Minimal little-endian TIFF: one IFD plus a SubIFD or pixel payload, enough to exercise the readers. */
function tiff(entries,blobs=[]){
 const head=8+2+entries.length*12+4;let tail=head;const placed=blobs.map(b=>{const at=tail;tail+=b.length;return at;});
 const out=new Uint8Array(tail),v=new DataView(out.buffer);out.set([73,73,42,0,8,0,0,0]);v.setUint16(8,entries.length,true);
 entries.forEach(([tag,type,count,value],i)=>{const p=10+i*12;v.setUint16(p,tag,true);v.setUint16(p+2,type,true);v.setUint32(p+4,count,true);
  if(typeof value==='object')v.setUint32(p+8,placed[value.blob],true);else v.setUint32(p+8,value,true);});
 blobs.forEach((b,i)=>out.set(b,placed[i]));return out;
}
const u16=a=>new Uint8Array(Uint16Array.from(a).buffer),u32=a=>new Uint8Array(Uint32Array.from(a).buffer),f32=a=>new Uint8Array(Float32Array.from(a).buffer);

test('strip DNG reader returns samples and calibration in sensor order',()=>{
 const f=decodeStripDng(tiff([[256,4,1,2],[257,4,1,2],[258,3,1,16],[259,3,1,1],[262,3,1,32803],[273,4,1,{blob:0}],[274,3,1,1],[277,3,1,1],[279,4,1,8],
  [33421,3,2,2|2<<16],[33422,1,4,0|1<<8|1<<16|2<<24],[50714,5,4,{blob:1}],[50717,4,1,1023],[50728,5,3,{blob:2}]],
  [u16([100,200,300,400]),u32([64,1,64,1,64,1,64,1]),u32([1,2,1,1,1,4])]));
 assert.deepEqual([...f.samples],[100,200,300,400]);assert.deepEqual(f.pattern,[0,1,1,2]);
 assert.deepEqual(f.black,[64,64,64,64]);assert.equal(f.white,1023);assert.deepEqual(f.wb,[2,1,4]);
});
test('strip DNG reader refuses compressed data',()=>{
 assert.throws(()=>decodeStripDng(tiff([[256,4,1,2],[257,4,1,2],[258,3,1,16],[259,3,1,7],[262,3,1,32803],[277,3,1,1],[33421,3,2,2|2<<16]])),/uncompressed/);
});
test('shading reader returns four gains per cell',()=>{
 const gains=[1,1.5,1.5,2,1,1.25,1.25,1.5];
 const s=decodeShadingTiff(tiff([[256,3,1,2],[257,3,1,1],[258,3,4,{blob:1}],[259,3,1,1],[273,4,1,{blob:0}],[277,3,1,4],[279,4,1,32],[339,3,4,{blob:2}]],[f32(gains),u16([32,32,32,32]),u16([3,3,3,3])]));
 assert.deepEqual([s.width,s.height],[2,1]);assert.deepEqual(s.data,gains);
});
test('article data supports the claims the copy makes',()=>{
 assert.equal(data.frames.length,8);assert.ok(data.frames.every(f=>f.exposure===data.frames[0].exposure&&f.iso===data.frames[0].iso));
 assert.deepEqual([data.frames[0].dx,data.frames[0].dy],[0,0]);
 // More frames never look noisier, and eight cannot beat the square-root limit.
 for(let i=1;i<data.noise.length;i++)assert.ok(data.noise[i]<data.noise[i-1]);
 assert.ok(data.noise.at(-1)>1/Math.sqrt(8)&&data.noise.at(-1)<.5);
 assert.ok(data.gain.groundEv-data.gain.skyEv>1,'the ground is brightened at least twice as much as the sky');
 assert.ok(data.robust.rejected/data.robust.total<1e-4);
 assert.ok(data.stops.includes(data.fuse.longEv),'the bright version of the blend is one of the slider pictures');
 for(const name of Object.keys(data.files))assert.ok(existsSync(`public/photography/lake/${name}`),name);
});
