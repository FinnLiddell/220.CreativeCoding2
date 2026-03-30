let player;

let goodFood = [];
let badFood = [];
let obstacles = [];

let idleFrames = [];
let walkFrames = [];

let frameIndex = 0;
let frameDelay = 8;
let frameTimer = 0;

let score = 0;
let health = 5;
let gameState = "playing";

function preload() {
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");
}

function setup() {
  new Canvas(600, 400);

  // PLAYER
  player = new Sprite(300, 200, 50, 50);
  player.color = "blue";

  // GOOD FOOD
  for (let i = 0; i < 5; i++) {
    let f = new Sprite(random(width), random(height), 30, 30);
    f.color = "green";
    f.type = "good";
    goodFood.push(f);
  }

  // BAD FOOD
  for (let i = 0; i < 3; i++) {
    let f = new Sprite(random(width), random(height), 30, 30);
    f.color = "red";
    f.type = "bad";
    badFood.push(f);
  }

  // OBSTACLES
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(width), random(height), 80, 40, "static");
    o.color = "gray";
    obstacles.push(o);
  }
}

function draw() {
  background(220);

  if (gameState === "playing") {

    handleMovement();
    animatePlayer();

    // collisions
    player.collides(obstacles);

    for (let f of goodFood) {
      if (player.overlaps(f)) {
        score++;
        f.pos = { x: random(width), y: random(height) };
      }
    }

    for (let f of badFood) {
      if (player.overlaps(f)) {
        health--;
        f.pos = { x: random(width), y: random(height) };
      }
    }

    displayUI();
    checkGame();

  } else if (gameState === "win") {
    endScreen("YOU WIN");
  } else if (gameState === "lose") {
    endScreen("GAME OVER");
  }
}

function handleMovement() {
  player.vel.x = 0;
  player.vel.y = 0;

  let moving = false;

  if (kb.pressing("a") || kb.pressing("left")) {
    player.vel.x = -4;
    moving = true;
  }
  if (kb.pressing("d") || kb.pressing("right")) {
    player.vel.x = 4;
    moving = true;
  }
  if (kb.pressing("w") || kb.pressing("up")) {
    player.vel.y = -4;
    moving = true;
  }
  if (kb.pressing("s") || kb.pressing("down")) {
    player.vel.y = 4;
    moving = true;
  }

  player.moving = moving;
}

function animatePlayer() {

  frameTimer++;
  if (frameTimer >= frameDelay) {
    frameIndex = (frameIndex + 1) % 2;
    frameTimer = 0;
  }

  if (player.moving) {
    player.img = walkFrames[frameIndex];
  } else {
    player.img = idleFrames[frameIndex];
  }
}

function displayUI() {
  fill(0);
  textSize(20);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);
}

function checkGame() {
  if (score >= 10) gameState = "win";
  if (health <= 0) gameState = "lose";
}

function endScreen(msg) {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text(msg, width / 2, height / 2);
  noLoop();
}
