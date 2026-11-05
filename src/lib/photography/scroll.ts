import data from './article-data.json'

// Scroll chooses stable states. No time-driven tour, dense SVG rebuild, or ongoing RAF.
const names = ['R', 'G', 'B']
const spaceTitles = ['A small piece of the photograph', 'One site, one measurement', 'The missing-colour problem', 'Look next door', 'Look diagonally', 'Repeat across the image']
const timeTitles = ['Four actual observations', 'Just averaging is not enough', 'Find the same detail', 'Put observations in register', 'Combine evidence that agrees']
let teardown: (() => void) | undefined
export function mountStories() {
  teardown?.()
  const abort = new AbortController()
  const stories = [...document.querySelectorAll<HTMLElement>('photo-story')]
  let queued = 0
  function set(story: HTMLElement, index: number) {
    if (story.dataset.active === String(index)) return
    story.dataset.active = String(index)
    story.dataset.step = String(index)
    const space = story.dataset.kind === 'space'
    story.querySelector('[data-figure-title]')!.textContent = (space ? spaceTitles : timeTitles)[index]
    story.querySelector('[data-step-count]')!.textContent = `${String(index + 1).padStart(2, '0')} / ${space ? '06' : '05'}`
    if (space) updateSpace(story, index)
    else updateTime(story, index)
  }
  function update() {
    queued=0
    if(document.hidden)return
    for (const story of stories) {
      const steps = [...story.querySelectorAll<HTMLElement>('[data-story-step]')]
      const visual=story.querySelector<HTMLElement>('.story-visual')!
      const grid=story.querySelector<SVGSVGElement>('.grid-panel svg')
      if(grid)grid.setAttribute('viewBox',matchMedia('(max-width: 899px)').matches?'94 74 305 255':'0 0 490 404')
      const mobile=matchMedia('(max-width: 899px)').matches
      const line=mobile ? Math.min(innerHeight*.65, visual.getBoundingClientRect().bottom+90) : innerHeight*.52
      let index=0
      for(let i=0;i<steps.length;i++)if(steps[i].getBoundingClientRect().top<=line)index=i
      set(story,index)
    }
  }
  const schedule=()=>{if(!queued)queued=requestAnimationFrame(update)}
  for(const story of stories){story.classList.add('is-enhanced')}
  addEventListener('scroll',schedule,{passive:true,signal:abort.signal})
  addEventListener('resize',schedule,{passive:true,signal:abort.signal})
  document.addEventListener('visibilitychange',schedule,{signal:abort.signal})
  const assets = new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      entry.target.querySelectorAll<SVGImageElement>('[data-photo-src]').forEach(image=>image.setAttribute('href',image.dataset.photoSrc!))
      assets.unobserve(entry.target)
    }
  },{rootMargin:'800px 0px'})
  stories.filter(s=>s.dataset.kind==='time').forEach(s=>assets.observe(s))
  const resize = new ResizeObserver(schedule)
  stories.forEach(s=>resize.observe(s))
  update()
  teardown=()=>{abort.abort();resize.disconnect();assets.disconnect();cancelAnimationFrame(queued)}
  document.addEventListener('astro:before-swap',()=>teardown?.(),{once:true,signal:abort.signal})
}
function updateSpace(root: HTMLElement, step:number) {
  const target=data.patch.sites.find(s=>s.x===data.patch.x&&s.y===data.patch.y)!
  const visible=step===0?'crop':step===1?'sensor':step===5?'rebuilt':'grid'
  root.querySelectorAll<HTMLElement>('[data-space-panel]').forEach(p=>{p.hidden=p.dataset.spacePanel!==visible})
  const channel=step===3?1:step>=4?2:0
  const contributors=target.channels[channel].sites
  root.querySelectorAll<SVGGElement>('[data-cell]').forEach(cell=>{
    const [x,y]=cell.dataset.cell!.split(',').map(Number)
    cell.classList.toggle('contributor',step>=3&&contributors.some(p=>p.x===x&&p.y===y))
  })
  root.querySelectorAll<HTMLElement>('[data-readout-channel]').forEach((el,c)=>{
    const known=c===0||(c===1&&step>=3)||(c===2&&step>=4)
    el.querySelector('strong')!.textContent=known?target.channels[c].value.toFixed(4):'—'
    el.querySelector('small')!.textContent=c===0?'measured':known?'estimated':'missing'
    el.classList.toggle('revealed',known)
  })
  let arithmetic='Magnification changes the inspection scale, not the evidence.'
  if(step===1)arithmetic='Microlens → colour filter → sensing site. Geometry is schematic.'
  if(step===2)arithmetic=`R = (145 − 63.75) ÷ (1023 − 63.75) = ${target.value.toFixed(4)}. G and B were not measured here.`
  if(step===3||step===4){const c=target.channels[channel];arithmetic=`${names[channel]} ≈ (${c.sites.map(p=>p.value.toFixed(3)).join(' + ')}) × ¼ = ${c.value.toFixed(4)} · weights: ¼ each`}
  if(step===5)arithmetic='One measured component; two estimated components. The same kernel, repeated.'
  root.querySelector('[data-arithmetic]')!.textContent=arithmetic
  root.querySelector('[data-figure-hint]')!.textContent=step>=2&&step<=4?'Raw target (2301, 2201) · normalized sensor values':'The same region · capture N000'
}
function updateTime(root:HTMLElement,step:number){
  const panel=step===0?'captures':step===2||step===3?'table':'result'
  root.querySelectorAll<HTMLElement>('[data-time-panel]').forEach(p=>{p.hidden=p.dataset.timePanel!==panel})
  root.querySelector('.table-panel')?.classList.toggle('registered',step===3)
  // Corrections in displayed coordinates: raw (-dx,-dy), rotated clockwise => (dy,-dx).
  // Matrix is the light table image plane basis, mapping original photo pixels to SVG.
  root.querySelectorAll<SVGGElement>('.photo-carrier').forEach(el=>{
    const t=data.transforms[Number(el.dataset.frame)]
    const image=el.querySelector('image')!
    const matrix=image.transform.baseVal.consolidate()!.matrix
    const dx=matrix.a*t.dy-matrix.c*t.dx,dy=matrix.b*t.dy-matrix.d*t.dx
    el.style.setProperty('--correct-x',`${dx}px`);el.style.setProperty('--correct-y',`${dy}px`)
  })
  const comparison=root.querySelector<HTMLElement>('.corresponding-frame')!
  const t=data.transforms[2]
  comparison.style.setProperty('--correspond-x',`${100*t.dy/384}%`)
  comparison.style.setProperty('--correspond-y',`${-100*t.dx/384}%`)
  const file=step===4?'merged':'unaligned'
  root.querySelectorAll<HTMLImageElement>('[data-result-image],[data-detail-image]').forEach(img=>{img.src=`/photography/${file}.webp`;img.alt=step===4?'Registered robust merge, same rendering and framing':'Unregistered average, same rendering and framing'})
  root.querySelector('[data-result-label]')!.textContent=step===4?'Registered robust merge':'Unregistered average'
  root.querySelector('[data-arithmetic]')!.textContent=[
    'Same scene. Different positions and noise.',
    'Average first: detail from different positions lands in the same output.',
    'N001 (−1.375, −1.125) · N002 (−3.625, −1.375) · N003 (−2.875, +0.625) px',
    'Aligned(x, y) = source(x + dx, y + dy). Bilinear resampling between sites.',
    '6,264 / 437,007 overlapping candidate observations rejected for disagreement (1.4%).'
  ][step]
  root.querySelector('[data-figure-hint]')!.textContent=step===2?'Measured source sampling offsets · sensor axes':step===3?'Carriers lower; measured offsets are corrected':'Same crop · same display settings'
}
