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
  document.getElementById('hud-score').textContent = 'score: ' + score;
  document.getElementById('hud-level').textContent = 'level ' + level;
  let h = '';
  for (let i = 0; i < 3; i++) h += i < lives ? '♥ ' : '♡ ';
  document.getElementById('hud-lives').textContent = h.trim();
}

function anyKey() { return Object.values(keys).some(v => v); }

const sketch = (p) => {

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

    p.background(COL.bg);
    p.stroke('#d4c4a0'); p.strokeWeight(1);
    for (const l of bgLines) p.line(0, l, W, l);
    p.stroke('#e0b8b8'); p.strokeWeight(1.5);
    p.line(38, 0, 38, H);

    if (gameState === 'start') { drawStart(p); return; }
    if (gameState === 'over')  { drawOver(p);  return; }
    if (gameState === 'win')   { drawWin(p);   return; }

    if (flashT > 0) {
      p.noStroke();
      p.fill(flashOk ? 'rgba(180,230,160,0.35)' : 'rgba(220,80,80,0.3)');
      p.rect(0, 0, W, H);
      flashT--;
    }

    guy.update(keys);

    spawnT++;
    const rate = Math.max(30, 72 - level * 9);
    if (spawnT > rate) { spawnT = 0; cups.push(new Cup()); }

    if (level < 5 && score >= levelScore(level)) {
      level++;
      window._LEVEL = level;
      sndLevel();
      flashOk = true; flashT = 22;
    }
    if (level >= 5 && score > levelScore(5)) gameState = 'win';

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

    p.stroke(COL.ink); p.strokeWeight(2.5);
    p.line(0, H - 20, W, H - 20);

    if (window.SPRITES && window.SPRITES.good) {
      p.imageMode(p.CENTER);
      p.image(window.SPRITES.good, 26, 14, 22, 22);
    }

    updateHUD();
  };

  function drawStart(p) {
    p.textAlign(p.CENTER);
    p.noStroke(); p.fill(COL.ink);
    p.textSize(46); p.textStyle(p.BOLD);
    p.text('Coffee Catcher', W / 2, H / 2 - 100);
    p.textStyle(p.NORMAL); p.textSize(19); p.fill(COL.mid);
    p.text('catch the good coffee, dodge the bad!', W / 2, H / 2 - 62);

    if (window.SPRITES && window.SPRITES.good) {
      p.imageMode(p.CENTER);
      p.image(window.SPRITES.good, W / 2, H / 2, 80, 80);
    }

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

    if (window.SPRITES && window.SPRITES.good) {
      p.imageMode(p.CENTER);
      p.image(window.SPRITES.good, W / 2, H / 2 + 30, 50, 50);
    }

    const pulse = 0.7 + Math.sin(p.frameCount * 0.07) * 0.3;
    p.fill(`rgba(60,30,10,${pulse})`); p.textSize(20);
    p.text('press any key to try again', W / 2, H / 2 + 80);
    if (anyKey()) { resetAll(); gameState = 'play'; }
  }

  function drawWin(p) {
    p.textAlign(p.CENTER);
    p.noStroke(); p.fill(COL.ink);
    p.textSize(44); p.textStyle(p.BOLD);
    p.text('fully caffeinated!', W / 2, H / 2 - 60);
    p.textStyle(p.NORMAL); p.textSize(22); p.fill(COL.mid);
    p.text('final score: ' + score, W / 2, H / 2 - 10);

    if (window.SPRITES && window.SPRITES.good) {
      p.imageMode(p.CENTER);
      p.image(window.SPRITES.good, W / 2, H / 2 + 30, 50, 50);
    }

    const pulse = 0.7 + Math.sin(p.frameCount * 0.07) * 0.3;
    p.fill(`rgba(60,30,10,${pulse})`); p.textSize(20);
    p.text('press any key to play again', W / 2, H / 2 + 80);
    if (anyKey()) { resetAll(); gameState = 'play'; }
  }

};

new p5(sketch, document.getElementById('wrap'));
