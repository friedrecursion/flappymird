const gravity = 0.26;
const polespeed = 1.36;
let birdsize = 24;
let birdheight = 380;
let birdspeed = 0;
let score = 0;
let highScore = 0; // Initialize high score

const polewidth = 25;
const poleGap = birdsize * 4;
const poledistance = 120;
const poleoverhang = 5; // Overhang for the poles

const width = 600;
const height = 400;

let poles = [];
let gameOver = false;

function setup() {
  createCanvas(width, height);
  highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Load high score from localStorage
  resetGame();
}

function draw() {
  background(100, 180, 255); // blue background

  // Draw green ground
  fill(50, 200, 50);
  rect(0, height - 20, width, 20);

  let birdX = 100;
  let birdY = height - birdheight;

  if (!gameOver) {
    // Draw bird before poles
    fill(255, 255, 0); // yellow bird
    circle(birdX, birdY, birdsize);

    // Update bird position
    birdheight -= birdspeed;
    birdspeed += gravity;

    // Check if bird hits the top or ground
    if (birdY - birdsize / 2 < 0 || birdY + birdsize / 2 > height - 20) {
      gameOver = true;
    }

    // Update poles
    for (let i = 0; i < poles.length; i++) {
      let [x, holeY] = poles[i];

      fill(0, 200, 0); // green poles
      rect(x, 0, polewidth, holeY - poleGap / 2);
      rect(x, holeY + poleGap / 2, polewidth, height - holeY - poleGap / 2 - 20);

      // draw tube ends
      rect(x - poleoverhang, holeY - poleGap / 2, polewidth + poleoverhang * 2, poleoverhang*3);
      rect(x - poleoverhang, holeY + poleGap / 2, polewidth + poleoverhang * 2, poleoverhang*3);

      // Collision detection (based on birdY)
      if (
        birdX + birdsize / 2 > x &&
        birdX - birdsize / 2 < x + polewidth &&
        (birdY - birdsize  < holeY - poleGap / 2 || birdY + birdsize / 2  > holeY + poleGap / 2)
      ) {
        gameOver = true;
      }

      // Scoring
      if (!poles[i].passed && x + polewidth < birdX - birdsize / 2) {
        score++;
        poles[i].passed = true;
      }

      poles[i][0] -= polespeed;
    }

    // Remove offscreen poles
    if (poles.length > 0 && poles[0][0] + polewidth < 0) {
      poles.shift();
    }

    // Add new poles
    if (poles[poles.length - 1][0] < width - poledistance) {
      poles.push([width, randomPoleY()]);
    }
  } else {
    // Update high score if needed
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore); // Save new high score
    }

    // Game over screen
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over", width / 2, height / 2 - 30);
    textSize(20);
    text("Score: " + score, width / 2, height / 2);
    text("High Score: " + highScore, width / 2, height / 2 + 30);
    text("Press any key to restart", width / 2, height / 2 + 60);
  }

  // Draw score
  textAlign(CENTER, TOP);
  textSize(48); // Big score
  fill(255);
  text(score, width / 2, 10); // Display score at the top center
}

function keyPressed() {
  if (!gameOver && key === ' ') {
    birdspeed = -gravity * 18;
  } else if (gameOver) {
    resetGame();
  }
}

// Handle mobile screen taps
function touchStarted() {
  if (!gameOver) {
    birdspeed = -gravity * 18;
    return false; // Prevents zooming and scrolling during the jump
  } else {
    resetGame();
    return true; // Allow default behavior when game is over, allowing zoom and other touch actions
  }
}


function resetGame() {
  birdheight = 200;
  birdspeed = 0;
  score = 0;
  poles = [];
  gameOver = false;

  let x = 300;
  while (x < width + polewidth) {
    poles.push([x, randomPoleY()]);
    x += poledistance;
  }
}

function randomPoleY() {
  return random(poleGap / 2 + 10, height - poleGap / 2 - 30);
}
