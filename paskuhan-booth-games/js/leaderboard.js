/* ---------- leaderboard ---------- */
const LB_KEY='paskuhan_lb_v1';
const loadLB = () => store.get(LB_KEY,{love:[],hope:[],joy:[]});
function saveScore(game,score){
  const lb=loadLB(); const entry={n:player,s:score,t:Date.now()};
  lb[game].push(entry); lb[game].sort((a,b)=>b.s-a.s||a.t-b.t); lb[game]=lb[game].slice(0,10);
  store.set(LB_KEY,lb);
  const i=lb[game].indexOf(entry); return i>=0 ? i+1 : 0;
}
function renderBoard(){
  const lb=loadLB(), meta={love:['💞 Love – Heart of Christmas','var(--love)'],hope:['🌟 Hope – Catch a Star','var(--hope)'],joy:['🎶 Joy – Joy Quiz Bee','var(--joy)']};
  $('lbGrid').innerHTML = Object.keys(meta).map(k=>`<div class="lb" style="border-color:${meta[k][1]}"><h3>${meta[k][0]}</h3>${
    lb[k].length ? '<ol>'+lb[k].map((e,i)=>`<li><span>${['🥇','🥈','🥉'][i]||''} ${esc(e.n)}</span><span>${e.s}</span></li>`).join('')+'</ol>' : '<p class="empty">No players yet…</p>'}</div>`).join('');
}
function resetBoard(){ if(prompt('Type RESET to clear the leaderboard:')==='RESET'){ localStorage.removeItem(LB_KEY); renderBoard(); toast('Leaderboard has been reset.'); } }

