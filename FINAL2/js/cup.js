const SPEED_MIN = 1.4;
const SPEED_MAX = 3.2;

class Cup {

  constructor() {

    this.x = 30 + Math.random() * (window._GW - 60);

    this.y = -30;

    this.good = Math.random() > 0.38;

    const levelBoost = (window._LEVEL - 1) * 0.35;

    this.vy =
      SPEED_MIN +
      Math.random() * (SPEED_MAX - SPEED_MIN) +
      levelBoost;

    this.points = Math.max(5, Math.floor(this.vy * 10));

    this.rot = 0;

    this.rotS = (Math.random() - 0.5) * 0.04;

    this.alive = true;

    this.wobble = Math.random() * Math.PI * 2;

    this.size = this.good
      ? (0.9 + Math.random() * 0.3)
      : (0.85 + Math.random() * 0.25);
  }

  update() {

    this.y += this.vy;

    this.rot += this.rotS;

    this.wobble += 0.08;

    if (this.y > window._GH + 40) {
      this.alive = false;
    }
  }

  draw(p) {

    p.push();

    p.translate(this.x, this.y);

    p.rotate(this.rot + Math.sin(this.wobble) * 0.06);

    p.scale(this.size);

    p.imageMode(p.CENTER);

    if (this.good) {
      p.image(window.SPRITES.good, 0, 0, 48, 56);
    } else {
      p.image(window.SPRITES.bad, 0, 0, 48, 56);
    }

    p.pop();

    if (this.vy > 2.5) {

      p.noStroke();

      p.fill(this.good ? COL.cup_good : COL.cup_bad);

      p.textSize(13);

      p.textAlign(p.CENTER);

      p.text('+' + this.points, this.x, this.y - 30);
    }
  }
}
