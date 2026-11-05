/** Working titles and authoring prompts; these are not article body copy. */
export const beats = [
  { id:'the-phone', part:'01 / Inside the camera', title:'What is behind this lens?', view:'camera', camera:0, prompt:'Your introduction to the phone camera.' },
  { id:'the-optics', part:'01 / Inside the camera', title:'A camera, taken apart.', view:'camera', camera:1, prompt:'Your explanation of the lens assembly.' },
  { id:'the-sensor', part:'01 / Inside the camera', title:'At the end of the lens: the sensor.', view:'camera', camera:1, prompt:'Your transition to showing the sensor in your own camera.', hold:true },
  { id:'sensor-size', part:'01 / Inside the camera', title:'How small is it?', view:'size', prompt:'Your comparison with your camera and a fingernail.' },
  { id:'closer', part:'02 / Across space', title:'Look closer. Then closer again.', view:'patch', prompt:'Your introduction to sensing sites, filters and microlenses.' },
  { id:'one-measurement', part:'02 / Across space', title:'One site. One measurement.', view:'grid', channel:0, prompt:'Your explanation of the two missing colour components.' },
  { id:'neighbours', part:'02 / Across space', title:'Look next door.', view:'grid', channel:1, prompt:'Your explanation of the green contributors.' },
  { id:'diagonals', part:'02 / Across space', title:'Then look diagonally.', view:'grid', channel:2, prompt:'Your explanation of the blue contributors.' },
  { id:'reconstruct', part:'02 / Across space', title:'Repeat across the photograph.', view:'crop', prompt:'Your introduction to demosaicing and the return to the image.' },
  { id:'little-light', part:'03 / Across time', title:'What happens when there is little light?', view:'noise', prompt:'Your explanation of limited light and measurement noise.' },
  { id:'another-photo', part:'03 / Across time', title:'Take another photograph.', view:'frames', prompt:'Your introduction to repeated observations of the same scene.' },
  { id:'find-detail', part:'03 / Across time', title:'First, find the same detail.', view:'unaligned', prompt:'Your explanation of why simply averaging can blur edges.' },
  { id:'align', part:'03 / Across time', title:'Line up. Then combine.', view:'alignment', prompt:'Your explanation of correspondence and alignment.' },
  { id:'combine', part:'03 / Across time', title:'Keep the evidence that agrees.', view:'merged', prompt:'Your explanation of averaging and rejecting disagreement.' },
  { id:'different-exposures', part:'03 / Across time', title:'Different exposures. Different evidence.', view:'bracket', prompt:'Your explanation of brightness range, once a real exposure bracket is selected.' },
] as const
