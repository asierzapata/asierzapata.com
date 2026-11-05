async () => {
 const root=document.querySelector('photo-preview'),steps=[...root.querySelectorAll('[data-hf-beat]')],checks=[];
 const assert=(v,m)=>{if(!v)throw Error(m);checks.push(m)};
 const settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 for(const i of [...steps.keys(),...[...steps.keys()].reverse()]){
  const step=steps[i],mobile=innerWidth<900;
  const offset=mobile?root.querySelector('.hf-visual-column').getBoundingClientRect().height+35:innerHeight*.29;
  scrollTo({top:scrollY+step.getBoundingClientRect().top-offset,behavior:'instant'});await settle();
  assert(root.dataset.hfState===String(i),`state ${i} reached`);
  assert(root.querySelectorAll('[data-hf-panel]:not([hidden])').length===1,`state ${i} has one visual`);
  assert(document.documentElement.scrollWidth<=innerWidth,`state ${i} no horizontal overflow`);
  if(i===6||i===7)assert(root.querySelectorAll('.is-contributor').length===4,`state ${i} four exact contributors`);
 }
 for(const i of [1,2,0,7,14,6]){const e=steps[i];scrollTo({top:scrollY+e.getBoundingClientRect().top-(innerWidth<900?root.querySelector('.hf-visual-column').getBoundingClientRect().height+35:innerHeight*.29),behavior:'instant'})}await settle();assert(root.dataset.hfState==='6','rapid reversal settles on the final passage');
 const known=[...root.querySelectorAll('[data-hf-component] strong')].map(e=>e.textContent);assert(known[0]==='0.0847'&&known[1]==='0.1608'&&known[2]==='—','measured and estimated components match actual data');
 assert(root.querySelectorAll('.camera-piece').length===62,'camera retains 62 precomputed, recorded solids');
 assert(document.querySelectorAll('.hf-author-prompt').length===15,'all 15 author slots remain, no article prose substituted');
 return {viewport:[innerWidth,innerHeight],reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,figureHeight:root.querySelector('.hf-visual-column').getBoundingClientRect().height,checks};
}
