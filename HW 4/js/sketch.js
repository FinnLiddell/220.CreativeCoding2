/*
Generative AI / External resource reflection is in README.md.
This sketch loads three images, one of which is a generative-AI-produced image (see README).
Movement of the central image is controlled by a timer (setInterval) which updates the target
position every 1200ms; the image moves smoothly towards the target using interpolation.
Custom font is loaded from a hosted open-source font and used for the title and author.
*/

let titleFont;
let imgs = [];
let moverX, moverY;
let targetX, targetY;
const TIMER_MS = 1200;

function preload(){
  // Load a hosted open-source font (Lobster). Using the raw GitHub URL so it's loaded as an asset.
  titleFont = loadFont('https://github.com/google/fonts/raw/main/ofl/lobster/Lobster-Regular.ttf');

  // Three images from the local `images/` folder — two photos and one AI-generated image.
  const urls = [
    'images/pizza1.jpg',
    'images/pizza2.jpg',
    'images/ai-pizza.png'
  ];

  for (let u of urls) imgs.push(loadImage(u));
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  textFont(titleFont);
  imageMode(CORNER);
  // initial mover position in center
  moverX = width/2;
  moverY = height/2 + 80;
  targetX = moverX;
  targetY = moverY;

  // Timer-driven movement: update the target location every TIMER_MS milliseconds
  setInterval(() => {
    updateTarget();
  }, TIMER_MS);
}

function draw(){
  background(250, 245, 240);

  // Title
  fill(30, 30, 30);
  textAlign(CENTER, TOP);
  textSize(56);
  text('My Favorite Food', width/2, 24);

  // Author name in same custom font but smaller
  textSize(20);
  text('By Your Name', width/2, 92);

  // Left static image (photo)
  if (imgs[0]) image(imgs[0], 40, 140, 320, 220);

  // Right static image (photo)
  if (imgs[1]) image(imgs[1], width - 360, 140, 320, 220);

  // Smooth movement for the central image that was triggered by the timer
  moverX = lerp(moverX, targetX, 0.06);
  moverY = lerp(moverY, targetY, 0.06);

  if (imgs[2]) image(imgs[2], moverX - 150, moverY - 100, 300, 200);

  // Small instructions
  textSize(14);
  textAlign(LEFT, BOTTOM);
  fill(80);
  text('The center image moves to a new random location every ' + (TIMER_MS/1000) + 's (timer-driven).', 24, height - 24);
}

function updateTarget(){
  // pick a new constrained location (so the image stays on-screen)
  targetX = random(200, max(400, width - 200));
  targetY = random(200, max(300, height - 200));
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
