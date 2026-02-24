let idleFrames = [];
let walkFrames = [];

let currentFrames;
let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;

let characterX = 300;
let characterY = 250;
let moving = false;

let foods = [];

function preload() {
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");
}

function setup() {
  createCanvas(600, 400);

  currentFrames = idleFrames;

  // Create 5 food objects
  for (let i = 0; i < 5; i++) {
    let f = new Food(
      random(50, width - 50),
      random(100, height - 50),
      random(40, 70),
      color(random(255), random(255), random(255))
    );
    foods.push(f);
  }
}

function draw() {
  background(230, 220, 200);

  handleMovement();
  updateAnimation();
  displayCharacter();

  // Display all food objects
  for (let i = 0; i < foods.length; i++) {
    foods[i].display();
  }
}

function handleMovement() {
  moving = false;

  if (keyIsDown(LEFT_ARROW)) {
    characterX -= 3;
    moving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    characterX += 3;
    moving = true;
  }

  if (moving) {
    currentFrames = walkFrames;
  } else {
    currentFrames = idleFrames;
  }
}

function updateAnimation() {
  animationTimer++;

  if (animationTimer >= animationSpeed) {
    frameIndex++;
    frameIndex %= currentFrames.length;
    animationTimer = 0;
  }
}

function displayCharacter() {
  imageMode(CENTER);
  image(
    currentFrames[frameIndex],
    characterX,
    characterY,
    100,
    100
  );
}
