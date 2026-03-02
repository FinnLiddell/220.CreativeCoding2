// ===== Animation Arrays =====
let idleFrames = [];
let walkFrames = [];
let currentFrames;

let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;

// ===== Character =====
let characterX = 300;
let characterY = 250;
let moveSpeed = 4;
let moving = false;

// ===== Food =====
let foodImg;
let foodX;
let foodY;
let foodMoveTimer = 0;
let foodMoveInterval = 120; // frames

// ===== Game State =====
let score = 0;
let gameTime = 60; // seconds
let startTime;
let gameState = "playing";

function preload() {
  // Character animations
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  // Food image
  foodImg = loadImage("images/coffee.png");
}

function setup() {
  createCanvas(600, 400);

  currentFrames = idleFrames;

  foodX = random(50, width - 50);
  foodY = random(50, height - 50);

  startTime = millis();
}

function draw() {

  if (gameState === "playing") {

    background(230, 220, 200);

    handleMovement();
    updateAnimation();
    displayCharacter();

    updateFood();
    checkCollision();

    displayScoreAndTimer();
    checkTimer();

  } else if (gameState === "gameOver") {

    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("GAME OVER", width / 2, height / 2);

    textSize(20);
    text("Final Score: " + score, width / 2, height / 2 + 40);
  }
}

// ===========================
// CHARACTER MOVEMENT
// ===========================

function handleMovement() {
  moving = false;

  if (keyIsDown(LEFT_ARROW)) {
    characterX -= moveSpeed;
    moving = true;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    characterX += moveSpeed;
    moving = true;
  }

  if (keyIsDown(UP_ARROW)) {
    characterY -= moveSpeed;
    moving = true;
  }

  if (keyIsDown(DOWN_ARROW)) {
    characterY += moveSpeed;
    moving = true;
  }

  // Keep character inside canvas
  characterX = constrain(characterX, 50, width - 50);
  characterY = constrain(characterY, 50, height - 50);

  if (moving) {
    currentFrames = walkFrames;
  } else {
    currentFrames = idleFrames;
  }
}

// ===========================
// ANIMATION
// ===========================

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
  image(currentFrames[frameIndex], characterX, characterY, 100, 100);
}

// ===========================
// FOOD LOGIC
// ===========================

function updateFood() {

  imageMode(CENTER);
  image(foodImg, foodX, foodY, 60, 60);

  foodMoveTimer++;

  if (foodMoveTimer > foodMoveInterval) {
    moveFood();
    foodMoveTimer = 0;
  }
}

function moveFood() {
  foodX = random(50, width - 50);
  foodY = random(50, height - 50);
}

// ===========================
// COLLISION
// ===========================

function checkCollision() {

  let d = dist(characterX, characterY, foodX, foodY);

  if (d < 60) {
    score++;
    moveFood();
  }
}

// ===========================
// SCORE + TIMER
// ===========================

function displayScoreAndTimer() {

  fill(0);
  textSize(20);
  textAlign(LEFT);

  text("Score: " + score, 20, 30);

  let elapsed = floor((millis() - startTime) / 1000);
  let remainingTime = max(0, gameTime - elapsed);

  text("Time: " + remainingTime, width - 120, 30);
}

function checkTimer() {
  let elapsed = floor((millis() - startTime) / 1000);

  if (elapsed >= gameTime) {
    gameState = "gameOver";
  }
}
