/* ---------- SOUND: Web Audio synth (no files needed) ---------- */
const Sound = (() => {
  let ctx, master, sfxBus, musicBus, timer=null, loopStart=0, ei=0;
  let musicOn = store.get('pk_music',true), sfxOn = store.get('pk_sfx',true);
  const BEAT=.24, F={C3:130.81,F3:174.61,G3:196,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880,C6:1046.5};
  // Jingle Bells chorus
  const L1='E5 1,E5 1,E5 2,E5 1,E5 1,E5 2,E5 1,G5 1,C5 1.5,D5 .5,E5 4';
  const MEL=(L1+',F5 1,F5 1,F5 1.5,F5 .5,F5 1,E5 1,E5 1,E5 .5,E5 .5,E5 1,D5 1,D5 1,E5 1,D5 2,G5 2,'+L1+',F5 1,F5 1,F5 1.5,F5 .5,F5 1,E5 1,E5 1,E5 .5,E5 .5,G5 1,G5 1,F5 1,D5 1,C5 4').split(',');
  const BASS='C3 C3 C3 C3 F3 C3 G3 G3 C3 C3 C3 C3 F3 C3 G3 C3'.split(' ');
  const EV=[]; let t=0; MEL.forEach(n=>{ const [k,d]=n.trim().split(' '); EV.push({t,f:F[k],d:+d}); t+=+d; });
  const LOOP=t+4; BASS.forEach((k,i)=>{ EV.push({t:i*4,f:F[k],d:2,b:1}); EV.push({t:i*4+2,f:F[k]*1.5,d:2,b:1}); });
  EV.sort((a,b)=>a.t-b.t);
  function init(){
    if(!ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
      ctx=new AC(); master=ctx.createGain(); master.gain.value=1; master.connect(ctx.destination);
      sfxBus=ctx.createGain(); sfxBus.gain.value=.7; sfxBus.connect(master);
      musicBus=ctx.createGain(); musicBus.gain.value=.28; musicBus.connect(master); }
    if(ctx.state==='suspended') ctx.resume();
    return true;
  }
  function tone(f,at,dur,type='triangle',vol=.5,out=sfxBus,slide=0){
    const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f,at);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),at+dur);
    g.gain.setValueAtTime(0.0001,at); g.gain.exponentialRampToValueAtTime(vol,at+.01); g.gain.exponentialRampToValueAtTime(.0001,at+dur);
    o.connect(g).connect(out); o.start(at); o.stop(at+dur+.05);
  }
  function bell(f,at,dur,out=sfxBus,vol=.5){ tone(f,at,dur,'triangle',vol,out); tone(f*2,at,dur*.6,'sine',vol*.3,out); tone(f*3,at,dur*.3,'sine',vol*.12,out); }
  const FX={
    click:n=>tone(900,n,.06,'square',.12),
    flip:n=>tone(700,n,.08,'triangle',.35,sfxBus,1.4),
    match:n=>[F.C5,F.E5,F.G5,F.C6].forEach((f,i)=>bell(f,n+i*.07,.35)),
    wrong:n=>{ tone(220,n,.25,'sawtooth',.18,sfxBus,.6); },
    catch:n=>bell(F.A5,n,.25,sfxBus,.45),
    big:n=>{ bell(F.E5,n,.2); bell(F.A5,n+.08,.3); bell(F.C6,n+.16,.4); },
    hit:n=>{ tone(160,n,.35,'sawtooth',.35,sfxBus,.4); tone(90,n,.4,'square',.2,sfxBus,.5); },
    tick:n=>tone(1200,n,.03,'square',.12),
    correct:n=>{ bell(F.G5,n,.25); bell(F.C6,n+.1,.45); },
    incorrect:n=>{ tone(300,n,.18,'square',.2); tone(200,n+.18,.3,'square',.2); },
    win:n=>[F.C5,F.E5,F.G5,F.C6,F.G5,F.C6].forEach((f,i)=>bell(f,n+i*.12,i===5?.9:.3,sfxBus,.55)),
    start:n=>[F.G4,F.C5,F.E5].forEach((f,i)=>bell(f,n+i*.08,.3)),
    hang:n=>{ tone(400,n,.4,'sine',.3,sfxBus,2.5); [F.E5,F.G5,F.C6].forEach((f,i)=>bell(f,n+.35+i*.1,.5)); },
  };
  function sfx(name){ if(!sfxOn||!init()) return; FX[name]?.(ctx.currentTime+.01); }
  function sched(){
    const ahead=ctx.currentTime+.5;
    for(;;){ if(ei>=EV.length){ ei=0; loopStart+=LOOP*BEAT; }
      const e=EV[ei], at=loopStart+e.t*BEAT; if(at>ahead) break;
      if(at>=ctx.currentTime-.02){ if(e.b) tone(e.f,at,e.d*BEAT*.9,'sine',.55,musicBus); else bell(e.f,at,Math.max(.3,e.d*BEAT*1.3),musicBus,.5); }
      ei++; }
  }
  function startMusic(){ if(!musicOn||timer||!init()) return; loopStart=ctx.currentTime+.15; ei=0; timer=setInterval(sched,100); }
  function stopMusic(){ clearInterval(timer); timer=null; }
  function setMusic(v){ musicOn=v; store.set('pk_music',v); v?startMusic():stopMusic(); ui(); }
  function setSfx(v){ sfxOn=v; store.set('pk_sfx',v); ui(); }
  function ui(){ $('musicBtn').style.opacity=musicOn?1:.4; $('sfxBtn').textContent=sfxOn?'🔊':'🔇'; }
  // Browsers only allow audio after the first click/tap/key press
  const unlock=()=>{ init(); startMusic(); };
  ['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,unlock,{passive:true}));
  return { sfx, setMusic, setSfx, ui, get music(){return musicOn}, get on(){return sfxOn} };
})();
Sound.ui();
$('musicBtn').onclick = () => Sound.setMusic(!Sound.music);
$('sfxBtn').onclick = () => Sound.setSfx(!Sound.on);

