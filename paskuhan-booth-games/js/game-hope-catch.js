/* ---------- HOPE: catch the stars ---------- */
const EMOJI_FONT='"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif';
const ITEMS=[{e:'⭐',p:10,w:55},{e:'🌟',p:30,w:10},{e:'❤️',p:20,w:15},{e:'⛈️',p:0,bad:true,w:20}];
let cat={running:false}, catRAF=0, keys={};
const cv=$('catchCanvas'), ctx=cv.getContext('2d');
function catchResize(){ const r=cv.getBoundingClientRect(), d=devicePixelRatio||1; cv.width=r.width*d; cv.height=r.height*d; ctx.setTransform(d,0,0,d,0,0); cat.W=r.width; cat.H=r.height; }
function catchReady(){ $('catchOverlay').style.display='flex'; catchResize(); cat={running:false,W:cat.W,H:cat.H}; $('catScore').textContent=0; $('catLives').textContent=3; $('catTime').textContent=CONFIG.catchSeconds; ctx.clearRect(0,0,cat.W,cat.H); }
function catchBegin(){
  $('catchOverlay').style.display='none'; catchResize(); Sound.sfx('start');
  Object.assign(cat,{running:true,x:cat.W/2,items:[],pops:[],score:0,lives:3,time:CONFIG.catchSeconds,spawn:0,last:performance.now(),elapsed:0,inv:0});
  timers.push(setInterval(()=>{ cat.time--; $('catTime').textContent=cat.time; if(cat.time<=5) Sound.sfx('tick'); if(cat.time<=0) finish('hope',cat.score); },1000));
  catRAF=requestAnimationFrame(catchLoop);
}
function catchStop(){ cat.running=false; cancelAnimationFrame(catRAF); }
function pickItem(){ const tot=ITEMS.reduce((s,i)=>s+i.w,0); let r=Math.random()*tot; for(const it of ITEMS){ if((r-=it.w)<0) return it; } return ITEMS[0]; }
function catchLoop(now){
  if(!cat.running) return;
  const dt=Math.min(.05,(now-cat.last)/1000); cat.last=now; cat.elapsed+=dt;
  const W=cat.W,H=cat.H, size=Math.max(30,Math.min(52,W/16)), bw=size*2.2;
  if(keys.ArrowLeft||keys.a) cat.x-=600*dt; if(keys.ArrowRight||keys.d) cat.x+=600*dt;
  cat.x=Math.max(bw/2,Math.min(W-bw/2,cat.x));
  const diff=1+cat.elapsed/25;
  cat.spawn-=dt; if(cat.spawn<=0){ cat.spawn=.75/diff; const it=pickItem(); cat.items.push({...it,x:size/2+Math.random()*(W-size),y:-size,v:(140+Math.random()*120)*diff}); }
  ctx.clearRect(0,0,W,H);
  const glow=Math.min(1,cat.score/400);
  ctx.save(); ctx.globalAlpha=.25+glow*.75; ctx.shadowColor='#ffd54f'; ctx.shadowBlur=10+glow*50; ctx.font=`${size*1.6}px ${EMOJI_FONT}`; ctx.textAlign='center'; ctx.fillText('🌟',W-size*1.2,size*1.8); ctx.restore();
  ctx.fillStyle='#fff'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center'; ctx.fillText(`Light of Hope ${Math.round(glow*100)}%`,W-size*1.4,size*2.6);
  const py=H-size*.9; cat.inv=Math.max(0,cat.inv-dt);
  ctx.globalAlpha = cat.inv>0 && Math.floor(cat.inv*10)%2 ? .35 : 1;
  ctx.font=`${size*1.5}px ${EMOJI_FONT}`; ctx.textBaseline='middle'; ctx.fillText('🧺',cat.x,py); ctx.globalAlpha=1;
  ctx.font=`${size}px ${EMOJI_FONT}`;
  for(let i=cat.items.length-1;i>=0;i--){
    const it=cat.items[i]; it.y+=it.v*dt; ctx.fillText(it.e,it.x,it.y);
    if(it.y>py-size*.7 && it.y<py+size*.3 && Math.abs(it.x-cat.x)<bw/2){
      cat.items.splice(i,1);
      if(it.bad){ if(cat.inv<=0){ cat.lives--; cat.inv=1.2; $('catLives').textContent=cat.lives; Sound.sfx('hit'); cat.pops.push({x:it.x,y:it.y,t:'-1 ❤️',a:1,c:'#ff5252'}); if(cat.lives<=0){ finish('hope',cat.score); return; } } }
      else { cat.score+=it.p; $('catScore').textContent=cat.score; Sound.sfx(it.p>=30?'big':'catch'); cat.pops.push({x:it.x,y:it.y,t:'+'+it.p,a:1,c:'#ffe082'}); }
    } else if(it.y>H+size) cat.items.splice(i,1);
  }
  ctx.font='bold 22px sans-serif';
  for(let i=cat.pops.length-1;i>=0;i--){ const p=cat.pops[i]; p.y-=60*dt; p.a-=dt*1.5; if(p.a<=0){cat.pops.splice(i,1);continue;} ctx.globalAlpha=p.a; ctx.fillStyle=p.c; ctx.fillText(p.t,p.x,p.y); }
  ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
  catRAF=requestAnimationFrame(catchLoop);
}
function catchPointer(e){ if(!cat.running) return; const r=cv.getBoundingClientRect(); cat.x=(e.touches?e.touches[0].clientX:e.clientX)-r.left; if(e.cancelable) e.preventDefault(); }
cv.addEventListener('pointermove',catchPointer); cv.addEventListener('touchmove',catchPointer,{passive:false});
addEventListener('keydown',e=>{ keys[e.key]=true; if(current==='hope'&&e.key.startsWith('Arrow')) e.preventDefault(); });
addEventListener('keyup',e=>keys[e.key]=false);
addEventListener('resize',()=>{ if(current==='hope') catchResize(); if(current==='wheel') drawWheel(); });

