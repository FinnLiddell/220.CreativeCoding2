let coffeeModel;
let textures = [];
let shapes = [];
let myFont;

function preload() {
  // MODEL
  coffeeModel = loadModel('models/coffee.obj', true);

  // TEXTURES
  textures[0] = loadImage('textures/tex1.jpg');
  textures[1] = loadImage('textures/tex2.jpg');
  textures[2] = loadImage('textures/tex3.jpg');
  textures[3] = loadImage('textures/tex4.jpg');
  textures[4] = loadImage('textures/tex5.jpg');

  // FONT
  myFont = loadFont('assets/Lobster-Regular.ttf');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  textFont(myFont);
  textAlign(CENTER, CENTER);

  // CREATE ORBITING OBJECTS
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

  orbitControl(); // mouse drag rotation

  // --- CENTRAL MODEL (FIX UPSIDE DOWN) ---
  push();
  rotateX(PI); // flips model correctly
  rotateY(frameCount * 0.01);
  scale(2);
  normalMaterial();
  model(coffeeModel);
  pop();

  // --- ORBITING SHAPES ---
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];

    push();

    let x = cos(s.angle) * s.distance;
    let z = sin(s.angle) * s.distance;

    translate(x, s.yOffset, z);

    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);

    texture(textures[i]);

    if (s.type === 0) box(50);
    if (s.type === 1) sphere(30);
    if (s.type === 2) cone(30, 60);
    if (s.type === 3) torus(30, 10);
    if (s.type === 4) cylinder(25, 60);

    pop();

    s.angle += s.speed;
  }

  // --- TITLE ---
  push();
  resetMatrix();
  translate(width / 2, 50);
  fill(255, 220, 180);
  textSize(36);
  text("Coffee Universe", 0, 0);
  pop();

  // --- NAME ---
  push();
  resetMatrix();
  translate(width / 2, height - 30);
  fill(200);
  textSize(20);
  text("By Finnegan Liddell", 0, 0);
  pop();
}

// --- CLICK INTERACTION ---
function mousePressed() {
  for (let i = 0; i < 2; i++) {
    shapes[i].distance = random(150, 300);
    shapes[i].yOffset = random(-150, 150);
  }
}
