// ===== PLAYER =====
let player;

// ===== ANIMATION =====
let idleAnim;
let walkAnim;

// ===== GROUPS =====
let goodGroup;
let badGroup;
let obstacleGroup;

// ===== GAME DATA =====
let score = 0;
let health = 5;
let gameState = "playing";

function preload() {

  idleAnim = loadAnimation(
    "images/idle1.png",
    "images/idle2.png"
  );

  walkAnim = loadAnimation(
    "images/walk1.png",
    "images/walk2.png"
  );
}

function setup() {
  createCanvas(600, 400);

  // PLAYER
  player = createSprite(300, 200, 50, 50);
  player.addAnimation("idle", idleAnim);
  player.addAnimation("walk", walkAnim);
  player.changeAnimation("idle");

  // GROUPS
  goodGroup = new Group();
  badGroup = new Group();
  obstacleGroup = new Group();

  // GOOD ITEMS
  for (let i = 0; i < 5; i++) {
    let g = createSprite(random(width), random(height), 30, 30);
    g.shapeColor = "green";
    goodGroup.add(g);
  }

  // BAD ITEMS
  for (let i = 0; i < 3; i++) {
    let b = createSprite(random(width), random(height), 30, 30);
    b.shapeColor = "red";
    badGroup.add(b);
  }

  // OBSTACLES
  for (let i = 0; i < 3; i++) {
    let o = createSprite(random(width), random(height), 80, 40);
    o.shapeColor = "gray";
    o.immovable = true;
    obstacleGroup.add(o);
  }
}

function draw() {

  background(220);

  if (gameState === "playing") {

    handleMovement();

    // collisions
    player.collide(obstacleGroup);
    player.overlap(goodGroup, collectGood);
    player.overlap(badGroup, hitBad);

    drawSprites();

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

  player.velocity.x = 0;
  player.velocity.y = 0;

  let moving = false;

  if (keyDown("LEFT_ARROW") || keyDown("a")) {
    player.velocity.x = -4;
    moving = true;
  }
  if (keyDown("RIGHT_ARROW") || keyDown("d")) {
    player.velocity.x = 4;
    moving = true;
  }
  if (keyDown("UP_ARROW") || keyDown("w")) {
    player.velocity.y = -4;
    moving = true;
  }
  if (keyDown("DOWN_ARROW") || keyDown("s")) {
    player.velocity.y = 4;
    moving = true;
  }

  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}

// ===== GOOD =====
function collectGood(player, item) {
  score++;
  item.position.x = random(width);
  item.position.y = random(height);
}

// ===== BAD =====
function hitBad(player, item) {
  health--;
  item.position.x = random(width);
  item.position.y = random(height);
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
  if (score >= 10) gameState = "win";
  if (health <= 0) gameState = "lose";
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
