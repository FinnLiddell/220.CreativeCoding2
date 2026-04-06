let angle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(20);

  ambientLight(120);
  directionalLight(255, 255, 255, 0.5, 1, -1);

  angle += 0.01;

  rotateY(angle * 0.2);

  push();
  translate(0, 50, 0);

  push();
  ambientMaterial(240, 240, 235);
  scale(1, 1.2, 1); // makes it taller
  cylinder(80, 160);
  pop();

  push();
  translate(0, 20, 0);
  ambientMaterial(120, 80, 50);
  cylinder(82, 60);
  pop();

  push();
  translate(0, -90, 0);
  ambientMaterial(230);
  cylinder(85, 20);
  pop();

  push();
  translate(0, -105, 0);
  ambientMaterial(220);
  cylinder(70, 15);
  pop();

  push();
  translate(20, -115, 0);
  ambientMaterial(200);
  sphere(8);
  pop();

  pop();

  for (let i = 0; i < 3; i++) {
    push();
    let rise = (frameCount * 0.6 + i * 25) % 120;
    translate(-10 + i * 10, -120 - rise, 0);
    ambientMaterial(200);
    sphere(8);
    pop();
  }

  push();
  translate(-300, 150, 0);
  rotateX(angle);
  normalMaterial();
  box(70);
  pop();
}
