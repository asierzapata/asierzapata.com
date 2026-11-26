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
  const spoken = [...fig.querySelectorAll<HTMLElement>('[data-step]')].filter(li => !presenting() || li.dataset.talk !== 'false')
  const place = spoken.findIndex(li => Number(li.dataset.step) === state) + 1
  if (foot) foot.textContent = `${place} / ${spoken.length} · ${title}`
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
  // On slides the figure itself has no box (display: contents), so we watch its frame.
  new IntersectionObserver(entries => { visible = entries.at(-1)!.isIntersecting; update() }).observe(fig.querySelector('.fig-frame')!)
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

/** The chart recorder: two pens keep writing the readings of two light meters on moving paper, and a print head
 * stamps the color each pixel comes out as. In the states `data-solo` lists only the sky pen writes. In the states
 * `data-boost` lists, the rock pen's reading is multiplied, like brightening the picture. */
type Recorder = {
  origin: [number, number]; ux: [number, number]; uy: [number, number]; unit: number; white: number
  step: number; speed: number; length: number; feed: number; gain: number
  stamp: { size: number; every: number; half: number; from: number }
  pens: Record<string, { mean: number; sd: number; lead: number; lane: number; tint: number[] }>
  knob: { centre: [number, number]; r: number; from: number; span: number; stops: number }
}
function mountRecorder(fig: HTMLElement, art: HTMLElement) {
  const svg = art.querySelector<SVGSVGElement>('svg')!
  const spec: Recorder = JSON.parse(svg.dataset.spec!)
  const boost = art.dataset.boost!.split(' '), solo = art.dataset.solo!.split(' ')
  const feed = svg.querySelector<SVGGElement>('.feed')!, stamps = svg.querySelector<SVGGElement>('.stamps')!
  const pointer = svg.querySelector<SVGPathElement>('.meter[data-pen="rock"] .pointer')!
  const count = Math.ceil(spec.length / spec.step) + 2
  type Stamp = { y: number; node: SVGPathElement }
  const pens = Object.entries(spec.pens).map(([name, stats]) => ({
    ...stats, dark: name === 'rock', values: [] as number[], next: 0, written: 0, printed: [] as Stamp[],
    trace: svg.querySelector<SVGPathElement>(`.trace[data-pen="${name}"]`)!,
    carriage: svg.querySelector<SVGGElement>(`.carriage[data-pen="${name}"]`)!,
    charge: svg.querySelector<SVGPathElement>(`.meter[data-pen="${name}"] .charge`)!,
  }))
  type Pen = (typeof pens)[number]
  // Three uniform draws make a bell-shaped error with a spread of one.
  const bell = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2
  const target = () => boost.includes(fig.dataset.state!) ? spec.gain : 1
  const writing = (pen: Pen) => !(pen.dark && solo.includes(fig.dataset.state!))
  let gain = 1, phase = 0, fed = 0, due = 0, last = 0, frame = 0, visible = false, shown = false
  const light = (pen: Pen) => Math.max(0, pen.mean + pen.sd * bell())
  // The meter reads the light. The knob multiplies that reading afterwards, error included.
  const read = (pen: Pen, show = true) => {
    const raw = light(pen)
    if (show) { const grey = Math.round(28 + 227 * Math.sqrt(Math.min(1, raw / spec.white))); pen.charge.style.fill = `rgb(${grey},${grey},${grey})` }
    return Math.min(spec.white, raw * (pen.dark ? gain : 1))
  }
  // A pixel's color takes three readings: red, green and blue. Each has its own error.
  const print = (pen: Pen, y: number) => {
    const node = stamps.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
    const scale = (pen.dark ? gain : 1) / spec.white
    node.setAttribute('fill', `rgb(${pen.tint.map(c => Math.round(255 * c * Math.min(1, light(pen) * scale) ** (1 / 2.2))).join(',')})`)
    pen.printed.push({ y, node })
  }
  const clear = (pen: Pen) => { pen.printed.forEach(one => one.node.remove()); pen.printed = []; pen.written = 0 }
  const fill = () => {
    due = 0
    for (const pen of pens) {
      clear(pen)
      pen.values = Array.from({ length: count }, () => read(pen, false)); pen.next = read(pen)
      if (!writing(pen)) continue
      pen.written = Infinity
      for (let y = spec.stamp.from; y < spec.length; y += spec.stamp.every) print(pen, y)
    }
  }
  const at = (value: number, y: number) => {
    const x = value * spec.unit
    return `${(spec.origin[0] + spec.ux[0] * x + spec.uy[0] * y).toFixed(1)} ${(spec.origin[1] + spec.ux[1] * x + spec.uy[1] * y).toFixed(1)}`
  }
  const paint = () => {
    const part = phase / spec.step
    for (const pen of pens) {
      // The pen is on its way from the last reading to the next one. A pen that is not writing waits on zero.
      const on = writing(pen), head = on ? pen.values[0] + (pen.next - pen.values[0]) * part : 0
      let d = ''
      if (on) {
        // A pen that sits further along the paper starts its line there, and a line is only as long as the pen has written.
        d = `M${at(head, pen.lead)}`
        for (let j = 0; j < pen.values.length; j++) {
          const run = (part + j) * spec.step
          if (run > pen.written) break
          d += `L${at(pen.values[j], pen.lead + run)}`
          if (pen.lead + run >= spec.length) break
        }
      }
      pen.trace.setAttribute('d', d)
      const x = head * spec.unit
      pen.carriage.setAttribute('transform', `translate(${(spec.ux[0] * x).toFixed(2)} ${(spec.ux[1] * x).toFixed(2)})`)
      for (const { y, node } of pen.printed) {
        const end = Math.min(spec.length, y + spec.stamp.size), lo = pen.lane - spec.stamp.half, hi = pen.lane + spec.stamp.half
        node.setAttribute('d', `M${at(lo, y)}L${at(hi, y)}L${at(hi, end)}L${at(lo, end)}Z`)
      }
    }
    feed.setAttribute('transform', `translate(${(spec.uy[0] * fed).toFixed(2)} ${(spec.uy[1] * fed).toFixed(2)})`)
    const { centre, r, from, span, stops } = spec.knob, angle = from + span * Math.log2(gain) / stops
    const dx = r * Math.sin(angle), dy = -r * Math.cos(angle)
    pointer.setAttribute('d', `M${centre[0]} ${centre[1]}L${(centre[0] + spec.ux[0] * dx + spec.uy[0] * dy).toFixed(1)} ${(centre[1] + spec.ux[1] * dx + spec.uy[1] * dy).toFixed(1)}`)
  }
  const tick = (now: number) => {
    frame = 0
    if (!fig.isConnected) return
    const dt = Math.min(.05, (now - last) / 1000), move = spec.speed * dt
    last = now
    // The knob turns over about a second, evenly in stops, so the pen swings out instead of jumping.
    gain = Math.exp(Math.log(gain) + (Math.log(target()) - Math.log(gain)) * (1 - Math.exp(-dt / .3)))
    phase += move
    fed = (fed + move) % spec.feed
    due += move
    const stamp = due >= spec.stamp.every
    if (stamp) due -= spec.stamp.every
    for (const pen of pens) {
      for (const one of pen.printed) one.y += move
      pen.printed = pen.printed.filter(one => one.y < spec.length || (one.node.remove(), false))
      if (!writing(pen)) { if (pen.written) clear(pen); continue }
      pen.written += move
      if (stamp) print(pen, spec.stamp.from)
    }
    while (phase >= spec.step) {
      phase -= spec.step
      for (const pen of pens) { pen.values.unshift(pen.next); pen.values.length = count; pen.next = read(pen) }
    }
    paint()
    run()
  }
  const run = () => {
    if (frame || !visible || art.dataset.on !== 'true' || reduced()) return
    frame = requestAnimationFrame(tick)
  }
  const update = () => {
    const on = art.dataset.on === 'true'
    // Arriving at the recorder, or with motion turned off, the paper already shows the state we are in.
    if ((on && !shown) || reduced()) { gain = target(); fill(); paint() }
    shown = on
    last = performance.now()
    run()
  }
  fill(); paint()
  fig.addEventListener('fig:state', update)
  // We watch the drawing and not the figure: in the wide presenter layout the figure has no box of its own.
  new IntersectionObserver(entries => { visible = entries.at(-1)!.isIntersecting; last = performance.now(); run() }).observe(art)
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
  }).observe(fig.querySelector('.fig-frame')!)
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
    fig.querySelectorAll<HTMLElement>('.recorder-art').forEach(art => mountRecorder(fig, art))
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
