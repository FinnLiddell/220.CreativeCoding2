function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(20, 30, 60);

  // Moon
  fill(255, 255, 200);
  ellipse(450, 100, 80);

  // Cat
  fill(100);
  ellipse(300, 400, 200, 120);
  ellipse(300, 330, 120, 100);

  // Eyes follow mouse
  fill(0);
  ellipse(280 + mouseX * 0.01, 330, 10);
  ellipse(320 + mouseX * 0.01, 330, 10);
}
