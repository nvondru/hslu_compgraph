let game = {};

function initGame() {
  game = {
    paddleLeft: new Gameobject(20, 100, -380, 0),
    paddleRight: new Gameobject(20, 100, 380, 0),
    ball: new Gameobject(15, 15, 0, 0),
    middleLine: new Gameobject(2, gl.drawingBufferHeight, 0, 0),
  };

  game.ball.speed = { x: 100, y: 0 };

  //   let ballDebugLines = {
  //     top: new Gameobject(10000, 1, 0, game.ball.upperBound),
  //   };
}

class Gameobject {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.updateBounds();
    drawableObjects.push(this);
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
