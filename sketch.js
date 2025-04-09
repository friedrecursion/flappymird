const gravity = 0.22;
const polespeed = 1.36;
let birdsize = 24;
const birdstartHeight = 300;
let birdheight = birdstartHeight;
let birdspeed = 0;
let score = 0;
let highScore = 0;
let firstRound = true;

const polewidth = 25;
const poleGap = birdsize * 4.35;
const poledistance = 140;
const poleoverhang = 5;

let width = 600;
const height = 400;

let poles = [];
let gameOver = false;

function setup() {
  width = windowWidth < 500 ? windowWidth - 20 : 500 - 20;
  let cnv = createCanvas(width, height);
  cnv.mousePressed(flap);
  document.body.insertBefore(cnv.elt, document.getElementById('user-container'));
  fetchHighScore();
  highScore = getHighScore();
  resetGame();
}

function draw() {
  background(100, 180, 255);

  fill(50, 200, 50);
  rect(0, height - 20, width, 20);

  let birdX = 100;
  let birdY = height - birdheight;

  if (!gameOver) {
    fill(255, 255, 0);
    circle(birdX, birdY, birdsize);

    birdheight -= birdspeed;
    birdspeed += gravity;

    if (birdY - birdsize / 2 < 0 || birdY + birdsize / 2 > height - 20) {
      handleGameOver();
    }

    for (let i = 0; i < poles.length; i++) {
      let [x, holeY] = poles[i];

      fill(0, 200, 0);
      rect(x, 0, polewidth, holeY - poleGap / 2);
      rect(x, holeY + poleGap / 2, polewidth, height - holeY - poleGap / 2 - 20);

      rect(x - poleoverhang, holeY - poleGap / 2, polewidth + poleoverhang * 2, poleoverhang * 3);
      rect(x - poleoverhang, holeY + poleGap / 2, polewidth + poleoverhang * 2, poleoverhang * 3);

      if (
        birdX + birdsize / 2 > x &&
        birdX - birdsize / 2 < x + polewidth &&
        (birdY - birdsize < holeY - poleGap / 2 || birdY + birdsize / 2 > holeY + poleGap / 2)
      ) {
        handleGameOver();
      }

      if (!poles[i].passed && x + polewidth < birdX - birdsize / 2) {
        score++;
        poles[i].passed = true;
      }

      poles[i][0] -= polespeed;
    }

    if (poles.length > 0 && poles[0][0] + polewidth < 0) {
      poles.shift();
    }

    if (poles[poles.length - 1][0] < width - poledistance) {
      poles.push([width, randomPoleY()]);
    }

  } else {
    if (firstRound) {
      fetchHighScore();
      firstRound = false;
    }

    highScore = getHighScore();

    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over", width / 2, height / 2 - 30);
    textSize(20);
    text("Score: " + score, width / 2, height / 2);
    text("High Score: " + highScore, width / 2, height / 2 + 30);
    text("Press any key to restart", width / 2, height / 2 + 60);
  }

  textAlign(CENTER, TOP);
  textSize(48);
  fill(255);
  text(score, width / 2, 10);
}

function keyPressed() {
  if (!gameOver && key === ' ') {
    birdspeed = -gravity * 18;
  } else if (gameOver) {
    resetGame();
  }
}

function flap() {
  if (!gameOver) {
    birdspeed = -gravity * 18;
  } else if (gameOver) {
    resetGame();
  }
}

function resetGame() {
  birdheight = birdstartHeight;
  birdspeed = 0;
  score = 0;
  poles = [];
  gameOver = false;
  firstRound = true;

  let x = 300;
  while (x < width + polewidth) {
    poles.push([x, randomPoleY()]);
    x += poledistance;
  }
}

function randomPoleY() {
  return random(poleGap / 2 + 10, height - poleGap / 2 - 30);
}

function handleGameOver() {
  if (!gameOver) {
    gameOver = true;

    if (score > highScore) {
      highScore = score;
      setHighScore(highScore);
      updateHighScore(highScore);
    }
  }
}
