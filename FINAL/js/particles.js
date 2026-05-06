class Particle {
  constructor(x, y, col, txt) {
    this.x   = x;
    this.y   = y;
    this.vx  = (Math.random() - 0.5) * 3;
    this.vy  = -2 - Math.random() * 2;
    this.life = 1.0;
    this.col  = col;
    this.txt  = txt || null;
    this.r    = 4 + Math.random() * 5;
  }

  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.vy  += 0.1;
    this.life -= 0.03;
  }

  dead() { return this.life <= 0; }
}

function burst(arr, x, y, col, n, txt) {
  for (let i = 0; i < n; i++) arr.push(new Particle(x, y, col));
  if (txt) {
    const pt  = new Particle(x, y - 10, col);
    pt.txt    = txt;
    pt.r      = 0;
    pt.vx     = 0;
    pt.vy     = -1.5;
    arr.push(pt);
  }
}
