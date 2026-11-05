// Bare 4x4 sensor teaching cutaway. Anatomy MIT; schematic dimensions.
import * as k from '../../.agents/skills/anatomy/kit/iso-kit.mjs';
import * as A from '../../.agents/skills/anatomy/kit/audit.mjs';
import {writeFileSync} from 'node:fs';
const board={x:-73,y:-73,w:146,d:146,r:5};
const P=k.fitProjection([...k.boxCorners(board,0,22)],700,510,{pad:65,azimuth:38,elevation:46});
const R=A.recorder(P);let count=0;
function slab(name,p,z,h,material='ceramic'){
 const id=`patch.${name}.${count++}`;
 R.put({name:id,piece:'patch',at:[p.x+p.w/2,p.y+p.d/2,z+h/2],svg:`<g class="camera-material" data-material="${material}">${k.solidSvg(k.slabOf(p,z,h,P,8,Math.min(h/3,.5)),{tone:'mid'})}</g>`,shapes:[R.solid(A.slab(p,z,h,{name:id,owner:'patch',...(name==='carrier'?{ground:true}:{})}))]});
}
slab('carrier',board,0,3,'ceramic');slab('silicon',{x:-67,y:-67,w:134,d:134,r:3},3,2,'silicon');
for(let i=0;i<7;i++)for(const x of [-73,69])slab('pad',{x,y:-58+i*18,w:4,d:8,r:.5},3,.3,'gold');
for(let y=0;y<4;y++)for(let x=0;x<4;x++){
 const p={x:-61+x*31,y:-61+y*31,w:29,d:29,r:2};
 slab('well',p,5,5,'well');
 slab('filter',p,10,1.8,['filter-blue','filter-green','filter-green','filter-red'][(y%2)*2+x%2]);
 slab('microlens',{...p,x:p.x+1,y:p.y+1,w:27,d:27,r:13.3},11.8,3.5,'microlens');
}
// Centroid sorting alone hides rear sites beneath the large carrier. Settle
// actual projected surface depths so all sixteen sites remain visible.
A.settle(R,P,{states:[0],step:1});R.items.sort((a,b)=>a.key-b.key);
writeFileSync('src/lib/photography/preview/pixel-geometry.js',`// Generated schematic sensor cutaway, Anatomy MIT.\nexport const pixelMarkup=${JSON.stringify(`<svg class="pixel-drawing iso-svg" viewBox="0 0 700 510" role="img" aria-label="Schematic cutaway of sixteen sensing sites with colour filters and microlenses on a silicon die.">${R.items.map(p=>p.svg).join('')}</svg>`)};\n`);
console.log(`Bare sensor patch: ${count} recorded solids, four by four sites.`);
if(process.argv.includes('--audit')){const result=A.audit(R,P);console.log(A.report(result));writeFileSync('docs/photography/preview-verification/pixel-audit.json',JSON.stringify(result,null,2));if(A.failures(result))process.exitCode=1;else console.log('audit passed');}
