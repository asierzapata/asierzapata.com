# High-fidelity preview verification — 30 October 2026

- Camera: 62 true recorded solids; Anatomy clearance, support, stand-in-shape,
  depth-order and other audit checks pass at 25 separation shares. Runtime paint
  order uses the same keys and depth offsets. Annular pieces use concave fills.
- Sensor patch: 64 true recorded solids and 16 sites; Anatomy audit passes,
  including physical support and surface-based painter order. The base no longer
  occludes rear sites. Both figure audits have zero reported problems.
- Chrome DevTools MCP: 98 assertions on 1440×1000 desktop and 98 on 390×844 mobile.
  Traverses all 15 states forward/backward, checks single visible stage, no horizontal
  overflow, exact contributor counts/readouts, and interrupted/fast reversals.
- Mobile uses reduced motion and dark system preference; the blog retains its
  existing light appearance. The sticky visual is about 334px high at 390×844.
  At 844×390 it switches to normal document flow, without horizontal overflow.
- Anatomy line-end checker: zero floating ends at assembled, separating, exposed
  sensor and pixel-patch states. The independent seam is closed; remaining strokes
  are kit boundaries, rather than unsupported decorative lines.
- Desktop and mobile screenshots, plus a camera close-up, were opened and inspected.
  Numerical mobile view shows the central 3×3 neighbourhood with all contributors.
- Ten existing numerical/data tests pass. The new draft does not change their pure
  pipeline functions or prepared photographic outputs.
- Draft-enabled and ordinary production builds pass. Ordinary production excludes
  the preview route, homepage listing and RSS entry. No deployment was performed.
- Native noscript endpoints are generated from the same geometry. Their browser
  scripting-disabled branch was not separately exercised; CSP-only script blocking
  is not claimed to activate HTML noscript parsing.

The local static QA server returns 404 for the site's existing Vercel Analytics
endpoint; article assets and application code load locally. There is no new
production service. Source-selection limits are in high-fidelity-preview.md:
current Pixel fixture, schematic iPhone-inspired optics, provisional physical-size
comparison, and an exposure bracket awaiting actual data.
