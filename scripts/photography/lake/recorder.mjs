// A two-pen chart recorder, for the noise chapter of the three-cheats article. Built with the Anatomy kit (MIT).
// One pen follows a light meter under the sky, the other a meter under the rocks, both on the same scale.
// The numbers are measured from the burst's raw frames (green pixels of N002 against N007, in raw units above black,
// where white is about 971): bright sky 487 ± 12, rocks 5 ± 1.6. The page brightens the rocks until they read as much as the sky,
// so the two lines sit at the same height and only their wobble differs.
import * as k from '../../../.agents/skills/anatomy/kit/iso-kit.mjs';
import * as G from '../../../.agents/skills/anatomy/kit/lathe.mjs';
import {writeFileSync} from 'node:fs';

const WHITE=971,SKY={mean:487,sd:12},ROCK={mean:5,sd:1.6},GAIN=SKY.mean/ROCK.mean;
const T=22,PZ=T+.5;
const BASE={x:-140,y:-112,w:300,d:224,r:10},BASE_H=7,FOOT_H=6;
const BODY={x:-126,y:-98,w:272,d:184,r:6};
const PAPER={x:-110,y:-70,w:166,d:140,r:0};
// The value scale runs across the paper from right to left, so on screen dark is low and bright is high:
// zero at ZERO+FULL, white at ZERO. Beyond white the paper has two lanes where the recorder prints the color
// each pixel comes out as: a square every FEED units of paper.
const ZERO=-82,FULL=126,UNIT=FULL/WHITE,NIL=ZERO+FULL,STAMP=7,HEAD={x:-106,y:-32,w:20,d:20,r:1.5};
const PEN_Y=-19,BACK={x:-114,y:-58,w:174,d:8,r:1.5},FRONT={x:-114,y:60,w:174,d:10,r:1.5},BAR_H=4;
const STEP=1.6,SPEED=11,LENGTH=FRONT.y+4-PEN_Y,FEED=8;
const BEAM={x:-124,y:-40,w:194,d:8,r:1.5},BEAM_Z=T+14,BEAM_H=8;
const PANEL={x:68,y:-52,w:72,d:124,r:3},ROWS=[{pen:'sky',y:-28,hue:'#e8edf7',lead:0,lane:-101,tint:[1,.84,.68],...SKY},{pen:'rock',y:14,hue:'#fbbf24',lead:10,lane:-91,tint:[1,.93,.86],...ROCK}];
const KNOB={x:116,r:8.5,from:-Math.PI*2/3,span:Math.PI*4/3,stops:7};
const ROLL={y:-70,z:T+14,r:12};

const P=k.fitProjection([...k.boxCorners(BASE,-BASE_H-FOOT_H,0),...k.boxCorners({x:-124,y:ROLL.y-ROLL.r,w:194,d:ROLL.r*2},T,ROLL.z+ROLL.r)],800,600,{pad:16,azimuth:40,elevation:50});
const S=(paths,options)=>k.solidSvg(paths,options),L=(d,options)=>k.lineSvg(d,options),D=(points,options)=>k.dotsSvg(points,options);
const at=(x,y,z)=>k.iso([x,y,z],P);
const face=points=>k.pathOf(points.map(p=>k.iso(p,P)),true);
const screw=(x,y,z,r=2)=>L(k.ring(x,y,r,z,P,14),{tone:'lo'})+D([at(x,y,z)],{size:1.1,tone:'mid'});
const grey=value=>{const g=Math.round(28+227*Math.sqrt(Math.max(0,Math.min(1,value/WHITE))));return `rgb(${g},${g},${g})`;};

