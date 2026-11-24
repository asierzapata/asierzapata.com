/** State machine shared by every figure in the three-cheats article, plus presenter mode.
 * A figure is `[data-fig]` with `data-state`; children declare the states they belong to in `data-show`. */
const BASE = '/photography/lake'
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const times = (ev: number) => (2 ** ev).toFixed(1).replace(/\.0$/, '')

export function setState(fig: HTMLElement, next: number) {
  const count = Number(fig.dataset.states)
  const state = Math.max(0, Math.min(count - 1, next))
  fig.dataset.state = String(state)
  fig.dataset.last = String(state === count - 1)
  fig.querySelectorAll<HTMLElement>('[data-show]').forEach(el => {
    el.dataset.on = String(el.dataset.show!.split(' ').includes(String(state)))
  })
  fig.querySelectorAll<HTMLElement>('[data-step]').forEach(li => { li.dataset.active = String(Number(li.dataset.step) === state) })
  const title = fig.querySelector(`[data-step="${state}"] strong`)?.textContent
  const foot = fig.querySelector<HTMLElement>('[data-foot]')
  // On stage the count leaves out the steps that only readers get.
  const shown = presenting() ? count - fig.querySelectorAll('[data-talk="false"]').length : count
  if (foot) foot.textContent = `${state + 1} / ${shown} · ${title}`
  fig.dispatchEvent(new CustomEvent('fig:state', { detail: state }))
}

function preload(names: string[]) {
  names.forEach(name => { new Image().src = `${BASE}/${name}.webp` })
}

function mountBurst(fig: HTMLElement) {
  const flicker = fig.querySelector<HTMLImageElement>('[data-flicker]')!
  const count = Number(flicker.dataset.count)
  const range = fig.querySelector<HTMLInputElement>('[data-stack]')!
  const noise: number[] = JSON.parse(range.dataset.noise!)
  const output = range.parentElement!.querySelector('output')!
  const stacked = fig.querySelector<HTMLImageElement>('[data-stack-image]')!
  const chip = fig.querySelector<HTMLElement>('[data-frame-chip]')
  let timer = 0, frame = 0, visible = false
  const show = (next: number) => {
    frame = next
    flicker.src = `${BASE}/frame-${frame}.webp`
    if (chip) chip.textContent = `frame ${frame + 1} of ${count}`
  }
  const stop = () => { clearInterval(timer); timer = 0 }
  // The frames play in turn while the first step is on screen. The figure opens on that step, so we cannot wait for a state change.
  const update = () => {
    const play = visible && fig.dataset.state === '0' && !reduced()
    if (!play) { stop(); if (frame) show(0); return }
    if (timer) return
    preload(Array.from({ length: count }, (_, i) => `frame-${i}`))
    timer = window.setInterval(() => fig.isConnected ? show((frame + 1) % count) : stop(), 500)
  }
  new IntersectionObserver(entries => { visible = entries.at(-1)!.isIntersecting; update() }).observe(fig)
  fig.addEventListener('fig:state', event => {
    update()
    if ((event as CustomEvent).detail === 3) preload(Array.from({ length: count }, (_, i) => `stack-${i + 1}`))
  })
  range.addEventListener('input', () => {
    const n = Number(range.value)
    stacked.src = `${BASE}/stack-${n}.webp`
    output.textContent = `${n} · grain ${Math.round(noise[n - 1] * 100)}%`
    range.setAttribute('aria-valuetext', `${n} frames, grain ${Math.round(noise[n - 1] * 100)}%`)
  })
}

/** The sensor cutaway: each meter's brightness follows the light that reaches it. */
function mountSensor(fig: HTMLElement, art: HTMLElement) {
  const charges = [...art.querySelectorAll<SVGPathElement>('.charge')]
  const wobble = art.hasAttribute('data-wobble')
  // Two uniform draws make a bell-shaped error, which is close enough to how noise behaves.
  const error = () => wobble && !reduced() ? (Math.random() + Math.random() - 1) * .22 : 0
  const paint = () => {
    const filtered = fig.dataset.fig !== 'sensor' || fig.dataset.state !== '0'
    for (const charge of charges) {
      const value = Number(charge.dataset.light) * (filtered ? Number(charge.dataset.pass) : 1) * (1 + error())
      const grey = Math.round(28 + 227 * Math.sqrt(Math.min(1, value)))
      charge.style.fill = `rgb(${grey},${grey},${grey})`
    }
  }
  paint()
  fig.addEventListener('fig:state', paint)
  if (!wobble || reduced()) return
  const timer = window.setInterval(() => !fig.isConnected ? clearInterval(timer) : art.dataset.on === 'true' && paint(), 800)
}

