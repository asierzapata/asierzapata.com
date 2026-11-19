// Cutaway of a few pixels of a phone sensor, for the three-cheats article. Built with the Anatomy kit (MIT).
// Schematic: real pixels are about a micron wide and the filter sits directly on the silicon. We lift it on posts
// so the two layers the article talks about can be told apart: the light meters, and the colour filter over each.
import * as k from '../../../.agents/skills/anatomy/kit/iso-kit.mjs';
import {writeFileSync} from 'node:fs';

const COLS=4,ROWS=3,PITCH=46,WELL=30;
const BOARD={x:-140,y:-104,w:300,d:208,r:10},BOARD_H=7,FOOT_H=6;
const DIE={x:-126,y:-78,w:206,d:156,r:4},DIE_H=6,TOP=DIE_H;
const GRID={x:-118,y:-69},WELL_H=5;
const LIFT=92,FRAME_H=3,TILE_H=3,SKY=176;
const CHIP={x:100,y:-34,w:44,d:68,r:3},CHIP_H=9;
const P=k.fitProjection([...k.boxCorners(BOARD,-BOARD_H-FOOT_H,0),...k.boxCorners({x:GRID.x,y:GRID.y,w:COLS*PITCH,d:ROWS*PITCH},SKY,SKY)],800,600,{pad:30,azimuth:38,elevation:33});
const S=(paths,options)=>k.solidSvg(paths,options),L=(d,options)=>k.lineSvg(d,options),D=(points,options)=>k.dotsSvg(points,options);
const at=(x,y,z)=>k.iso([x,y,z],P);
// RGGB, like the phone in the article. `light` is how much light reaches the spot, `pass` the share its filter lets through.
const HUE=['#e5484d','#30a46c','#3e63dd'],GLOW=['#ff8f8f','#7ee2a8','#8fb0ff'],PASS=[.3,.46,.24];
const cells=[];
for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
 const x=GRID.x+col*PITCH,y=GRID.y+row*PITCH;
 cells.push({col,row,x,y,c:[0,1,1,2][(row&1)*2+(col&1)],light:.38+.5*((col*7+row*13+col*row*5)%10)/10});
}
const byDepth=[...cells].sort((a,b)=>k.depthOf([a.x,a.y,0],P)-k.depthOf([b.x,b.y,0],P));
const wellOf=cell=>({x:cell.x+5,y:cell.y+5,w:WELL,d:WELL,r:3}),midOf=cell=>[cell.x+5+WELL/2,cell.y+5+WELL/2];

// 1. The board: feet, plate, groove, corner screws, label plate, a ruler along the front edge, and gold fingers.
let board='';
for(const [x,y] of k.corners(BOARD,16))board+=S(k.cylinder(x,y,7,-BOARD_H-FOOT_H,FOOT_H,P,24),{tone:'lo'});
board+=S(k.slabOf(BOARD,-BOARD_H,BOARD_H,P,8,1.2),{tone:'lo',halo:true});
board+=L(k.planOutline(k.insetPlan(BOARD,5),0,P),{tone:'faint'});
board+=D(k.corners(BOARD,12).map(([x,y])=>at(x,y,0)),{size:1.6,tone:'mid'});
for(const [x,y] of k.corners(BOARD,12))board+=L(k.ring(x,y,2.6,0,P,16),{tone:'lo'});
const label={x:-128,y:84,w:44,d:12,r:1.5};
board+=S(k.slabOf(label,0,.8,P,4),{tone:'mid',flat:true});
for(const dy of [3,6,9])board+=L(k.lineOnTop([label.x+4,label.y+dy],[label.x+label.w-(dy===9?16:4),label.y+dy],.8,P),{tone:'lo',free:true});
const ruler={x:GRID.x,y:86,w:COLS*PITCH,d:8,r:1};
board+=S(k.slabOf(ruler,0,.8,P,4),{tone:'mid',flat:true});
const ticks=k.topTicks(ruler.x,ruler.x+ruler.w,PITCH/4,4,ruler.y,.8,[3,ruler.d],P);
board+=L(ticks.minor,{tone:'lo'})+L(ticks.major,{tone:'mid'});
for(let i=0;i<9;i++)board+=`<g class="gold">${S(k.slabOf({x:-112+i*22,y:-100,w:10,d:9,r:1},0,.9,P,3),{tone:'mid',flat:true})}</g>`;

