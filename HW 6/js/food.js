class Food {
  constructor(x, y, size, cupColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.cupColor = cupColor;
  }

  display() {

    let s = this.size;

    fill(this.cupColor);
    rectMode(CENTER);
    rect(this.x, this.y, s * 0.6, s);

    fill(90, 50, 20);
    ellipse(this.x, this.y - s/2, s * 0.6, s * 0.2);

    fill(180, 120, 70);
    rect(this.x, this.y + s * 0.1, s * 0.6, s * 0.3);

    noFill();
    stroke(this.cupColor);
    strokeWeight(3);
    arc(
      this.x + s * 0.35,
      this.y - s * 0.1,
      s * 0.5,
      s * 0.6,
      -HALF_PI,
      HALF_PI
    );
    noStroke();
  }
}
