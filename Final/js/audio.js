// ship.js — Player ship

const SHIP_SPEED = 4;
const INVINCIBLE_FRAMES = 120;

class Ship {
  constructor(canvasW, canvasH) {
    this.x = canvasW / 2;
    this.y = canvasH - 70;
    this.w = 22;
    this.h = 30;
    this.invincible = 0;
    this.thrustAnim = 0;
  }

  update(keys) {
    const W = window._GAME_W;
    const H = window._GAME_H;

    if (keys['ArrowLeft']  || keys['a'] || keys['A']) this.x -= SHIP_SPEED;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += SHIP_SPEED;
    if (keys['ArrowUp']    || keys['w'] || keys['W']) this.y -= SHIP_SPEED;
    if (keys['ArrowDown']  || keys['s'] || keys['S']) this.y += SHIP_SPEED;

    // Clamp to canvas bounds
    this.x = Math.max(this.w, Math.min(W - this.w, this.x));
    this.y = Math.max(this.h, Math.min(H - this.h, this.y));

    if (this.invincible > 0) this.invincible--;
    this.thrustAnim = (this.thrustAnim + 1) % 10;
  }

  draw(p) {
    // Blink during invincibility
    if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) return;

    p.push();
    p.translate(this.x, this.y);

    // Thruster flame
    const flicker = this.thrustAnim < 5 ? 14 : 10;
    p.noStroke();
    p.fill(255, 180, 50, 180);
    p.ellipse(0, this.h / 2 + flicker / 2, 10, flicker);
    p.fill(255, 230, 120, 220);
    p.ellipse(0, this.h / 2 + flicker / 4, 6, flicker * 0.6);

    // Main body
    p.fill(80, 160, 255);
    p.stroke(180, 220, 255);
    p.strokeWeight(1.5);
    p.beginShape();
    p.vertex(0,              -this.h / 2);
    p.vertex(this.w / 2,     this.h / 2);
    p.vertex(this.w * 0.2,   this.h * 0.3);
    p.vertex(-this.w * 0.2,  this.h * 0.3);
    p.vertex(-this.w / 2,    this.h / 2);
    p.endShape(p.CLOSE);

    // Cockpit
    p.fill(160, 220, 255, 200);
    p.noStroke();
    p.ellipse(0, -this.h / 8, 10, 14);

    // Left wing
    p.fill(50, 120, 220);
    p.stroke(120, 180, 255);
    p.strokeWeight(1);
    p.beginShape();
    p.vertex(-this.w * 0.2,  this.h * 0.1);
    p.vertex(-this.w * 0.8,  this.h * 0.5);
    p.vertex(-this.w * 0.2,  this.h * 0.4);
    p.endShape(p.CLOSE);

    // Right wing
    p.beginShape();
    p.vertex(this.w * 0.2,   this.h * 0.1);
    p.vertex(this.w * 0.8,   this.h * 0.5);
    p.vertex(this.w * 0.2,   this.h * 0.4);
    p.endShape(p.CLOSE);

    p.pop();
  }

  // Circle-circle collision check with a given object at radius r
  hits(obj, r) {
    return Math.hypot(this.x - obj.x, this.y - obj.y) < r + 14;
  }
}
