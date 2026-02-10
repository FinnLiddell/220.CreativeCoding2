let stars = [];
let night = true;

function setup() {
  createCanvas(600, 600);

 
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(2, 5)
    });
  }
}

function draw() {
    background(30, 40, 70);

  
  fill(180);
  rect(100, 80, 400, 300);


  fill(50, 80, 130);
  rect(110, 90, 180, 130);
  rect(310, 90, 180, 130);
  rect(110, 230, 180, 130);
  rect(310, 230, 180, 130);

  fill(255);
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
    s.y += random(-0.5, 0.5);
    s.x += random(-0.5, 0.5);
  }

  
  fill(240, 240, 200);
  ellipse(mouseX, mouseY, 50);


  fill(120);
  ellipse(300, 420, 160, 100);

 
  ellipse(300, 350, 100, 80);


  triangle(260, 320, 280, 270, 300, 320);
  triangle(340, 320, 320, 270, 300, 320);


  rect(360, 430, 70, 15, 10);

  
  fill(160);
  rect(90, 400, 420, 20);
  
    fill(0);
  textSize(32);
  text("My Favorite Food: Pizza", 20, 40);

  textSize(16);
  text("Finn Liddell", width - 150, height - 20);

  image(food1, 50, 100, 200, 150);
  image(food2, 300, 100, 200, 150);
  
  
  let food1, food2, foodAI;
let titleFont;

let xPos = 0;
let moveRight = true;


let lastMoveTime = 0;
let moveInterval = 1000; 

function preload() {
 
  food1 = loadImage("images/pizza1.jpg");
  food2 = loadImage("images/pizza2.jpg");
  foodAI = loadImage("images/ai-pizza.png");

  // Custom font
  titleFont = loadFont("assets/titleFont.ttf");
}

function setup() {
  createCanvas(800, 600);
  textFont(titleFont);
}

function draw() {
  background(240);

  fill(0);
  textSize(32);
  text("My Favorite Food: Pizza", 20, 40);

  textSize(16);
  text("Your Name", width - 150, height - 20);

  image(food1, 50, 100, 200, 150);
  image(food2, 300, 100, 200, 150);

  // TIMER-BASED movement
  if (millis() - lastMoveTime > moveInterval) {
    if (moveRight) {
      xPos += 50;
    } else {
      xPos -= 50;
    }

    if (xPos > width - 200 || xPos < 0) {
      moveRight = !moveRight;
    }

    lastMoveTime = millis();
  }

  // Moving AI image
  image(foodAI, xPos, 350, 200, 150);
}
}