// 2. The silicon: a die with row and column lines, a light meter and a switch per pixel, and bond pads on one edge.
let die=S(k.slabOf(DIE,0,DIE_H,P,6,.8),{tone:'mid'});
die+=L(k.planOutline(k.insetPlan(DIE,3),TOP,P),{tone:'faint'});
for(let col=0;col<COLS;col++){const x=GRID.x+col*PITCH+41;die+=L(k.lineOnTop([x,DIE.y+3],[x,DIE.y+DIE.d-3],TOP,P),{tone:'lo'});}
for(let row=0;row<ROWS;row++){const y=GRID.y+row*PITCH+40;die+=L(k.lineOnTop([DIE.x+3,y],[DIE.x+DIE.w-3,y],TOP,P),{tone:'lo'});}
die+=D(cells.map(cell=>at(cell.x+41,cell.y+40,TOP)),{size:1.1,tone:'mid'});
let wells='';
for(const cell of byDepth){
 const p=wellOf(cell);
 wells+=`<g class="meter">${S(k.slabOf(p,TOP,WELL_H,P,4,.8),{tone:'hi'})}`
  +`<path class="charge" data-light="${cell.light.toFixed(2)}" data-pass="${PASS[cell.c]}" d="${k.planOutline(k.insetPlan(p,3.5),TOP+WELL_H,P)}"/>`
  +S(k.slabOf({x:cell.x+38,y:cell.y+9,w:6,d:11,r:1},TOP,2.4,P,3),{tone:'mid'})
  +L(k.lineOnTop([cell.x+35,cell.y+14.5],[cell.x+38,cell.y+14.5],TOP,P),{tone:'mid'})+`</g>`;
}
// Bond wires carry every reading off the die to the chip that turns it into a number.
let wires='';
const PADS=7,padY=i=>DIE.y+18+i*20,landX=90;
for(let i=0;i<PADS;i++){
 const y=padY(i);
 die+=S(k.slabOf({x:DIE.x+DIE.w-9,y:y-3,w:6,d:6,r:1},TOP,.8,P,3),{tone:'hi',flat:true});
 board+=`<g class="gold">${S(k.slabOf({x:landX-3,y:y-3,w:6,d:6,r:1},0,.8,P,3),{tone:'mid',flat:true})}</g>`;
 wires+=k.wireSvg(at(DIE.x+DIE.w-6,y,TOP+.8),at(landX,y,.8),{via:[at(DIE.x+DIE.w-3,y,TOP+9),at(landX-3,y,7)],tone:'mid',size:1.3});
 const pin=CHIP.y+8+i*(CHIP.d-16)/(PADS-1);
 board+=L(k.onTop([[landX+3,y],[landX+7,y],[landX+7,pin],[CHIP.x,pin]],0,P),{tone:'lo'});
}
// What else lives on a camera board: a clock crystal and resistors behind the chip, capacitors and the ribbon socket in front.
let behind=S(k.slabOf({x:102,y:-88,w:34,d:15,r:7},0,5.5,P,10,.8),{tone:'mid'})+L(k.planOutline({x:106,y:-85,w:26,d:9,r:4.5},5.5,P),{tone:'faint'});
behind+=D([[100,-80.5],[138,-80.5]].map(([x,y])=>at(x,y,0)),{size:1.2,tone:'mid'});
for(let i=0;i<4;i++){
 const x=102+i*11;
 behind+=S(k.slabOf({x,y:-62,w:7,d:4,r:.6},0,2,P,2),{tone:'mid'})+L(k.lineOnTop([x+3.5,-58],[x+3.5,-50],0,P),{tone:'lo'});
}
behind+=D(Array.from({length:4},(_,i)=>at(105.5+i*11,-50,0)),{size:1,tone:'mid'});
let chip='';
for(let i=0;i<PADS;i++){const y=CHIP.y+8+i*(CHIP.d-16)/(PADS-1);for(const x of [CHIP.x-3,CHIP.x+CHIP.w-1])chip+=S(k.slabOf({x,y:y-1.5,w:4,d:3,r:.5},0,3,P,2),{tone:'mid'});}
chip+=S(k.slabOf(CHIP,1.5,CHIP_H,P,5,1),{tone:'mid'});
chip+=L(k.ring(CHIP.x+8,CHIP.y+8,2.2,1.5+CHIP_H,P,14),{tone:'lo'});
for(const dx of [16,22,28])chip+=L(k.lineOnTop([CHIP.x+dx,CHIP.y+16],[CHIP.x+dx,CHIP.y+CHIP.d-(dx===28?26:10)],1.5+CHIP_H,P),{tone:'lo',free:true});
let front='';
for(let i=0;i<5;i++){
 const x=101+i*9.5;
 front+=L(k.lineOnTop([x+2.5,44],[x+2.5,70],0,P),{tone:'lo'});
 front+=S(k.slabOf({x,y:46,w:5,d:9,r:.6},0,3,P,2),{tone:'mid'});
 front+=`<g class="gold">${S(k.slabOf({x,y:46,w:5,d:2,r:.4},0,3.2,P,2),{tone:'mid'})}${S(k.slabOf({x,y:53,w:5,d:2,r:.4},0,3.2,P,2),{tone:'mid'})}</g>`;
}
const socket={x:94,y:70,w:54,d:13,r:1.5};
front+=S(k.slabOf(socket,0,5,P,4,.6),{tone:'mid'});
front+=D(Array.from({length:12},(_,i)=>at(socket.x+5+i*4,socket.y+3.5,5)),{size:.9,tone:'hi'});
front+=S(k.slabOf({x:socket.x+1,y:socket.y+8,w:socket.w-2,d:4,r:1},0,6.5,P,3,.5),{tone:'hi'});
front+=D([[152,60],[152,68],[152,76]].map(([x,y])=>at(x,y,0)),{size:1.4,tone:'mid'});
for(const y of [60,68,76])front+=L(k.ring(152,y,2.4,0,P,14),{tone:'lo'});

