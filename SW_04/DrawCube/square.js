class Square {
  constructor(width, height, depth, x, y, z) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.position = {};
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    // prettier-ignore
    this.vertices = [
      0, 0, 0,
      1, 0, 0,
      1, 0, 1,
      0, 0, 1,
      0, 1, 0, 
      1, 1, 0,
      1, 1, 1,
      0, 1, 1,
    ];
    this.angle = 0;
    this.rotation = {
      x: 0,
      y: 0,
      z: 0,
    };
  }
}
