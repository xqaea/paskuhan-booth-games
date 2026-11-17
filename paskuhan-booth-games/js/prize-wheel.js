/* ---------- Prize wheel ---------- */
let wheelRot=0, spinning=false;
const WCOL=['#c62828','#2e7d32','#f9a825','#1565c0','#ad1457','#00838f','#ef6c00','#6a1b9a'];
function drawWheel(){
  const c=$('wheelCanvas'), r=c.getBoundingClientRect(), d=devicePixelRatio||1; if(!r.width) return;
  c.width=r.width*d; c.height=r.height*d; const x=c.getContext('2d'); x.setTransform(d,0,0,d,0,0);
  const R=r.width/2, n=CONFIG.prizes.length, seg=Math.PI*2/n;
  x.translate(R,R);
  for(let i=0;i<n;i++){ const a=wheelRot+i*seg;
    x.beginPath(); x.moveTo(0,0); x.arc(0,0,R-6,a,a+seg); x.closePath(); x.fillStyle=WCOL[i%WCOL.length]; x.fill(); x.strokeStyle='#fff'; x.lineWidth=3; x.stroke();
    x.save(); x.rotate(a+seg/2); x.fillStyle='#fff'; x.font=`bold ${Math.max(12,R/11)}px sans-serif`; x.textAlign='right'; x.textBaseline='middle'; x.fillText(CONFIG.prizes[i],R-20,0); x.restore(); }
  x.beginPath(); x.arc(0,0,R-4,0,7); x.strokeStyle='#ffc107'; x.lineWidth=8; x.stroke();
  x.beginPath(); x.arc(0,0,R*.13,0,7); x.fillStyle='#ffc107'; x.fill(); x.font=`${R*.14}px ${EMOJI_FONT}`; x.textAlign='center'; x.textBaseline='middle'; x.fillText('🎄',0,2);
}
function spin(){
  if(spinning) return; spinning=true; $('spinBtn').disabled=true; $('prize').textContent='';
  const start=wheelRot, delta=Math.PI*2*(5+Math.random()*3)+Math.random()*Math.PI*2, dur=5000, t0=performance.now(); let lastSeg=-1;
  const n=CONFIG.prizes.length, seg=Math.PI*2/n;
  const idxAt = rot => Math.floor((((-Math.PI/2-rot)%(Math.PI*2))+Math.PI*2)%(Math.PI*2)/seg);
  (function step(now){ const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,4); wheelRot=start+delta*e; drawWheel();
    const s=idxAt(wheelRot); if(s!==lastSeg){ lastSeg=s; Sound.sfx('tick'); }
    if(p<1) requestAnimationFrame(step); else { spinning=false; $('spinBtn').disabled=false; const prize=CONFIG.prizes[idxAt(wheelRot)]; $('prize').textContent='🎉 '+prize+' 🎉'; Sound.sfx(prize.includes('Try Again')?'incorrect':'win'); } })(t0);
}

