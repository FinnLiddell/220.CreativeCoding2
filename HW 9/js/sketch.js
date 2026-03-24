let player;

function setup() {
  createCanvas(600, 400);

  player = createSprite(300, 200, 50, 50);
}

function draw() {
  background(200);
  drawSprites();
}
