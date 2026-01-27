function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(200, 220, 240);
  fill(220);
  rect(0, 0, width, height);
  fill(180);
  rect(150, 100, 300, 300);
  fill(170, 210, 230);
  rect(160, 110, 130, 130);
  rect(300, 110, 130, 130);
  rect(160, 250, 130, 130);
  rect(300, 250, 130, 130);
  fill(250, 245, 200);
  ellipse(350, 170, 60);
  fill(120, 110, 100);
  ellipse(300, 430, 180, 120);
  ellipse(300, 350, 120, 100);
  triangle(250, 320, 270, 260, 290, 320);
  triangle(350, 320, 330, 260, 310, 320);
  fill(30);
  ellipse(280, 350, 10);
  ellipse(320, 350, 10);
  fill(120, 110, 100);
  rect(380, 440, 80, 20, 10);
  fill(160);
  rect(140, 400, 320, 20);
}
