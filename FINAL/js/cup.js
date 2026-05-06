// cup.js — falling coffee cups (good and bad)

class Cup {
  constructor() {
    this.x    = 30 + Math.random() * (window._GW - 60);
    this.y    = -30;
    this.good = Math.random() > 0.38;
    this.vy   = 1.4 + Math.random() * 1.2 + window._LEVEL * 0.22;
    this.rot  = 0;
    this.rotS = (Math.random() - 0.5) * 0.04;
    this.alive  = true;
    this.wobble = Math.random() * Math.PI * 2;
    this.size   = this.good ? (0.9 + Math.random() * 0.3) : (0.85 + Math.random() * 0.25);
    // 0=latte 1=espresso 2=cold brew 3=cappuccino
    this.type = Math.floor(Math.random() * 4);
  }

  update() {
    this.y += this.vy;
    this.rot += this.rotS;
    this.wobble += 0.08;
    if (this.y > window._GH + 40) this.alive = false;
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.rot + Math.sin(this.wobble) * 0.06);
    p.scale(this.size);
    this.good ? this._drawGood(p) : this._drawBad(p);
    p.pop();
  }

  _drawGood(p) {
    const c = COL.good[this.type];
    // body
    p.fill(c); p.stroke(COL.ink); p.strokeWeight(2);
    p.beginShape();
    p.vertex(-10,  14); p.vertex(10,  14);
    p.vertex(  8, -10); p.vertex(-8, -10);
    p.endShape(p.CLOSE);
    // base
    p.fill(c); p.rect(-10, 12, 20, 4, 1);
    // handle
    p.noFill(); p.stroke(COL.ink); p.strokeWeight(2);
    p.arc(14, 2, 12, 12, p.HALF_PI * 0.5, p.HALF_PI * 2.5);
    // liquid
    p.fill(this.type === 1 ? '#2c1507' : this.type === 2 ? '#1a0e04' : '#d4956a');
    p.noStroke();
    p.ellipse(0, -10, 16, 5);
    // foam
    if (this.type !== 1 && this.type !== 2) {
      p.fill('#fff8f0'); p.ellipse(0, -13, 12, 5);
      p.fill('#f0e0c8'); p.ellipse(-2, -14, 5, 3);
    }
    // steam
    p.stroke(COL.steam); p.strokeWeight(1.5); p.noFill();
    p.line(-3, -14, -5, -22);
    p.line( 0, -14,  0, -23);
    p.line( 3, -14,  5, -22);
    // label
    const labels = ['latte', 'esprso', 'cold\nbrew', 'capp.'];
    p.stroke(COL.ink); p.strokeWeight(1);
    p.fill(255); p.rect(-6, -4, 12, 8, 2);
    p.noStroke(); p.fill(COL.ink);
    p.textSize(5); p.textFont('monospace');
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels[this.type], 0, 0);
  }

  _drawBad(p) {
    // drippy slime cup
    p.fill('#b8d4b0'); p.stroke(COL.ink); p.strokeWeight(2);
    p.beginShape();
    p.vertex(-10, 14); p.vertex(10,  14);
    p.vertex(  9, -8); p.vertex(-9,  -8);
    p.endShape(p.CLOSE);
    // drips
    p.fill('#7ab87a'); p.noStroke();
    p.ellipse(-7, 16, 6, 8);
    p.ellipse( 0, 17, 5, 7);
    p.ellipse( 7, 16, 6, 8);
    // gross liquid
    p.fill('#4a7c59'); p.stroke(COL.ink); p.strokeWeight(1.5);
    p.ellipse(0, -8, 18, 6);
    // bubbles
    p.fill('#c8e8c0'); p.noStroke();
    p.ellipse(-4, -9, 4, 4);
    p.ellipse( 3, -8, 3, 3);
    p.ellipse( 0, -10, 3, 3);
    // X eyes
    p.stroke(COL.ink); p.strokeWeight(2);
    p.line(-5, -1, -3, 1); p.line(-3, -1, -5, 1);
    p.line( 3, -1,  5, 1); p.line( 5, -1,  3, 1);
    // stink lines
    p.stroke('#5b8a3c'); p.strokeWeight(1.5);
    p.line(-2, -14, -3, -22);
    p.line( 1, -14,  2, -22);
  }
}
