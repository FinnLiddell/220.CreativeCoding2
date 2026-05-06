// sketch.js — Main p5.js sketch

const W = 560;
const H = 480;
window._GAME_W = W;
window._GAME_H = H;

let score = 0, lives = 3, level = 1;
let gameState = 'start';

let ship, bullets, asteroids, crystals, enemies, particles;
let spawnTimer, crystalTimer, enemyTimer, shootCooldown;
let flashTimer = 0, flashColor = [255, 80, 80];
let bgStars = [];

const keys = {};
const LEVEL_THRESHOLDS = [0, 1200, 2400, 3800, 5400, 6000];
const MAX_LEVEL = 5;

const sketch = (p) => {

  p.setup = function () {
    const cnv = p.createCanvas(W, H);
    cnv.parent('game-wrap');
    p.textFont('monospace');
    for (let i = 0; i < 120; i++) {
      bgStars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        s:  Math.random() * 2,
        sp: 0.3 + Math.random() * 0.7,
      });
    }
    resetEntities();
  };

  p.keyPressed  = () => { keys[p.key] = true;  keys[p.keyCode] = true;  };
  p.keyReleased = () => { keys[p.key] = false; keys[p.keyCode] = false; };

  p.draw = function () {
    p.background(8, 10, 24);
    drawStars(p);

    switch (gameState) {
      case 'start': drawStart(p); return;
      case 'over':  drawOver(p);  return;
      case 'win':   drawWin(p);   return;
    }

    drawFlash(p);

    ship.update(keys);
    ship.draw(p);

    // Shooting
    if (shootCooldown > 0) shootCooldown--;
    if ((keys[' '] || keys[32]) && shootCooldown <= 0) {
      bullets.push(new Bullet(ship.x, ship.y - 16));
      shootSound();
      shootCooldown = 14;
    }

    // Spawning
    spawnTimer++;   crystalTimer++;   enemyTimer++;
    const spawnRate = Math.max(28, 60 - level * 6);
    if (spawnTimer   > spawnRate) { spawnTimer = 0;   asteroids.push(new Asteroid(level)); }
    if (crystalTimer > 90)        { crystalTimer = 0; crystals.push(new Crystal()); }
    if (enemyTimer   > 180 && level >= 2) { enemyTimer = 0; enemies.push(new Enemy(level)); }

    // Level up
    if (level < MAX_LEVEL && score >= LEVEL_THRESHOLDS[level]) {
      level++;
      levelUpSound();
      flashColor = [80, 255, 180];
      flashTimer = 20;
    }
    if (level >= MAX_LEVEL && score > LEVEL_THRESHOLDS[MAX_LEVEL]) gameState = 'win';

    // Bullets
    for (const b of bullets) { b.update(); b.draw(p); }

    // Bullet vs asteroid
    for (const b of bullets) {
      for (const a of asteroids) {
        if (!b.alive || !a.alive) continue;
        if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
          b.alive = false;
          a.hp--;
          spawnParticles(particles, a.x, a.y, 5, [180, 150, 100]);
          if (a.hp <= 0) {
            a.alive = false;
            score += Math.floor(a.r);
            explodeSound();
            spawnParticles(particles, a.x, a.y, 12, [200, 160, 100]);
          }
        }
      }
    }

    // Bullet vs enemy
    for (const b of bullets) {
      for (const e of enemies) {
        if (!b.alive || !e.alive) continue;
        if (Math.hypot(b.x - e.x, b.y - e.y) < 20) {
          b.alive = false;
          e.hp--;
          spawnParticles(particles, e.x, e.y, 5, [255, 120, 80]);
          if (e.hp <= 0) {
            e.alive = false;
            score += 200;
            explodeSound();
            spawnParticles(particles, e.x, e.y, 14, [255, 80, 80]);
          }
        }
      }
    }

    // Asteroids
    for (const a of asteroids) {
      a.update();
      a.draw(p);
      if (a.alive && ship.invincible <= 0 && ship.hits(a, a.r * 0.7)) {
        a.alive = false;
        lives--;
        hitSound();
        spawnParticles(particles, a.x, a.y, 8, [255, 80, 80]);
        ship.invincible = 120;
        flashColor = [255, 80, 80];
        flashTimer = 18;
        if (lives <= 0) gameState = 'over';
      }
    }

    // Crystals
    for (const c of crystals) {
      c.update();
      c.draw(p);
      if (c.alive && ship.hits(c, c.r)) {
        c.alive = false;
        score += c.points;
        collectSound();
        spawnParticles(particles, c.x, c.y, 8, c.type === 'big' ? [80, 255, 180] : [120, 200, 255]);
      }
    }

    // Enemies
    for (const e of enemies) {
      e.update(ship);
      e.draw(p);
      for (const b of e.bullets) {
        if (b.alive && ship.invincible <= 0 && Math.hypot(b.x - ship.x, b.y - ship.y) < 18) {
          b.alive = false;
          lives--;
          hitSound();
          ship.invincible = 120;
          flashColor = [255, 80, 80];
          flashTimer = 18;
          spawnParticles(particles, b.x, b.y, 6, [255, 80, 80]);
          if (lives <= 0) gameState = 'over';
        }
      }
    }

    // Particles
    for (const pt of particles) { pt.update(); pt.draw(p); }

    // Prune dead
    bullets   = bullets.filter(b  => b.alive);
    asteroids = asteroids.filter(a => a.alive);
    crystals  = crystals.filter(c  => c.alive);
    enemies   = enemies.filter(e   => e.alive);
    particles = particles.filter(pt => !pt.isDead());

    updateHUD();
  };

  // ── Screens ────────────────────────────────────────────────────────────────

  function drawStart(p) {
    p.textAlign(p.CENTER);
    p.fill(80, 160, 255); p.textSize(36); p.textStyle(p.BOLD);
    p.text('VOID RUNNER', W / 2, H / 2 - 80);
    p.fill(200, 230, 255); p.textSize(14); p.textStyle(p.NORMAL);
    p.text('Arrow keys / WASD  ·  Spacebar to shoot', W / 2, H / 2 - 30);
    p.text('Collect crystals  ·  Destroy asteroids  ·  Survive!', W / 2, H / 2);
    const pulse = Math.sin(p.frameCount * 0.06) * 0.3 + 0.7;
    p.fill(120, 255, 200, pulse * 255); p.textSize(18);
    p.text('PRESS ANY KEY TO START', W / 2, H / 2 + 60);
    if (anyKeyPressed()) { resetAll(); gameState = 'play'; }
  }

  function drawOver(p) {
    p.textAlign(p.CENTER);
    p.fill(255, 80, 80); p.textSize(40); p.textStyle(p.BOLD);
    p.text('GAME OVER', W / 2, H / 2 - 60);
    p.fill(200, 220, 255); p.textSize(20); p.textStyle(p.NORMAL);
    p.text('Score: ' + score, W / 2, H / 2);
    const pulse = Math.sin(p.frameCount * 0.06) * 0.3 + 0.7;
    p.fill(255, 180, 80, pulse * 255); p.textSize(16);
    p.text('PRESS ANY KEY TO RESTART', W / 2, H / 2 + 60);
    if (anyKeyPressed()) { resetAll(); gameState = 'play'; }
  }

  function drawWin(p) {
    p.textAlign(p.CENTER);
    p.fill(80, 255, 180); p.textSize(36); p.textStyle(p.BOLD);
    p.text('YOU WIN!', W / 2, H / 2 - 60);
    p.fill(200, 240, 255); p.textSize(20); p.textStyle(p.NORMAL);
    p.text('Final Score: ' + score, W / 2, H / 2);
    const pulse = Math.sin(p.frameCount * 0.06) * 0.3 + 0.7;
    p.fill(120, 200, 255, pulse * 255); p.textSize(16);
    p.text('PRESS ANY KEY TO PLAY AGAIN', W / 2, H / 2 + 60);
    if (anyKeyPressed()) { resetAll(); gameState = 'play'; }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function drawStars(p) {
    p.noStroke();
    for (const s of bgStars) {
      s.y += s.sp;
      if (s.y > H) s.y = 0;
      p.fill(200, 220, 255, 80 + s.s * 60);
      p.ellipse(s.x, s.y, s.s, s.s);
    }
  }

  function drawFlash(p) {
    if (flashTimer > 0) {
      p.fill(...flashColor, Math.min(flashTimer * 8, 80));
      p.noStroke();
      p.rect(0, 0, W, H);
      flashTimer--;
    }
  }

  function updateHUD() {
    document.getElementById('hud-score').textContent = 'Score: ' + score;
    document.getElementById('hud-level').textContent = 'Level ' + level;
    let hearts = '';
    for (let i = 0; i < 3; i++) hearts += i < lives ? '♥ ' : '♡ ';
    document.getElementById('hud-lives').textContent = hearts.trim();
  }

  function anyKeyPressed() {
    return Object.values(keys).some(v => v);
  }

  function resetEntities() {
    ship         = new Ship(W, H);
    bullets      = [];
    asteroids    = [];
    crystals     = [];
    enemies      = [];
    particles    = [];
    spawnTimer   = 0;
    crystalTimer = 0;
    enemyTimer   = 0;
    shootCooldown = 0;
    flashTimer   = 0;
  }

  function resetAll() {
    score = 0; lives = 3; level = 1;
    resetEntities();
  }

};

new p5(sketch, document.getElementById('game-wrap'));
