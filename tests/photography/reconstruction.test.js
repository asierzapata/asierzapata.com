import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {reconstructionSteps} from '../../src/lib/photography/preview/reconstruction-model.js'

const {patch}=JSON.parse(readFileSync('src/lib/photography/article-data.json'))

test('the reconstruction story retains the measurement and reveals only the estimates reached',()=>{
  const before=JSON.stringify(patch)
  const steps=reconstructionSteps(patch)
  assert.deepEqual(steps.map(s=>s.components.map(c=>c.value)),[
    ['0.0847','—','—'],
    ['0.0847','0.1608','—'],
    ['0.0847','0.1608','0.0860'],
  ])
  assert.deepEqual(steps.map(s=>s.components.map(c=>c.status)),[
    ['measured','not measured','not measured'],
    ['measured','estimated','not measured'],
    ['measured','estimated','estimated'],
  ])
  assert.equal(JSON.stringify(patch),before)
})

test('every animated contribution comes from the actual interpolation kernel',()=>{
  const target=patch.sites.find(s=>s.x===patch.x&&s.y===patch.y)
  reconstructionSteps(patch).forEach((step,c)=>{
    assert.deepEqual(step.sources,target.channels[c].sites)
    assert.equal(step.sources.length,c===0?1:4)
    const value=step.sources.reduce((n,s)=>n+s.value*s.weight,0)
    assert.ok(Math.abs(value-target.channels[c].value)<1e-12)
    step.sources.forEach(s=>{
      const cell=patch.cells.find(p=>p.x===s.x&&p.y===s.y)
      assert.equal(cell.c,c)
      assert.equal(cell.value,s.value)
      assert.ok(Math.abs(s.x-patch.x)<=1&&Math.abs(s.y-patch.y)<=1)
    })
  })
})

test('calculation copy derives the black level and weights from data, not fixed labels',()=>{
  const steps=reconstructionSteps(patch)
  assert.equal(steps[0].equation,'R = (145 − 63.75) / (1023 − 63.75) ≈ 0.0847')
  assert.equal(steps[1].equation,'G ≈ 0.131 × ¼ + 0.183 × ¼ + 0.170 × ¼ + 0.159 × ¼ ≈ 0.1608')
  assert.equal(steps[2].equation,'B ≈ 0.084 × ¼ + 0.073 × ¼ + 0.098 × ¼ + 0.089 × ¼ ≈ 0.0860')
})
