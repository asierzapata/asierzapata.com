# Local verification — 30 October 2026

- `npm run test:photography`: 10 passing checks, covering all CFA phases and
  borders, measured-component preservation, actual retained numerical neighbours,
  calibration/viewing separation, known subpixel translations, invalid overlap,
  residual rejection, low-confidence fallback, independent noise averaging,
  finite SVG geometry and derivative SHA-256 integrity.
- `npm run photography:prepare`: independently recorded source/sample hashes
  matched for all four original RAWs. Recomputed translations exactly match
  (-1.375,-1.125), (-3.625,-1.375), (-2.875,+0.625). Rejection reproduces
  6,264 / 437,007. Original sample scan confirms maximum 814, no saturated sites.
- `npm run build`: normal production build passes; draft post route omitted.
  `INCLUDE_DRAFTS=true npm run build`: local draft build passes, tested as static
  production output. Draft is still excluded from production home and RSS.
- Browser: Chrome DevTools MCP, headless installed Google Chrome. Both 1440×1000
  and 390×844 traverse every state forward/backward, check exact contributor
  counts, fast/interrupted scrolling, horizontal overflow, equal comparison
  transforms, range focus/focus outline, and progressive plane loading.
- Mobile uses reduced motion and a dark system preference. The blog itself
  supports only its existing light theme. Figure travel transitions are disabled
  under reduced motion. At 390×844 the spatial figure is about 388px tall.
- At 844×390 the visual stops being sticky and all nine narrative stills are
  visible. Normal vertical scrolling remains available.
- Script-blocked production HTML: 11 narrative steps, 9 visible local fallback
  stills, no horizontal overflow, optional inspection control hidden. The static
  numerical grids use the exact retained source measurements.
- Existing coding-agent article still has its original prose layout. Returning
  to the photography route initializes and traverses all states correctly.
- Anatomy line-end check: sensor has no independent texture lines; table checks
  236 ends in four rule paths, zero floating ends in separated and registered
  states. Finite-path checks and 4× screenshots inspect filter/lens boundaries,
  carrier brackets, guide columns, and mounted ruler strips. The figures contain
  planar slabs rather than pipes, lathe bodies, or live 3D joints; see design.md
  for the scope of geometry verification.
- Screenshots were opened and inspected; the mobile padding, viewport grid and
  photo carrier supports/painter order were refined from those observations.

The static local server reports the existing Vercel Analytics script as 404
because it is not a Vercel deployment. Article scripts and photographic assets
load locally; this is not an article runtime exception. Initial delivery uses
one 272KB opening WebP, ordinary Astro/MDX output and an approximately 11KB
article script (3.6KB gzip); all photographic assets together are about 2.2MB,
loaded progressively. These are file sizes, not a field-performance claim.

Reports and representative screenshots are retained in this directory.
The scripts-blocked run intentionally produces CSP diagnostics. No deployment,
publication, general camera compatibility, or proprietary pipeline parity is
claimed.
