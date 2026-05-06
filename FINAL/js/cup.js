// Cup speed range per level — used to calculate points on catch
// Points = floor(vy * 10), so a fast cup is worth more

const SPEED_MIN = 1.4;
const SPEED_MAX = 3.2;

class Cup {
  constructor() {
    this.x      = 30 + Math.random() * (window._GW - 60);
    this.y      = -30;
    this.good   = Math.random() > 0.38;

    // Speed scales with level, with random variance
    const levelBoost = (window._LEVEL - 1) * 0.35;
    this.vy     = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN) + levelBoost;

    // Points based on speed — faster = more points
    this.points = Math.max(5, Math.floor(this.vy * 10));

    this.rot    = 0;
    this.rotS   = (Math.random() - 0.5) * 0.04;
    this.alive  = true;
    this.wobble = Math.random() * Math.PI * 2;
    this.size   = this.good
      ? (0.9  + Math.random() * 0.3)
      : (0.85 + Math.random() * 0.25);
  }

  update() {
    this.y      += this.vy;
    this.rot    += this.rotS;
    this.wobble += 0.08;
    if (this.y > window._GH + 40) this.alive = false;
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.rot + Math.sin(this.wobble) * 0.06);
    p.scale(this.size);
    p.imageMode(p.CENTER);
    this.good ? this._drawGood(p) : this._drawBad(p);
    p.pop();

    // Speed indicator — small number above fast cups so player knows it's worth more
    if (this.vy > 2.5) {
      p.noStroke();
      p.fill(this.good ? COL.cup_good : COL.cup_bad);
      p.textSize(13);
      p.textAlign(p.CENTER);
      p.text('+' + this.points, this.x, this.y - 30);
    }
  }

  _drawGood(p) {
    const img = window.SPRITES && window.SPRITES['good'];
    if (img) {
      p.image(img, 0, 0, 48, 56);
    } else {
      // fallback shape
      p.fill(COL.cup_good); p.stroke(COL.ink); p.strokeWeight(2);
      p.beginShape();
      p.vertex(-10,  14); p.vertex(10,  14);
      p.vertex(  8, -10); p.vertex(-8, -10);
      p.endShape(p.CLOSE);
      p.rect(-10, 12, 20, 4, 1);
      p.noFill(); p.stroke(COL.ink); p.strokeWeight(2);
      p.arc(14, 2, 12, 12, p.HALF_PI * 0.5, p.HALF_PI * 2.5);
      p.fill('#d4956a'); p.noStroke();
      p.ellipse(0, -10, 16, 5);
      p.fill('#fff8f0'); p.ellipse(0, -13, 12, 5);
      p.stroke(COL.steam); p.strokeWeight(1.5); p.noFill();
      p.line(-3, -14, -5, -22);
      p.line( 0, -14,  0, -23);
      p.line( 3, -14,  5, -22);
    }
  }

  _drawBad(p) {
    const img = window.SPRITES && window.SPRITES['bad'];
    if (img) {
      p.image(img, 0, 0, 48, 56);
    } else {
      // fallback shape
      p.fill('#b8d4b0'); p.stroke(COL.ink); p.strokeWeight(2);
      p.beginShape();
      p.vertex(-10, 14); p.vertex(10,  14);
      p.vertex(  9, -8); p.vertex(-9,  -8);
      p.endShape(p.CLOSE);
      p.fill('#7ab87a'); p.noStroke();
      p.ellipse(-7, 16, 6, 8);
      p.ellipse( 0, 17, 5, 7);
      p.ellipse( 7, 16, 6, 8);
      p.fill('#4a7c59'); p.stroke(COL.ink); p.strokeWeight(1.5);
      p.ellipse(0, -8, 18, 6);
      p.stroke(COL.ink); p.strokeWeight(2);
      p.line(-5, -1, -3, 1); p.line(-3, -1, -5, 1);
      p.line( 3, -1,  5, 1); p.line( 5, -1,  3, 1);
      p.stroke('#5b8a3c'); p.strokeWeight(1.5);
      p.line(-2, -14, -3, -22);
      p.line( 1, -14,  2, -22);
    }
  }
}
