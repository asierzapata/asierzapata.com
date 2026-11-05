# Photography explainer — proposal v2

Status: storyboard proposal. This does not replace the existing article implementation.

**You write the article prose.** The titles below are working suggestions. Writing prompts describe the job of each passage; they are not proposed copy.

## The story

How does a sensor this small produce a photograph this good?

Three movements, with two computational mechanisms at their centre:

1. **Get inside the camera.** Photograph → iPhone → one camera module → sensor → sensing sites.
2. **Reconstruct across space.** One filtered measurement → neighbours → missing components → full-colour photograph.
3. **Gather evidence across time.** Limited light and uncertainty → repeated observations → alignment and averaging → different exposures for brightness range → the opening photograph again.

Hardware establishes the constraint. Software makes better use of the evidence. We should not assign an unsupported percentage of image quality to either.

## Composition and pacing

Desktop: a large visual on the left, short passages on the right. Keep the same visual stage across connected beats, rather than introducing a new illustrated card each time. The frame, selected camera, crop marker and selected sensing site provide continuity.

Mobile: the current visual sits above its passage. Use a compact sticky stage only while there is enough height for reading; use adjacent static states on short screens.

Start and finish with a photograph large enough to appreciate. Use isometric depth for the phone/camera reveal; transition to face-on views when looking at samples and photographic detail. Keep the numerical demonstration short: a single target, its actual contributors, and the result. Avoid the previous article's instrument-card chrome, persistent readout bars and fabricated laboratory furniture. Anatomy should supply purposeful material detail and restrained motion to the real camera object; computation should look like operations on data and photographs.

A passage advances a causal state. Large scene changes can follow scroll progress; arithmetic and comparisons settle into discrete, readable states. No idle animation, timed reveal or scroll interception. Stopping or reversing scroll must leave an understandable image. Reduced motion uses the same endpoints.

## Storyboard

### 1. How did this come from a phone?

- **Visual starts:** the finished photograph, generously framed.
- **Scroll changes:** the phone appears beside it; a selected rear camera receives a quiet outline.
- **Visual ends:** the same phone and the photograph remain connected.
- **Your passage's job:** introduce the familiar result and the question, in your own voice. Establish that computation contributes without making a hardware-versus-software percentage claim.
- **Next connection:** enter the camera that made the image.

### 2. What is behind this lens?

- **Visual starts:** the back of an iPhone, with one camera selected.
- **Scroll changes:** approach that camera; surrounding phone fades back; the module separates along its optical axis. Open the housing and separate the lens assembly, filter and sensor package in a clearly labelled schematic cutaway.
- **Visual ends:** an exposed sensor package, with a small phone silhouette preserving its origin.
- **Presentation hold:** a stable endpoint, with no autoplay. This is where you bring out your camera and show its sensor live.
- **Your passage's job:** connect the familiar phone to the physical sensor. Only identify parts needed to understand what follows.
- **Boundary:** the number, shape and order of lens elements must come from a source for the chosen module, or be explicitly schematic. Do not present an invented teardown as an exact iPhone assembly.
- **Next connection:** remove the inspection magnification to reveal physical size.

### 3. How small is it?

- **Visual starts:** the enlarged sensor from the teardown.
- **Scroll changes:** pull it back to a physical-size comparison, beside a fingernail reference and your camera's sensor.
- **Visual ends:** a readable comparison with actual dimensions and an inspection magnification label.
- **Your passage's job:** give the audience a physical reference. Connect the illustration to the camera in your hands.
- **Boundary:** select the iPhone camera and your camera model before assigning dimensions. A fingernail is an approximate reference, not a calibrated ruler. Do not imply that every phone sensor has the same size or that area alone determines image quality.
- **Next connection:** magnify the same sensor into its repeating matrix.

### 4. One site. One filtered measurement.

- **Visual starts:** the sensor surface, with a small patch marked.
- **Scroll changes:** magnify the patch; show microlenses, colour filters and sensing regions; gently flatten the patch into its actual Bayer arrangement. Select a red-filtered site.
- **Visual ends:** one populated component and two visibly empty slots: R measured, G missing, B missing.
- **Your passage's job:** establish the missing-colour problem in plain language. Introduce terminology only after the visual makes it apparent.
- **Boundary:** RAW values are digitized measurements. Colour identifies the filter; it is not the stored data type. Preserve actual CFA phase; filters have overlapping spectral responses.
- **Next connection:** keep that target still while evidence appears around it.

