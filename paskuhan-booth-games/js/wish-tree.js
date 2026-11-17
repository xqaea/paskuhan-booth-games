/* ---------- Christmas Tree of Wishes ---------- */
const TREE_KEY='paskuhan_tree_v1';
const VAL_COLOR={love:'#e91e63',hope:'#ffb300',joy:'#43a047'}, VAL_NAME={love:'💞 Love',hope:'🌟 Hope',joy:'🎶 Joy'};
let treeDesign=ORNAMENTS[0], treeVal='love', cycleIv=null, cycleI=0;
const ornHTML = d => d.startsWith('ball:') ? `<div class="ball ${d.slice(5)}"></div>` : d;
// fixed ornament slots inside the tree triangle (percent of box)
const SLOTS=(()=>{ let seed=7; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647; const pts=[];
  for(let tries=0;tries<6000&&pts.length<CONFIG.treeMax;tries++){
    const y=22+rnd()*58, hw=40*(y-12)/70-4, x=50+(rnd()*2-1)*hw;
    if(pts.every(p=>Math.hypot(p.x-x,(p.y-y)*.8)>(pts.length<45?8.5:6.2))) pts.push({x,y}); }
  return pts.sort((a,b)=>a.y-b.y); })();
const TREE_SVG = (()=>{ let lights=''; const cols=['#ff5252','#ffd740','#69f0ae','#40c4ff','#ff80ab'];
  for(let i=0;i<34;i++){ const y=95+i*9.3, hw=165*(y-50)/360-8, x=200+Math.sin(i*1.9)*hw*.92;
    lights+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${cols[i%5]}" style="animation:blink 1.2s ${(i%5)*.25}s infinite alternate;color:${cols[i%5]}"/>`; }
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><defs>
  <linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#1b5e20"/><stop offset=".5" stop-color="#2e7d32"/><stop offset="1" stop-color="#14451a"/></linearGradient>
  <radialGradient id="sg"><stop offset="0" stop-color="#fff59d"/><stop offset="1" stop-color="#ffc107" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="200" cy="478" rx="150" ry="14" fill="#0006"/>
  <rect x="176" y="405" width="48" height="66" rx="4" fill="#6d4c41"/>
  <polygon points="200,190 28,412 372,412" fill="url(#tg)" stroke="#0b3d12" stroke-width="3"/>
  <polygon points="200,118 62,300 338,300" fill="url(#tg)" stroke="#0b3d12" stroke-width="3"/>
  <polygon points="200,58 104,180 296,180" fill="url(#tg)" stroke="#0b3d12" stroke-width="3"/>
  <path d="M120,165 Q200,200 280,160 M85,280 Q200,320 315,275 M55,395 Q200,440 345,390" stroke="#ffd54f" stroke-width="3" fill="none" stroke-dasharray="2 7" stroke-linecap="round"/>
  ${lights}
  <circle cx="200" cy="52" r="46" fill="url(#sg)"/>
  <polygon points="200,18 210,42 236,44 216,60 223,86 200,72 177,86 184,60 164,44 190,42" fill="#ffc107" stroke="#fff59d" stroke-width="2"/>
  </svg>`; })();
$('designPick').innerHTML = ORNAMENTS.map((d,i)=>`<div class="dz${i?'':' sel'}" data-d="${d}">${ornHTML(d)}</div>`).join('');
$('designPick').querySelectorAll('.dz').forEach(el=>el.onclick=()=>{ treeDesign=el.dataset.d; $('designPick').querySelectorAll('.dz').forEach(x=>x.classList.toggle('sel',x===el)); Sound.sfx('click'); });
$('valPick').querySelectorAll('button').forEach((b,i)=>{ if(!i) b.classList.add('sel'); b.onclick=()=>{ treeVal=b.dataset.v; $('valPick').querySelectorAll('button').forEach(x=>x.classList.toggle('sel',x===b)); Sound.sfx('click'); }; });
$('treeMsg').addEventListener('input',()=>$('msgCount').textContent=$('treeMsg').value.length);
function treeList(){ return store.get(TREE_KEY,[]); }
function renderTree(newIdx=-1){
  const list=treeList().slice(-SLOTS.length);
  $('treeBox').innerHTML = TREE_SVG + list.map((o,i)=>{ const s=SLOTS[i]; return `<div class="orn ring-${o.v}${i===newIdx?' new':''}" data-i="${i}" style="left:${s.x}%;top:${s.y}%" title="${esc(o.n)}">${ornHTML(o.d)}</div>`; }).join('');
  $('treeBox').querySelectorAll('.orn').forEach(el=>el.onclick=e=>{ e.stopPropagation(); showOrn(list[+el.dataset.i]); });
  const total=treeList().length;
  $('treeStats').textContent = total ? `✨ ${total} wish${total>1?'es':''} on our tree` : '';
  if(!total) $('treeCaption').innerHTML='🎄 Our tree is waiting for its first ornament. Be the first to hang your wish!';
  else if(newIdx<0) caption(list.length-1);
}
function caption(i){
  const list=treeList().slice(-SLOTS.length), o=list[i]; if(!o) return;
  $('treeBox').querySelectorAll('.orn').forEach(el=>el.classList.toggle('hl',+el.dataset.i===i));
  $('treeCaption').innerHTML=`<b>${esc(o.n)}</b><span class="vt" style="background:${VAL_COLOR[o.v]}">${VAL_NAME[o.v]}</span><br>“${esc(o.m)}”`;
}
function showOrn(o){ $('ornBox').innerHTML=`<div class="o">${ornHTML(o.d)}</div><span class="vt" style="background:${VAL_COLOR[o.v]};color:#fff;padding:3px 10px;border-radius:99px;font-weight:800">${VAL_NAME[o.v]}</span><p>“${esc(o.m)}”</p><b style="color:#c62828">– ${esc(o.n)}</b><div style="margin-top:14px;font-size:13px;opacity:.6">tap anywhere to close</div>`; $('ornModal').classList.add('show'); Sound.sfx('flip'); }
function hangOrnament(){
  const n=$('treeName').value.trim(), m=$('treeMsg').value.trim();
  if(!n){ toast('Please type your name ✍️'); $('treeName').focus(); return; }
  if(!m){ toast('Please write a short message 💌'); $('treeMsg').focus(); return; }
  const list=treeList(); list.push({n,m,d:treeDesign,v:treeVal,t:Date.now()}); store.set(TREE_KEY,list);
  $('treeMsg').value=''; $('msgCount').textContent=0;
  const shown=Math.min(list.length,SLOTS.length)-1; renderTree(shown); caption(shown); cycleI=shown;
  Sound.sfx('hang'); toast('Your ornament is on the tree! 🎄 Merry Christmas!',2500);
  stopCycle(); setTimeout(startCycle,4000);
}
function startCycle(){ stopCycle(); cycleIv=setInterval(()=>{ const len=Math.min(treeList().length,SLOTS.length); if(!len) return; cycleI=(cycleI+1)%len; caption(cycleI); },CONFIG.displayCycleSeconds*1000); }
function stopCycle(){ clearInterval(cycleIv); cycleIv=null; }
function toggleDisplay(){ document.body.classList.toggle('display'); if(document.body.classList.contains('display')) toast('Display Mode: press Esc to exit',2500); }
function resetTree(){ if(prompt('Type RESET to remove all ornaments from the tree:')==='RESET'){ localStorage.removeItem(TREE_KEY); renderTree(); toast('The tree has been cleared.'); } }

