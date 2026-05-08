const COL = {
  bg: '#fdf6e3',
  ink: '#3b2208',
  mid: '#7a5230',
  cream: '#fffbe8',
  cup_good: '#c0792a',
  cup_bad: '#3d7a5a',
  steam: '#b8956a',
};

window.COL = COL;

class Guy {

  constructor() {

    this.x = window._GW / 2;
    this.y = window._GH - 38;

    this.w = 44;

    this.step = 0;

    this.catching = 0;
  }

  update(keys) {

    const spd = 4 + window._LEVEL * 0.3;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      this.x -= spd;
    }

    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      this.x += spd;
    }

    this.x = constrain(
      this.x,
      this.w / 2 + 4,
      window._GW - this.w / 2 - 4
    );

    this.step = (this.step + 0.18) % TWO_PI;

    if (this.catching > 0) {
      this.catching--;
    }
  }

  draw() {

    const bob = sin(this.step) * 2;

    push();

    translate(this.x, this.y + bob);

    stroke(COL.ink);
    strokeWeight(2.5);

    noFill();

    // tray
    stroke(COL.mid);
    strokeWeight(3);

    line(-22, 0, 22, 0);

    stroke(COL.ink);
    strokeWeight(2);

    line(-22, 0, -26, -5);
    line(22, 0, 26, -5);

    // torso
    stroke(COL.ink);
    strokeWeight(2.5);

    line(0, 0, 0, -22);

    // legs
    const lw = sin(this.step) * 6;

    line(0, 0, -8 + lw, 14);
    line(0, 0, 8 - lw, 14);

    line(-8 + lw, 14, -13 + lw, 18);
    line(8 - lw, 14, 13 - lw, 18);

    // arms
    line(0, -14, -22, -6);
    line(0, -14, 22, -6);

    // head
    fill(COL.cream);

    stroke(COL.ink);
    strokeWeight(2);

    ellipse(0, -30, 18, 18);

    // face
    noStroke();
    fill(COL.ink);

    if (this.catching > 0) {

      ellipse(-3, -30, 3, 3);
      ellipse(3, -30, 3, 3);

      noFill();

      stroke(COL.ink);
      strokeWeight(1.5);

      arc(0, -28, 8, 6, 0, PI);

    } else {

      ellipse(-3, -30, 2, 2);
      ellipse(3, -30, 2, 2);

      noFill();

      stroke(COL.ink);
      strokeWeight(1.5);

      line(-3, -26, 3, -26);
    }

    // cup in hand
    if (this.catching > 10) {

      noStroke();

      fill(COL.cup_good);

      rect(8, -8, 8, 6, 1);

      fill(COL.steam);

      ellipse(12, -9, 4, 3);
    }

    pop();
  }

  catchBox() {

    return {
      x: this.x - 24,
      y: this.y - 8,
      w: 48,
      h: 12
    };
  }
}
