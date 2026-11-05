import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { channelAt, contributors, normalizedAt, reconstruct, stagePixel, inspect, shadingAt } from '../../src/lib/photography/pipeline.js'
import { estimateTranslation, mergeFrames, sample } from '../../src/lib/photography/burst.js'
const article=JSON.parse(readFileSync('public/photography/article-data.json'))
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`)
const fixture=(pattern=[0,1,1,2],origin=[0,0])=>({width:7,height:7,samples:new Uint16Array(49),black:[0,0,0,0],white:1000,pattern,origin,wb:[2,1,1.5],matrix:[1,0,0,0,1,0,0,0,1]})
test('every CFA phase preserves the measured component and reconstructs constant channels, including borders',()=>{
 for(const pattern of [[0,1,1,2],[2,1,1,0],[1,0,2,1],[1,2,0,1]])for(const origin of [[0,0],[1,0],[0,1],[1,1]]){
  const f=fixture(pattern,origin)
  for(let y=0;y<7;y++)for(let x=0;x<7;x++)f.samples[y*7+x]=[100,200,300][channelAt(f,x,y)]
  for(let y=0;y<7;y++)for(let x=0;x<7;x++){
   reconstruct(f,x,y,{wb:false}).forEach((v,c)=>close(v,[.1,.2,.3][c]))
   assert.deepEqual(contributors(f,x,y,channelAt(f,x,y)),[{x,y,weight:1}])
  }
 }
})
test('published contributors, weights and estimates agree with actual retained RAW neighbourhood',()=>{
 const {patch}=article,first=patch.cells[0]
 const f={...fixture(patch.pattern,[first.x&1,first.y&1]),black:patch.black,white:patch.white,samples:Uint16Array.from(patch.cells.map(s=>s.dn))}
 for(const target of patch.sites){
  const x=target.x-first.x,y=target.y-first.y
  assert.equal(channelAt(f,x,y),target.c)
  const rgb=reconstruct(f,x,y,{wb:false,shading:false})
  for(const c of target.channels){
   close(rgb[c.c],c.value)
   const expected=contributors(f,x,y,c.c).map(p=>({x:p.x+first.x,y:p.y+first.y,weight:p.weight,value:normalizedAt(f,p.x,p.y),dn:f.samples[p.y*7+p.x]}))
   assert.deepEqual(c.sites,expected)
  }
 }
 const red=patch.sites.find(s=>s.x===patch.x&&s.y===patch.y)
 assert.equal(red.c,0);assert.equal(red.channels[1].sites.length,4);assert.equal(red.channels[2].sites.length,4)
 const green=patch.sites.find(s=>s.c===1)
 assert.equal(green.channels[0].sites.length,2);assert.equal(green.channels[2].sites.length,2)
})
test('calibration retains fractions, unclipped measurements and immutable viewing',()=>{
 const f=fixture();f.black=[63.75,63.5,63.5,63.75];f.white=1023;f.samples[0]=145
 close(normalizedAt(f,0,0),(145-63.75)/(1023-63.75))
 f.samples[0]=0;assert.ok(normalizedAt(f,0,0)<0);f.samples[0]=1200;assert.ok(normalizedAt(f,0,0)>1)
 const v=[-.1,.3,2],copy=[...v];inspect(v,'final');assert.deepEqual(v,copy)
 f.shading={width:2,height:2,data:[2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5]}
 close(shadingAt(f,0,0),2);close(shadingAt(f,1,0),3);close(shadingAt(f,0,1),4);close(shadingAt(f,1,1),5)
 const before=f.samples.slice();stagePixel(f,2,2,'final');assert.deepEqual(f.samples,before)
})
function scene(w=96,h=96){const data=new Float32Array(w*h*3);for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let c=0;c<3;c++)data[(y*w+x)*3+c]=.3+.12*Math.sin(x*.27)+.13*Math.cos(y*.19);return {width:w,height:h,data}}
test('registration recovers known integer and fractional shifts with the documented sign',()=>{
 const a=scene()
 for(const [dx,dy]of [[3,-2],[-4,1],[2.5,-1.25]]){
  const b={...a,data:new Float32Array(a.data.length)}
  for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++)for(let c=0;c<3;c++)b.data[(y*a.width+x)*3+c]=sample(a.data,a.width,a.height,x-dx,y-dy,3,c)??0
  const t=estimateTranslation(a,b,10);assert.ok(t.valid);assert.ok(Math.abs(t.dx-dx)<=.25);assert.ok(Math.abs(t.dy-dy)<=.25);assert.ok(t.after<t.before)
 }
})
test('merge treats out-of-overlap and residual rejection separately',()=>{
 const a=scene(),b={...a,data:a.data.slice()},identity={dx:0,dy:0,valid:true}
 for(let y=35;y<55;y++)for(let x=35;x<55;x++)for(let c=0;c<3;c++)b.data[(y*96+x)*3+c]=1
 const robust=mergeFrames([a,b],[identity,identity]),average=mergeFrames([a,b],[identity,identity],{robust:false})
 assert.equal(robust.rejected,400);assert.equal(robust.data[(40*96+40)*3],a.data[(40*96+40)*3]);assert.notEqual(average.data[(40*96+40)*3],a.data[(40*96+40)*3])
 const flat={...a,data:new Float32Array(a.data.length).fill(.2)}; const border=mergeFrames([flat,flat],[identity,{dx:3,dy:0,valid:true}]);assert.equal(border.mask[95],255);assert.equal(border.data[95*3],flat.data[95*3]);assert.equal(border.rejected,0)
})
test('flat input declines alignment instead of inventing a confident transform',()=>{
 const f={width:64,height:64,data:new Float32Array(64*64*3).fill(.2)};assert.equal(estimateTranslation(f,f).valid,false)
})
test('independent repeated noisy observations improve the estimate with no invented signal',()=>{
 let seed=4;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32-.5}
 const frames=Array.from({length:4},()=>({width:96,height:96,data:Float32Array.from({length:96*96*3},()=>.5+random()*.02)}))
 const m=mergeFrames(frames,frames.map(()=>({dx:0,dy:0,valid:true})),{robust:false})
 const variance=f=>f.data.reduce((s,v)=>s+(v-.5)**2,0)/f.data.length
 assert.ok(variance(m)<variance(frames[0])*.3)
})
test('all served derivatives match their provenance hashes and fixed viewing contract',()=>{
 assert.deepEqual(JSON.parse(readFileSync('src/lib/photography/article-data.json')),article)
 for(const [file,entry]of Object.entries(article.files))assert.equal(createHash('sha256').update(readFileSync(`public/photography/${file}`)).digest('hex'),entry.sha256)
 assert.equal(article.viewing.ev,2);assert.equal(article.viewing.tone,1);assert.deepEqual(article.sourceSampleStats,{maximum:814,saturated:0,white:1023})
 const old=JSON.parse(readFileSync('public/photography/burst-registration.json'))
 assert.equal(article.rejected,old.rejected);assert.equal(article.total,old.total)
 article.transforms.forEach((t,i)=>{assert.equal(t.dx,old.transforms[i].dx);assert.equal(t.dy,old.transforms[i].dy)})
})
