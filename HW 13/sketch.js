let coffeeModel;

let textures = [];
let shapes = [];

let angle = 0;

function preload() {
  coffeeModel = loadModel('coffee.obj', true);

  // load 5 textures
  textures[0] = loadImage('tex1.jpg');
  textures[1] = loadImage('tex2.jpg');
  textures[2] = loadImage('tex3.jpg');
  textures[3] = loadImage('tex4.jpg');
  textures[4] = loadImage('tex5.jpg');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  textAlign(CENTER, CENTER);

  // create 5 orbiting objects
  for (let i = 0; i < 5; i++) {
    shapes.push({
      angle: random(TWO_PI),
      distance: random(150, 300),
      speed: random(0.01, 0.03),
      yOffset: random(-100, 100),
      type: i
    });
  }
}

function draw() {
  background(15);

  ambientLight(100);
  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  orbitControl(); // allows mouse drag to rotate scene

  // --- CENTRAL MODEL ---
  push();
  rotateY(angle * 0.5);
  normalMaterial();
  scale(2);
  model(coffeeModel);
  pop();

  angle += 0.01;

  // --- ORBITING SHAPES ---
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];

    push();

    // orbit motion
    let x = cos(s.angle) * s.distance;
    let z = sin(s.angle) * s.distance;

    translate(x, s.yOffset, z);

    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);

    texture(textures[i]);

    // different shapes
    if (s.type === 0) box(50);
    if (s.type === 1) sphere(30);
    if (s.type === 2) cone(30, 60);
    if (s.type === 3) torus(30, 10);
    if (s.type === 4) cylinder(25, 60);

    pop();

    // update orbit
    s.angle += s.speed;
  }

  // --- TEXT ---
  push();
  resetMatrix();
  translate(width / 2, 50);
  fill(255);
  textSize(28);
  text("Coffee Universe", 0, 0);
  pop();

  push();
  resetMatrix();
  translate(width / 2, height - 30);
  fill(180);
  textSize(18);
  text("By Finnegan Liddell", 0, 0);
  pop();
}

// --- INTERACTION ---
function mousePressed() {
  // move at least two objects randomly
  for (let i = 0; i < 2; i++) {
    shapes[i].distance = random(150, 300);
    shapes[i].yOffset = random(-150, 150);
  }
}
