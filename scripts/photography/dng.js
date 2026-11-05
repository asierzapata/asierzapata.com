/** Bounded decoder for the bundled HDR+ DNG profile. No rendering or demosaicing. */
export function readDirectory(buffer) {
  if (buffer.byteLength < 8 || buffer.byteLength > 32e6) throw Error('Invalid DNG size.');
  const v = new DataView(buffer), bytes = new Uint8Array(buffer);
  const little = bytes[0] === 73 && bytes[1] === 73;
  if (!little && !(bytes[0] === 77 && bytes[1] === 77)) throw Error('Not a TIFF/DNG file.');
  const u16 = o => v.getUint16(o, little), u32 = o => v.getUint32(o, little);
  if (u16(2) !== 42) throw Error('Only classic TIFF is supported.');
  const offset = u32(4);if(offset<8||offset>buffer.byteLength-2)throw Error('Truncated or invalid TIFF directory.');
  const count = u16(offset), tags = new Map();
  if (count > 256 || offset + 2 + count * 12 + 4 > buffer.byteLength) throw Error('Invalid directory.');
  const sizes = {1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8,11:4,12:8};
  for (let i = 0; i < count; i++) {
    const p = offset + 2 + i * 12, tag = u16(p), type = u16(p+2), n = u32(p+4), size = sizes[type];
    if (!size || n > 1e6) throw Error('Unsupported metadata representation.');
    const at = size * n <= 4 ? p + 8 : u32(p+8);
    if (at + n * size > buffer.byteLength) throw Error('Truncated metadata.');
    const values = [];
    for (let j = 0; j < n; j++) {
      const a = at + j * size;
      if (type === 3) values.push(u16(a));
      else if (type === 4) values.push(u32(a));
      else if (type === 5 || type === 10) {
        const num = type === 5 ? u32(a) : v.getInt32(a,little), den = type === 5 ? u32(a+4) : v.getInt32(a+4,little);
        if (!den) throw Error('Invalid rational metadata.');
        values.push(num / den);
      } else if (type === 11) values.push(v.getFloat32(a,little));
      else if (type === 12) values.push(v.getFloat64(a,little));
      else if (type === 9) values.push(v.getInt32(a,little));
      else values.push(bytes[a]);
    }
    tags.set(tag, values);
  }
  return tags;
}

/** Lossless JPEG SOF3, 1x1 sampling, predictor 1, no restart markers.
 * Deliberately narrow; unsupported coding features fail rather than guess. */
export function decodeLossless(bytes) {
  let p = 0;
  const read = () => { if(p>=bytes.length) throw Error('Truncated JPEG tile.'); return bytes[p++]; };
  const word = () => read() * 256 + read();
  if (word() !== 0xffd8) throw Error('Invalid JPEG tile.');
  let width, height, components, precision, tables = [], selectors;
  while (p < bytes.length) {
    if (read() !== 255) throw Error('Invalid JPEG marker.');
    const marker = read(), length = word(), end = p + length - 2;
    if (end > bytes.length || length < 2) throw Error('Truncated JPEG header.');
    if (marker === 0xc3) {
      precision = read(); height = word(); width = word(); components = read();
      if (precision !== 16 || ![1,2].includes(components) || width*height*components>262144) throw Error('Unsupported lossless frame.');
      for (let c=0;c<components;c++) { read(); if(read()!==0x11 || read()!==0) throw Error('Unsupported sampling.'); }
    } else if (marker === 0xc4) {
      while (p < end) {
        const id = read(); if (id > 3) throw Error('Unsupported Huffman table.');
        const counts = Array.from({length:16},read), table = Array.from({length:17},()=>new Map());
        let code=0;
        for(let len=1;len<=16;len++) { for(let k=0;k<counts[len-1];k++) table[len].set(code++,read()); code *=2; }
        tables[id]=table;
      }
    } else if(marker===0xda) {
      if(read()!==components) throw Error('Unsupported scan.');
      selectors=[];
      for(let c=0;c<components;c++) { if(read()!==c) throw Error('Unsupported component order.'); selectors.push(read() >> 4); }
      if(read()!==1 || read()!==0 || read()!==0) throw Error('Only predictor 1 without point transform is supported.');
      break;
    } else throw Error(`Unsupported JPEG marker ${marker.toString(16)}.`);
    if(p!==end) throw Error('Invalid JPEG segment.');
  }
  if(!selectors || selectors.some(s=>!tables[s])) throw Error('Missing lossless scan.');
  let bitBuffer=0, available=0;
  const bit = () => {
    if(!available) { bitBuffer=read(); if(bitBuffer===255 && read()!==0) throw Error('Unexpected entropy marker.'); available=8; }
    return bitBuffer >> --available & 1;
  };
  const output = new Uint16Array(width*height*components);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) for(let c=0;c<components;c++) {
    let code=0, category;
    for(let len=1;len<=16;len++) { code=code*2+bit(); category=tables[selectors[c]][len].get(code); if(category!==undefined) break; }
    if(category===undefined || category>16) throw Error('Invalid Huffman code.');
    let delta=0;
    if(category===16) delta=-32768;
    else if(category) { for(let i=0;i<category;i++) delta=delta*2+bit(); if(delta<2**(category-1)) delta-=2**category-1; }
    const index=(y*width+x)*components+c;
    const prediction=x ? output[index-components] : y ? output[index-width*components] : 2**(precision-1);
    output[index]=(prediction+delta)&65535;
  }
  return {width:width*components,height,data:output};
}

export function decodeDng(buffer) {
  const tags=readDirectory(buffer), get = t => tags.get(t), single = t => get(t)?.[0];
  const width=single(256),height=single(257);
  if(!get(50706) || single(262)!==32803 || single(277)!==1 || String(get(33421))!=='2,2') throw Error('This input is not a supported Bayer DNG; linear DNG/ProRAW is already reconstructed.');
  if(width!==4048 || height!==3036 || single(258)!==16 || single(259)!==7 || single(322)!==256 || single(323)!==256 || single(274)!==6) throw Error('This decoder is validated only for the bundled HDR+ profile.');
  if(String(get(33422))!=='2,1,1,0' || get(50714)?.length!==4 || get(50728)?.length!==3 || single(50717)!==1023) throw Error('Unsupported calibration metadata.');
  if(get(50829) || get(51008) || get(51009) || get(51022) || get(50712) || get(50715) || get(50716)) throw Error('Additional RAW corrections are not supported.');
  const offsets=get(324),lengths=get(325),cols=Math.ceil(width/256),rows=Math.ceil(height/256);
  if(offsets?.length!==cols*rows || lengths?.length!==offsets.length) throw Error('Invalid tile layout.');
  const samples=new Uint16Array(width*height);
  for(let t=0;t<offsets.length;t++) {
    if(offsets[t]+lengths[t]>buffer.byteLength) throw Error('Truncated DNG tile.');
    const tile=decodeLossless(new Uint8Array(buffer,offsets[t],lengths[t]));
    if(tile.width!==256 || tile.height!==256) throw Error('Unexpected tile dimensions.');
    const ox=t%cols*256,oy=Math.floor(t/cols)*256;
    for(let y=0;y<256 && oy+y<height;y++) samples.set(tile.data.subarray(y*256,y*256+Math.min(256,width-ox)),(oy+y)*width+ox);
  }
  return {width,height,samples,pattern:[2,1,1,0],black:get(50714),white:single(50717),wb:get(50728).map(x=>1/x),orientation:single(274),origin:[0,0],log:['Lossless JPEG unpack only; no linearization or rendering','Full active array, zero margin; orientation deferred to display']};
}
