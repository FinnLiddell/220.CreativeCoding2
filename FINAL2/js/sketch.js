const W = 520;
const H = 460;

window._GW = W;
window._GH = H;
window._LEVEL = 1;

let score;
let lives;
let level;
let gameState;

let guy;
let cups;
let particles;

let spawnT;
let flashT;
let flashOk;

let bgLines = [];

let keys = {};

let imgGood;
let imgBad;

function preload() {

  imgGood = loadImage('assets/good.png');
  imgBad = loadImage('assets/bad.png');

  window.SPRITES = {
    good: imgGood,
    bad: imgBad
  };
}

function setup() {

  let cv = createCanvas(W, H);

  cv.parent('wrap');

  textFont('Caveat');

  for (let i = 0; i < H; i += 22) {
    bgLines.push(i);
  }

  resetAll();
}

function keyPressed() {

  keys[key] = true;
  keys[keyCode] = true;
}

function keyReleased() {

  keys[key] = false;
  keys[keyCode] = false;
}

function draw() {

  background(COL.bg);

  stroke('#d4c4a0');
  strokeWeight(1);

  for (let l of bgLines) {
    line(0, l, W, l);
  }

  stroke('#e0b8b8');
  strokeWeight(1.5);

  line(38, 0, 38, H);

  if (gameState === 'start') {
    drawStart();
    return;
  }

  if (gameState === 'over') {
    drawOver();
    return;
  }

  if (gameState === 'win') {
    drawWin();
    return;
  }

  if (flashT > 0) {

    noStroke();

    fill(
      flashOk
        ? 'rgba(180,230,160,0.35)'
        : 'rgba(220,80,80,0.3)'
    );

    rect(0, 0, W, H);

    flashT--;
  }

  window._LEVEL = level;

  guy.update(keys);
  guy.draw(this);

  spawnT++;

  let rate = max(30, 72 - level * 9);

  if (spawnT > rate) {

    spawnT = 0;

    cups.push(new Cup());
  }

  if (level < 5 && score >= levelScore(level)) {

    level++;

    sndLevel();

    flashOk = true;
    flashT = 22;
  }

  if (level >= 5 && score > levelScore(5)) {
    gameState = 'win';
  }

  let cb = guy.catchBox();

  for (let c of cups) {

    c.update();
    c.draw(this);

    if (
      c.alive &&
      c.y + 14 > cb.y &&
      c.y - 14 < cb.y + cb.h &&
      c.x > cb.x &&
      c.x < cb.x + cb.w
    ) {

      c.alive = false;

      if (c.good) {

        score += c.points;

        sndGood();

        burst(
          particles,
          c.x,
          c.y,
          COL.cup_good,
          8,
          '+' + c.points
        );

        guy.catching = 40;

        flashOk = true;
        flashT = 8;

      } else {

        lives--;

        sndBad();

        burst(
          particles,
          c.x,
          c.y,
          COL.cup_bad,
          10,
          'yuck!'
        );

        flashOk = false;
        flashT = 18;

        if (lives <= 0) {
          gameState = 'over';
        }
      }
    }
  }

  cups = cups.filter(c => c.alive);

  for (let pt of particles) {

    pt.update();

    if (pt.txt) {

      let a = floor(pt.life * 255)
        .toString(16)
        .padStart(2, '0');

      noStroke();

      fill(COL.ink + a);

      textSize(18);

      textAlign(CENTER);

      text(pt.txt, pt.x, pt.y);

    } else {

      let a = floor(pt.life * 220)
        .toString(16)
        .padStart(2, '0');

      noStroke();

      fill(pt.col + a);

      ellipse(
        pt.x,
        pt.y,
        pt.r * pt.life * 2,
        pt.r * pt.life * 2
      );
    }
  }

  particles = particles.filter(pt => !pt.dead());

  stroke(COL.ink);
  strokeWeight(2.5);

  line(0, H - 20, W, H - 20);

  updateHUD();
}

function drawStart() {

  textAlign(CENTER);

  noStroke();

  fill(COL.ink);

  textSize(46);

  textStyle(BOLD);

  text('Coffee Catcher', W / 2, H / 2 - 100);

  textStyle(NORMAL);

  textSize(19);

  fill(COL.mid);

  text(
    'catch the good coffee, dodge the bad!',
    W / 2,
    H / 2 - 62
  );

  imageMode(CENTER);

  image(imgGood, W / 2, H / 2, 80, 80);

  textSize(15);

  text(
    'faster cups = more points!',
    W / 2,
    H / 2 + 58
  );

  let pulse = 0.7 + sin(frameCount * 0.07) * 0.3;

  fill(`rgba(60,30,10,${pulse})`);

  textSize(21);

  text(
    'press any key to start',
    W / 2,
    H / 2 + 100
  );

  if (anyKey()) {

    resetAll();

    gameState = 'play';
  }
}

function drawOver() {

  textAlign(CENTER);

  noStroke();

  fill(COL.ink);

  textSize(44);

  textStyle(BOLD);

  text('out of coffee :(', W / 2, H / 2 - 60);

  textStyle(NORMAL);

  textSize(22);

  fill(COL.mid);

  text(
    'final score: ' + score,
    W / 2,
    H / 2 - 10
  );

  imageMode(CENTER);

  image(imgGood, W / 2, H / 2 + 30, 50, 50);

  let pulse = 0.7 + sin(frameCount * 0.07) * 0.3;

  fill(`rgba(60,30,10,${pulse})`);

  textSize(20);

  text(
    'press any key to try again',
    W / 2,
    H / 2 + 80
  );

  if (anyKey()) {

    resetAll();

    gameState = 'play';
  }
}

function drawWin() {

  textAlign(CENTER);

  noStroke();

  fill(COL.ink);

  textSize(44);

  textStyle(BOLD);

  text('fully caffeinated!', W / 2, H / 2 - 60);

  textStyle(NORMAL);

  textSize(22);

  fill(COL.mid);

  text(
    'final score: ' + score,
    W / 2,
    H / 2 - 10
  );

  imageMode(CENTER);

  image(imgGood, W / 2, H / 2 + 30, 50, 50);

  let pulse = 0.7 + sin(frameCount * 0.07) * 0.3;

  fill(`rgba(60,30,10,${pulse})`);

  textSize(20);

  text(
    'press any key to play again',
    W / 2,
    H / 2 + 80
  );

  if (anyKey()) {

    resetAll();

    gameState = 'play';
  }
}

function levelScore(l) {
  return l * 800;
}

function anyKey() {
  return Object.values(keys).some(v => v);
}

function updateHUD() {

  document.getElementById('hud-score').textContent =
    'score: ' + score;

  document.getElementById('hud-level').textContent =
    'level ' + level;

  let h = '';

  for (let i = 0; i < 3; i++) {
    h += i < lives ? '♥ ' : '♡ ';
  }

  document.getElementById('hud-lives').textContent =
    h.trim();
}

function reset() {

  guy = new Guy();

  cups = [];

  particles = [];

  spawnT = 0;

  flashT = 0;

  flashOk = false;
}

function resetAll() {

  score = 0;

  lives = 3;

  level = 1;

  gameState = 'start';

  reset();
}
