// ===== ANIMATION =====
let idleFrames = [];
let walkFrames = [];
let currentFrames;

let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;

// ===== PLAYER =====
let player;

// ===== GROUPS =====
let goodFood;
let badFood;
let obstacles;

// ===== GAME DATA =====
let score = 0;
let health = 5;
let gameState = "playing";

// ===== IMAGES =====
let goodImg;
let badImg;
let obstacleImg;

function preload() {

  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  goodImg = loadImage("images/goodCoffee.png");
  badImg = loadImage("images/badCoffee.png");
  obstacleImg = loadImage("images/obstacle.png");
}

function setup() {
  createCanvas(600, 400);

  // PLAYER
  player = new Sprite(300, 200, 60, 60);
  player.img = idleFrames[0];

  // GROUPS
  goodFood = new Group();
  badFood = new Group();
  obstacles = new Group();

  // GOOD FOOD
  for (let i = 0; i < 5; i++) {
    let g = new Sprite(random(width), random(height), 40, 40);
    g.img = goodImg;
    goodFood.add(g);
  }

  // BAD FOOD
  for (let i = 0; i < 3; i++) {
    let b = new Sprite(random(width), random(height), 40, 40);
    b.img = badImg;
    badFood.add(b);
  }

  // OBSTACLES
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(width), random(height), 80, 50);
    o.img = obstacleImg;
    o.collider = "static";
    obstacles.add(o);
  }

  currentFrames = idleFrames;
}

function draw() {

  background(230, 220, 200);

  if (gameState === "playing") {

    handleMovement();
    updateAnimation();

    player.img = currentFrames[frameIndex];

    player.collide(obstacles);
    player.overlaps(goodFood, collectGood);
    player.overlaps(badFood, hitBad);

    displayUI();
    checkGameState();

  } else if (gameState === "win") {
    showEnd("YOU WIN");
  } else if (gameState === "lose") {
    showEnd("GAME OVER");
  }
}

// ===== MOVEMENT =====
function handleMovement() {

  player.vel.x = 0;
  player.vel.y = 0;

  let moving = false;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vel.x = -3;
    moving = true;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vel.x = 3;
    moving = true;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.vel.y = -3;
    moving = true;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.vel.y = 3;
    moving = true;
  }

  if (moving) {
    currentFrames = walkFrames;
  } else {
    currentFrames = idleFrames;
  }
}

// ===== ANIMATION =====
function updateAnimation() {

  animationTimer++;

  if (animationTimer >= animationSpeed) {
    frameIndex++;
    frameIndex %= currentFrames.length;
    animationTimer = 0;
  }
}

// ===== COLLISION =====
function collectGood(player, item) {
  score++;
  item.pos = { x: random(width), y: random(height) };
}

function hitBad(player, item) {
  health--;
  item.pos = { x: random(width), y: random(height) };
}

// ===== UI =====
function displayUI() {
  fill(0);
  textSize(20);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);
}

// ===== GAME STATE =====
function checkGameState() {
  if (score >= 10) {
    gameState = "win";
  }
  if (health <= 0) {
    gameState = "lose";
  }
}

// ===== END =====
function showEnd(msg) {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text(msg, width / 2, height / 2);

  textSize(20);
  text("Final Score: " + score, width / 2, height / 2 + 40);

  noLoop();
}
