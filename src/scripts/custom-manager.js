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
    if (this.baseCell === null) return false;

    const basePosition = this.indexToPosition(this.baseCell);
    const endPosition = this.indexToPosition(index);

    if (!(basePosition.x === endPosition.x || basePosition.y === endPosition.y))
      return false;
    const dir = this.getDirection(basePosition, endPosition);

    if ((dir.x != 0 && dir.y != 0) || dir.x === dir.y) return false;
    return !this.checkShipOverlaps(basePosition, endPosition);
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

  checkShipOverlaps(start, end) {
    if (this.ships.length <= 0) return false;

    for (let l = 0; l < this.ships.length; l++) {
      if (this.checkOverlap(start, end, this.ships[l])) return true;
    }

    return false;
  }

  checkOverlap(start, end, controlShip) {
    const subject = [start, end];
    const control = [controlShip.position, controlShip.getEndPoints()];

    return this.checkIntersect(subject, control);
  }

  checkIntersect(subject, control) {
    let o1 = this.getVectorAlignment(subject[0], subject[1], control[0]);
    let o2 = this.getVectorAlignment(subject[0], subject[1], control[1]);
    let o3 = this.getVectorAlignment(control[0], control[1], subject[0]);
    let o4 = this.getVectorAlignment(control[0], control[1], subject[1]);

    if (o1 !== o2 && o3 !== o4) return true;

    if (o1 === 0 && this.IsPointAlignedTo(subject[0], control[0], subject[1]))
      return true;
    if (o2 === 0 && this.IsPointAlignedTo(subject[0], control[1], subject[1]))
      return true;
    if (o3 === 0 && this.IsPointAlignedTo(control[0], subject[0], control[1]))
      return true;
    if (o4 === 0 && this.IsPointAlignedTo(control[0], subject[1], control[1]))
      return true;

    return false;
  }

  getVectorAlignment(start, end, control) {
    let orientation =
      (end.y - start.y) * (control.x - end.x) -
      (end.x - start.x) * (control.y - end.y);

    // Collinear
    if (orientation === 0) return 0;

    // Clockwise/Counterclockwise
    return orientation > 0 ? 1 : 2;
  }

  IsPointAlignedTo(start, end, control) {
    return (
      end.x <= Math.max(start.x, control.x) &&
      end.x >= Math.min(start.x, control.x) &&
      end.y <= Math.max(start.y, control.y) &&
      end.y >= Math.min(start.y, control.y)
    );
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
