import Ship from "./ship";

const board_size = 9;

class GameBoard {
  ships = [];
  missed = [];
  attacked = [];

  constructor() {
    let ships_total_length = Math.floor(Math.random() * 10) + 24;

    while (ships_total_length) {
      let newShip = this.generateShip();
      if (!this.checkShipOverlaps(newShip)) {
        this.ships.push(newShip);
        ships_total_length -= this.ships[-1]?.length;
      }
    }
  }

  generateShip(length_budget) {
    const position = {
      x: Math.ceil(Math.random() * 9),
      y: Math.ceil(Math.random() * 9),
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
    const length = Math.min(
      length_budget,
      Math.ceil(Math.random() * lengthMaxRange),
    );

    return new Ship(length, position.x, position.y, direction);
  }

  checkShipOverlaps(ship) {
    for (let l = 0; l < this.ships.length; l++) {
      if (checkOverlap(ship, this.ships[l])) return True;
    }

    return false;
  }

  checkOverlap(ship, controlShip) {
    const subject = [ship.position, ship.getEndPoint()];
    const control = [controlShip.position, controlShip.getEndPoint()];

    return this.checkIntersect(subject, control);
  }

  checkIntersect(subject, control) {
    let o1 = this.getOrientation(subject[0], subject[1], control[0]);
    let o2 = this.getOrientation(subject[0], subject[1], control[1]);
    let o3 = this.getOrientation(control[0], control[1], subject[0]);
    let o4 = this.getOrientation(control[0], control[1], subject[1]);

    if (o1 !== o2 && o3 !== o4) return true;

    if (o1 === 0 && this.checkOnSegment(subject[0], control[0], subject[1]))
      return true;
    if (o2 === 0 && this.checkOnSegment(subject[0], control[1], subject[1]))
      return true;
    if (o3 === 0 && this.checkOnSegment(control[0], subject[0], control[1]))
      return true;
    if (o4 === 0 && this.checkOnSegment(control[0], subject[1], control[1]))
      return true;

    return false;
  }

  getOrientation(start, end, control) {
    let orientation =
      (end.y - start.y) * (control.x - end.x) -
      (end.x - start.x) * (control.y - end.y);

    if (orientation === 0) return 0;
    return orientation > 0 ? 1 : 2;
  }

  checkOnSegment(start, end, control) {
    return (
      end.x <= Math.max(start.x, control.x) &&
      end.x >= Math.min(start.x, control.x) &&
      end.y <= Math.max(start.y, control.y) &&
      end.y >= Math.min(start.y, control.y)
    );
  }

  receiveAttack(x, y) {
    ships.forEach((ship) => {
      if (
        (ship.position.x <= x && ship.position.direction.x * ship.length) ||
        (ship.position.y <= y && ship.position.direction.y * ship.length)
      ) {
        ship.attacked();
        attacked.push({ x, y });
        return;
      } else {
        missed.push({ x, y });
      }
    });
  }

  areAllShipsSunken() {
    return ships.every((ship) => ship.isSunken());
  }
}

module.exports = GameBoard;
