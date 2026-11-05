// Figure-scale photographic registration light table, generated with Anatomy (MIT).
import * as k from '../../.agents/skills/anatomy/kit/iso-kit.mjs';
import {writeFileSync} from 'node:fs';
const plan={x:-150,y:-120,w:300,d:240,r:9};
const P=k.fitProjection([...k.boxCorners(plan,-18,0),[-110,-85,85],[110,85,85]],700,440,{pad:25,azimuth:45,elevation:42});
const S=(p,tone='mid')=>k.solidSvg(p,{tone});let body='';let count=0;
const slab=(p,z,h,t='mid')=>{count++;return S(k.slabOf(p,z,h,P,6,.6),t)};
for(const [x,y] of k.corners(plan,18))body+=slab({x:x-9,y:y-9,w:18,d:18,r:4},-18,7,'lo');
body+=slab(plan,-11,11);body+=slab(k.insetPlan(plan,9),0,2,'lo');body+=slab({x:-123,y:-93,w:246,d:186,r:2},2,1,'hi');
for(const x of [-131,123])body+=slab({x,y:-101,w:8,d:202,r:1},2,5);
for(const y of [-101,93])body+=slab({x:-123,y,w:246,d:8,r:1},2,5);
for(const [x,y] of k.corners(k.insetPlan(plan,13),4))for(const dx of [-3,3])body+=slab({x:x+dx-1.2,y:y-1.2,w:2.4,d:2.4,r:.7},2,1,'lo');
for(const x of [-144,136]){
 body+=slab({x,y:-90,w:8,d:180,r:1},0,3);
 for(const y of [-94,86])body+=slab({x:x-1,y,w:10,d:8,r:1},0,8,'lo');
}
for(const y of [-115,106]){
 const strip={x:-120,y,w:240,d:7,r:1};body+=slab(strip,0,1,'hi');
 const t=k.topTicks(-116,116,4,5,y,1,[2,4],P);body+=k.lineSvg(t.minor,{tone:'lo'})+k.lineSvg(t.major,{tone:'mid'});
}
for(const [x,y] of [[-125,-94],[109,-94],[-125,80],[109,80]]){
 body+=slab({x,y,w:16,d:14,r:2},7,5);body+=slab({x:x+3,y:y+3,w:10,d:8,r:1},12,2,'lo');
}
// Square guide columns seat the lifted inspection carriers; no floating hardware.
for(const x of [-90,90])for(const y of [-80,80]){
 body+=slab({x:x-5,y:y-5,w:10,d:10,r:1},3,4,'lo');
 body+=slab({x:x-2,y:y-2,w:4,d:4,r:.5},7,72);
 body+=slab({x:x-3,y:y-3,w:6,d:6,r:1},79,2,'hi');
}
const carriers=[];
for(let i=0;i<4;i++){
 const z=15+i*18,p={x:-83,y:-83,w:166,d:166,r:2};let s=slab(p,z,1.5,'lo');
 const a=k.iso([-77,-77,z+1.5],P),b=k.iso([77,-77,z+1.5],P),c=k.iso([-77,77,z+1.5],P);
 const m=[(b[0]-a[0])/384,(b[1]-a[1])/384,(c[0]-a[0])/384,(c[1]-a[1])/384,...a];
 s+=`<g class="photographic-plane"><image data-photo-src="/photography/frame-${i}.webp" width="384" height="384" transform="matrix(${m.join(' ')})"/></g>`;
 for(const x of [-1,1])for(const y of [-80,80])s+=slab({x:x<0?-88:80,y:y-2,w:8,d:4,r:.5},z,2);
 for(const [x,y] of k.corners(p,3).filter((_,j)=>j%2===0))s+=slab({x:x-2,y:y-2,w:4,d:4,r:.5},z+1.5,1,'hi');
 carriers.push(`<g class="photo-carrier" data-frame="${i}" style="--lower-x:${k.iso([0,0,15],P)[0]-k.iso([0,0,z],P)[0]}px;--lower-y:${k.iso([0,0,15],P)[1]-k.iso([0,0,z],P)[1]}px">${s}</g>`);
}
writeFileSync('src/lib/photography/table-geometry.js',`export const tableMarkup=${JSON.stringify(`<svg viewBox="0 0 700 440" role="img" aria-label="Photographic registration light table. Four real captures on inspection carriers lower onto a common illuminated surface.">${body+carriers.join('')}</svg>`)};\n`);
console.log(`Light table generated: ${count} seated solids. Ruler ticks rooted on strip edges.`);
