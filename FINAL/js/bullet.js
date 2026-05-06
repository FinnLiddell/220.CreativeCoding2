// bullet.js — Player bullets

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = -10;
    this.alive = true;
  }

  update() {
    this.y += this.vy;
    if (this.y < -10) this.alive = false;
  }

  draw(p) {
    p.noStroke();
    p.fill(120, 220, 255);
    p.ellipse(this.x, this.y, 5, 14);
    p.fill(200, 240, 255, 150);
    p.ellipse(this.x, this.y, 3, 8);
  }
}
