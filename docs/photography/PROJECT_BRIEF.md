# Photography explainer: project brief and handoff

Last updated: 5 November 2026.

This is the current direction for continuing the work. The detailed storyboard is
in [proposal-v2.md](proposal-v2.md). Earlier notes and the original prose-heavy
article are retained as history; where they differ, the decisions below take
precedence.

## What we are trying to make

An interactive, continuous-scrolling photography article inside Asier's existing
Astro blog, Async. It grew from a ten-minute internal engineering talk,
“How Your Phone Cheats When Taking Photos,” aimed at curious software engineers
who do not already know photography or image processing.

The aim is to make familiar computational photography understandable through a
small number of concrete mechanisms. A reader should be able to follow the
working titles and illustrations alone, then use the prose for explanation.

The central connection remains:

**Reconstruction across space, then reconstruction across time.**

Neighbouring sensing sites supply evidence for missing colour components.
Repeated captures supply additional, imperfect observations of the same scene.
These are computations over measurements, not arbitrary invention of scene detail.

## Decisions made with Asier

- **Asier writes the article prose.** Suggested titles are welcome. The current
  preview intentionally has empty prose spaces and clearly marked authoring prompts.
  Do not fill them with assistant-written narration as an implementation shortcut.
- **Get the narrative beats right before polishing prose.** Each illustration
  should have an identifiable beginning, causal change and readable resting state.
- **Visual left, text right when space allows.** On small screens, keep the active
  visual above and close to the explanation. Preserve ordinary vertical scrolling.
- **Enter through a recognizable phone.** Scrolling approaches one camera, opens
  the assembly, separates the optics and reveals the sensor. Hold the exposed
  sensor still so Asier can show the sensor in his own camera during the talk.
- **Make the small sensor physically relatable.** Compare the selected phone
  sensor with Asier's camera sensor and an approximate fingernail reference. Actual
  device models and dimensions are still needed before claiming a scale ratio.
- **Use better RAW material.** The current Google Pixel tree scene is a validated
  processing fixture. It is not an approved final photograph for the revised story.
- **Keep both mechanisms focused.** Hardware and limited light motivate the story.
  Demosaicing, repeated-observation noise reduction and a possible real exposure
  bracket do the explanatory work. Do not add a general pipeline tour or separate
  colour, sharpening, depth, super-resolution and tone-mapping chapters.
- **Nothing has been deployed or published.** Both article versions remain drafts.

## Agreed visual sequence

| Beat | Working title / visual job |
| --- | --- |
| 1 | **How did this come from a phone?** Start with the result, connect it to the phone, select one camera. |
| 2 | **What is behind this lens?** Phone → camera module → lens assembly → exposed sensor. Stable pause for the live physical-camera comparison. |
| 3 | **How small is it?** Pull back from inspection magnification into a verified physical-size comparison. |
| 4 | **One site. One filtered measurement.** Magnify a sensor patch, reveal microlenses and filters, flatten it into a Bayer grid, select one site with two missing components. |
| 5 | **Borrow the missing colour from next door.** Highlight actual contributors, show their weights and estimates, repeat reconstruction and return to the crop. |
| 6 | **What happens when there is little light?** Inspect a genuinely noisy region and briefly establish why repeated measurements differ. |
| 7 | **Line up. Then combine.** Show separate captures, the unregistered average, correspondence, measured alignment and the actual merge. |
| 8 | **Different exposures, different useful evidence.** Use a real bracket to show the brightness-range problem. Include only if the source demonstrates it clearly. |
| 9 | **One photograph. More evidence.** Return to the opening image and connect neighbouring positions with neighbouring moments. |

The high-fidelity preview expands these nine editorial beats into fifteen scroll
states, including separate green/blue contributor and alignment/merge states.
They belong to a shared reading experience, not a presentation dashboard.

## What exists now

### Current visual direction

Development route: `/posts/how-your-phone-cheats-preview/`.

Source: [the preview post](../../src/posts/how-your-phone-cheats-preview.mdx),
[HighFidelity.astro](../../src/components/photography/preview/HighFidelity.astro)
and [beats.ts](../../src/lib/photography/preview/beats.ts).

The preview includes an audited 62-solid phone/camera figure, an audited 64-solid
sensor patch with sixteen sites, the provisional size comparison, real Bayer
readouts, actual photographic stages and explicit exposure-bracket source slots.
The phone and optics are iPhone-inspired schematic geometry, not an exact teardown
or an optical prescription for a verified device. The full implementation notes
are in [high-fidelity-preview.md](high-fidelity-preview.md).

Camera travel follows scrolling, settles without an idle tour and stops when
inactive. Reduced motion displays the same endpoints. The mobile numerical grid
shows a 3×3 neighbourhood containing the target and all contributors. Browser-native
noscript stills come from the same geometry; that branch is implemented but was not
separately verified with the browser's scripting flag disabled.

### Earlier implementation

Development route: `/posts/how-your-phone-cheats/`.

This is the earlier complete article and two-figure implementation. It preserves
working numerical demonstrations and static fallbacks, but its assistant-written
prose and instrument-card presentation were superseded by Asier's later direction.
Do not use it as the final editorial voice.

### Storyboard and supporting material

- [Interactive storyboard](storyboard.html): standalone export of the approved
  rough proposal; open directly in a browser. Its sketches are not scientific data.
- [Editable storyboard fragment](storyboard.fragment.html): original inline source.
- [Detailed proposal](proposal-v2.md): transitions, prose responsibilities and
  candidate capture scenes.
