let stars = [];
let night = true;

let food1;
let food2;
let foodAI;
let titleFont;

function preload() {
  // Images
  food1 = loadImage("images/pizza1.jpg");
  food2 = loadImage("images/pizza2.jpg");
  foodAI = loadImage("images/ai-pizza.png");

  // Custom font
  titleFont = loadFont("assets/PlayfulTime-BLBB8.ttf");
}

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
  
  if (night) {
    background(30, 40, 70);
  } else {
    background(120, 170, 220);
  }

  fill(0);
  textSize(32);
  text("My Favorite Food: Pizza", 20, 40);

  // NAME (lower-right)
  textSize(16);
  text("Your Name", width - 150, height - 20);

  // Static images
  image(food1, 50, 100, 200, 150);
  image(food2, 300, 100, 200, 150);
  
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
}
