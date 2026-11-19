import data from '../../../lib/photography/lake/data.json'
/** The pixel we follow through the burst sits in the middle of a six-times zoom. */
export const ZOOM = 6
const { width, height } = data.crop
const edge = (at: number, size: number) => (at + .5 - size / ZOOM / 2) * ZOOM / (ZOOM - 1) / size
export const origin = `${(edge(data.pixel.x, width) * 100).toFixed(3)}% ${(edge(data.pixel.y, height) * 100).toFixed(3)}%`