### 5. Borrow the missing colour from next door.

- **Visual starts:** the selected site, with the measured component held constant.
- **Scroll changes:** highlight the orthogonal green contributors; reveal their weights and estimate. Then highlight the diagonal blue contributors and estimate. Expand the completed triplet across the reconstructed patch.
- **Visual ends:** reconstructed photographic detail, with the patch locator still visible in the full photograph.
- **Your passage's job:** explain one example of interpolation. Introduce demosaicing, then make the distinction between measurement and estimation.
- **Boundary:** use the same contributor implementation for weights, arithmetic and image. Measured = solid; estimated = hatched or dashed plus explicit words. “Two of three components per output position are estimated” is more accurate than “two thirds of the scene is invented.”
- **Next connection:** keep the photograph visible and inspect uncertainty that reconstruction did not remove.

### 6. What happens when there is little light?

- **Visual starts:** a real dim region of the photograph, large enough for noise to be visible.
- **Scroll changes:** briefly show a clearly labelled schematic of repeated measurements fluctuating under unchanged illumination; return to actual single-frame detail.
- **Visual ends:** one noisy observation of a recognizable scene detail.
- **Your passage's job:** explain why collecting light matters and why repeated measurements can differ. Keep the noise-origin explanation subordinate to the next demonstration.
- **Boundary:** photon arrival variability and electronic/read noise are distinct sources. Under comparable conditions, gathering more light improves relative photon statistics; do not equate sensor size alone with noise or claim the schematic is a fitted camera noise model.
- **Next connection:** ask the visual question by revealing another actual capture of the same detail.

### 7. Line up. Then combine.

- **Visual starts:** several separate, same-exposure RAW captures of the scene.
- **Scroll changes:** inspect corresponding detail; show the real unaligned average; reveal actual displacement; align captures; combine valid, agreeing observations. Compare 1, 4 and 8 captures only if the chosen source actually contains them and the differences are visible.
- **Visual ends:** a single-versus-merged comparison with identical framing and rendering. Keep it still long enough to inspect.
- **Your passage's job:** explain repeated evidence, why alignment is necessary and why disagreement sometimes should be excluded. Close the spatial/temporal parallel.
- **Boundary:** same-exposure averaging does not inherently brighten the image; it can make the estimate less noisy. Use the real available frame count. Residual rejection does not identify moving objects semantically. Do not promise a universal improvement factor.
- **Next connection:** retain the scene while changing a different acquisition variable: exposure duration.

### 8. Different exposures, different useful evidence.

- **Visual starts:** the same scene with both bright and dark regions identified.
- **Scroll changes:** show a real short exposure retaining bright detail, and a real longer exposure with better shadow evidence. Normalize exposure in the processing domain to establish correspondence, then combine usable evidence and render once for display.
- **Visual ends:** the combined result, with bright and dark details recognizable together. One matched comparison, not a separate rendering lesson.
- **Your passage's job:** distinguish brightness range from the previous noise problem. Explain the purpose of an exposure bracket, then return to the finished photograph.
- **Boundary:** use actual exposure brackets and exposure metadata. Never manufacture multiple “captures” by changing the brightness of one image. If making a clipping claim, check original RAW samples. Inspection may use a documented exposure-aware adapter, but final before/after comparisons need an explicitly matched viewing strategy.
- **Recommendation:** include this beat if the source proves it clearly. If not, finish after beat 7; do not force the data to support an HDR demonstration.
- **Next connection:** bring the reconstructed components and repeated observations back into the opening image.

### 9. One photograph. More evidence.

- **Visual starts:** the finished photograph at the opening scale.
- **Scroll changes:** a brief spatial-neighbourhood inset and a temporal-capture inset reconnect the two mechanisms to the result.
- **Visual ends:** the photograph on its own again.
- **Your passage's job:** land the parallel in your words: neighbouring positions reconstruct colour; neighbouring moments improve the estimate. Rendering can receive one final sentence if useful.
- **Boundary:** do not imply this educational pipeline reproduces a proprietary iPhone pipeline, or that it invents arbitrary scene details.