// 1. The bench plate: feet, plate, groove, corner screws, a ruler that repeats the paper's scale, and a label plate.
let base='';
for(const [x,y] of k.corners(BASE,16)){base+=S(k.cylinder(x,y,7.5,-BASE_H-FOOT_H,1.6,P,24),{tone:'lo'})+S(k.cylinder(x,y,6,-BASE_H-FOOT_H+1.6,FOOT_H-1.6,P,24),{tone:'lo'});}
base+=S(k.slabOf(BASE,-BASE_H,BASE_H,P,8,1.2),{tone:'lo',halo:true});
base+=L(k.planOutline(k.insetPlan(BASE,5),0,P),{tone:'faint'});
for(const [x,y] of k.corners(BASE,12))base+=screw(x,y,0,2.6);
const ruler={x:ZERO-4,y:96,w:FULL+8,d:8,r:1};
base+=S(k.slabOf(ruler,0,.8,P,3),{tone:'mid',flat:true});
const marks=k.topTicks(0,FULL,FULL/20,5,ruler.y,.8,[3,ruler.d],{...P,origin:at(ZERO,0,0)});
base+=L(marks.minor,{tone:'lo'})+L(marks.major,{tone:'mid'});
const label={x:92,y:95,w:44,d:11,r:1.5};
base+=S(k.slabOf(label,0,.8,P,4),{tone:'mid',flat:true});
for(const dy of [3,5.5,8])base+=L(k.lineOnTop([label.x+4,label.y+dy],[label.x+label.w-(dy===8?18:4),label.y+dy],.8,P),{tone:'lo',free:true});

// 2. The case: a low box with a seam, vents on the side, the slot the paper leaves through, and a groove round the top.
let body=S(k.slabOf(BODY,0,T,P,6,1),{tone:'mid',inner:L(k.sideSeam(BODY,T-5,P,6),{tone:'faint'})});
const right=BODY.x+BODY.w,front=BODY.y+BODY.d;
for(let i=0;i<9;i++){const y=-66+i*9;body+=L(face([[right,y,5],[right,y+2.4,5],[right,y+2.4,13],[right,y,13]]),{tone:'lo'});}
body+=L(face([[PAPER.x-2,front,8],[PAPER.x+PAPER.w+2,front,8],[PAPER.x+PAPER.w+2,front,11],[PAPER.x-2,front,11]]),{tone:'mid'});
body+=D([[PAPER.x-8,front,9.5],[PAPER.x+PAPER.w+8,front,9.5],[84,front,9.5],[132,front,9.5]].map(p=>k.iso(p,P)),{size:1.1,tone:'mid'});
body+=L(k.planOutline(k.insetPlan(BODY,4),T,P,6),{tone:'faint'});
body+=L(k.lineOnTop([62,BODY.y+4],[62,front-4],T,P),{tone:'faint'});

// 3. The paper, with the scale printed along it. The margins carry the feed holes.
let paper=`<g class="paper">${S(k.slabOf(PAPER,T,.5,P,2),{tone:'mid',flat:true})}</g>`;
const y0=BACK.y+2,y1=FRONT.y+FRONT.d-2;
for(let v=0;v<=9;v++){const x=NIL-v*100*UNIT;paper+=L(k.lineOnTop([x,y0],[x,y1],PZ,P),{tone:v%5===0?'lo':'faint'});}
for(const x of [ZERO-3,ZERO+FULL+3])paper+=L(k.lineOnTop([x,y0],[x,y1],PZ,P),{tone:'lo'});
// What moves with the paper: a time line every FEED units and a hole every half of that. The page slides the group and wraps it.
let feed='';
for(let i=0;i<15;i++){const y=BACK.y+i*FEED;feed+=L(k.lineOnTop([ZERO-3,y],[ZERO+FULL+3,y],PZ,P),{tone:'faint'});}
const holes=[];
for(let i=0;i<30;i++)for(const x of [PAPER.x+3.5,PAPER.x+PAPER.w-3.5])holes.push(at(x,BACK.y+i*FEED/2,PZ));
feed+=D(holes,{size:1,tone:'lo'});

