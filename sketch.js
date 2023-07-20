let bg;
let spaceship;
let spaceshipImg;
let asteroids = [];
let asteroidImg;
let bullets = [];

let gameOver = false;  // New global variable to track the game state

function preload() {
  spaceshipImg = loadImage('./spaceship.png');
  asteroidImg = loadImage('./asteroid.png');
  bg = loadImage('./background.png');
}

function setup() {
  let canvasWidth = 2800;
  let canvasHeight = Math.round(canvasWidth / 0.715);  // Use the aspect ratio of your image here
  createCanvas(canvasWidth, canvasHeight);
  spaceship = new Spaceship();
  for(let i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  let scaleFactor = max(width / bg.width, height / bg.height);
  image(bg, 0, 0, bg.width * scaleFactor, bg.height * scaleFactor);

  spaceship.show();
  spaceship.move();

  for(let a of asteroids) {
    a.show();
    a.move();
    if(spaceship.hits(a)) {
      console.log("GAME OVER");
      gameOver = true;  // Set gameOver to true when the spaceship hits an asteroid
      noLoop();
    }
  }

  for(let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();

    // If bullet is out of canvas, remove it
    if (bullets[i].pos.x < 0 || bullets[i].pos.x > width || bullets[i].pos.y < 0 || bullets[i].pos.y > height) {
      bullets.splice(i, 1);
      continue;
    }

   for(let j = asteroids.length - 1; j >= 0; j--) {
      if(bullets[i] && bullets[i].hits(asteroids[j])) {
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }
  }

  if(asteroids.length === 0) {
    textSize(100);
    fill(255);
    text("YOU WIN", width / 2, height / 2);
    noLoop();
  }

  if(gameOver) {  // Show "手术失败" when gameOver is true
    textSize(64);  // Change this value to scale the text
    fill(255);
    text("手术失败", width / 2, height / 2);
  }
}

function mousePressed() {
  let newBullet = new Bullet(spaceship.pos.copy(), createVector(mouseX, mouseY));
  bullets.push(newBullet);
  console.log("New bullet at:", newBullet.pos, "with velocity:", newBullet.vel);
}

function keyPressed() {  // New function to reset the game when the "R" key is pressed
  if (key == 'r' || key == 'R') {
    resetGame();
  }
}

function resetGame() {  // New function to reset the game state
  asteroids = [];
  bullets = [];
  spaceship = new Spaceship();
  for(let i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
  gameOver = false;
  loop();
}

class Spaceship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 60;
  }

  show() {
    let imgWidth = this.r * 13;  // Change these values to scale the image
    let imgHeight = this.r * 13;
    image(spaceshipImg, this.pos.x, this.pos.y, imgWidth, imgHeight);
  }

  move() {
    if (mouseIsPressed) {
      this.pos.x = lerp(this.pos.x, mouseX, 0.05);
      this.pos.y = lerp(this.pos.y, mouseY, 0.05);
    }
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {  // When the spaceship hits an asteroid
      gameOver = true;  // Set gameOver to true
      return true;
    }
    return false;
  }
}

class Asteroid {
  constructor() {
    let padding = 100;  // Change this value to adjust the distance from the edges of the canvas
    this.pos = createVector(random(padding, width - padding), random(padding, height - padding));
    this.r = 50;
  }

  show() {
    let imgWidth = this.r * 8;  // Change these values to scale the image
    let imgHeight = this.r * 8;
    image(asteroidImg, this.pos.x, this.pos.y, imgWidth, imgHeight);
  }

  move() {
    this.pos.x += random(-1, 1);
    this.pos.y += random(-1, 1);
  }
}

class Bullet {
  constructor(pos, target) {
    this.pos = pos;
    this.vel = p5.Vector.sub(target, pos);
    this.vel.setMag(10);
    this.r = 7;
    console.log("Created bullet with position:", this.pos, "and velocity:", this.vel);
  }

  show() {
    let diameter = this.r * 10;  // Change this value to scale the bullet
    fill(255);
    ellipse(this.pos.x, this.pos.y, diameter, diameter);
  }

  move() {
    this.pos.add(this.vel);
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;
  }
}
