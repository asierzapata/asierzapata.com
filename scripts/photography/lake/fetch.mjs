// Downloads the public HDR+ burst into .cache (never committed). Safe to re-run.
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
export const BURST='0543_20150918_191324_709';
export const BASE='https://storage.googleapis.com/hdrplusdata/20171106_subset';
export const CACHE='.cache/photography/lake';
export const FRAMES=8,REFERENCE=2;
const files={'final.jpg':`results_20171023/${BURST}/final.jpg`,'rgb2rgb.txt':`bursts/${BURST}/rgb2rgb.txt`,'shading.tiff':`bursts/${BURST}/lens_shading_map_N00${REFERENCE}.tiff`};
for(let i=0;i<FRAMES;i++)files[`N00${i}.dng`]=`bursts/${BURST}/payload_N00${i}.dng`;
export const sources=Object.fromEntries(Object.entries(files).map(([name,path])=>[name,`${BASE}/${path}`]));
if(import.meta.url===`file://${process.argv[1]}`){
 mkdirSync(CACHE,{recursive:true});
 for(const [name,url] of Object.entries(sources)){
  if(existsSync(`${CACHE}/${name}`))continue;
  const response=await fetch(url);if(!response.ok)throw Error(`${url}: ${response.status}`);
  writeFileSync(`${CACHE}/${name}`,Buffer.from(await response.arrayBuffer()));console.log(`Fetched ${name}`);
 }
}
