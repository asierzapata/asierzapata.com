import test from 'node:test'
import assert from 'node:assert/strict'
import {sensorMarkup} from '../../src/lib/photography/sensor-geometry.js'
import {tableMarkup} from '../../src/lib/photography/table-geometry.js'
test('precomputed figure paths are finite and have usable viewboxes and accessible descriptions',()=>{
 for(const svg of [sensorMarkup,tableMarkup]){
  assert.ok(svg.includes('role="img"'));assert.ok(svg.includes('aria-label='));assert.ok(svg.includes('viewBox='));assert.ok(!/NaN|Infinity|undefined/.test(svg));
  const paths=[...svg.matchAll(/\sd="([^"]*)"/g)];assert.ok(paths.length>100)
  for(const [,d]of paths){assert.match(d,/^[MLCQAZHVSmlcqazhvs\d\s.,+e-]+$/);const n=d.match(/-?\d+(?:\.\d+)?/g).map(Number);assert.ok(n.every(x=>Number.isFinite(x)&&Math.abs(x)<3000))}
 }
})
test('teaching figures retain purposeful hardware and real photographic planes',()=>{
 assert.equal((sensorMarkup.match(/class="sensor-filter"/g)||[]).length,16)
 assert.equal((sensorMarkup.match(/class="microlens"/g)||[]).length,16)
 assert.equal((sensorMarkup.match(/class="collection"/g)||[]).length,16)
 assert.equal((tableMarkup.match(/class="photo-carrier"/g)||[]).length,4)
 for(let i=0;i<4;i++)assert.ok(tableMarkup.includes(`/photography/frame-${i}.webp`))
})
