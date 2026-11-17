/* ---------- decorations ---------- */
(()=>{ const c=['#ff5252','#ffd740','#69f0ae','#40c4ff','#ff80ab']; let h='';
  for(let i=0;i<40;i++) h+=`<span style="color:${c[i%5]};background:${c[i%5]};animation-delay:${(i%5)*.25}s"></span>`; $('lights').innerHTML=h; })();
(()=>{ const cv=$('snow'), cx=cv.getContext('2d'); let fl=[];
  function rs(){ cv.width=innerWidth; cv.height=innerHeight; fl=Array.from({length:Math.min(120,innerWidth/10)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*2.5+1,s:Math.random()*.8+.3,w:Math.random()*Math.PI*2})); }
  addEventListener('resize',rs); rs();
  (function loop(){ cx.clearRect(0,0,cv.width,cv.height); cx.fillStyle='rgba(255,255,255,.8)';
    for(const f of fl){ f.y+=f.s; f.w+=.02; f.x+=Math.sin(f.w)*.4; if(f.y>cv.height){f.y=-5;f.x=Math.random()*cv.width;}
      cx.beginPath(); cx.arc(f.x,f.y,f.r,0,7); cx.fill(); }
    requestAnimationFrame(loop); })();
})();

/* ---------- start / result ---------- */
function startGame(g){
  player = $('playerName').value.trim();
  if(!player){ toast('Please type your name first! ✍️'); $('playerName').focus(); go('home'); return; }
  go(g); Sound.sfx('start');
  if(g==='love') memStart(); else if(g==='hope') catchReady(); else quizStart();
}
function finish(game,score){
  clearTimers(); Sound.sfx('win');
  const rank = saveScore(game,score);
  go('result');
  $('resTitle').textContent = GAME_INFO[game].name + ' – Finished! 🎉';
  $('resName').textContent = player;
  $('resScore').textContent = score;
  $('resRank').innerHTML = rank ? `🏆 You are rank <b>#${rank}</b> on the leaderboard!` : 'Play again to make it to the Top 10!';
  $('resMsg').textContent = GAME_INFO[game].msg;
  const ok = score >= CONFIG.spinThreshold[game];
  $('resBtns').innerHTML = (ok ? `<button class="btn" onclick="go('wheel')">🎡 Spin the Prize Wheel!</button>` :
     `<div class="sub" style="width:100%">You need ${CONFIG.spinThreshold[game]} points to spin the Prize Wheel. So close! 💪</div>`) +
     `<button class="btn sec" onclick="startGame('${game}')">Play Again</button><button class="btn sec" onclick="go('tree')">🎄 Hang a Wish</button><button class="btn sec" onclick="go('home')">Home</button>`;
}

