// Static endpoints use the exact generated figure geometry, not separate drawings.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {cameraMarkup,cameraGeometry} from '../../src/lib/photography/preview/camera-geometry.js';
import {pixelMarkup} from '../../src/lib/photography/preview/pixel-geometry.js';
const folder='public/photography/preview';mkdirSync(folder,{recursive:true});
const css=readFileSync('src/components/photography/anatomy.css','utf8')+'\n'+readFileSync('src/components/photography/preview/preview.css','utf8').split('\n').filter(line=>line.startsWith('.camera-material')||line.startsWith('.camera-selection-ring')).join('\n');
function standalone(svg){return svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" data-theme="light" ').replace('iso-svg"','iso-svg iso"').replace(/(<svg[^>]*>)/,`$1<style>${css}</style>`)}
writeFileSync(`${folder}/camera-assembled.svg`,standalone(cameraMarkup));
const scale=2.35,[cx,cy]=cameraGeometry.camera;
let separated=cameraMarkup.replace('<g data-camera-world>',`<g data-camera-world transform="translate(${350-cx*scale} ${330-cy*scale}) scale(${scale})">`);
separated=separated.replace(/<g class="camera-piece"([^>]+)>/g,(_,attrs)=>{
 const value=(name)=>attrs.match(new RegExp(name+'="([^"\\s]+)"'))?.[1];
 const piece=value('data-piece'),x=value('data-lift-x'),y=value('data-lift-y');
 if(x===undefined||y===undefined)throw Error('Missing static piece transform');
 return `<g class="camera-piece" opacity="${piece==='phone'?'.09':'1'}" transform="translate(${x} ${y})">`;
});
writeFileSync(`${folder}/camera-separated.svg`,standalone(separated.replace('class="camera-selection-ring"','class="camera-selection-ring" opacity="0"')));
writeFileSync(`${folder}/pixel-patch.svg`,standalone(pixelMarkup));
console.log('Static no-script endpoints: assembled camera, separated camera, sensor patch.');
