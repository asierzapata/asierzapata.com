# Interactive Visualizations Guide for asierzapata.com

A reference for creating interactive, visual components in blog posts — inspired by sites like [justoffbyone.com](https://justoffbyone.com/posts/math-of-why-you-cant-focus-at-work/).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setup & Dependencies](#setup--dependencies)
3. [Creating Interactive Components](#creating-interactive-components)
4. [Visualization Catalog](#visualization-catalog)
5. [Styling Conventions](#styling-conventions)
6. [Reusable Patterns](#reusable-patterns)
7. [Opportunities for the AI Engineering Draft Post](#opportunities-for-the-ai-engineering-draft-post)

---

## Architecture Overview

This site is built with **Astro 5** and already has the key integrations needed:

- **`@astrojs/mdx`** — allows JSX components inside blog posts
- **`@astrojs/react`** — React components work inside MDX files
- **Tailwind CSS 4** — utility-first styling

The workflow for interactive posts:

```
.md post (static)  →  rename to .mdx  →  import React components  →  interactive post
```

### Key constraint: `client:` directives

Astro renders components as static HTML by default (zero JS). For interactivity, you **must** add a [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives):

```mdx
import MyChart from '../components/visualizations/MyChart.tsx'

{/* Static — rendered at build time, no interactivity */}
<MyChart />

{/* Interactive — hydrated on the client */}
<MyChart client:visible />
```

Common directives:
- `client:visible` — hydrate when the component scrolls into view (best for perf)
- `client:load` — hydrate immediately on page load
- `client:idle` — hydrate when the browser is idle
- `client:media="(min-width: 768px)"` — hydrate only on matching media query

**Use `client:visible` for most visualizations.** It keeps the page fast by only loading JS when the reader scrolls to the visualization.

---

## Setup & Dependencies

### Required: Install a visualization library

No visualization library is currently installed. Here are the recommended options, ranked by fit for this site:

#### Option A: Recharts (Recommended for most cases)

```bash
npm install recharts
```

- Built on React + D3
- Declarative, composable API
- Great for: line charts, bar charts, area charts, scatter plots, heatmaps
- Easy to style with Tailwind
- Responsive out of the box

#### Option B: D3.js (For custom/complex visualizations)

```bash
npm install d3
```

- Maximum flexibility
- Best for: custom simulations, force-directed graphs, timeline visualizations, unusual chart types
- Steeper learning curve
- You control every pixel

#### Option C: Visx (D3 primitives as React components)

```bash
npm install @visx/group @visx/shape @visx/scale @visx/axis @visx/responsive
```

- D3's power with React's ergonomics
- Install only what you need (modular)
- Great for: anything D3 can do, but with React component composition

#### Option D: No library (SVG + React state)

For simple visualizations, you can use raw SVG with React `useState`/`useEffect`. No dependencies needed.

```tsx
// Pure React + SVG — no library needed
export default function SimpleBar({ value }: { value: number }) {
  return (
    <svg width="200" height="20">
      <rect width={value * 2} height="20" fill="#3b82f6" rx="4" />
    </svg>
  )
}
```

### Recommendation

**Start with raw SVG + React for simple visuals, add Recharts when you need real charts.** This keeps the bundle small and avoids over-engineering.

---

## Creating Interactive Components

### Step 1: Convert post from `.md` to `.mdx`

MDX = Markdown + JSX. You need this to import and use React components.

```bash
mv src/posts/my-post.md src/posts/my-post.mdx
```

Everything in the markdown file still works — MDX is a superset.

### Step 2: Create a component

Place visualization components in a dedicated directory:

```
src/components/visualizations/
├── InteractiveSlider.tsx
├── CycleDigram.tsx
├── HeatmapGrid.tsx
└── ...
```

Example interactive component:

```tsx
// src/components/visualizations/ParameterExplorer.tsx
import { useState } from 'react'

interface Props {
  initialValue?: number
  label: string
  min?: number
  max?: number
}

export default function ParameterExplorer({
  initialValue = 50,
  label,
  min = 0,
  max = 100,
}: Props) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: <span className="font-mono text-blue-600">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
      {/* Visualization reacts to the value */}
      <div className="mt-4 h-8 rounded bg-blue-100 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-200"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
```

### Step 3: Use it in MDX

```mdx
import ParameterExplorer from '../components/visualizations/ParameterExplorer.tsx'

Here's some regular markdown text explaining the concept...

<ParameterExplorer client:visible label="Quality threshold (θ)" min={0} max={100} initialValue={70} />

And the post continues with more markdown...
```

### Important: the `not-prose` class

Tailwind Typography (`prose`) styles all children. This can break custom component layouts. Add `not-prose` to your component's root element to opt out:

```tsx
<div className="not-prose my-8 ...">
  {/* Your visualization — unaffected by prose styles */}
</div>
```

---

## Visualization Catalog

Here are the types of visualizations seen on justoffbyone.com and how to build each one in this stack.

### 1. Interactive Timeline

**What it is:** A horizontal bar representing time (e.g., a workday), with colored segments showing different states (focus blocks, interruptions, recovery).

**When to use:** Showing processes over time, state transitions, or sequential phases.

**How to build:**

```tsx
// React + SVG
export default function Timeline({ segments }: { segments: Segment[] }) {
  const totalWidth = 600
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <svg width={totalWidth} height={40} className="mx-auto">
        {segments.map((seg, i) => (
          <rect
            key={i}
            x={seg.start * totalWidth}
            width={seg.duration * totalWidth}
            height={40}
            fill={seg.color}
            rx={2}
          />
        ))}
      </svg>
    </div>
  )
}
```

### 2. Parameter Sliders + Live Output

**What it is:** Sliders that control parameters, with a visualization that updates in real time.

**When to use:** Letting readers explore "what if" scenarios. Showing how changing inputs affects outcomes.

**How to build:** Use React `useState` for each parameter, render the visualization as a function of state. This is the bread and butter of interactive posts.

```tsx
const [lambda, setLambda] = useState(3)
const [delta, setDelta] = useState(15)

// Visualization is a pure function of (lambda, delta)
return (
  <>
    <Slider value={lambda} onChange={setLambda} label="λ (interruption rate)" />
    <Slider value={delta} onChange={setDelta} label="Δ (recovery time)" />
    <SimulationOutput lambda={lambda} delta={delta} />
  </>
)
```

### 3. Grid / Heatmap

**What it is:** A grid of cells where color encodes a value. Each cell might represent a simulation run, a day, or a parameter combination.

**When to use:** Showing distributions, simulation results across many runs, or exploring 2D parameter spaces.

**How to build:**

```tsx
export default function HeatmapGrid({ data, rows, cols }: Props) {
  const cellSize = 12
  return (
    <div className="not-prose my-8">
      <svg width={cols * cellSize} height={rows * cellSize}>
        {data.map((value, i) => (
          <rect
            key={i}
            x={(i % cols) * cellSize}
            y={Math.floor(i / cols) * cellSize}
            width={cellSize - 1}
            height={cellSize - 1}
            fill={colorScale(value)}
            rx={1}
          />
        ))}
      </svg>
    </div>
  )
}
```

### 4. Animated Cycle / Flow Diagram

**What it is:** A diagram showing a process loop (like Evaluate → Build → Observe) with animation to show flow direction.

**When to use:** Illustrating iterative processes, feedback loops, pipelines.

**How to build:** SVG with CSS animations or React state for step highlighting.

```tsx
export default function CycleDiagram({ steps, activeStep }: Props) {
  return (
    <div className="not-prose my-8 flex items-center justify-center gap-4">
      {steps.map((step, i) => (
        <Fragment key={i}>
          <div
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              i === activeStep
                ? 'bg-blue-500 text-white scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <span className="text-gray-400">→</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
```

### 5. Before/After Comparison

**What it is:** Side-by-side or toggle-based comparison of two states.

**When to use:** Comparing deterministic vs non-deterministic, before/after optimizations, waterfall vs iterative.

### 6. Simulation Runner

**What it is:** A "Run simulation" button that generates randomized results and displays them.

**When to use:** Demonstrating probabilistic behavior, Monte Carlo-style concepts, or "run it yourself to see" moments.

```tsx
export default function SimulationRunner() {
  const [results, setResults] = useState<number[]>([])

  function runSimulation() {
    const newResults = Array.from({ length: 100 }, () =>
      Math.random() > 0.7 ? 1 : 0
    )
    setResults(newResults)
  }

  return (
    <div className="not-prose my-8 rounded-lg border p-6">
      <button
        onClick={runSimulation}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Run 100 simulations
      </button>
      {results.length > 0 && <ResultsGrid results={results} />}
    </div>
  )
}
```

### 7. Annotated Code / Step-by-Step Walkthrough

**What it is:** Code blocks with interactive highlighting — click a step and the relevant lines light up with an explanation.

**When to use:** Explaining complex code, architecture, or multi-step processes where the reader benefits from controlling the pace.

---

## Styling Conventions

To keep visualizations consistent with the site's design:

### Colors (from your theme tokens)

```tsx
const COLORS = {
  primary:    'var(--color-primary)',      // Blue 500
  primaryLight: 'var(--color-primary-light)',  // Blue 400
  surface:    'var(--color-surface)',       // Gray 100
  surfaceLight: 'var(--color-surface-light)',  // Gray 50
  border:     'var(--color-border)',        // Gray 200
  text:       'var(--color-text-base)',     // Gray 900
  muted:      'var(--color-muted)',         // Gray 500
  // Semantic colors for visualizations
  success:    '#22c55e',  // green-500
  warning:    '#f59e0b',  // amber-500
  danger:     '#ef4444',  // red-500
}
```

### Component wrapper pattern

Every visualization should follow this container pattern for consistency:

```tsx
<div className="not-prose my-8 rounded-lg border border-gray-200 bg-white/80 p-6 shadow-sm">
  {/* Optional: caption/title */}
  <p className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
    Figure 1: Some title
  </p>

  {/* The visualization */}
  <div className="...">
    ...
  </div>

  {/* Optional: description below */}
  <p className="mt-4 text-sm text-gray-500 italic">
    Drag the slider to explore different values.
  </p>
</div>
```

### Responsive design

- Use `viewBox` on SVGs instead of fixed `width`/`height` for responsiveness
- Provide a wrapper with `max-w-full overflow-x-auto` for wide visualizations
- Consider `client:media="(min-width: 640px)"` for complex visualizations that don't work on mobile, with a static fallback image

---

## Reusable Patterns

### Pattern: Wrapper Component

Create a shared wrapper so all visualizations look consistent:

```tsx
// src/components/visualizations/VisualizationWrapper.tsx
interface Props {
  title?: string
  description?: string
  children: React.ReactNode
}

export default function VisualizationWrapper({ title, description, children }: Props) {
  return (
    <figure className="not-prose my-10 rounded-lg border border-gray-200 bg-white/80 p-6 shadow-sm">
      {title && (
        <figcaption className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </figcaption>
      )}
      {children}
      {description && (
        <p className="mt-4 text-sm text-gray-500 italic">{description}</p>
      )}
    </figure>
  )
}
```

### Pattern: useSimulation hook

For posts that involve running simulations:

```tsx
// src/components/visualizations/hooks/useSimulation.ts
import { useState, useCallback } from 'react'

export function useSimulation<T>(simulationFn: () => T) {
  const [result, setResult] = useState<T | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const run = useCallback(() => {
    setIsRunning(true)
    // Use requestAnimationFrame to allow UI to update
    requestAnimationFrame(() => {
      const output = simulationFn()
      setResult(output)
      setIsRunning(false)
    })
  }, [simulationFn])

  return { result, isRunning, run }
}
```

### Pattern: Animated number

For values that change when sliders move:

```tsx
// Simple animated number display
export function AnimatedValue({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-2xl font-bold text-blue-600 tabular-nums transition-all">
        {value.toFixed(1)}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}
```

---

## Opportunities for the AI Engineering Draft Post

The draft post (`src/posts/ai-engineering-part-1-how-to-think-as-a-team.md`) covers non-determinism, evaluation, and iterative development for AI features. Here are specific places where interactive visualizations would strengthen the content:

### 1. Deterministic vs Non-Deterministic Output Demo

**Where in the post:** Section "The Shift That Changes Everything" (line ~33)

**Concept:** The post says *"You're building something that does X about Y% of the time."* — show this.

**Visualization:** A "Run" button that calls a simulated AI function. Each click produces a slightly different output from the same input. After 10 runs, show all outputs in a grid to make the variance visible.

```
┌─────────────────────────────────────────────────┐
│  Input: "Make this question harder"             │
│                                                 │
│  [Run AI ▶]   [Run 10x ▶▶]                     │
│                                                 │
│  Run 1: "What are the primary causes of..."  ✓  │
│  Run 2: "Analyze the relationship between..." ✓  │
│  Run 3: "List three factors that..."          ✗  │
│  Run 4: "What are the primary causes of..."  ✓  │
│  ...                                            │
│                                                 │
│  Success rate: 7/10 (70%)                       │
│  ████████████████████░░░░░░  70%                │
└─────────────────────────────────────────────────┘
```

**Why it works:** Makes the abstract concept of non-determinism tangible. The reader *experiences* it rather than just reading about it.

---

### 2. Interactive Evaluate → Build → Observe Cycle

**Where in the post:** Section "The Evaluate-Build-Observe Cycle" (line ~57)

**Concept:** The cycle `EVALUATE → BUILD → OBSERVE → (repeat)` is currently a plain text line. Make it an animated, interactive diagram.

**Visualization:** Three connected nodes in a cycle. Auto-animates to show flow. Clicking on each node expands it to show the key activities from that phase (pulled from the post content).

```
         ┌──────────┐
    ┌───▶│ EVALUATE │───┐
    │    └──────────┘   │
    │                   ▼
┌───┴────┐        ┌─────────┐
│OBSERVE │◀───────│  BUILD  │
└────────┘        └─────────┘

Click any node to see details...
```

**Why it works:** Cycles are inherently visual. An animated loop reinforces that this isn't a linear process.

---

### 3. Quality Bar Slider

**Where in the post:** Section "What does a good outcome look like" (line ~88) and "What's the ultimate metric" (line ~94)

**Concept:** Show how the quality bar determines when to stop iterating.

**Visualization:** A slider for "Quality Bar" (e.g., 60%–95%). As the reader adjusts it, show:
- How many iteration rounds are needed (exponentially more for higher bars)
- A chart showing diminishing returns (each % point gets harder)
- A "danger zone" where cost exceeds value

```
Quality Bar: ──────────●───── 85%

Estimated iterations:   ████████████░░░░░  12 rounds
Cost per % improvement: $████████████████  (exponential)

┌──────────────────────────────────┐
│  Effort per % point              │
│  ▓                               │
│  ▓▓                              │
│  ▓▓▓▓                            │
│  ▓▓▓▓▓▓▓▓                       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓               │
│  ──────────────────────────────  │
│  70%  75%  80%  85%  90%  95%    │
└──────────────────────────────────┘
```

**Why it works:** Makes the diminishing returns argument concrete and personal ("my 95% bar means 3x more work than 85%").

---

### 4. Evaluation Dataset Coverage Grid

**Where in the post:** Section "What inputs will this feature handle?" (line ~84) and "Ignoring input diversity" (line ~150)

**Concept:** Visualize the gap between what your evaluation dataset covers and what real users actually send.

**Visualization:** A grid of cells where each cell represents an input type. Color shows:
- Green: covered by your eval dataset
- Red: not covered
- Yellow: partially covered

Let readers toggle between "Your dataset" and "Real usage" to see the gap.

```
Input Type Coverage

[Your Dataset]  [Real Usage]

┌──┬──┬──┬──┬──┬──┐
│██│██│██│░░│░░│░░│  PDF types
├──┼──┼──┼──┼──┼──┤
│██│██│░░│░░│░░│░░│  Languages
├──┼──┼──┼──┼──┼──┤
│██│░░│░░│░░│░░│░░│  Edge cases
└──┴──┴──┴──┴──┴──┘

Coverage: 5/18 (28%)
```

**Why it works:** The visual gap between "what you tested" and "what users do" is immediately alarming and memorable.

---

### 5. Correlation Explorer: Eval Metrics vs Success Metric

**Where in the post:** Section "Post-Deploy: When You Finally Get Real Data" (line ~103)

**Concept:** The post discusses whether evaluation measurements (clarity, tone, accuracy) actually correlate with the success metric (% questions kept unedited).

**Visualization:** An interactive scatter plot. X-axis = your eval score, Y-axis = success metric. Readers can toggle between different eval metrics to see which ones actually correlate.

```
% Questions Kept Unedited
100│                    ○
   │              ○  ○
 75│         ○ ○○   ○
   │       ○○ ○  ○
 50│    ○  ○ ○
   │  ○  ○
 25│ ○
   │○
  0└─────────────────────
   0   25   50   75  100
      Clarity Score

   [Clarity ●] [Tone ○] [Accuracy ○]

   r² = 0.72  — Strong correlation ✓
```

**Why it works:** "Do my metrics actually predict what matters?" is the central question. Letting readers explore fake-but-realistic data makes the concept stick.

---

### 6. Timeline: Traditional Dev vs AI Dev Process

**Where in the post:** Throughout, but especially "Build" (line ~115) and the mistakes section (line ~143)

**Concept:** Show the contrast between traditional waterfall (spec → build → review → ship) and the AI iterative cycle.

**Visualization:** Two parallel timelines:
- Top: Traditional — neat, linear blocks
- Bottom: AI — overlapping, with lots of back-and-forth between evaluate and build, early PM involvement

```
Traditional:
│ Spec ████│ Build ████████████│ Review ██│ Ship █│

AI Engineering:
│Eval██│Build██│PM│Eval█│Build██│PM│Obs█│Eval█│Ship█│
         ↺ iterate ↺        ↺ iterate ↺
```

**Why it works:** The visual contrast between "neat and linear" vs "messy and iterative" reinforces the cultural shift the post advocates for.

---

### Summary: Suggested Implementation Order

If you're going to add visualizations to this post, start with the ones that have the highest impact-to-effort ratio:

| Priority | Visualization | Impact | Effort |
|----------|--------------|--------|--------|
| 1 | Non-determinism demo (Run button) | High | Low |
| 2 | Evaluate → Build → Observe cycle | High | Low |
| 3 | Quality bar slider | High | Medium |
| 4 | Traditional vs AI timeline comparison | Medium | Low |
| 5 | Dataset coverage grid | Medium | Medium |
| 6 | Correlation scatter plot | Medium | High |

---

## Checklist: Adding a Visualization to a Post

1. [ ] Rename post from `.md` to `.mdx` if not already
2. [ ] Create component in `src/components/visualizations/`
3. [ ] Use TypeScript (`.tsx`) for type safety
4. [ ] Wrap in `not-prose` container with consistent styling
5. [ ] Add `client:visible` directive in the MDX import
6. [ ] Use CSS variables from the theme for colors
7. [ ] Test responsive behavior (mobile + desktop)
8. [ ] Keep component self-contained (no external API calls)
9. [ ] Add a brief text description below for accessibility
10. [ ] Verify the build works: `npm run build`

---

## File Organization

```
src/
├── components/
│   └── visualizations/           # All interactive components
│       ├── VisualizationWrapper.tsx   # Shared wrapper
│       ├── hooks/
│       │   └── useSimulation.ts      # Shared hooks
│       └── ai-engineering/           # Post-specific components
│           ├── NonDeterminismDemo.tsx
│           ├── EvalBuildObserveCycle.tsx
│           ├── QualityBarSlider.tsx
│           └── ...
└── posts/
    └── ai-engineering-part-1-how-to-think-as-a-team.mdx  # Note: .mdx
```
