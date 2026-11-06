export function reconstructionSteps(patch) {
  const target=patch.sites.find(s=>s.x===patch.x&&s.y===patch.y)
  const letters=['R','G','B']
  const black=patch.black[((target.y+patch.origin[1])&1)*2+((target.x+patch.origin[0])&1)]
  return target.channels.map((channel,index)=>({
    sources:channel.sites,
    components:target.channels.map((c,i)=>({
      letter:letters[i],
      value:i<=index?c.value.toFixed(4):'—',
      status:i===0?'measured':i<=index?'estimated':'not measured',
    })),
    equation:index===0
      ?`R = (${target.dn} − ${black}) / (${patch.white} − ${black}) ≈ ${channel.value.toFixed(4)}`
      :`${letters[index]} ≈ ${channel.sites.map(s=>`${s.value.toFixed(3)} × ${s.weight===.25?'¼':s.weight}`).join(' + ')} ≈ ${channel.value.toFixed(4)}`,
  }))
}
