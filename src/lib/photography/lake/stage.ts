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
  if (foot) foot.textContent = `${state + 1} / ${count} · ${title}`
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
  let timer = 0, frame = 0
  const stop = () => { clearInterval(timer); timer = 0 }
  fig.addEventListener('fig:state', event => {
    stop()
    if ((event as CustomEvent).detail !== 1 || reduced()) return
    preload(Array.from({ length: count }, (_, i) => `frame-${i}`))
    timer = window.setInterval(() => {
      if (!fig.isConnected) return stop()
      frame = (frame + 1) % count
      flicker.src = `${BASE}/frame-${frame}.webp`
    }, 400)
  })
  range.addEventListener('input', () => {
    const n = Number(range.value)
    stacked.src = `${BASE}/stack-${n}.webp`
    output.textContent = `${n} · grain ${Math.round(noise[n - 1] * 100)}%`
    range.setAttribute('aria-valuetext', `${n} frames, grain ${Math.round(noise[n - 1] * 100)}%`)
  })
  range.addEventListener('pointerdown', () => preload(Array.from({ length: count }, (_, i) => `stack-${i + 1}`)), { once: true })
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
  range.addEventListener('pointerdown', () => preload(Array.from({ length: Number(range.max) + 1 }, (_, i) => `ev-${i}`)), { once: true })
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
    const line = wide ? innerHeight * .55 : pinned + (innerHeight - pinned) * .4
    let state = 0
    fig.querySelectorAll<HTMLElement>('[data-step]').forEach((li, i) => { if (li.getBoundingClientRect().top <= line) state = i })
    if (state !== Number(fig.dataset.state)) setState(fig, state)
  })
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(sync) } }

/** Presenter mode: every figure state is one step. Arrow keys walk the whole talk. */
type Step = { beat: HTMLElement; fig: HTMLElement | null; state: number }
let steps: Step[] = [], index = 0, hud: HTMLElement | null = null
const presenting = () => document.documentElement.classList.contains('presenting')

function collect() {
  steps = [...document.querySelectorAll<HTMLElement>('[data-beat]')].flatMap<Step>(beat => {
    const fig = beat.querySelector<HTMLElement>('[data-fig]')
    return fig ? Array.from({ length: Number(fig.dataset.states) }, (_, state) => ({ beat, fig, state })) : [{ beat, fig: null, state: 0 }]
  })
}
function go(next: number) {
  index = Math.max(0, Math.min(steps.length - 1, next))
  const step = steps[index]
  if (step.fig) setState(step.fig, step.state)
  step.beat.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' })
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
    if (fig.dataset.fig === 'burst') mountBurst(fig)
    if (fig.dataset.fig === 'exposure') mountExposure(fig)
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
