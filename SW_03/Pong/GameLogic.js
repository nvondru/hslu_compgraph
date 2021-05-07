let game = {};

function initGame() {
  game = {
    paddleLeft: {
      scale: { x: 10, y: 60 },
      translate: { x: -gl.drawingBufferWidth / 2 + 20, y: 0 },
    },
    paddleRight: {
      scale: { x: 10, y: 60 },
      translate: { x: gl.drawingBufferWidth / 2 - 20, y: 0 },
    },
    ball: {
      scale: { x: 10, y: 10 },
      translate: { x: 0, y: 0 },
      speed: { x: 100, y: 0 },
    },
  };
}

class Rectangle {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
  updateBounds() {
    this.leftBound = this.x - this.width / 2;
    this.upperBound = this.y - this.height / 2;
    this.rightBound = this.x + this.width / 2;
    this.lowerBound = this.y + this.height / 2;
  }
}
