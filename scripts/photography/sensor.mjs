// Adapted from phone-photography-talk; Anatomy MIT. Schematic teaching fixture.
import * as k from '../../.agents/skills/anatomy/kit/iso-kit.mjs';import {writeFileSync} from 'node:fs';
// A Figure-scale, 78-part cutaway teaching mount. Dimensions and charge
// collection geometry are schematic, not an iPhone bill of materials.
const plan={x:-108,y:-100,w:216,d:200,r:10},P=k.fitProjection([...k.boxCorners(plan,-16,0),[-70,-70,95],[70,70,95]],700,460,{pad:26,azimuth:45,elevation:42});
const S=(p,tone='mid')=>k.solidSvg(p,{tone});let body='';
for(const [x,y] of k.corners(plan,16))body+=S(k.slabOf({x:x-7,y:y-7,w:14,d:14,r:3},-16,5,P),'lo');
body+=S(k.slabOf(plan,-11,8,P,6,1));body+=S(k.slabOf(k.insetPlan(plan,8),-3,3,P,5,.5),'lo');
for(const [x,y] of k.corners(plan,12)){body+=S(k.slabOf({x:x-3,y:y-3,w:6,d:6,r:1.5},-3,1,P));}
body+=S(k.slabOf({x:-83,y:-78,w:166,d:156,r:5},0,5,P),'lo');
for(let i=0;i<7;i++)for(const side of [-1,1])body+=S(k.slabOf({x:side*88-2,y:-54+i*18,w:4,d:10,r:.7},0,3,P),'hi');
const cells=[];for(let y=0;y<4;y++)for(let x=0;x<4;x++)cells.push({x:-65+x*34,y:-65+y*34,c:[2,1,1,0][(y&1)*2+(x&1)]});cells.sort((a,b)=>k.depthOf([a.x,a.y,0],P)-k.depthOf([b.x,b.y,0],P));
for(const cell of cells){const p={x:cell.x,y:cell.y,w:30,d:30,r:3},q=k.iso([cell.x+15,cell.y+15,15],P);body+=`<g class="collection">${S(k.slabOf(p,5,9,P,4,.7),'lo')}<circle class="charge" cx="${q[0]}" cy="${q[1]}" r="4.5"/></g>`;}
for(const [x,y] of [[-77,-72],[67,-72],[-77,62],[67,62]])body+=S(k.slabOf({x,y,w:10,d:10,r:2},5,29,P),'mid');
body+=`<g class="sensor-glass">${S(k.slabOf({x:-73,y:-73,w:146,d:146,r:5},34,2,P,6,.5),'hi')}</g>`;
for(const cell of cells){
 const p={x:cell.x,y:cell.y,w:30,d:30,r:3},center=[cell.x+15,cell.y+15];
 body+=`<g class="sensor-filter" style="--sample:${['#ba6550','#6f9563','#5486a6'][cell.c]}">${S(k.slabOf(p,36,3,P,4,.4))}<path d="${k.planOutline(p,39,P)}" fill="var(--sample)" opacity=".88"/></g>`;
 body+=`<g class="microlens">${S(k.slabOf({...p,r:14},39,4,P,12,.6),'hi')}</g>`;
 const a=k.iso([...center,80],P),b=k.iso([...center,45],P);body+=`<g class="incoming" data-from="${a.join(',')}" data-to="${b.join(',')}"><circle cx="${a[0]}" cy="${a[1]}" r="2.4" fill="${['#cb7d67','#95aa60','#799db7'][cell.c]}"/></g>`;
}
writeFileSync('src/lib/photography/sensor-geometry.js',`export const sensorMarkup=${JSON.stringify(`<svg viewBox="0 0 700 460" role="img" aria-label="Cutaway sensor teaching mount: rounded microlenses sit on red, green and blue filter cells over sixteen schematic charge-collection regions.">${body}</svg>`)};`);console.log('Built sensor teaching mount: 78 seated solids, with illustrative light and charge overlays.');
