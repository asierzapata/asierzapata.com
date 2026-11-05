import {beats} from './beats'
import {cameraGeometry} from './camera-geometry.js'
import data from '../article-data.json'
let cleanup: (()=>void)|undefined
const clamp=(n:number,min=0,max=1)=>Math.max(min,Math.min(max,n))
const smooth=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)}
export function mountPreview(){
  cleanup?.()
  const root=document.querySelector<HTMLElement>('photo-preview')
  if(!root)return
  const signal=new AbortController(),reduce=matchMedia('(prefers-reduced-motion: reduce)')
  const steps=[...root.querySelectorAll<HTMLElement>('[data-hf-beat]')]
  const panels=[...root.querySelectorAll<HTMLElement>('[data-hf-panel]')]
  const pieces=[...root.querySelectorAll<SVGGElement>('.camera-piece')].map(el=>({el,piece:el.dataset.piece!,x:Number(el.dataset.liftX),y:Number(el.dataset.liftY),key:Number(el.dataset.paintKey),lift:Number(el.dataset.paintLift)}))
  const world=root.querySelector<SVGGElement>('[data-camera-world]')!
  const cameraPanel=root.querySelector<HTMLElement>('.hf-camera-panel')!
  const selection=root.querySelector<SVGPathElement>('.camera-selection-ring')!
  const grid=root.querySelector<SVGSVGElement>('.hf-sample-grid')!
  const target=data.patch.sites.find(s=>s.x===data.patch.x&&s.y===data.patch.y)!
  const cells=[...root.querySelectorAll<SVGGElement>('[data-hf-cell]')]
  const components=[...root.querySelectorAll<HTMLElement>('[data-hf-component]')]
  const caption=root.querySelector('[data-hf-caption]')!,source=root.querySelector('[data-hf-source]')!
  let frame=0,last=0,dirty=true,index=-1,travel=0,focus=0,targetTravel=0,targetFocus=0,visible=true
  let paintOrder=pieces.map(p=>p.el)
  const captions:Record<string,[string,string]>={camera:['Schematic phone camera','Not an exact iPhone teardown'],size:['A physical reference','Relative sizes await camera-model verification'],patch:['Inside the sensor','Schematic microlenses, filters and sensing sites'],grid:['Actual Bayer measurements','Normalized sensor values · Google Pixel fixture'],crop:['Colour, reconstructed','Same bilinear kernel · native 384 × 384 region'],noise:['One imperfect observation','Actual fixture detail · low-light source pending'],frames:['Four separate captures','N000–N003 · matching exposure settings'],unaligned:['The unregistered average','Same framing and rendering as the reference'],alignment:['Establish correspondence','Measured translation · sensor-coordinate offsets'],merged:['Combine agreeing evidence','Same viewing settings · registered robust merge'],bracket:['An exposure bracket','Source slots · no invented photographic result']}
  function setState(next:number){
    if(next===index)return
    index=next
    const beat=beats[index]
    root!.dataset.hfState=String(index);root!.dataset.hfView=beat.view
    panels.forEach(panel=>panel.hidden=panel.dataset.hfPanel!==beat.view)
    const words=captions[beat.view];caption.textContent=words[0];source.textContent=words[1]
    if(index===2){caption.textContent='The exposed sensor';source.textContent='A stable pause for your physical camera'}
    if(beat.view==='grid'){
      const channel='channel' in beat?beat.channel:0
      const selected=target.channels[channel]
      cells.forEach(el=>{const [x,y]=el.dataset.hfCell!.split(',').map(Number);el.classList.toggle('is-contributor',channel!==0&&selected.sites.some(p=>p.x===x&&p.y===y))})
      components.forEach((el,c)=>{const known=c===0||c<=channel;el.querySelector('strong')!.textContent=known?target.channels[c].value.toFixed(4):'—';el.querySelector('small')!.textContent=c===0?'measured':known?'estimated':'not measured';el.classList.toggle('is-estimated',known&&c!==0)})
      root!.querySelector('[data-hf-equation]')!.textContent=channel===0?'R = (145 − 63.75) / (1023 − 63.75)':`${['R','G','B'][channel]} ≈ (${selected.sites.map(s=>s.value.toFixed(3)).join(' + ')}) × ¼ = ${selected.value.toFixed(4)}`
    }
    root!.querySelector('.hf-alignment-panel')?.classList.remove('is-registered')
  }
  function measure(){
    dirty=false
    const mobile=matchMedia('(max-width:899px)').matches
    const line=mobile?Math.min(innerHeight*.7,root!.querySelector('.hf-visual-column')!.getBoundingClientRect().bottom+85):innerHeight*.52
    let next=0
    const boxes=steps.map(step=>step.getBoundingClientRect())
    for(let i=0;i<boxes.length;i++)if(boxes[i].top<=line)next=i
    setState(next)
    grid.setAttribute('viewBox',mobile?'138 120 192 159':'0 0 462 399')
    if(next===0){targetTravel=0;targetFocus=0}
    else if(next===1){const p=clamp((line-boxes[1].top)/(boxes[1].height*.5));targetTravel=reduce.matches?1:smooth(p);targetFocus=reduce.matches?1:smooth(clamp(p*1.8))}
    else {targetTravel=1;targetFocus=1}
    if(beats[next].view==='alignment'){
      const p=clamp((line-boxes[next].top)/(boxes[next].height*.35))
      root!.querySelector('.hf-alignment-panel')?.classList.toggle('is-registered',reduce.matches||p>.35)
    }
  }
  function tick(now:number){
    frame=0
    if(document.hidden||!visible){last=0;return}
    if(dirty)measure()
    const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now
    const cameraVisible=beats[Math.max(0,index)].view==='camera'
    const factor=reduce.matches?1:1-Math.exp(-dt/.15)
    travel+=(targetTravel-travel)*factor;focus+=(targetFocus-focus)*factor
    if(Math.abs(targetTravel-travel)<.0003)travel=targetTravel
    if(Math.abs(targetFocus-focus)<.0003)focus=targetFocus
    if(cameraVisible){
      const scale=1+focus*1.35
      const [cx,cy]=cameraGeometry.camera
      const tx=(350-cx*scale)*focus,ty=(330-cy*scale)*focus
      world.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`)
      pieces.forEach(({el,x,y})=>el.setAttribute('transform',`translate(${x*travel} ${y*travel})`))
      const sorted=[...pieces].sort((a,b)=>(a.key+a.lift*travel)-(b.key+b.lift*travel))
      if(sorted.some((p,i)=>p.el!==paintOrder[i])){
        sorted.forEach(p=>world.append(p.el))
        paintOrder=sorted.map(p=>p.el)
        world.append(selection)
      }
      selection.style.opacity=String(clamp(1-focus*3))
      cameraPanel.classList.toggle('is-focused',focus>.3)
    }
    if(cameraVisible&&(travel!==targetTravel||focus!==targetFocus))frame=requestAnimationFrame(tick)
    else last=0
  }
  const schedule=()=>{dirty=true;if(!frame)frame=requestAnimationFrame(tick)}
  addEventListener('scroll',schedule,{passive:true,signal:signal.signal})
  addEventListener('resize',schedule,{passive:true,signal:signal.signal})
  document.addEventListener('visibilitychange',schedule,{signal:signal.signal})
  reduce.addEventListener('change',schedule,{signal:signal.signal})
  const observer=new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;last=0}},{rootMargin:'150px 0px'})
  observer.observe(root)
  const resize=new ResizeObserver(schedule);resize.observe(root)
  root.classList.add('is-enhanced');schedule()
  cleanup=()=>{signal.abort();observer.disconnect();resize.disconnect();cancelAnimationFrame(frame)}
  document.addEventListener('astro:before-swap',()=>cleanup?.(),{once:true,signal:signal.signal})
}
