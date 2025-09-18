class Ship {
  position = { x: 0, y: 0 };
  direction = { x: 1, y: 0 };
  length = 0;
  hits = 0;

  constructor(length, x, y, direction) {
    this.length = length;
    this.position = { x, y };
    this.direction = direction;
  }

  getEndPoints() {
    return {
      x: this.position.x + this.direction.x * (this.length - 1),
      y: this.position.y + this.direction.y * (this.length - 1),
    };
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

module.exports = Ship;