function mountExposure(fig: HTMLElement) {
  const range = fig.querySelector<HTMLInputElement>('[data-ev]')!
  const image = fig.querySelector<HTMLImageElement>('[data-ev-image]')!
  const output = range.parentElement!.querySelector('output')!
  range.addEventListener('input', () => {
    image.src = `${BASE}/ev-${range.value}.webp`
    output.textContent = `×${times(Number(range.value))}`
    range.setAttribute('aria-valuetext', `×${times(Number(range.value))} brighter`)
  })
  new IntersectionObserver((entries, observer) => {
    if (!entries.some(e => e.isIntersecting)) return
    observer.disconnect()
    preload(Array.from({ length: Number(range.max) + 1 }, (_, i) => `ev-${i}`))
  }).observe(fig)
}

/** Reading mode: the step that has reached the reading line decides what its figure shows. */
let queued = false
function sync() {
  queued = false
  if (presenting()) return
  const wide = matchMedia('(min-width: 900px)').matches
  document.querySelectorAll<HTMLElement>('[data-fig]').forEach(fig => {
    const box = fig.getBoundingClientRect()
    if (box.bottom < 0 || box.top > innerHeight) return
    // Beside the figure on wide screens, so the line is mid-screen. Below it on narrow ones.
    // Clamped, because on short screens the picture is not pinned and scrolls away.
    const pinned = Math.max(0, Math.min(fig.querySelector<HTMLElement>('.fig-pin')!.getBoundingClientRect().bottom, innerHeight * .6))
    // On wide screens a step lights up as its text comes in from the bottom, well before it reaches the middle.
    const line = wide ? innerHeight * .75 : pinned + (innerHeight - pinned) * .4
    let state = 0
    fig.querySelectorAll<HTMLElement>('[data-step]').forEach((li, i) => { if (li.getBoundingClientRect().top <= line) state = i })
    if (state !== Number(fig.dataset.state)) setState(fig, state)
  })
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(sync) } }

/** Presenter mode: every figure state is one step. Arrow keys walk the whole talk.
 * A slider with `data-walk` adds one step per value, so a clicker can drag it for us. */
type Step = { beat: HTMLElement; fig: HTMLElement | null; state: number; value?: string }
let steps: Step[] = [], index = 0, hud: HTMLElement | null = null
const presenting = () => document.documentElement.classList.contains('presenting')