- [Earlier implementation guide](README.md) and [design record](design.md).
- [Original verification](verification/README.md) and
  [high-fidelity verification](preview-verification/README.md), including screenshots
  and numerical/browser/geometry reports from 30 October 2026.

The Anatomy skill, kit, supporting resources, examples and MIT license are vendored
under `.agents/skills/anatomy/`; `skills-lock.json` records its origin. The relative
`.claude/skills/anatomy` symlink points to that same installation. They are included
so figure generation is available after cloning, without relying on a local skill
installation outside the repository.

## Real data, processing and scientific boundaries

The bundled derivatives come from HDR+ burst `0006_20160722_115157_431`, Google Pixel,
captures N000–N003. These are four distinct conventional Bayer RAW captures with
matching exposure and calibration. This is not an iPhone capture series.

The original RAW files are not committed. Derived photographs, sample neighbourhoods,
calibration sidecars, hashes and notices are in `public/photography/`. The validated
fixture uses a native 384×384 crop starting at raw coordinates (2109, 2009).

Pure processing functions live in `src/lib/photography/pipeline.js` and `burst.js`.
Preparation decodes the originals offline, rechecks source and unpacked-sample
hashes, reconstructs the crop and recomputes alignment/merging. Readers do not
need to download or decode full-resolution RAWs to open the article.

Preserve these distinctions when continuing:

- A sensing site records one filtered scalar measurement. Demosaicing preserves
  that component and estimates the other two; “two thirds of the scene is invented”
  would be misleading.
- Grid values, contributors, arithmetic and reconstructed images must share the
  same interpolation kernel. Preserve CFA phase through crops. The current numerical
  grid uses sensor coordinates; photographic views rotate 90° clockwise for display.
- Calibration and display rendering are separate from the underlying measurements.
  Comparisons share framing, +2 EV, tone curve and sRGB display encoding.
- The current registration is translation-only, after reconstruction into common
  linear RGB. Rotation, parallax, subject motion and rolling shutter limit that model.
- Rejection detects residual disagreement, not semantic moving-object identity.
  The prepared merge rejects 6,264 of 437,007 candidate overlapping observations.
- Same-exposure averaging can reduce noise; it does not inherently brighten an
  image or recover information absent from every observation.
- The fixture has no saturated sensor sites: maximum 814 DN, white level 1023.
  It cannot support an invented clipped-highlight example.
- ProRAW is already demosaiced and may include fusion. A DNG extension alone does
  not establish original Bayer measurements. A new device needs validated decoding
  and calibration; the current decoder is deliberately specific to this fixture.
- Smartphone filters have overlapping spectral responses. Sensor area alone does
  not determine image quality, and no percentage of quality is assigned to hardware
  versus software.

Photographic adaptations and retained source data are CC BY-SA 4.0. Preserve
[NOTICE.md](../../public/photography/NOTICE.md), attribution, links, source
relationships and hashes when changing or redistributing these assets. The original
manifest describes the broader reference application; it is not a feature list for
this blog article.

## Remaining work, in useful order

1. Review the high-fidelity visual direction with Asier. It is a concrete prototype,
   not an approved finished article.
2. Identify the intended iPhone camera and Asier's physical camera. Verify sensor
   dimensions before finalizing the size comparison; verify teardown geometry or
   retain an explicit schematic treatment.
3. Select and validate stronger original RAW material. Prefer one static scene
   with colour/edge detail, a noisy dim region and useful bright/dark detail.
   The proposed first candidate is a desk/shelf by a bright window with coloured
   books, a plant and dark textured fabric.
4. Obtain actual repeated captures at matching settings, ideally enough for a
   meaningful frame-count comparison. Obtain a separate real exposure bracket if
   keeping beat 8. Do not manufacture captures by adjusting one processed image.
5. Validate the new decoder/calibration path, inspect useful crops and prove the
   photographic differences using a consistent viewing strategy. Replace fixture
   data only when the calculations and provenance are reproducible.
6. Have Asier write the passages against the settled visual beats, then integrate
   his prose and adjust pacing to its real length. Keep titles and illustrations
   understandable when skimmed without the paragraphs.
7. Recheck numerical integrity, camera geometry, ordinary and draft builds,
   desktop/mobile scrolling, reverse/fast scrolling, resizing, keyboard access,
   reduced motion and fallback behaviour. Rehearse the physical-camera pause.
8. Publish only after a later explicit request. Creating/pushing this branch does
   not authorize deploying the website or making either draft a published post.

## Run and regenerate

Use the existing project's supported Node/npm environment. From a fresh clone:

```sh
npm ci
npm run dev
```

Open the preview route above, normally at `http://localhost:4321`. Existing
photographic and figure derivatives are committed, so ordinary development/builds
need no sibling checkout, RAW decoder installation or network image service.

```sh
npm run test:photography
npm run build
INCLUDE_DRAFTS=true npm run build
npm run preview
```

`INCLUDE_DRAFTS=true` is only for local static-output QA. It includes draft post
routes while production homepage and RSS keep their normal filtering. Normal
builds exclude both photography post routes. Public assets still follow Astro's
normal copy-to-output convention even when the posts are drafts.

```sh
npm run photography:figures
npm run photography:preview-figures
```

The preview figure command audits the camera and patch, then regenerates static
endpoints. To recompute photographs, `photography:prepare` defaults to the original
local reference checkout at `../phone-photography-talk/public/assets`; alternatively:

```sh
node scripts/photography/prepare.mjs /absolute/path/to/original/assets
node scripts/photography/fallbacks.mjs
```

The original captures and required sidecars must be present there. Original source
URLs and hashes are recorded in the committed manifests. The reference project is
input material only and must not be modified as part of continuing this blog work.
