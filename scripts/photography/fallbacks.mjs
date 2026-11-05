import {readFileSync,writeFileSync} from 'node:fs';
const {patch}=JSON.parse(readFileSync('public/photography/article-data.json'));
const t=patch.sites.find(s=>s.x===patch.x&&s.y===patch.y),names=['R','G','B'];
for(let channel=0;channel<3;channel++){
 const cells=patch.cells.map((s,i)=>{const x=24+i%7*63,y=20+Math.floor(i/7)*51;const selected=s.x===t.x&&s.y===t.y,contributor=t.channels[channel].sites.some(p=>p.x===s.x&&p.y===s.y);return `<g><rect x="${x}" y="${y}" width="59" height="47" rx="3" fill="${['#f6e5e2','#e0eee5','#e1eaf7'][s.c]}" stroke="${selected?'#a65e00':contributor?'#334155':'#cbd5e1'}" stroke-width="${selected?3.5:contributor?2.5:1}" ${contributor&&!selected?'stroke-dasharray="4 2"':''}/><text x="${x+6}" y="${y+14}" font-size="9">${names[s.c]}</text><text x="${x+29}" y="${y+34}" text-anchor="middle" font-size="14">${s.value.toFixed(3)}</text></g>`}).join('');
 const footer=channel===0?'R = 0.0847 measured · G, B missing':`${names[channel]} = ${t.channels[channel].value.toFixed(4)} estimated · weight ¼ each`;
 writeFileSync(`public/photography/grid-${['red','green','blue'][channel]}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="490" height="430" viewBox="0 0 490 430"><rect width="490" height="430" rx="8" fill="#f8fafc"/><g font-family="monospace" fill="#243449">${cells}<text x="245" y="410" text-anchor="middle" font-size="12">${footer}</text></g></svg>`);
}