function collect() {
  steps = [...document.querySelectorAll<HTMLElement>('[data-beat]')].flatMap<Step>(beat => {
    const fig = beat.querySelector<HTMLElement>('[data-fig]')
    if (!fig) return [{ beat, fig: null, state: 0 }]
    const walk = fig.querySelector<HTMLInputElement>('input[data-walk]')
    const walked = walk?.closest<HTMLElement>('[data-show]')?.dataset.show!.split(' ').map(Number) ?? []
    const spoken = Array.from({ length: Number(fig.dataset.states) }, (_, state) => state).filter(state => fig.querySelector(`[data-step="${state}"]`)?.getAttribute('data-talk') !== 'false')
    return spoken.flatMap<Step>(state =>
      walked.includes(state) ? walk!.dataset.walk!.split(' ').map(value => ({ beat, fig, state, value })) : [{ beat, fig, state }])
  })
}
function go(next: number) {
  index = Math.max(0, Math.min(steps.length - 1, next))
  const step = steps[index]
  if (step.fig) setState(step.fig, step.state)
  if (step.fig && step.value !== undefined) {
    const range = step.fig.querySelector<HTMLInputElement>('input[data-walk]')!
    range.value = step.value
    range.dispatchEvent(new Event('input'))
  }
  // The punchline waits for the last click on a figure, which may be the end of a slider walk.
  if (step.fig) step.fig.dataset.last = String(steps[index + 1]?.fig !== step.fig)
  // A key press changes the slide at once. What moves is inside the slide.
  step.beat.scrollIntoView({ block: 'start', behavior: 'instant' })
  document.querySelectorAll('[data-beat][data-current]').forEach(beat => beat !== step.beat && beat.removeAttribute('data-current'))
  step.beat.dataset.current = ''
  if (hud) hud.textContent = `${index + 1} / ${steps.length}   ← →   P to exit`
}
function toggle(on = !presenting()) {
  collect()
  if (!steps.length) return
  document.documentElement.classList.toggle('presenting', on)
  hud?.remove(); hud = null
  fullscreen(on)
  if (!on) return queue()
  hud = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'present-hud' }))
  // Start from whichever beat is on screen, at the state its figure already shows.
  const middle = innerHeight / 2
  const current = steps.findIndex(s => { const r = s.beat.getBoundingClientRect(); return r.top <= middle && r.bottom >= middle && (!s.fig || Number(s.fig.dataset.state) === s.state) })
  go(Math.max(0, current))
}
// Slides want the whole screen. Browsers only allow it after a key press or a click, so opening
// the page with ?present stays windowed until the first key, and a refusal is not an error.
let full = false
function fullscreen(on: boolean) {
  const root = document.documentElement
  if (on && !document.fullscreenElement) Promise.resolve(root.requestFullscreen?.()).then(() => { full = !!document.fullscreenElement }).catch(() => {})
  if (!on) { full = false; if (document.fullscreenElement) Promise.resolve(document.exitFullscreen?.()).catch(() => {}) }
}
function onFullscreen() {
  if (!presenting()) return
  // Escape leaves fullscreen without telling the page, so we leave the slides with it.
  if (!document.fullscreenElement && full) return toggle(false)
  requestAnimationFrame(() => go(index))
}
function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (event.metaKey || event.ctrlKey || event.altKey || !document.querySelector('[data-beat]')) return
  // A clicker sends PageUp and PageDown. They must keep working after the presenter has touched a slider.
  const clicker = presenting() && ['PageDown', 'PageUp', ' '].includes(event.key)
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && !clicker) return
  if (event.key === 'p' || event.key === 'P') return toggle()
  if (!presenting()) return
  if (event.key === 'Escape') return toggle(false)
  if (!document.fullscreenElement && !full) fullscreen(true)
  const delta = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0
  if (!delta) return
  event.preventDefault()
  go(index + delta)
}

let listening = false
export function mountLake() {
  document.querySelectorAll<HTMLElement>('[data-fig]:not([data-live])').forEach(fig => {
    fig.dataset.live = 'true'
    fig.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(r => r.addEventListener('change', () => { if (presenting()) r.blur() }))
    // Labels drawn inside an SVG follow the size of the HTML labels: tell each drawing how many of its units make a pixel.
    const fit = new ResizeObserver(entries => entries.forEach(({ target, contentRect }) => {
      if (contentRect.width) (target as SVGSVGElement).style.setProperty('--u', String((target as SVGSVGElement).viewBox.baseVal.width / contentRect.width))
    }))
    fig.querySelectorAll('svg[data-label]').forEach(svg => fit.observe(svg))
    // The last step needs the picture's height to scroll all the way up beside it. Only a resize changes it.
    const frame = fig.querySelector<HTMLElement>('.fig-frame')
    if (frame) new ResizeObserver(() => fig.style.setProperty('--frame-h', `${frame.offsetHeight}px`)).observe(frame)
    fig.querySelectorAll<HTMLElement>('.sensor-art').forEach(art => mountSensor(fig, art))
    // The ending wipes its two halves apart the first time it is really on screen.
    if (fig.dataset.fig === 'recap' && frame) new IntersectionObserver((entries, observer) => {
      if (!entries.some(e => e.isIntersecting)) return
      observer.disconnect()
      fig.dataset.seen = 'true'
    }, { threshold: .6 }).observe(frame)
    if (fig.dataset.fig === 'burst') mountBurst(fig)
    if (fig.dataset.fig === 'tradeoff') mountExposure(fig)
  })
  if (!listening) {
    listening = true
    document.addEventListener('keydown', onKey)
    addEventListener('scroll', queue, { passive: true })
    addEventListener('resize', () => { queue(); if (presenting()) go(index) })
    document.addEventListener('fullscreenchange', onFullscreen)
  }
  queue()
  if (!document.querySelector('[data-beat]')) return toggle(false)
  if (new URLSearchParams(location.search).has('present') && !presenting()) toggle(true)
}
