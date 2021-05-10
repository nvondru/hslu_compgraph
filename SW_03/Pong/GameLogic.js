let game = {};

function initGame() {
  game = {
    paddleLeft: new GameObject(20, 100, -380, 0, true),

    paddleRight: new GameObject(20, 100, 380, 0, true),
    ball: new GameObject(15, 15, 0, 0, true),
    middleLine: new GameObject(2, gl.drawingBufferHeight, 0, 0, true),
    upperBorder: new GameObject(
      gl.drawingBufferWidth,
      10,
      0,
      gl.drawingBufferHeight / 2,
      false
    ),
    lowerBorder: new GameObject(
      gl.drawingBufferWidth,
      10,
      0,
      -gl.drawingBufferHeight / 2,
      false
    ),
    rightBorder: new GameObject(
      10,
      gl.drawingBufferHeight,
      gl.drawingBufferWidth / 2,
      0,
      false
    ),
    leftBorder: new GameObject(
      10,
      gl.drawingBufferHeight,
      -gl.drawingBufferWidth / 2,
      0,
      false
    ),
    player1: new Player(1),
    player2: new Player(2),
  };

  game.paddleLeft.handleCollision = () => {
    if (game.ball.y > game.paddleLeft.upperBound - game.paddleLeft.height / 3) {
      game.ball.speed.y = 100;
    } else if (
      game.ball.y <
      game.paddleLeft.lowerBound + game.paddleLeft.height / 3
    ) {
      game.ball.speed.y = -100;
    } else {
      game.ball.speed.y = 0;
    }
    game.ball.speed.x *= -1;
  };

  game.paddleRight.handleCollision = () => {
    if (
      game.ball.y >
      game.paddleRight.upperBound - game.paddleRight.height / 3
    ) {
      game.ball.speed.y = 200;
    } else if (
      game.ball.y <
      game.paddleRight.lowerBound + game.paddleRight.height / 3
    ) {
      game.ball.speed.y = -200;
    } else {
      game.ball.speed.y = game.ball.speed.y;
    }
    game.ball.speed.x *= -1;
  };
  document.getElementById("pong").addEventListener("click", () => {
    location.reload();
  });
  nextRound();
}

function nextRound() {
  game.ball.x = 0;
  game.ball.y = 0;
  let initialYSpeed = Math.floor(Math.random() * 100);
  let initialDirection = Math.round(Math.random());
  if (initialDirection > 0) {
    game.ball.speed = { x: 500, y: initialYSpeed };
  } else {
    game.ball.speed = { x: -500, y: initialYSpeed };
  }
}

class GameObject {
  constructor(width, height, x, y, visible) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.updateBounds();
    if (visible === true) {
      drawableObjects.push(this);
    }
  }
  updateBounds() {
    this.leftBound = this.x - this.width / 2;
    this.upperBound = this.y + this.height / 2;
    this.rightBound = this.x + this.width / 2;
    this.lowerBound = this.y - this.height / 2;
  }
  collidesWith(other) {
    return objectsCollide(this, other);
  }
  moveBy(vector, deltaTime) {
    this.x += vector.x * deltaTime;
    this.y += vector.y * deltaTime;
    this.updateBounds();
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.scoreDisplay = document.getElementById("score--player" + name);
  }
  increasePoints() {
    this.score++;
    this.scoreDisplay.innerHTML = this.score;
  }
}
