/** Reader for the uncompressed, strip-based Bayer DNGs of the HDR+ dataset
 * (Nexus 5X/6/6P), and for its float lens-shading TIFFs. No rendering. */
const SIZES={1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8,11:4,12:8};
function directory(view,offset,little){
 const count=view.getUint16(offset,little),tags=new Map();
 for(let i=0;i<count;i++){
  const p=offset+2+i*12,tag=view.getUint16(p,little),type=view.getUint16(p+2,little),n=view.getUint32(p+4,little),size=SIZES[type];
  if(!size||n>1e5)continue;
  const at=size*n<=4?p+8:view.getUint32(p+8,little),values=[];
  for(let j=0;j<n;j++){
   const a=at+j*size;
   values.push(type===3?view.getUint16(a,little):type===4?view.getUint32(a,little):type===5?view.getUint32(a,little)/view.getUint32(a+4,little):type===10?view.getInt32(a,little)/view.getInt32(a+4,little):type===9?view.getInt32(a,little):type===11?view.getFloat32(a,little):type===12?view.getFloat64(a,little):view.getUint8(a));
  }
  tags.set(tag,values);
 }
 return tags;
}
function open(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),little=bytes[0]===73;
 if(!little&&bytes[0]!==77)throw Error('Not a TIFF/DNG file.');
 if(view.getUint16(2,little)!==42)throw Error('Only classic TIFF is supported.');
 return {view,little,root:directory(view,view.getUint32(4,little),little)};
}
export function decodeStripDng(bytes){
 const {view,little,root}=open(bytes);
 const raw=[root,...(root.get(330)||[]).map(o=>directory(view,o,little))].find(t=>t.get(262)?.[0]===32803);
 if(!raw)throw Error('No Bayer image in this DNG.');
 const one=t=>raw.get(t)?.[0],width=one(256),height=one(257);
 if(one(259)!==1||one(258)!==16||one(277)!==1||String(raw.get(33421))!=='2,2')throw Error('Only uncompressed 16-bit 2x2 Bayer strips are supported.');
 const black=raw.get(50714),neutral=root.get(50728),pattern=raw.get(33422);
 if(black?.length!==4||neutral?.length!==3||pattern?.length!==4)throw Error('Unsupported calibration metadata.');
 const samples=new Uint16Array(width*height),offsets=raw.get(273),lengths=raw.get(279);let k=0;
 for(let s=0;s<offsets.length;s++){
  if(offsets[s]+lengths[s]>bytes.byteLength)throw Error('Truncated DNG strip.');
  for(let q=0;q<lengths[s]&&k<samples.length;q+=2)samples[k++]=view.getUint16(offsets[s]+q,little);
 }
 if(k!==samples.length)throw Error('Strip data does not fill the image.');
 const exif=root.get(34665)?directory(view,root.get(34665)[0],little):new Map();
 return {width,height,samples,pattern,black,white:one(50717),wb:neutral.map(v=>1/v),origin:[0,0],orientation:root.get(274)?.[0],
  exposure:(exif.get(33434)||root.get(33434))?.[0],iso:(exif.get(34855)||root.get(34855))?.[0],model:String.fromCharCode(...(root.get(272)||[])).replace(/\0/g,'').trim()};
}
/** Dataset sidecar: float32, four gains per cell in R, G(red row), G(blue row), B order. */
export function decodeShadingTiff(bytes){
 const {view,little,root}=open(bytes),one=t=>root.get(t)?.[0],width=one(256),height=one(257);
 if(one(277)!==4||one(259)!==1||String(root.get(258))!=='32,32,32,32'||String(root.get(339))!=='3,3,3,3')throw Error('Unsupported shading map.');
 const data=[],offsets=root.get(273),lengths=root.get(279);
 for(let s=0;s<offsets.length;s++)for(let q=0;q<lengths[s];q+=4)data.push(view.getFloat32(offsets[s]+q,little));
 if(data.length!==width*height*4)throw Error('Shading data does not fill the map.');
 return {width,height,data};
}
