import data from '../article-data.json'
import {reconstructionSteps} from './reconstruction-model.js'

type Source=typeof data.patch.sites[number]['channels'][number]['sites'][number]

const titles=[
  'One measured. Two still missing.',
  'Green comes from four neighbours.',
  'Blue completes the RGB estimate.',
]
const descriptions=[
  'This site measures red, but not green or blue.',
  '¼ from each neighbour. Red stays measured.',
  '¼ from each diagonal. Two estimates, one measurement.',
]

export function mountReconstruction(root:HTMLElement,signal:AbortSignal,select:(channel:number)=>void){
  const figure=root.querySelector<HTMLElement>('[data-reconstruction]')!
  const main=figure.querySelector<HTMLElement>('.rc-main')!
  const grid=figure.querySelector<SVGSVGElement>('.rc-grid')!
  const overlay=figure.querySelector<SVGSVGElement>('.rc-connections')!
  const cells=[...figure.querySelectorAll<SVGGElement>('[data-hf-cell]')]
  const components=[...figure.querySelectorAll<HTMLElement>('[data-hf-component]')]
  const buttons=[...figure.querySelectorAll<HTMLButtonElement>('[data-rc-step]')]
  const connections=[...figure.querySelectorAll<SVGGElement>('.rc-connection')].map(el=>({
    el,path:el.querySelector<SVGPathElement>('.rc-route')!,halo:el.querySelector<SVGPathElement>('.rc-route-halo')!,
    port:el.querySelector<SVGCircleElement>('.rc-source-port')!,token:el.querySelector<SVGGElement>('.rc-token')!,length:0,
  }))
  const reduce=matchMedia('(prefers-reduced-motion: reduce)')
  const steps=reconstructionSteps(data.patch)
  let channel=-1,frame=0,start=0,active=false
  function stop(){
    cancelAnimationFrame(frame);frame=0
    connections.forEach(c=>c.token.setAttribute('opacity','0'))
  }
  function layout(){
    grid.setAttribute('viewBox',innerWidth<900?'126 126 196 196':'0 0 448 448')
    if(!active||channel<0)return
    const box=main.getBoundingClientRect()
    if(!box.width)return
    overlay.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`)
    const end=components[channel].querySelector('.rc-port')!.getBoundingClientRect()
    const ex=end.left+end.width/2-box.left,ey=end.top+end.height/2-box.top
    connections.forEach((c,i)=>{
      const source=steps[channel].sources[i]
      c.el.setAttribute('visibility',source?'visible':'hidden')
      if(!source)return
      const cell=cells.find(el=>el.dataset.hfCell===`${source.x},${source.y}`)!
      const rect=cell.querySelector('.rc-site-face')!.getBoundingClientRect()
      const direct=channel===0||source.x>data.patch.x&&source.y===data.patch.y
      const above=source.y<data.patch.y
      const sx=(direct?rect.right+2:rect.left+rect.width/2)-box.left
      const sy=(direct?rect.top+rect.height/2:above?rect.top+2:rect.bottom-2)-box.top
      const bend=(ex-sx)*.5
      const sensor=grid.getBoundingClientRect()
      const lane=(above?rect.top-rect.height*3/56:rect.bottom+rect.height*3/56)-box.top
      const exit=sensor.right-box.left+8
      const turn=Math.max(0,(ex-exit)*.45)
      const d=direct
        ?`M${sx} ${sy}C${sx+bend} ${sy},${ex-bend*.65} ${ey},${ex} ${ey}`
        :`M${sx} ${sy}Q${sx} ${lane},${sx+6} ${lane}H${exit}C${exit+turn} ${lane},${ex-turn} ${ey},${ex} ${ey}`
      c.path.setAttribute('d',d);c.halo.setAttribute('d',d)
      c.port.setAttribute('cx',String(sx));c.port.setAttribute('cy',String(sy))
      c.token.querySelector('text')!.textContent=channel===0?'R':'¼'
      c.length=c.path.getTotalLength()
    })
  }
  function tick(now:number){
    frame=0
    if(document.hidden||!active){stop();return}
    if(!start)start=now
    const elapsed=now-start
    let moving=false
    connections.forEach((c,i)=>{
      if(i>=steps[channel].sources.length)return
      const t=(elapsed-220-i*140)/1250
      if(t<1)moving=true
      if(t<=0||t>=1){c.token.setAttribute('opacity','0');return}
      const eased=t*t*(3-2*t),p=c.path.getPointAtLength(c.length*eased)
      c.token.setAttribute('transform',`translate(${p.x} ${p.y})`)
      c.token.setAttribute('opacity',String(Math.min(1,t*12,(1-t)*12)))
    })
    if(moving)frame=requestAnimationFrame(tick)
  }
  function replay(){
    stop();layout()
    if(!active||reduce.matches||document.hidden)return
    start=0;frame=requestAnimationFrame(tick)
  }
  function update(next:number|null){
    active=next!==null
    if(next===null){stop();return}
    if(next===channel){layout();return}
    channel=next
    const step=steps[channel]
    figure.dataset.channel=String(channel)
    cells.forEach(el=>el.classList.toggle('is-contributor',channel!==0&&step.sources.some((s:Source)=>el.dataset.hfCell===`${s.x},${s.y}`)))
    components.forEach((el,i)=>{
      const c=step.components[i]
      el.querySelector('strong')!.textContent=c.value
      el.querySelector('small')!.textContent=c.status
      el.classList.toggle('is-estimated',c.status==='estimated')
      el.classList.toggle('is-active',i===channel)
    })
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===channel)))
    figure.querySelector('[data-rc-counter]')!.textContent=`0${channel+1} / 03`
    figure.querySelector('[data-rc-index]')!.textContent=`0${channel+1}`
    figure.querySelector('[data-rc-title]')!.textContent=titles[channel]
    figure.querySelector('[data-rc-description]')!.textContent=descriptions[channel]
    figure.querySelector('[data-hf-equation]')!.textContent=step.equation
    grid.setAttribute('aria-label',`${titles[channel]} ${descriptions[channel]}`)
    replay()
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i),{signal}))
  figure.querySelector('.rc-replay')!.addEventListener('click',replay,{signal})
  figure.querySelector('.rc-controls')!.addEventListener('keydown',event=>{
    const e=event as KeyboardEvent
    const next=e.key==='ArrowRight'?Math.min(2,channel+1):e.key==='ArrowLeft'?Math.max(0,channel-1):e.key==='Home'?0:e.key==='End'?2:null
    if(next===null)return
    e.preventDefault();buttons[next].focus({preventScroll:true});select(next)
  },{signal})
  figure.querySelector('details')!.addEventListener('keydown',event=>{
    if((event as KeyboardEvent).key==='Escape')figure.querySelector('details')!.open=false
  },{signal})
  reduce.addEventListener('change',stop,{signal})
  document.addEventListener('visibilitychange',stop,{signal})
  const observer=new IntersectionObserver(entries=>{if(!entries[entries.length-1].isIntersecting)stop()})
  observer.observe(figure)
  signal.addEventListener('abort',()=>{stop();observer.disconnect()},{once:true})
  return {update,layout}
}
