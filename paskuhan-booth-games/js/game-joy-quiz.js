/* ---------- JOY: quiz (no repeats until all questions are used) ---------- */
const QUSED_KEY='paskuhan_quiz_used_v1';
function drawQuestions(n){
  let used=store.get(QUSED_KEY,[]).filter(i=>i<QUIZ.length);
  let pool=shuffle([...QUIZ.keys()].filter(i=>!used.includes(i)));
  if(pool.length<n){ const fresh=shuffle([...QUIZ.keys()].filter(i=>!pool.includes(i))); pool=pool.concat(fresh); used=[]; }
  const pick=pool.slice(0,n); store.set(QUSED_KEY,used.concat(pick)); return pick.map(i=>QUIZ[i]);
}
let qz={};
function quizStart(){ qz={list:drawQuestions(CONFIG.quizQuestions),i:0,score:0}; $('qScore').textContent=0; quizShow(); }
function quizShow(){
  clearTimers();
  const [q,ans,fact]=qz.list[qz.i]; const correct=ans[0];
  $('qNum').textContent=`Question ${qz.i+1} of ${qz.list.length}`; $('qText').textContent=q; $('qFact').textContent='';
  $('qChoices').innerHTML=''; shuffle(ans).forEach(a=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=a; b.onclick=()=>quizAnswer(b,a===correct,correct,fact); $('qChoices').appendChild(b); });
  qz.t0=performance.now(); const total=CONFIG.quizSeconds*1000; $('qTimer').style.width='100%'; let lastSec=CONFIG.quizSeconds;
  timers.push(setInterval(()=>{ const left=Math.max(0,total-(performance.now()-qz.t0)); $('qTimer').style.width=(left/total*100)+'%';
    const s=Math.ceil(left/1000); if(s!==lastSec){ lastSec=s; if(s<=3&&s>0) Sound.sfx('tick'); }
    if(left<=0) quizAnswer(null,false,correct,fact); },50));
}
function quizAnswer(btn,ok,correct,fact){
  clearTimers();
  const left=Math.max(0,CONFIG.quizSeconds-(performance.now()-qz.t0)/1000);
  document.querySelectorAll('.choice').forEach(b=>{ b.disabled=true; if(b.textContent===correct) b.classList.add('right'); });
  if(ok){ const pts=100+Math.round(left*10); qz.score+=pts; $('qScore').textContent=qz.score; Sound.sfx('correct'); $('qFact').textContent=`Correct! +${pts} · ${fact}`; }
  else { if(btn) btn.classList.add('wrong'); Sound.sfx('incorrect'); $('qFact').textContent=(btn?'❌ Wrong! ':'⏰ Time\'s up! ')+fact; }
  timers.push(setTimeout(()=>{ qz.i++; if(qz.i<qz.list.length) quizShow(); else finish('joy',qz.score); },2400));
}

