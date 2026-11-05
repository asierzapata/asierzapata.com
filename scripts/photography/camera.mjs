// Figure-scale schematic phone camera. Anatomy kit, MIT.
// World units are illustrative, not an iPhone BOM or verified optical prescription.
import * as k from '../../.agents/skills/anatomy/kit/iso-kit.mjs';
import * as G from '../../.agents/skills/anatomy/kit/lathe.mjs';
import * as A from '../../.agents/skills/anatomy/kit/audit.mjs';
import {writeFileSync} from 'node:fs';
const plan={x:-66,y:-132,w:132,d:264,r:19};
const P=k.fitProjection([...k.boxCorners(plan,0,26),[-34,-99,132]],700,620,{pad:38,azimuth:38,elevation:48});
const axis=G.frameAlong([-34,-99,0],[0,0,1]);
const R=A.recorder(P),moves={barrel:112,top:83,middle:60,bottom:37,filter:18,sensor:0};
const pieces=[];let count=0;
function put(name,paths,shape,{material='silver',piece='phone',move=0,extra=''}={}){
 count++;const svg=`<g class="camera-material" data-material="${material}">${k.solidSvg(paths,{tone:'mid'})}${extra}</g>`;
 const item=R.put({name,piece,move:[0,0,move],at:shape.at||[0,0,0],svg,shapes:[R.solid(shape)]});
 item.meta={piece,material,move};pieces.push(item);return item;
}
function slab(name,p,z,h,opts={}){return put(name,k.slabOf(p,z,h,P,8,Math.min(.6,h/3)),A.slab(p,z,h,{name,owner:opts.owner||opts.piece||'phone',...(name==='phone.chassis'?{ground:true}:{})}),opts)}
function disc(name,x,y,r,z,h,opts={}){return put(name,k.cylinder(x,y,r,z,h,P,64),A.cylinder(x,y,r,z,h,{name,owner:opts.owner||opts.piece||'phone'}),opts)}
function ring(name,F,z,h,inner,outer,opts={}){
 // Split the real annulus into rear/front half-solids. Whole rings interlock
 // in painter order with the optical elements they surround.
 const angle=P.azimuth*Math.PI/180;
 for(const [half,start]of [['front',angle-Math.PI/2],['back',angle+Math.PI/2]]){
  const arc=(r,reverse=false)=>Array.from({length:49},(_,i)=>{const t=start+(reverse?48-i:i)/48*Math.PI;return [F.o[0]+r*Math.cos(t),F.o[1]+r*Math.sin(t)]});
  const poly=[...arc(outer),...arc(inner,true)];
  put(`${name}.${half}`,k.extrude(poly,z,h,P,{convex:false}),A.extruded(poly,z,h,{name:`${name}.${half}`,owner:opts.owner||opts.piece||'phone'}),opts);
 }
}
slab('phone.chassis',plan,0,6.5,{material:'titanium'});
slab('phone.back',k.insetPlan(plan,1.15),6.5,.65,{material:'back',extra:k.lineSvg(k.planOutline(k.insetPlan(plan,2.2),7.16,P),{tone:'faint'})});
// The back-glass seam is a closed inset outline, not an unsupported open rule.
const seam=k.lineSvg(k.planOutline(k.insetPlan(plan,2.2),7.16,P),{tone:'faint'});
const cameraPlan={x:-57,y:-123,w:84,d:93,r:17};
slab('phone.camera-island',cameraPlan,7.15,2.85,{material:'island'});
// Side buttons physically meet the chassis sides.
for(const [i,y]of[-57,-25,13].entries())slab(`phone.key-${i}`,{x:-67.3,y,w:1.3,d:i===2?23:17,r:.55},2,2.3,{material:'titanium'});
slab('phone.power',{x:66,y:-36,w:1.3,d:34,r:.55},2,2.3,{material:'titanium'});
// Small closed speaker/connector recesses, drawn on the bottom side face.
for(let i=0;i<8;i++)slab(`phone.speaker-${i}`,{x:-37+i*4.2,y:131.1,w:2.2,d:.9,r:.4},1.8,2.3,{material:'recess'});
slab('phone.port',{x:7,y:131.1,w:17,d:.9,r:.4},1.6,2.8,{material:'recess'});
for(const [i,x]of[-50,37].entries())slab(`phone.antenna-${i}`,{x,y:131.2,w:1.2,d:.8,r:.1},.7,5,{material:'band'});
// Two other cameras retain a complete barrel/rim/glass assembly.
for(const [i,x,y]of[[0,1,-75],[1,-34,-52]]){
 disc(`phone.other-${i}-seat`,x,y,16.6,10,.9,{material:'titanium'});
 disc(`phone.other-${i}-barrel`,x,y,15.5,10.9,4.7,{material:'graphite'});
 disc(`phone.other-${i}-rim`,x,y,14.5,15.6,.65,{material:'titanium'});
 disc(`phone.other-${i}-glass`,x,y,12.7,16.25,.25,{material:'optic'});
 disc(`phone.other-${i}-aperture`,x,y,5.3,16.5,.1,{material:'aperture'});
}
disc('phone.flash-seat',10,-110,6.2,10,.5,{material:'silver'});
disc('phone.flash',10,-110,5.3,10.5,.35,{material:'flash'});
disc('phone.rangefinder',3,-42,4.2,10,.8,{material:'graphite'});
// Sensor and carrier stay seated while the optical elements move along their axis.
slab('sensor.carrier',{x:-48,y:-113,w:28,d:28,r:3},10,1.6,{piece:'sensor',material:'ceramic'});
slab('sensor.die',{x:-44,y:-109,w:20,d:20,r:.4},11.6,.4,{piece:'sensor',material:'silicon'});
slab('sensor.active',{x:-43,y:-108,w:18,d:18,r:.3},12,.25,{piece:'sensor',material:'sensor'});
for(let i=0;i<6;i++)for(const x of [-47,-23])slab(`sensor.pad-${i}-${x}`,{x,y:-112+i*4.2,w:2,d:2,r:.2},11.6,.12,{piece:'sensor',material:'gold'});
// Filter, lenses and annular housing are real recorded geometry. All move away
// from the sensor monotonically, so adjacent optical pieces never cross.
disc('filter.plate',-34,-99,12.4,12.25,.75,{piece:'filter',move:moves.filter,material:'filter'});
for(const [piece,z,h]of[['bottom',13,3],['middle',16,3],['top',19,3]]){
 disc(`${piece}.optic`,-34,-99,12.4,z,h,{piece,move:moves[piece],material:'optic'});
 disc(`${piece}.coating`,-34,-99,11.4,z+h,.06,{piece,move:moves[piece],material:'coating',owner:piece});
}
ring('barrel.base',axis,10,3,20.5,21.5,{piece:'barrel',move:moves.barrel,material:'graphite'});
ring('barrel.flange',axis,13,.5,12.85,21.5,{piece:'barrel',move:moves.barrel,material:'graphite'});
ring('barrel.housing',axis,13.5,10,12.85,16.6,{piece:'barrel',move:moves.barrel,material:'graphite'});
ring('barrel.polished-rim',axis,23.5,.6,12.85,16.6,{piece:'barrel',move:moves.barrel,material:'titanium'});
// A shallow surface inlay on the rear glass, with no unsupported text labels.
slab('phone.brand-inlay',{x:-11,y:7,w:22,d:25,r:10},7.15,.02,{material:'inlay'});
const states=Array.from({length:25},(_,i)=>i/24);
A.settle(R,P,{states,step:1,least:1});
R.items.sort((a,b)=>a.key-b.key);
const camera=k.iso([-34,-99,62],P),sensor=k.iso([-34,-99,12],P),origin=k.iso([0,0,0],P),unit=k.iso([0,0,1],P);
const markup=`<svg class="phone-drawing iso-svg" viewBox="0 0 700 620" role="img" aria-label="Detailed schematic phone camera. Scrolling separates its housing, three illustrative optical elements and an infrared filter to expose the sensor. This is not an exact iPhone teardown."><defs><linearGradient id="hf-lens-glint" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#87b6c9"/><stop offset=".4" stop-color="#192d42"/><stop offset=".7" stop-color="#292240"/><stop offset="1" stop-color="#5c8090"/></linearGradient><linearGradient id="hf-sensor" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#606e99"/><stop offset=".45" stop-color="#415167"/><stop offset="1" stop-color="#a28390"/></linearGradient></defs><g data-camera-world>${R.items.map(item=>{const move=item.meta.move;return `<g class="camera-piece" data-piece="${item.meta.piece}" data-paint-key="${item.key}" data-paint-lift="${move*Math.sin(P.elevation*Math.PI/180)}" data-lift-x="${(unit[0]-origin[0])*move}" data-lift-y="${(unit[1]-origin[1])*move}">${item.svg}</g>`}).join('')}<path class="camera-selection-ring" d="${k.ring(-34,-99,22,24.2,P,72)}"/></g></svg>`;
writeFileSync('src/lib/photography/preview/camera-geometry.js',`// Generated with the Anatomy kit. Schematic; dimensions are not a device specification.\nexport const cameraMarkup=${JSON.stringify(markup)};\nexport const cameraGeometry=${JSON.stringify({projection:P,camera,sensor,parts:count,travel:moves})};\n`);
console.log(`Camera figure: ${count} recorded solids, ${R.items.length} paint items.`);
if(process.argv.includes('--audit')){
 const result=A.audit(R,P,{frames:states,apart:1});
 console.log(A.report(result));
 writeFileSync('docs/photography/preview-verification/camera-audit.json',JSON.stringify(result,(key,value)=>key==='svg'?undefined:value,2));
 if(A.failures(result))process.exitCode=1;
 else console.log('audit passed');
}
