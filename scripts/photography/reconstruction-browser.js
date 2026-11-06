async () => {
  const root=document.querySelector('photo-preview'),figure=root.querySelector('[data-reconstruction]'),checks=[]
  const assert=(v,m)=>{if(!v)throw Error(m);checks.push(m)}
  const settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))
  const controls=[...figure.querySelectorAll('[data-rc-step]')]
  const expected=[['0.0847','—','—'],['0.0847','0.1608','—'],['0.0847','0.1608','0.0860']]
  for(const i of [0,1,2,1,0,2]){
    controls[i].click()
    await settle()
    assert(root.dataset.hfState===String(i+5),`step ${i} matches the article passage`)
    assert(controls.filter(b=>b.getAttribute('aria-pressed')==='true').length===1,`step ${i} has one pressed control`)
    assert(JSON.stringify([...figure.querySelectorAll('[data-hf-component] strong')].map(e=>e.textContent))===JSON.stringify(expected[i]),`step ${i} has the exact measured and estimated values`)
    assert(figure.querySelectorAll('.is-contributor').length===(i===0?0:4),`step ${i} has the correct source sites`)
    const box=figure.getBoundingClientRect(),stage=root.querySelector('.hf-stage').getBoundingClientRect()
    assert(box.top>=stage.top-1&&box.bottom<=stage.bottom+1,`step ${i} fits without clipping`)
    assert(document.documentElement.scrollWidth<=innerWidth,`step ${i} has no horizontal overflow`)
    const lines=[...figure.querySelectorAll('.rc-connection[visibility="visible"]')]
    assert(lines.length===(i===0?1:4),`step ${i} traces each actual contribution`)
    const main=figure.querySelector('.rc-main').getBoundingClientRect()
    const port=figure.querySelector(`[data-hf-component="${i}"] .rc-port`).getBoundingClientRect()
    lines.forEach(line=>{
      const path=line.querySelector('.rc-route'),end=path.getPointAtLength(path.getTotalLength())
      assert(Math.abs(end.x-(port.left+port.width/2-main.left))<.1&&Math.abs(end.y-(port.top+port.height/2-main.top))<.1,`step ${i} connection lands on its output`)
    })
  }
  controls[2].focus({preventScroll:true})
  controls[2].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true}))
  await settle()
  assert(root.dataset.hfState==='6'&&document.activeElement===controls[1],'arrow keys move focus and the article together')
  const details=figure.querySelector('details')
  details.open=true
  assert(figure.querySelector('[data-hf-equation]').textContent.includes('0.1608'),'calculation matches the current estimate')
  details.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))
  assert(!details.open,'Escape closes the calculation')
  figure.querySelector('.rc-replay').click()
  await new Promise(r=>setTimeout(r,800))
  const tokens=[...figure.querySelectorAll('.rc-token')]
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches
  assert(reduced?tokens.every(t=>Number(t.getAttribute('opacity'))===0):tokens.some(t=>Number(t.getAttribute('opacity'))>0),'replay respects the motion preference')
  await new Promise(r=>setTimeout(r,1400))
  assert(tokens.every(t=>Number(t.getAttribute('opacity'))===0),'the contribution animation settles rather than looping')
  return {viewport:[innerWidth,innerHeight],reducedMotion:reduced,checks}
}
