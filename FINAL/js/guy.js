// guy.js — stick figure player

const COL = {
  bg:     '#fdf6e3',
  paper:  '#f0e6d0',
  ink:    '#3b2208',
  mid:    '#7a5230',
  light:  '#e8d5b0',
  cream:  '#fffbe8',
  good:   ['#c0792a','#5c3d1e','#a0522d','#8b6914'],
  bad:    ['#4a7c59','#2d6e4e','#5b8a3c','#3d5a2a'],
  cup_good: '#c0792a',
  cup_bad:  '#3d7a5a',
  steam:  '#b8956a',
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
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) this.x -= spd;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += spd;
    this.x = Math.max(this.w / 2 + 4, Math.min(window._GW - this.w / 2 - 4, this.x));
    this.step = (this.step + 0.18) % (Math.PI * 2);
    if (this.catching > 0) this.catching--;
  }

  draw(p) {
    const x = this.x, y = this.y;
    const bob = Math.sin(this.step) * 2;
    p.push();
    p.translate(x, y + bob);
    p.stroke(COL.ink);
    p.strokeWeight(2.5);
    p.noFill();

    // tray
    p.stroke(COL.mid); p.strokeWeight(3);
    p.line(-22, 0, 22, 0);
    p.stroke(COL.ink); p.strokeWeight(2);
    p.line(-22, 0, -26, -5);
    p.line( 22, 0,  26, -5);

    // torso
    p.stroke(COL.ink); p.strokeWeight(2.5);
    p.line(0, 0, 0, -22);

    // legs
    const lw = Math.sin(this.step) * 6;
    p.line(0, 0, -8 + lw, 14);
    p.line(0, 0,  8 - lw, 14);
    p.line(-8 + lw, 14, -13 + lw, 18);
    p.line( 8 - lw, 14,  13 - lw, 18);

    // arms
    p.line(0, -14, -22, -6);
    p.line(0, -14,  22, -6);

    // head
    p.fill(COL.cream); p.stroke(COL.ink); p.strokeWeight(2);
    p.ellipse(0, -30, 18, 18);

    // face
    p.noStroke(); p.fill(COL.ink);
    if (this.catching > 0) {
      p.ellipse(-3, -30, 3, 3);
      p.ellipse( 3, -30, 3, 3);
      p.noFill(); p.stroke(COL.ink); p.strokeWeight(1.5);
      p.arc(0, -28, 8, 6, 0, Math.PI);
    } else {
      p.ellipse(-3, -30, 2, 2);
      p.ellipse( 3, -30, 2, 2);
      p.noFill(); p.stroke(COL.ink); p.strokeWeight(1.5);
      p.line(-3, -26, 3, -26);
    }

    // cup in hand
    if (this.catching > 10) {
      p.noStroke(); p.fill(COL.cup_good);
      p.rect(8, -8, 8, 6, 1);
      p.fill(COL.steam);
      p.ellipse(12, -9, 4, 3);
    }

    p.pop();
  }

  catchBox() {
    return { x: this.x - 24, y: this.y - 8, w: 48, h: 12 };
  }
}
