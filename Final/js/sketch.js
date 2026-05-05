// particles.js — Particle explosion effects

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.life = 1.0;
    this.decay = 0.03 + Math.random() * 0.03;
    this.r = 3 + Math.random() * 5;
    this.c = color || [255, 180, 80];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= this.decay;
  }

  draw(p) {
    p.noStroke();
    p.fill(this.c[0], this.c[1], this.c[2], this.life * 200);
    p.ellipse(this.x, this.y, this.r * this.life, this.r * this.life);
  }

  isDead() {
    return this.life <= 0;
  }
}

// Convenience: spawn N particles at (x, y) with given color into an array
function spawnParticles(arr, x, y, n, color) {
  for (let i = 0; i < n; i++) {
    arr.push(new Particle(x, y, color));
  }
}
