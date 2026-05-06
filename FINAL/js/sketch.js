const W = 520, H = 460;
window._GW    = W;
window._GH    = H;
window._LEVEL = 1;
window.SPRITES = {};

let score = 0, lives = 3, level = 1;
let gameState = 'start';

let guy, cups = [], particles = [];
let spawnT = 0, flashT = 0, flashOk = false;
const keys = {};
let bgLines = [];

function levelScore(l) { return l * 800; }

function reset() {
  guy = new Guy();
  cups = []; particles = [];
  spawnT = 0; flashT = 0;
}

function resetAll() {
  score = 0; lives = 3; level = 1;
  window._LEVEL = 1;
  reset();
}

function updateHUD() {
  document.getElementById('hud-score').textContent = '☕ score: ' + score;
  document.getElementById('hud-level').textContent = 'level ' + level;
  let h = '';
  for (let i = 0; i < 3; i++) h += i < lives ? '♥ ' : '♡ ';
  document.getElementById('hud-lives').textContent = h.trim();
}

function anyKey() { return Object.values(keys).some(v => v); }

const sketch = (p) => {

  // ── preload ────────────────────────────────────────────────────────────────
  // Put your two images in assets/ and name them good.png and bad.png
  p.preload = function () {
    window.SPRITES.good = p.loadImage('assets/good.png');
    window.SPRITES.bad  = p.loadImage('assets/bad.png');
  };

  p.setup = function () {
    const cv = p.createCanvas(W, H);
    cv.parent('wrap');
    p.textFont('Caveat');
    for (let i = 0; i < H; i += 22) bgLines.push(i);
    reset();
  };

  p.keyPressed  = () => { keys[p.key] = true;  keys[p.keyCode] = true;  };
  p.keyReleased = () => { keys[p.key] = false; keys[p.keyCode] = false; };

  p.draw = function () {
    // kraft paper background
    p.background(COL.bg);
    p.stroke('#d4c4a0'); p.strokeWeight(1);
    for (const l of bgLines) p.line(0, l, W, l);
    p.stroke('#e0b8b8'); p.strokeWeight(1.5);
    p.line(38, 0, 38, H);

    if (gameState === 'start') { drawStart(p); return; }
    if (gameState === 'over')  { drawOver(p);  return; }
    if (gameState === 'win')   { drawWin(p);   return; }

    // screen flash
    if (flashT > 0) {
      p.noStroke();
      p.fill(flashOk ? 'rgba(180,230,160,0.35)' : 'rgba(220,80,80,0.3)');
      p.rect(0, 0, W, H);
      flashT--;
    }

    guy.update(keys);

    // spawn
    spawnT++;
    const rate = Math.max(30, 72 - level * 9);
    if (spawnT > rate) { spawnT = 0; cups.push(new Cup()); }

    // level up
    if (level < 5 && score >= levelScore(level)) {
      level++;
      window._LEVEL = level;
      sndLevel();
      flashOk = true; flashT = 22;
    }
    if (level >= 5 && score > levelScore(5)) gameState = 'win';

    // cups + collision
    const cb = guy.catchBox();
    for (const c of cups) {
      c.update(); c.draw(p);
      if (c.alive &&
          c.y + 14 > cb.y && c.y - 14 < cb.y + cb.h &&
          c.x > cb.x && c.x < cb.x + cb.w) {
        c.alive = false;
        if (c.good) {
          score += c.points;
          sndGood();
          burst(particles, c.x, c.y, COL.cup_good, 8, '+' + c.points);
          guy.catching = 40;
          flashOk = true; flashT = 8;
        } else {
          lives--;
          sndBad();
          burst(particles, c.x, c.y, COL.cup_bad, 10, 'yuck!');
          flashOk = false; flashT = 18;
          if (lives <= 0) gameState = 'over';
        }
      }
    }
    cups = cups.filter(c => c.alive);

    // particles
    for (const pt of particles) {
      pt.update();
      if (pt.txt) {
        const alpha = Math.floor(pt.life * 255).toString(16).padStart(2, '0');
        p.noStroke();
        p.fill(COL.ink + alpha);
        p.textSize(18); p.textAlign(p.CENTER);
        p.text(pt.txt, pt.x, pt.y);
      } else {
        const alpha = Math.floor(pt.life * 220).toString(16).padStart(2, '0');
        p.noStroke();
        p.fill(pt.col + alpha);
        p.ellipse(pt.x, pt.y, pt.r * pt.life * 2, pt.r * pt.life * 2);
      }
    }
    particles = particles.filter(pt => !pt.dead());

    guy.draw(p);

    // ground line
    p.stroke(COL.ink); p.strokeWeight(2.5);
    p.line(0, H - 20, W, H - 20);

    updateHUD();
  };

  // ── screens ────────────────────────────────────────────────────────────────

  function drawStart(p) {
    p.textAlign(p.CENTER);
    p.noStroke(); p.fill(COL.ink);
    p.textSize(46); p.textStyle(p.BOLD);
    p.text('☕ Coffee Catcher', W / 2, H / 2 - 100);
    p.textStyle(p.NORMAL); p.textSize(19); p.fill(COL.mid);
    p.text('catch the good coffee, dodge the bad!', W / 2, H / 2 - 62);

    // demo stick guy
    p.push(); p.translate(W / 2, H / 2);
    p.stroke(COL.ink); p.strokeWeight(2.5); p.noFill();
    p.line(-22, 0, 22, 0);
    p.line(0, 0, 0, -22);
    p.line(0, -14, -22, -6);
    p.line(0, -14,  22, -6);
    p.line(0, 0, -8, 14);
    p.line(0, 0,  8, 14);
    p.fill(COL.cream); p.ellipse(0, -30, 18, 18);
    p.pop();

    p.textSize(15); p.fill(COL.mid); p.noStroke();
    p.text('faster cups = more points!', W / 2, H / 2 + 58);

    const pulse = 0.7 + Math.sin(p.frameCount * 0.07) * 0.3;
    p.fill(`rgba(60,30,10,${pulse})`); p.textSize(21);
    p.text('press any key to start', W / 2, H / 2 + 100);

    if (anyKey()) { resetAll(); gameState = 'play'; }
  }

  function drawOver(p) {
    p.textAlign(p.CENTER);
    p.noStroke(); p.fill(COL.ink);
    p.textSize(44); p.textStyle(p.BOLD);
    p.text('out of coffee :(', W / 2, H / 2 - 60);
    p.textStyle(p.NORMAL); p.textSize(22); p.fill(COL.mid);
    p.text('final score: ' + score, W / 2, H / 2 - 10);
    const pulse = 0.7 + Math.sin(p.frameCount * 0.07) * 0.3;
    p.fill(`rgba(60,30,10,${pulse})`); p.textSize(20);
    p.text('press any key to try again', W / 2, H / 2 + 50);
    if (anyKey
