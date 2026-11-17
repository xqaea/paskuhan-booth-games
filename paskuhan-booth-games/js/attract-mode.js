/* ---------- ATTRACT MODE (shown when the screen is idle) ---------- */
let idleT=null, attIv=null, attI=0, attOn=false;
const ATT_TREE_SVG = TREE_SVG.replace(/\btg\b/g,'atg').replace(/\bsg\b/g,'asg');
function treeSlide(){
  const all=treeList(), list=all.slice(-SLOTS.length), total=all.length;
  const orns=list.map((o,i)=>`<div class="orn ring-${o.v}" style="left:${SLOTS[i].x}%;top:${SLOTS[i].y}%">${ornHTML(o.d)}</div>`).join('');
  return `<div class="att-h att-h-sm">🎄 Christmas Tree of Wishes</div><div class="att-tree">${ATT_TREE_SVG}${orns}</div><div class="att-p">${total?`✨ ${total} wish${total>1?'es':''} hanging on our tree! Hang yours too! 🎁`:'Be the first to hang an ornament on our tree! 🎁'}</div>`;
}
function attractSlides(){
  const lb=loadLB(), wishes=shuffle(treeList()).slice(0,3), T=CONFIG.spinThreshold;
  const games=[
    ['💞','LOVE','var(--love)','Heart of Christmas',`Match the Christmas pairs in ${CONFIG.memorySeconds} seconds!`,T.love],
    ['🌟','HOPE','var(--hope)','Catch a Star',`Catch the falling stars and light up the parol. Dodge the storms! ⛈️`,T.hope],
    ['🎶','JOY','var(--joy)','Joy Quiz Bee',`${CONFIG.quizQuestions} Christmas trivia questions. Answer fast for bonus points!`,T.joy],
  ].map(g=>`<span class="att-tag" style="background:${g[2]}">${g[1]}</span><div class="att-big">${g[0]}</div><div class="att-h">${g[3]}</div><div class="att-p">${g[4]}<br><b style="color:#ffe082">Score ${g[5]}+ to spin the Prize Wheel! 🎡</b></div>`);
  const wish=o=>`<div class="att-orn">${ornHTML(o.d)}</div><div class="att-wish">“${esc(o.m)}”<b>– ${esc(o.n)} <span class="vt" style="background:${VAL_COLOR[o.v]};color:#fff;padding:2px 10px;border-radius:99px;font-size:.7em">${VAL_NAME[o.v]}</span></b></div><div class="att-p">🎄 Hang your own wish on our Christmas Tree!</div>`;
  const meta={love:['💞 Love','var(--love)'],hope:['🌟 Hope','var(--hope)'],joy:['🎶 Joy','var(--joy)']};
  const hasLB=Object.keys(meta).some(k=>lb[k].length);
  const s=[
    `<div class="att-big">🎄</div><div class="att-h">Paskuhan Booth Games</div><div class="att-p">One PHINMA: <b style="color:#ff80ab">Love</b>, <b style="color:#ffd54f">Hope</b> &amp; <b style="color:#69f0ae">Joy</b><br>Play, win prizes, and share the Christmas spirit! 🎁</div>`,
    games[0], games[1], games[2],
    treeSlide(),
  ];
  if(wishes[0]) s.push(wish(wishes[0]));
  s.push(hasLB
    ? `<div class="att-h">🏆 Top Players</div><div class="att-lb">${Object.keys(meta).map(k=>`<div style="border-color:${meta[k][1]}"><b>${meta[k][0]}</b>${lb[k].length?'<ol>'+lb[k].slice(0,3).map((e,i)=>`<li><span>${['🥇','🥈','🥉'][i]} ${esc(e.n)}</span><span>${e.s}</span></li>`).join('')+'</ol>':'<p style="opacity:.6;margin-top:8px">Be the first!</p>'}</div>`).join('')}</div><div class="att-p">Can you beat them? 💪</div>`
    : `<div class="att-big">🏆</div><div class="att-h">The Leaderboard is Empty!</div><div class="att-p">Be the first name on the board. 💪</div>`);
  if(wishes[1]) s.push(wish(wishes[1]));
  s.push(`<div class="att-big">🎡</div><div class="att-h">Win Prizes!</div><div class="att-prizes">${[...new Set(CONFIG.prizes.filter(p=>!/try again/i.test(p)))].map(p=>`<span>${esc(p)}</span>`).join('')}</div><div class="att-p">Reach the target score to spin the Prize Wheel.</div>`);
  if(wishes[2]) s.push(wish(wishes[2]));
  return s;
}
function showAttract(){
  if(attOn) return;
  const playing=['love','hope','joy'].includes(current)&&(timers.length||cat.running);
  if(playing||document.body.classList.contains('display')) return resetIdle();
  attOn=true; clearTimers(); $('ornModal').classList.remove('show'); document.activeElement?.blur?.();
  $('playerName').value=''; player='';
  const slides=attractSlides(); attI=-1;
  $('attDots').innerHTML=slides.map(()=>'<i></i>').join('');
  const next=()=>{ attI=(attI+1)%slides.length; const el=$('attSlide'); el.classList.remove('in'); void el.offsetWidth; el.innerHTML=slides[attI]; el.classList.add('in'); [...$('attDots').children].forEach((d,i)=>d.classList.toggle('on',i===attI)); };
  next(); attIv=setInterval(next,CONFIG.attractSlideSeconds*1000);
  $('attract').classList.add('show');
}
function hideAttract(){ if(!attOn) return; attOn=false; clearInterval(attIv); $('attract').classList.remove('show'); go('home'); Sound.sfx('start'); resetIdle(); }
function resetIdle(){ clearTimeout(idleT); if(CONFIG.idleSeconds>0) idleT=setTimeout(showAttract,CONFIG.idleSeconds*1000); }
['pointerdown','pointermove','keydown','touchstart','wheel','input'].forEach(ev=>addEventListener(ev,()=>{ if(!attOn) resetIdle(); },{passive:true,capture:true}));
$('attract').addEventListener('click',e=>{ e.stopPropagation(); hideAttract(); });
addEventListener('keydown',()=>{ if(attOn) hideAttract(); });
$('attLights').innerHTML=$('lights').innerHTML;
resetIdle();