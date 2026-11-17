/* ---------- LOVE: memory match ---------- */
let mem={};
function memStart(){
  mem={first:null,lock:false,pairs:0,score:0,time:CONFIG.memorySeconds,set:shuffle([...LOVE_CARDS.keys()]).slice(0,8)};
  $('memTime').textContent=mem.time; $('memPairs').textContent=0; $('memScore').textContent=0;
  const deck=shuffle([...mem.set,...mem.set]);
  $('memGrid').innerHTML = deck.map(k=>`<div class="mcard" data-k="${k}"><div class="inner"><div class="face back">🎄</div><div class="face front">${LOVE_CARDS[k][0]}<small>${LOVE_CARDS[k][1]}</small></div></div></div>`).join('');
  $('memGrid').querySelectorAll('.mcard').forEach(c=>c.onclick=()=>memFlip(c));
  mem.iv=setInterval(()=>{ mem.time--; $('memTime').textContent=mem.time; if(mem.time<=10) Sound.sfx('tick'); if(mem.time<=0) finish('love',mem.score); },1000);
  timers.push(mem.iv);
}
function memFlip(c){
  if(mem.lock||c.classList.contains('flip')||c.classList.contains('done')) return;
  c.classList.add('flip'); Sound.sfx('flip');
  if(!mem.first){ mem.first=c; return; }
  const a=mem.first; mem.first=null;
  if(a.dataset.k===c.dataset.k){
    a.classList.add('done'); c.classList.add('done'); mem.pairs++; mem.score+=100;
    $('memPairs').textContent=mem.pairs; $('memScore').textContent=mem.score;
    toast(LOVE_CARDS[a.dataset.k][2],2200); Sound.sfx('match');
    if(mem.pairs===8){ clearInterval(mem.iv); mem.score += mem.time*10; $('memScore').textContent=mem.score; timers.push(setTimeout(()=>finish('love',mem.score),900)); }
  } else {
    mem.lock=true; timers.push(setTimeout(()=>Sound.sfx('wrong'),250));
    timers.push(setTimeout(()=>{ a.classList.remove('flip'); c.classList.remove('flip'); mem.lock=false; },750));
  }
}

