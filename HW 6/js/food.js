class Food {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  display() {
    fill(this.color);

    // Base pastry
    ellipse(this.x, this.y, this.size);

    // Frosting layer
    fill(255, 200, 200);
    arc(
      this.x,
      this.y - this.size * 0.1,
      this.size,
      this.size * 0.8,
      PI,
      TWO_PI
    );
  }
}