// 3. Light. Above a filter it is all three colours; below it, only the one the filter lets through.
const ray=(cell,from,to,c,all)=>{const [x,y]=midOf(cell),dx=all?(c-1)*3.4:0;return `<path class="ray" data-flow="" style="--c:${GLOW[c]}" d="${k.rise([x+dx,y],from,to,P)}"/>`;};
const bare=byDepth.map(cell=>[0,1,2].map(c=>ray(cell,TOP+WELL_H,SKY,c,true)).join('')).join('');

// 4. The filter layer: four posts, a carrier frame, a tile of coloured glass per pixel, and a tiny lens on each.
const FRAME={x:GRID.x-6,y:GRID.y-6,w:COLS*PITCH+12,d:ROWS*PITCH+12,r:5};
const posts=k.corners(FRAME,2).sort((a,b)=>k.depthOf([a[0],a[1],0],P)-k.depthOf([b[0],b[1],0],P));
const postSvg=([x,y])=>S(k.cylinder(x,y,4.4,TOP,2,P,20),{tone:'mid'})+S(k.cylinder(x,y,2.6,TOP+2,LIFT-TOP-2,P,16),{tone:'mid',crease:'none'});
let filters=posts.slice(0,3).map(postSvg).join('');
filters+=byDepth.map(cell=>ray(cell,TOP+WELL_H,LIFT,cell.c,false)).join('');
filters+=postSvg(posts[3]);
filters+=S(k.slabOf(FRAME,LIFT,FRAME_H,P,6,.6),{tone:'mid',halo:true});
filters+=D(k.corners(FRAME,2).map(([x,y])=>at(x,y,LIFT+FRAME_H)),{size:1.3,tone:'hi'});
for(const cell of byDepth){
 const tile={x:cell.x+2,y:cell.y+2,w:PITCH-4,d:PITCH-4,r:3},[x,y]=midOf(cell),z=LIFT+FRAME_H;
 filters+=`<g class="tile" style="--c:${HUE[cell.c]}">${S(k.slabOf(tile,z,TILE_H,P,4,.5),{tone:'hi'})}<path class="tint" d="${k.planOutline(k.insetPlan(tile,1),z+TILE_H,P)}"/></g>`
  +`<g class="lens">${S(k.cylinder(x,y,15,z+TILE_H,1.6,P,28,.6),{tone:'hi',crease:'none'})}${S(k.cylinder(x,y,11,z+TILE_H+1.6,1.4,P,24,.6),{tone:'hi',crease:'none'})}${S(k.cylinder(x,y,6,z+TILE_H+3,1,P,20,.5),{tone:'hi',crease:'none'})}</g>`
  +[0,1,2].map(c=>ray(cell,z+TILE_H+4,SKY,c,true)).join('');
}

const svg=`<svg class="iso-svg" viewBox="0 0 800 600" role="img" aria-label="A cutaway of a few pixels of a camera sensor. On a circuit board sits a silicon die with a grid of light meters, wired to a chip that turns each reading into a number. Held above it on four posts is a layer of red, green and blue filters with a tiny lens on each. Red, green and blue light falls on every lens, and under each filter only one color continues down to its meter.">`
 +`<g class="meters">${board}${behind}${die}${wells}${wires}${chip}${front}</g><g class="bare">${bare}</g><g class="filters">${filters}</g></svg>`;
writeFileSync('src/lib/photography/lake/sensor.js',`// Generated by scripts/photography/lake/sensor.mjs\nexport const sensorMarkup=${JSON.stringify(svg)};\n`);
console.log(`Sensor cutaway: ${(svg.match(/class="iso-solid/g)||[]).length} solids, ${(svg.match(/<path/g)||[]).length} paths, ${Math.round(svg.length/1024)} kB.`);
