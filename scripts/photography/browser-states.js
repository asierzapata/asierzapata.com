// Pass this function to Chrome DevTools MCP evaluate_script.sourcePath.
async () => {
 const report={viewport:[innerWidth,innerHeight],reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,checks:[]};
 const assert=(condition,message)=>{if(!condition)throw Error(message);report.checks.push(message)};
 const settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 for(const kind of ['space','time']){
  const story=document.querySelector(`[data-kind=${kind}]`),steps=[...story.querySelectorAll('[data-story-step]')];
  for(const index of [...steps.keys(), ...[...steps.keys()].reverse()]){
   const el=steps[index];
   scrollTo({top:scrollY+el.getBoundingClientRect().top-(innerWidth<900?story.querySelector('.story-visual').getBoundingClientRect().height+32:innerHeight*.3),behavior:'instant'});
   await settle();
   assert(story.dataset.active===String(index),`${kind} step ${index} reached while scrolling`);
   const panel=story.querySelector(`[data-${kind}-panel]:not([hidden])`);
   assert(!!panel,`${kind} step ${index} has a visible figure`);
   if(kind==='space'&&(index===3||index===4))assert(story.querySelectorAll('.contributor').length===4,`${kind} step ${index} highlights 4 exact contributors`);
   assert(document.documentElement.scrollWidth<=innerWidth,`${kind} step ${index} no horizontal overflow`);
  }
 }
 // Interrupted/rapid scroll: only the final viewport selects the resting state.
 const s=document.querySelector('[data-kind=space]');
 for(const i of [1,4,0,3,5,2]){const e=s.querySelector(`[data-story-step="${i}"]`);scrollTo({top:scrollY+e.getBoundingClientRect().top-(innerWidth<900?s.querySelector('.story-visual').getBoundingClientRect().height+32:innerHeight*.3),behavior:'instant'});}
 await settle();assert(s.dataset.active==='2','fast interrupted scrolling settles to the final state');
 const control=document.querySelector('.comparison-control input');control.value='3';control.dispatchEvent(new Event('input',{bubbles:true}));
 const images=[...document.querySelectorAll('.comparison-images img')];assert(getComputedStyle(images[0]).transform===getComputedStyle(images[1]).transform,'comparison magnifies both sides identically');
 control.focus();assert(document.activeElement===control,'comparison control is keyboard focusable');
 assert(getComputedStyle(control).outlineStyle!=='none','comparison has a visible focus outline');
 assert(document.querySelector('[data-kind=time] .photo-carrier image').hasAttribute('href'),'later photographic planes load as time section approaches');
 report.figureHeight=s.querySelector('.story-visual').getBoundingClientRect().height;
 return report;
}
