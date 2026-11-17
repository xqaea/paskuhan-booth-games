const $ = id => document.getElementById(id);
let current = 'home', player = '', timers = [];
function clearTimers(){ timers.forEach(t=>{clearInterval(t);clearTimeout(t)}); timers=[]; catchStop(); stopCycle(); }
function go(id){
  clearTimers(); current = id; $('toast').classList.remove('show');
  if(id!=='tree') document.body.classList.remove('display');
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  if(id==='board') renderBoard();
  if(id==='wheel') { drawWheel(); $('prize').textContent=''; }
  if(id==='tree') { renderTree(); startCycle(); if(!$('treeName').value) $('treeName').value=$('playerName').value.trim(); }
  Sound.sfx('click');
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(document.body.classList.contains('display')) toggleDisplay(); else go('home'); } });
function toggleFS(){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
function toast(t,ms=1800){ const el=$('toast'); el.textContent=t; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),ms); }
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = { get:(k,d)=>{ try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }, set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} } };

