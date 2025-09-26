const Ship = require("./ship");

const board_size = 9;

class CustomManager {
  ships = [];
  takenCells = [];
  baseCell = null;

  clickEvent = null;
  hoverEvent = null;

  constructor() {
    this.ships = [];
    this.takenCells = [];
    this.baseCell = null;

    this.clickEvent = () => {};
    this.hoverEvent = () => {};
  }

  trackCell(cell) {
    if (cell === this.baseCell) {
      this.baseCell = null;
      return -2;
    }

    if (this.baseCell !== null && this.isValidEndPoint(cell)) {
      return this.createShip(cell);
    } else if (this.baseCell === null) {
      this.baseCell = cell;
      return -1;
    }

    return -3;
  }

  isValidEndPoint(index) {
    if (!this.baseCell) return false;

    const basePosition = this.indexToPosition(this.baseCell);
    const endPosition = this.indexToPosition(index);

    if (!(basePosition.x === endPosition.x || basePosition.y === endPosition.y))
      return false;

    const dir = this.getDirection(basePosition, endPosition);

    if ((dir.x != 0 && dir.y != 0) || dir.x === dir.y) return false;
    return true;
  }

  cancelTrack() {
    const lastCell = this.baseCell;
    this.baseCell = null;

    return lastCell;
  }

  getIntermediaryCells(start, end) {
    const basePosition = this.indexToPosition(start);
    const endPosition = this.indexToPosition(end);
    const length = this.getLength(basePosition, endPosition);
    const dir = this.getDirection(basePosition, endPosition);

    const intermediaries = [];
    if (dir.x !== 0) {
      for (let l = 0; l < length; l++) {
        intermediaries.push(start + (dir.x * l + dir.x));
      }
    } else if (dir.y !== 0) {
      for (let l = 0; l < length; l++) {
        intermediaries.push(start + (dir.y * l + dir.y) * 9);
      }
    }

    return intermediaries;
  }

  createShip(cell) {
    const start = this.indexToPosition(this.baseCell);
    const end = this.indexToPosition(cell);

    const length = this.getLength(start, end);
    const direction = this.getDirection(start, end);

    this.ships.push(new Ship(length, start.x, start.y, direction));
    this.takenCells.push(this.baseCell);
    this.takenCells.push(cell);

    const base = this.baseCell;
    this.baseCell = null;

    return base;
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
