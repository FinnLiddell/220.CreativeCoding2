let coffeeX = [];
let coffeeY = [];
let coffeeSize = [];

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 6; i++) {
    coffeeX[i] = random(50, width - 50);
    coffeeY[i] = random(220, 330);
    coffeeSize[i] = random(60, 90);
  }
}

function draw() {
  background(240, 230, 210);


  fill(160, 110, 60);
  rect(0, 330, width, 70);

  for (let i = 0; i < coffeeX.length; i++) {
    drawCoffee(coffeeX[i], coffeeY[i], coffeeSize[i]);
  }
}

function drawCoffee(x, y, size) {
  fill(255);
  rect(x - size/4, y - size/2, size/2, size);
  fill(90, 50, 20);
  ellipse(x, y - size/2, size/2, size/6);
  fill(180, 120, 70);
  rect(x - size/4, y - size/6, size/2, size/4);
  noFill();
  stroke(255);
  strokeWeight(4);
  arc(x + size/4, y - size/4, size/3, size/2, -HALF_PI, HALF_PI);
  noStroke();

  for (let i = 0; i < 3; i++) {
    let steamOffset = sin(frameCount * 0.05 + i) * 5;

    fill(255, 255, 255, 150);
    ellipse(
      x + steamOffset,
      y - size/2 - 20 - (i * 15),
      15,
      20
    );
  }
}
