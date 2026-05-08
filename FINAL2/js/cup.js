const SPEED_MIN = 1.4;
const SPEED_MAX = 3.2;

class Cup {

  constructor() {

    this.x = 30 + random(window._GW - 60);

    this.y = -30;

    this.good = random() > 0.38;

    const levelBoost = (window._LEVEL - 1) * 0.35;

    this.vy =
      SPEED_MIN +
      random(SPEED_MAX - SPEED_MIN) +
      levelBoost;

    this.points = max(5, floor(this.vy * 10));

    this.rot = 0;

    this.rotS = random(-0.04, 0.04);

    this.alive = true;

    this.wobble = random(TWO_PI);

    this.size = this.good
      ? random(0.9, 1.2)
      : random(0.85, 1.1);
  }

  update() {

    this.y += this.vy;

    this.rot += this.rotS;

    this.wobble += 0.08;

    if (this.y > window._GH + 40) {
      this.alive = false;
    }
  }

  draw() {

    push();

    translate(this.x, this.y);

    rotate(this.rot + sin(this.wobble) * 0.06);

    scale(this.size);

    imageMode(CENTER);

    if (this.good) {
      image(window.SPRITES.good, 0, 0, 48, 56);
    } else {
      image(window.SPRITES.bad, 0, 0, 48, 56);
    }

    pop();

    // point value
    if (this.vy > 2.5) {

      noStroke();

      fill(this.good ? COL.cup_good : COL.cup_bad);

      textSize(13);

      textAlign(CENTER);

      text('+' + this.points, this.x, this.y - 30);
    }
  }
}
