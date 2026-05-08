let _actx = null;

function getAudio() {

  if (!_actx) {
    _actx = new (window.AudioContext || window.webkitAudioContext)();
  }

  return _actx;
}

function tone(freq, type, dur, vol = 0.15, startFreq = null) {

  try {

    const ctx = getAudio();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;

    if (startFreq) {

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);

      osc.frequency.exponentialRampToValueAtTime(
        freq,
        ctx.currentTime + dur
      );

    } else {

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + dur
    );

    osc.start();
    osc.stop(ctx.currentTime + dur);

  } catch (e) {}
}

function sndGood() {
  tone(600, 'sine', 0.2, 0.15, 300);
}

function sndBad() {
  tone(120, 'sawtooth', 0.3, 0.2, 220);
}

function sndLevel() {

  tone(660, 'sine', 0.1, 0.12);

  setTimeout(() => {
    tone(880, 'sine', 0.15, 0.12);
  }, 120);
}
