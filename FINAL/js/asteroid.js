// asteroid.js — Falling asteroid obstacles

class Asteroid {
  constructor(level) {
    this.x = Math.random() * window._GAME_W;
    this.y = -30;
    this.r = 18 + Math.random() * 18 + level * 2;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = 1.5 + Math.random() * 1.5 + level * 0.3;
    this.rot = 0;
    this.rotSpeed = (Math.random() - 0.5) * 0.06;
    this.pts = this._generatePoints();
    this.alive = true;
    this.hp = Math.ceil(this.r / 14);
  }

  _generatePoints() {
    const pts = [];
    const n = 8;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const radius = this.r * (0.7 + Math.random() * 0.6);
      pts.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    return pts;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotSpeed;
    if (this.y > window._GAME_H + 40) this.alive = false;
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.rot);

    p.fill(120, 100, 80);
    p.stroke(180, 160, 130);
    p.strokeWeight(1.5);
    p.beginShape();
    for (const pt of this.pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.fill(160, 140, 110, 100);
    p.noStroke();
    p.ellipse(-this.r * 0.2, -this.r * 0.2, this.r * 0.4, this.r * 0.3);

    p.pop();
  }
}
