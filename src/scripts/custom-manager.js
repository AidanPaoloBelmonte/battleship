const Ship = require("./ship");

const board_size = 9;

class CustomManager {
  ships = [];
  takenCells = [];
  baseCell = null;

  constructor() {
    this.ships = [];
    this.takenCells = [];
    this.baseCell = null;
  }

  trackCell(cell) {
    if (this.baseCell !== null) this.createShip(cell);
    else this.baseCell = cell;
  }

  cancelTrack() {
    const lastCell = this.baseCell;
    this.baseCell = null;

    return lastCell;
  }

  createShip(cell) {
    const start = this.indexToPosition(this.baseCell);
    const end = this.indexToPosition(cell);

    const length = this.getLength(start, end);
    const direction = this.getDirection(start, end);

    this.ships.push(new Ship(length, start.x, start.y, direction));
    this.takenCells.push(this.baseCell);
    this.takenCells.push(cell);
    this.baseCell = null;
  }

  positionToIndex(x, y) {
    return y * board_size + x;
  }

  indexToPosition(index) {
    const y = Math.floor(index / board_size);
    const x = index - y * board_size;

    return { x, y };
  }

  getLength(start, end) {
    const vector = {
      x: end.x - start.x,
      y: end.y - start.y,
    };

    return Math.max(Math.abs(vector.x), Math.abs(vector.y));
  }

  getDirection(start, end) {
    const vector = {
      x: end.x - start.x,
      y: end.y - start.y,
    };

    const magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    return {
      x: Math.floor(vector.x / magnitude),
      y: Math.floor(vector.y / magnitude),
    };
  }
}

module.exports = CustomManager;