// A reading every STEP units of paper. The build draws one still history, the page keeps drawing.
let seed=7;
const uniform=()=>(seed=(seed*1664525+1013904223)%4294967296)/4294967296;
const bell=()=>(uniform()+uniform()+uniform()-1.5)*2;
const O=at(NIL,PEN_Y,PZ),UX=k.axisVector(P,[1,0,0]),UY=k.axisVector(P,[0,1,0]);
const still=row=>Array.from({length:Math.ceil(LENGTH/STEP)+2},()=>Math.max(0,Math.min(WHITE,row.mean+row.sd*bell())));
// A pen that sits `lead` units further along the paper starts its line there.
const traceOf=(values,lead)=>{
 let d='';
 for(let j=0;j<values.length;j++){
  const y=Math.min(lead+j*STEP,LENGTH),x=-values[j]*UNIT;
  d+=`${j?'L':'M'}${(O[0]+UX[0]*x+UY[0]*y).toFixed(1)} ${(O[1]+UX[1]*x+UY[1]*y).toFixed(1)}`;
  if(lead+j*STEP>=LENGTH)break;
 }
 return d;
};
const histories=ROWS.map(still);
const traces=ROWS.map((row,i)=>`<path class="trace" data-pen="${row.pen}" style="--c:${row.hue}" d="${traceOf(histories[i],row.lead)}"/>`).join('');

// 4. The paper roll in its cradle, and the two bars the paper runs under.
const SPIN=G.frameAlong([PAPER.x,ROLL.y,ROLL.z],[1,0,0]);
const cradle=x=>S(k.slabOf({x,y:ROLL.y-7,w:6,d:14,r:1.5},T,ROLL.z-T+4,P,3,.5),{tone:'mid'})+D([at(x+3,ROLL.y,ROLL.z+4)],{size:1.1,tone:'mid'});
let roll=S(G.disc(-13,-8,3.6,SPIN,P),{tone:'mid'})+cradle(PAPER.x-8);
roll+=`<g class="paper">${S(G.disc(0,PAPER.w,ROLL.r,SPIN,P),{tone:'hi'})}</g>`;
for(const r of [3,6,9])roll+=L(G.circleOf(SPIN,PAPER.w,r,P),{tone:r===3?'mid':'faint'});
roll+=cradle(PAPER.x+PAPER.w+2)+S(G.disc(PAPER.w+8,PAPER.w+13,3.6,SPIN,P),{tone:'mid'});
const bar=plan=>S(k.slabOf(plan,T,BAR_H,P,3,.5),{tone:'mid'})+[plan.x+4,plan.x+plan.w-4].map(x=>screw(x,plan.y+plan.d/2,T+BAR_H,1.6)).join('');

