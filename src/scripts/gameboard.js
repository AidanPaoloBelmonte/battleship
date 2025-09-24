const Ship = require("./ship");

const board_size = 9;

class GameBoard {
  ships = [];
  freeCells = [];

  constructor(customLengthBudget = 0) {
    this.ships = [];
    this.freeCells = [];

    this.init(customLengthBudget);
  }

  init(customLengthBudget = 0) {
    for (let l = 0; l < board_size * board_size; l++) this.freeCells.push(l);

    let shipsLengthBudget = customLengthBudget;
    if (customLengthBudget <= 0)
      shipsLengthBudget = Math.floor(Math.random() * 10) + 12;

    let calls = 0;
    let shipCount = 0;
    while (shipsLengthBudget > 0) {
      if (calls > 100) break;

      let newShip = this.generateShip(shipsLengthBudget);
      if (newShip.length > 0 && !this.checkShipOverlaps(newShip)) {
        this.ships.push(newShip);
        shipsLengthBudget -= newShip.length;

        shipCount++;
      }

      calls++;
    }
  }

  generateShip(lengthBudget) {
    const position = {
      x: Math.floor(Math.random() * 8),
      y: Math.floor(Math.random() * 8),
    };

    const direction = { x: 0, y: 0 };
    const directionRandom = Math.ceil(Math.random() * 100);
    const modifier = directionRandom % 2 === 0 ? 1 : -1;
    let basePos = 0;

    if (directionRandom < 50) {
      basePos = position.x;
      direction.x = 1 * modifier;
    } else {
      basePos = position.y;
      direction.y = 1 * modifier;
    }

    const lengthMaxRange = modifier > 0 ? 9 - basePos : basePos;
    if (lengthMaxRange <= 0) return -1;

    const length = Math.max(
      this.randomWeighted(Math.min(lengthBudget, lengthMaxRange)),
      1,
    );

    return new Ship(length, position.x, position.y, direction);
  }

  randomWeighted(max) {
    const baseWeights = [1, 1, 1, 3, 10, 30, 15, 15, 12];
    const weights = [];

    for (let l = 1; l < Math.min(baseWeights.length, max); l++) {
      weights.push(baseWeights[l] + baseWeights[l - 1]);
    }

    let rand = Math.random() * weights[weights.length - 1];

    let index = -1;
    for (let l = 0; l < weights.length; l++) {
      if (weights[l] > rand) {
        index = l;
        break;
      }
    }

    return index;
  }

  checkShipOverlaps(ship) {
    if (this.ships.length <= 0) return false;

    for (let l = 0; l < this.ships.length; l++) {
      if (this.checkOverlap(ship, this.ships[l])) return true;
    }

    return false;
  }

  checkOverlap(ship, controlShip) {
    const subject = [ship.position, ship.getEndPoints()];
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

  IsPointAlignedScalar(start, end, control) {
    let subjectLength = { x: end.x - start.x, y: end.y - start.y };
    let controlLength = { x: control.x - start.x, y: control.y - start.y };

    const pointDP =
      subjectLength.x * controlLength.x + subjectLength.y * controlLength.y;
    if (pointDP < 0) return false;

    const controlDP =
      controlLength.x * controlLength.x + controlLength.y * controlLength.y;

    return pointDP < controlDP;
  }

  getRandomFreePosition() {
    if (!this.freeCells) return null;

    const index =
      this.freeCells[Math.ceil(Math.random() * this.freeCells.length) - 1];
    return this.indexToPosition(index);
  }

  receiveAttack(x, y) {
    for (let l = 0; l < this.ships.length; l++) {
      const ship = this.ships[l];

      if (ship.length <= 1 && ship.position.x === x && ship.position.y === y) {
        ship.hit();
        this.recordAttack(x, y);
        return true;
      }

      if (
        this.getVectorAlignment(
          ship.position,
          { x, y },
          ship.getEndPoints(),
        ) !== 0
      )
        continue;

      if (
        !this.IsPointAlignedScalar(ship.position, { x, y }, ship.getEndPoints())
      )
        continue;

      ship.hit();
      this.recordAttack(x, y);
      return true;
    }

    this.recordAttack(x, y);
    return false;
  }

  recordAttack(x, y) {
    let index = this.positionToIndex(x, y);
    this.freeCells.splice(this.freeCells.indexOf(index), 1);
  }

  positionToIndex(x, y) {
    return y * board_size + x;
  }

  indexToPosition(index) {
    const y = Math.floor(index / board_size);
    const x = index - y * board_size;

    return { x, y };
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

  isMoveAvailable(x, y) {
    if (x < 0 || y < 0 || x > board_size || y > board_size) return false;

    let index = this.positionToIndex(x, y);
    return this.freeCells.includes(index);
  }

  areAllShipsSunken() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

module.exports = GameBoard;
