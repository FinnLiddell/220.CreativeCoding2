// ===== IMAGES =====
let idleFrames = [];
let walkFrames = [];
let goodImg;
let badImg;

// ===== GAME OBJECTS =====
let player;
let goodFood = [];
let enemies = [];
let particles = [];

// ===== ANIMATION =====
let frameIndex = 0;
let frameDelay = 8;
let frameTimer = 0;

// ===== GAME DATA =====
let score = 0;
let gameState = "playing";

// ===== LOAD =====
function preload() {
  // player animations
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  // food images
  goodImg = loadImage("images/good.png");
  badImg = loadImage("images/bad.png");
}

// ===== SETUP =====
function setup() {
  new Canvas(600, 400);

  // PLAYER
  player = new Sprite(300, 200, 50, 50);
  player.img = idleFrames[0];
  player.scale = 0.3; // FIX SIZE

  // GOOD FOOD
  for (let i = 0; i < 5; i++) {
    let f = new Sprite(random(width), random(height), 20, 20);
    f.img = goodImg;
    f.scale = 0.2;
    goodFood.push(f);
  }

  // ENEMIES
  for (let i = 0; i < 4; i++) {
    let e = new Sprite(random(width), random(height), 30, 30);
    e.img = badImg;
    e.scale = 0.25;
    e.health = 3;
    enemies.push(e);
  }
}

// ===== DRAW =====
function draw() {
  background(220);

  if (gameState === "playing") {

    handleMovement();
    animatePlayer();

    // GOOD FOOD
    for (let f of goodFood) {
      if (player.overlaps(f)) {
        score++;
        f.x = random(width);
        f.y = random(height);
      }
    }

    // ATTACK (SPACEBAR)
    if (kb.presses("space")) {
      for (let e of enemies) {
        if (player.overlaps(e)) {
          e.health--;

          // PARTICLES
          for (let i = 0; i < 10; i++) {
            particles.push(new Particle(e.x, e.y));
          }
        }
      }
    }

    // REMOVE DEAD ENEMIES
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].health <= 0) {
        enemies[i].remove();
        enemies.splice(i, 1);
      }
    }

    // PARTICLES
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    displayUI();
    checkWin();

  } else if (gameState === "win") {
    endScreen("YOU WIN");
  }
}

// ===== MOVEMENT =====
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

// ===== ANIMATION =====
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

// ===== PARTICLE CLASS =====
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = 60;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  display() {
    noStroke();
    fill(255, 150, 0, this.life * 4);
    circle(this.x, this.y, 6);
  }
}

// ===== UI =====
function displayUI() {
  fill(0);
  textSize(20);
  text("Score: " + score, 20, 30);
  text("Enemies: " + enemies.length, 20, 60);
}

// ===== WIN =====
function checkWin() {
  if (enemies.length === 0) {
    gameState = "win";
  }
}

// ===== END =====
function endScreen(msg) {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text(msg, width / 2, height / 2);
  noLoop();
}
