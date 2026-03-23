// === NAV SCROLL ===
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// === SCROLL REVEAL ===
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// === HERO PARALLAX ===
let tick = false;
window.addEventListener('scroll', () => {
  if (!tick) {
    requestAnimationFrame(() => {
      const s = window.scrollY;
      const bg = document.getElementById('heroBgImg');
      if (bg && s < window.innerHeight * 1.2) {
        bg.style.transform = 'scale(1.1) translateY(' + (s * 0.25) + 'px)';
      }
      tick = false;
    });
    tick = true;
  }
});

// === REACH COUNTER ANIMATION ===
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (!target) return;
    let cur = 0;
    const step = target / 50;
    const isInt = Number.isInteger(target);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = (isInt ? Math.round(cur) : cur.toFixed(1)) + suffix;
    }, 25);
    cObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.reach-num[data-target]').forEach(el => cObs.observe(el));

// === AMBIENT AUDIO (Web Audio API — synthesized warm room tone) ===
let audioCtx = null;
let audioPlaying = false;
let audioNodes = [];

function createAmbient() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const master = audioCtx.createGain();
  master.gain.value = 0;
  master.connect(audioCtx.destination);

  // warm low drone
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 55;
  const g1 = audioCtx.createGain();
  g1.gain.value = 0.08;
  osc1.connect(g1).connect(master);
  osc1.start();

  // subtle mid hum
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 110;
  const g2 = audioCtx.createGain();
  g2.gain.value = 0.03;
  osc2.connect(g2).connect(master);
  osc2.start();

  // filtered noise for air/room tone
  const bufSize = audioCtx.sampleRate * 2;
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 200;
  lpf.Q.value = 0.7;
  const gn = audioCtx.createGain();
  gn.gain.value = 0.04;
  noise.connect(lpf).connect(gn).connect(master);
  noise.start();

  audioNodes = { master, osc1, osc2, noise };
  return master;
}

document.getElementById('soundToggle').addEventListener('click', () => {
  if (!audioCtx) createAmbient();
  const bars = document.getElementById('audioBars');
  if (!audioPlaying) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioNodes.master.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);
    bars.classList.add('playing');
    audioPlaying = true;
  } else {
    audioNodes.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    bars.classList.remove('playing');
    audioPlaying = false;
  }
});