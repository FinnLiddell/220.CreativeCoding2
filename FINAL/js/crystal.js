// crystal.js — Collectible energy crystals

class Crystal {
  constructor() {
    this.x = 50 + Math.random() * (window._GAME_W - 100);
    this.y = -20;
    this.vy = 1.5 + Math.random();
    this.alive = true;
    this.anim = Math.random() * Math.PI * 2;
    this.type = Math.random() < 0.15 ? 'big' : 'small';
    this.r = this.type === 'big' ? 14 : 9;
    this.points = this.type === 'big' ? 150 : 50;
  }

  update() {
    this.y += this.vy;
    this.anim += 0.08;
    if (this.y > window._GAME_H + 20) this.alive = false;
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y + Math.sin(this.anim) * 4);

    const c = this.type === 'big' ? [80, 255, 180] : [120, 200, 255];
    const r = this.r;

    p.fill(...c, 200);
    p.stroke(...c);
    p.strokeWeight(1);
    p.beginShape();
    p.vertex(0,        -r);
    p.vertex(r * 0.5,  -r * 0.3);
    p.vertex(r * 0.5,   r * 0.3);
    p.vertex(0,         r);
    p.vertex(-r * 0.5,  r * 0.3);
    p.vertex(-r * 0.5, -r * 0.3);
    p.endShape(p.CLOSE);

    p.fill(...c, 80);
    p.noStroke();
    p.ellipse(0, 0, r * 0.6, r);

    p.pop();
  }
}
