// ===== CHARACTER ANIMATION =====
let idleFrames = [];
let walkFrames = [];
let currentFrames;

let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;

// ===== CHARACTER =====
let characterX = 300;
let characterY = 200;
let speed = 4;
let moving = false;

// ===== FOOD =====
let goodFoodImg;
let badFoodImg;

let goodX, goodY;
let badX, badY;

// ===== SOUND =====
let music;
let goodSound;
let badSound;
let musicStarted = false;

// ===== GAME DATA =====
let score = 0;
let health = 3;

function preload() {

  // character animation
  idleFrames[0] = loadImage("images/idle1.png");
  idleFrames[1] = loadImage("images/idle2.png");

  walkFrames[0] = loadImage("images/walk1.png");
  walkFrames[1] = loadImage("images/walk2.png");

  // food images
  goodFoodImg = loadImage("images/goodCoffee.png");
  badFoodImg = loadImage("images/badCoffee.png");

  // sounds
  music = loadSound("sounds/music.mp3");
  goodSound = loadSound("sounds/good.wav");
  badSound = loadSound("sounds/bad.wav");
}

function setup() {
  createCanvas(600,400);

  currentFrames = idleFrames;

  goodX = random(width);
  goodY = random(height);

  badX = random(width);
  badY = random(height);
}

function draw() {

  background(220);

  // stop gameplay if dead
  if(health <= 0){
    gameOver();
    return;
  }

  handleMovement();
  updateAnimation();
  displayCharacter();

  drawFood();
  checkCollisions();

  displayUI();
}

function mousePressed(){

  // start music on interaction
  if(!musicStarted){
    music.loop();
    musicStarted = true;
  }

}

// ===== CHARACTER =====

function handleMovement(){

  moving = false;

  if(keyIsDown(LEFT_ARROW)){
    characterX -= speed;
    moving = true;
  }

  if(keyIsDown(RIGHT_ARROW)){
    characterX += speed;
    moving = true;
  }

  if(keyIsDown(UP_ARROW)){
    characterY -= speed;
    moving = true;
  }

  if(keyIsDown(DOWN_ARROW)){
    characterY += speed;
    moving = true;
  }

  characterX = constrain(characterX,0,width);
  characterY = constrain(characterY,0,height);

  if(moving){
    currentFrames = walkFrames;
  }else{
    currentFrames = idleFrames;
  }

}

// ===== ANIMATION =====

function updateAnimation(){

  animationTimer++;

  if(animationTimer > animationSpeed){
    frameIndex++;
    frameIndex %= currentFrames.length;
    animationTimer = 0;
  }

}

function displayCharacter(){

  imageMode(CENTER);
  image(currentFrames[frameIndex],characterX,characterY,100,100);

}

// ===== FOOD =====

function drawFood(){

  imageMode(CENTER);

  image(goodFoodImg,goodX,goodY,60,60);
  image(badFoodImg,badX,badY,60,60);

}

// ===== COLLISION =====

function checkCollisions(){

  let goodDist = dist(characterX,characterY,goodX,goodY);

  if(goodDist < 60){

    score++;

    goodSound.play();

    goodX = random(width);
    goodY = random(height);

  }

  let badDist = dist(characterX,characterY,badX,badY);

  if(badDist < 60){

    health--;

    badSound.play();

    badX = random(width);
    badY = random(height);

  }

}

// ===== UI =====

function displayUI(){

  fill(0);
  textSize(20);

  text("Score: " + score,20,30);
  text("Health: " + health,20,60);

}

// ===== GAME OVER =====

function gameOver(){

  background(0);

  fill(255);
  textAlign(CENTER);
  textSize(40);

  text("GAME OVER",width/2,height/2);

  textSize(20);
  text("Final Score: " + score,width/2,height/2 + 40);

}