## Source proposal

**No replacement RAW has been selected or validated yet.** The existing tree capture remains a processing fixture, not the proposed visual anchor. The following is a shortlist of scenes and acquisition approaches, not a list of approved RAW files.

### Preferred: your own evening desk / window scene

One recognizable setting: a desk or shelf beside a bright window, with coloured book spines, a plant, printed detail and dark textured fabric. Choose a time when the brightness contrast and shadow noise are useful. The goal is one compelling image with three useful inspection regions, not a staged chart.

- Fine, high-contrast edges and coloured detail for the Bayer demonstration.
- A static, dim textured region for repeated-observation noise reduction.
- A bright window or lamp next to darker interior detail for exposure bracketing.
- Your own photograph would connect the article's voice, the phone illustration and the real measurements.

Capture sets required, once the device/capture mode is verified:

1. A repeated Bayer RAW series, ideally eight real captures with fixed exposure, ISO, focus and white balance, from the same selected camera. Preserve exposure metadata. The app/device determines what acquisition sequence is actually possible; no generic iPhone burst capability is assumed.
2. A genuine bracket of that same static scene, varying exposure duration while keeping other settings fixed where supported. Choose durations after inspecting the scene, rather than assuming a preset EV bracket will demonstrate the intended effect.
3. A reference photograph for appreciating the composition, clearly identified as camera-produced or our own rendering. It is not ground truth.

### Alternative scene: a static night facade

A shopfront or building with illuminated lettering, coloured surfaces and dark masonry. Strong noise and highlight examples; more risk of moving people, vehicles, flickering lighting and changing illumination. Prefer it only if the actual captures remain suitable for a simple, inspectable alignment example.

### Alternative scene: an interior with a bright window

A room, corridor or architectural interior with strong edges, dark textures and exterior detail through a window. Strong brightness-range example; check that the same capture also supplies useful colour and a visibly noisy region.

### Existing-data fallback: a different HDR+ burst

The curated HDR+ subset provides 153 source scenes with real RAW bursts, calibration sidecars and published final renders. It is a useful place to look for a dim interior or night scene. Bursts generally share exposure time and gain; do not treat them as varied-exposure brackets. Their published final JPEGs are results of Google's pipeline, not demonstrations of our own reconstruction or merge.

- Dataset documentation: https://storage.googleapis.com/hdrplusdata/README.html
- Curated visual gallery: https://photos.app.goo.gl/TVksV6qCBtkxaYLw9
- License: CC BY-SA; retain attribution and derivative relationships.
- The gallery did not load in the research tool during this proposal, so no particular image is claimed as shortlisted or visually assessed.

### Source acceptance gate

Before final illustrations or replacement integration:

- Verify original mosaic data, dimensions, CFA phase, black/white levels, orientation and usable colour calibration.
- Verify real, distinct captures; inspect fixed/matching settings for the repeated series and actual exposure durations for the bracket.
- Test a fixed-view single/merge comparison large enough to judge. Noise improvement and alignment failure should be legible without theatrical magnification.
- Choose one crop per explanation, retain full-image locators, and verify any RAW saturation claims.
- Prefer sources for which the educational processing is feasible. The current decoder/calibration is specific to the Google Pixel fixture; a new device requires a new validated decoding/calibration path.
- For an iPhone, distinguish Bayer RAW from ProRAW. ProRAW is already demosaiced and may include image fusion, so it cannot supply the original mosaic lesson.

Apple's format explanation: https://developer.apple.com/videos/play/wwdc2021/10160/

## What I would leave out

Separate colour-improvement, white-balance, sharpening, super-resolution, depth and tone-mapping chapters. The colour reconstruction beat already carries the colour story. This proposal has enough material without another pipeline tour.

## Recommended next implementation slice

After the storyboard direction is settled and candidate RAWs pass inspection, build only the continuous camera-to-sensor-to-grid transition first. Give it clear resting states and the live-camera comparison pause. Review that sequence with placeholder spaces for your prose. Then connect the actual numerical reconstruction and photographic comparisons to it.

The nine beats are not nine independent application chapters: they share one reading flow and a small number of persistent visual scenes. The technical pipeline is implemented only as needed to support the visible explanation.
