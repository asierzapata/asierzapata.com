# How your phone cheats when taking photos

Start with [the current project brief and handoff](PROJECT_BRIEF.md). The latest
visual direction is [the high-fidelity preview](high-fidelity-preview.md) at
`/posts/how-your-phone-cheats-preview/`. The article described below is the earlier
implementation, retained for reference; its prose is not the current editorial direction.

A local-only, unpublished MDX draft at `/posts/how-your-phone-cheats/`.
Start with `npm run dev`. It appears in the development homepage. `draft: true`
keeps it out of normal production post routes and RSS. No deployment performed.
The blog's existing public directory convention still copies assets to dist.

`immersive: true` opts this article into a wider content region while reusing
Async's shared layout, header, metadata, reading progress and typography.
Existing articles keep their original prose and table of contents.

## Regeneration

```
npm run photography:prepare
npm run photography:figures
npm run test:photography
npm run build
```

Preparation defaults to `../phone-photography-talk/public/assets`.
For another location, run `node scripts/photography/prepare.mjs /absolute/asset/path`
then `node scripts/photography/fallbacks.mjs`. RAWs stay outside the blog.
Decoding is constrained to the validated Google Pixel Bayer fixture.
All four original file and decoded sample SHA-256 hashes are rechecked.
Actual registration and rejection totals must match the independently recorded
reference results before derivatives are written. Runtime decoding is unnecessary.
The article's photographic outputs are committed and ordinary builds need no
reference checkout, Python or browser.

To build the draft locally for static-output QA:
`INCLUDE_DRAFTS=true npm run build`, then `npm run preview`.
Do not use that flag for publication. It only includes draft post routes;
production home and RSS retain their usual draft filtering.

## Separation of concerns

- `src/posts/how-your-phone-cheats.mdx`: complete static editorial narrative.
- `src/components/photography/`: figure templates, comparison and article CSS.
- `src/lib/photography/pipeline.js`, `burst.js`: reused pure numerical models.
- `scripts/photography/`: RAW decoding, reproducible derivatives and SVG geometry.
- `src/lib/photography/scroll.ts`: discrete viewport state and optional inspection.
- `public/photography/`: compact assets, source records, hashes and license notice.

The client imports prepared values and transforms, not the RAW decoder or image
processing models. It updates existing SVG highlights and readouts. Scroll work
coalesces to one requestAnimationFrame; there is no idle loop, scroll interception,
time-driven tour or framework hydration. The sole travel transition settles in
650ms; reduced motion removes it. SVG photographic planes load within 800px of
the second story. Raster image elements use native lazy loading with reserved sizes.
Astro navigation tears down listeners and observers before reinitialization.

Without JavaScript, every narrative paragraph remains and local still images
show critical numerical/photographic states. On short landscape viewports the
figure is not sticky and these stills remain visible beside their explanations.
The blog supports a light theme only. Dark system preference keeps that existing
theme; no unrelated theme switcher was added.

## Limits

Bilinear demosaicing can zipper and produce false colour. Registration is
translation-only after calibrated linear RGB reconstruction, for the prepared
384×384 region. Rejection is a luminance residual rule, not semantic motion
detection. No claimed device compatibility beyond this fixture, reproduction
of a proprietary pipeline, saturation example or measured noise-improvement factor.
Actual sensor axes remain BGGR in the numerical grid; only photographic views
rotate 90° clockwise. See `design.md` for figure parts and scientific contracts.

Photographic adaptations and data are CC BY-SA 4.0; see
`public/photography/NOTICE.md`. Original manifest includes broader reference-app
capabilities which are not features of the blog article.