// 5. The bridge: two posts and a beam with the scale along its top. The pen carriages ride on its front face.
const post=x=>S(k.slabOf({x,y:BEAM.y-2,w:8,d:12,r:1.5},T,BEAM_Z-T,P,3,.5),{tone:'mid'});
let bridge=post(-122)+post(60);
bridge+=S(k.slabOf(BEAM,BEAM_Z,BEAM_H,P,3,.5),{tone:'mid',inner:L(k.sideSeam(BEAM,BEAM_Z+4,P,3),{tone:'faint'})});
const scale=k.topTicks(0,FULL,FULL/20,5,BEAM.y,BEAM_Z+BEAM_H,[2.4,4.6],{...P,origin:at(ZERO,0,0)});
bridge+=L(scale.minor,{tone:'lo'})+L(scale.major,{tone:'mid'});
bridge+=[-118,64].map(x=>D([at(x,BEAM.y+4,BEAM_Z+BEAM_H)],{size:1.1,tone:'mid'})).join('');
// The print head hangs on the beam over the two color lanes. Squares are printed under it and come out with the paper.
bridge+=S(k.slabOf(HEAD,T+4,BEAM_Z+BEAM_H-2-T-4,P,3,.5),{tone:'hi',inner:L(k.sideSeam(HEAD,T+8,P,3),{tone:'faint'})});
bridge+=L(k.lineOnTop([HEAD.x+HEAD.w/2,HEAD.y],[HEAD.x+HEAD.w/2,HEAD.y+HEAD.d],BEAM_Z+BEAM_H-2,P),{tone:'faint'});
bridge+=ROWS.map(row=>`<circle class="pip" style="--c:${row.hue}" cx="${at(row.lane,HEAD.y+HEAD.d-4,BEAM_Z+BEAM_H-2)[0].toFixed(1)}" cy="${at(row.lane,HEAD.y+HEAD.d-4,BEAM_Z+BEAM_H-2)[1].toFixed(1)}" r="1.6"/>`).join('');
// A carriage is built with its pen on zero. The page slides it along the beam.
// The two pens must be able to pass each other, so they ride on different faces of the beam: the sky pen hangs
// on the front face, and the rock pen sits on top and reaches over it with a longer arm, a little further down the paper.
const slide=(row,g)=>{
 const value=-histories[ROWS.indexOf(row)][0]*UNIT;
 return `<g class="carriage" data-pen="${row.pen}" style="--c:${row.hue}" transform="translate(${(UX[0]*value).toFixed(2)} ${(UX[1]*value).toFixed(2)})">${g}</g>`;
};
const pen=(c,y,from,to)=>S(k.cylinder(c,y,2.2,from,to-from,P,16),{tone:'hi'});
const cap=(c,y,z)=>`<g class="ink">${S(k.cylinder(c,y,2.9,z,2.2,P,18,.4),{tone:'hi'})}</g>`;
const nib=(c,y)=>S(k.cylinder(c,y,.8,PZ,T+3-PZ,P,10),{tone:'hi',crease:'none'});
const low=row=>{
 const c=NIL,y=PEN_Y+row.lead,face=BEAM.y+BEAM.d,top=BEAM_Z+BEAM_H-1;
 let g=nib(c,y)+pen(c,y,T+3,T+9);
 g+=S(k.slabOf({x:c-7,y:face,w:14,d:8,r:1.5},T+9,top-T-9,P,3,.5),{tone:'hi'});
 g+=L(k.lineOnTop([c,face],[c,face+5],top,P),{tone:'mid'})+D([at(c,face+5,top)],{size:1.1,tone:'hi'});
 g+=S(k.slabOf({x:c-3.5,y:face+8,w:7,d:9.5,r:1.5},T+9,3,P,3,.4),{tone:'hi'});
 return slide(row,g+pen(c,y,T+12,T+18)+cap(c,y,T+18));
};
const high=row=>{
 const c=NIL,y=PEN_Y+row.lead,top=BEAM_Z+BEAM_H,arm=top+4;
 let g=S(k.slabOf({x:c-7,y:BEAM.y-1,w:14,d:BEAM.d+2,r:1.5},top,7,P,3,.5),{tone:'hi'})+D([at(c,BEAM.y+BEAM.d/2,top+7)],{size:1.1,tone:'hi'});
 g+=nib(c,y)+pen(c,y,T+3,arm);
 g+=S(k.slabOf({x:c-2.6,y:BEAM.y+BEAM.d,w:5.2,d:y+4.5-BEAM.y-BEAM.d,r:1.5},arm,3,P,3,.4),{tone:'hi'});
 return slide(row,g+pen(c,y,arm+3,arm+7)+cap(c,y,arm+7));
};

