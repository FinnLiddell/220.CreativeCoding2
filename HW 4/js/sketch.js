let food1, food2, foodAI;
let titleFont;

let xPos = 0;
let moveRight = true;

// TIMER variable
let lastMoveTime = 0;
let moveInterval = 1000; // move every 1 second

function preload() {
  // Images
  food1 = loadImage("images/pizza1.jpg");
  food2 = loadImage("images/pizza2.png");
  foodAI = loadImage("images/ai-pizza.png");

  // Custom font
  titleFont = loadFont("assets/PlayfulTime-BLBB8.ttf");
}

function setup() {
  createCanvas(800, 600);
  textFont(titleFont);
}

function draw() {
  background(240);

  // TITLE (upper-left)
  fill(0);
  textSize(32);
  text("My Favorite Food: Pizza", 20, 40);

  // NAME (lower-right)
  textSize(16);
  text("Your Name", width - 150, height - 20);

  // Static images
  image(food1, 50, 100, 200, 150);
  image(food2, 300, 100, 200, 150);
