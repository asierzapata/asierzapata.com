# High-fidelity visual draft

Local preview: `/posts/how-your-phone-cheats-preview/`.

This is a separate unpublished draft, leaving the earlier article available for
comparison. It implements the accepted visual storyboard with working titles,
empty prose spaces and authoring prompts. It does not substitute new article copy.

## Delivered visuals

- Large opening/closing photographs and three-part reading map in Async's shared
  article shell, with blue serif headings and a quiet paper surface.
- A 62-solid phone/camera figure, with titanium rails, back glass, lens barrels,
  coated illustrative optical elements, IR-cut filter, silicon die and contact pads.
  It is an iPhone-inspired schematic, not a particular device's verified teardown.
- The camera separates along the optical axis in response to ordinary scrolling.
  The surrounding phone fades while a closer view exposes the sensor. The exposed
  state holds for the live physical-camera comparison.
- A labelled provisional camera-sensor/fingernail comparison. Dimensions and
  proportions remain to be set from selected camera models; none are asserted.
- A 64-solid bare 4×4 sensor cutaway, with sensing regions, colour filters
  and microlenses. Layer geometry and dimensions are schematic.
- Face-on actual Bayer samples and contributor arithmetic, reconstructed crop,
  separate real captures, unregistered average, measured alignment and robust merge.
- A designed exposure-bracket section with explicit empty source slots. No exposure
  variants or HDR photograph are fabricated from a single processed image.

The photographic data still belongs to the validated Google Pixel fixture and is
labelled accordingly, rather than attributed to the illustrated phone. Better RAW
material remains a source-selection task. All comparisons retain matched framing
and the existing fixed display strategy. The noise section is existing fixture
inspection, not a claim that a new low-light series has been validated.

## Implementation

`src/components/photography/preview/HighFidelity.astro` renders the visual stages and
prose spaces. `src/lib/photography/preview/beats.ts` contains working titles and
explicit authoring prompts. `scroll.ts` selects narrative states, drives the
camera reveal and updates contributor highlights. No framework was added.

The geometry is generated once by `scripts/photography/camera.mjs` and
`pixel-patch.mjs`. All moving camera parts record their true shapes. Annular
housing pieces split into actual front/rear half-solids with concave fills;
there are no convex stand-ins covering their openings. Runtime paint order
follows the same settled keys plus calculated projection depth as the audit.

A single requestAnimationFrame loop follows camera targets and stops once
settled, hidden, offscreen, or outside camera states. No idle tour. Reduced
motion jumps to the same explanatory endpoints. Mobile uses a 3×3 numerical
neighbourhood containing the selected site and all contributors, keeping its
numbers legible. Short viewports use normal flow rather than a sticky stage.

Static SVG endpoints come from the same geometry. Browser-native `<noscript>`
states pair these and the existing exact-data images with their headings when
scripting is disabled. CSP-blocking scripts alone is not equivalent to disabling
the browser's scripting flag, so the native noscript branch is not claimed as
exercised by a CSP-only test.

## Regenerate and validate

```
npm run photography:preview-figures
npm run test:photography
INCLUDE_DRAFTS=true npm run build
```

The figure command audits the camera before generating the bare patch and static
endpoints. The camera audit checks 25 uniform separation shares, including both
endpoints, with actual source geometry, supports, clearance and depth order.
The bare patch also records and audits every solid and its support. Its surface
order is settled from the true geometry, rather than guessed from centroids. The real-pipeline numerical regression suite remains applicable.

`preview-browser.js` can be passed to Chrome DevTools MCP's evaluate_script as a
function source. It traverses all 15 narrative states forward and backward, checks
rapid reversals, exact contributor counts/values, and horizontal overflow. Review
screenshots at both desktop and mobile sizes, as well as 4× camera close-ups.

Normal builds exclude this draft route, home listing and RSS item. No deployment
or publication is part of this work.