// 6. The panel: for each pen a light meter, a wire, and a knob that sets how much its reading is multiplied.
let panel=S(k.slabOf(PANEL,T,.8,P,4),{tone:'mid',flat:true})+L(k.planOutline(k.insetPlan(PANEL,2),T+.8,P,4),{tone:'faint'});
const PT=T+.8,knobTop=PT+10.4;
for(const [x,y] of k.corners(PANEL,5))panel+=D([at(x,y,PT)],{size:1.1,tone:'mid'});
for(const row of ROWS){
 const well={x:74,y:row.y-8,w:16,d:16,r:2.5},ring=k.radialTicks(KNOB.x,row.y,15,KNOB.stops,1,PT,[2.4,3.4],P,KNOB.from,KNOB.span);
 panel+=`<g class="meter" data-pen="${row.pen}" style="--c:${row.hue}">`
  +`<circle class="pip" cx="${at(82,row.y-12.5,PT)[0].toFixed(1)}" cy="${at(82,row.y-12.5,PT)[1].toFixed(1)}" r="2"/>`
  +S(k.slabOf(well,PT,4,P,4,.6),{tone:'hi'})+`<path class="charge" style="fill:${grey(row.mean)}" d="${k.planOutline(k.insetPlan(well,3),PT+4,P)}"/>`
  +k.wireSvg(at(well.x+well.w,row.y,PT),at(KNOB.x-11,row.y,PT),{tone:'mid',size:1.3})
  +L(ring.major,{tone:'mid'})
  +S(k.cylinder(KNOB.x,row.y,11,PT,1.6,P,36),{tone:'mid'})
  +S(k.cylinder(KNOB.x,row.y,KNOB.r,PT+1.6,8.8,P,36,.6),{tone:'hi',inner:L(k.knurl(KNOB.x,row.y,KNOB.r,PT+2.4,PT+9.6,30,P),{tone:'lo'})})
  +L(k.ring(KNOB.x,row.y,6,knobTop,P,24),{tone:'faint'})
  +`<path class="pointer" d="${k.lineOnTop([KNOB.x,row.y],[KNOB.x+6*Math.sin(KNOB.from),row.y-6*Math.cos(KNOB.from)],knobTop,P)}"/>`
  +D([at(KNOB.x,row.y,knobTop)],{size:1.1,tone:'hi'})+`</g>`;
}
const sw={x:76,y:46,w:15,d:11,r:1.5};
panel+=S(k.slabOf(sw,PT,1.6,P,3),{tone:'mid'})+S(k.slabOf(k.insetPlan(sw,2),PT+1.6,2.4,P,3,.4),{tone:'hi'});
panel+=S(k.cylinder(101,51.5,3,PT,1.4,P,18),{tone:'mid'})+`<circle class="lamp" cx="${at(101,51.5,PT+1.4)[0].toFixed(1)}" cy="${at(101,51.5,PT+1.4)[1].toFixed(1)}" r="2.2"/>`;
const plate={x:110,y:45,w:25,d:13,r:1.5};
panel+=S(k.slabOf(plate,PT,.6,P,3),{tone:'mid',flat:true});
for(const dy of [3.5,6.5,9.5])panel+=L(k.lineOnTop([plate.x+3,plate.y+dy],[plate.x+plate.w-(dy===9.5?11:3),plate.y+dy],PT+.6,P),{tone:'lo',free:true});

// What the page needs to keep the pens writing. The unit is negative because the scale runs against x.
const rockKnob=ROWS[1].y;
const spec={origin:O,ux:UX,uy:UY,unit:-UNIT,white:WHITE,step:STEP,speed:SPEED,length:LENGTH,feed:FEED,gain:GAIN,
 stamp:{size:STAMP,every:FEED,half:STAMP/2/UNIT,from:HEAD.y+4-PEN_Y},
 pens:Object.fromEntries(ROWS.map(row=>[row.pen,{mean:row.mean,sd:row.sd,lead:row.lead,lane:(NIL-row.lane)/UNIT,tint:row.tint}])),
 knob:{centre:at(KNOB.x,rockKnob,knobTop),r:6,from:KNOB.from,span:KNOB.span,stops:KNOB.stops}};

const svg=`<svg class="iso-svg" viewBox="0 0 800 600" role="img" data-spec='${JSON.stringify(spec,(key,value)=>typeof value==='number'?Math.round(value*1e4)/1e4:value)}' aria-label="A chart recorder with two pens writing on one strip of paper, both on the same scale. The scale rises from the near side of the paper to the far side. The pen wired to a light meter under the sky sits halfway up and draws a nearly steady line. The pen wired to a meter under the rocks sits almost on zero. When its knob multiplies the reading until it matches the sky, its line rises to the same height and swings widely. Along the far edge of the paper the recorder prints the color each pixel comes out as: the same square every time for the sky, a different one every time for the brightened rocks.">`
 +`<g class="bench">${base}${body}</g><g class="chart">${paper}<g class="feed">${feed}</g><g class="stamps"></g>${traces}</g>`
 +`<g class="works">${roll}${bar(BACK)}${bridge}${low(ROWS[0])}${high(ROWS[1])}${bar(FRONT)}${panel}</g></svg>`;
writeFileSync('src/lib/photography/lake/recorder.js',`// Generated by scripts/photography/lake/recorder.mjs\nexport const recorderMarkup=${JSON.stringify(svg)};\n`);
console.log(`Chart recorder: ${(svg.match(/class="iso-solid/g)||[]).length} solids, ${(svg.match(/<path/g)||[]).length} paths, ${Math.round(svg.length/1024)} kB.`);
