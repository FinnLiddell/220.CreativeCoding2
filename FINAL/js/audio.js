// audio.js — Web Audio API sound effects

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, type, dur, vol = 0.18, startFreq = null) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    if (startFreq) {
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + dur);
    } else {
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
    }
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

function shootSound()      { playTone(880,  'square',   0.08, 0.12); }
function collectSound()    { playTone(1200, 'sine',     0.18, 0.15, 600); }
function explodeSound()    { playTone(80,   'sawtooth', 0.35, 0.2,  200); }
function hitSound()        { playTone(150,  'sawtooth', 0.2,  0.18); }
function enemyShootSound() { playTone(200,  'square',   0.1,  0.08); }
function levelUpSound() {
  playTone(880,  'sine', 0.1, 0.15);
  setTimeout(() => playTone(1108, 'sine', 0.1, 0.15), 110);
  setTimeout(() => playTone(1320, 'sine', 0.2, 0.15), 220);
}
