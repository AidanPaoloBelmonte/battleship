import Ship from "./ship";

const board_size = 9;

export class GameBoard {
  ships = [];
  missed = [];
  attacked = [];

  constructor() {
    let ships_total_length = Math.floor(Math.random() * 10) + 24;

    while (ships_total_length) {
      let newShip = this.generateShip();
      if (!this.checkOverlap(newShip)) {
        this.ships.push(newShip);
        ships_total_length -= ships[-1]?.length;
      }
    }
  }

  generateShip(length_budget) {
    const coordinates = {
      x: Math.ceil(Math.random() * 9),
      y: Math.ceil(Math.random() * 9),
    };

    const direction = { x: 0, y: 0 };
    const directionRandom = Math.ceil(Math.random() * 100);
    const modifier = directionRandom % 2 === 0 ? 1 : -1;
    const basePos = 0;

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

    return new Ship(length, coordinates.x, coordinates.y, direction);
  }

  checkOverlap(ship) {
    const subject = [ship.position, ship.getEndPoint()];
    for (let l = 0; l < this.ships.length; l++) {
      const control = [this.ships[l].position, this.ships[l].getEndPoint()];

      if (this.checkIntersect(subject, control)) return True;
    }

    return False;
  }

  checkIntersect(subject, control) {
    let o1 = getOrientation(subject[0], subject[1], control[0]);
    let o2 = getOrientation(subject[0], subject[1], control[1]);
    let o3 = getOrientation(control[0], control[1], subject[0]);
    let o4 = getOrientation(control[0], control[1], subject[1]);

    if (o1 !== o2 && o3 !== o4) return True;

    if (o1 === 0 && this.checkOnSegment(subject[0], control[0], subject[1]))
      return True;
    if (o2 === 0 && this.checkOnSegment(subject[0], control[1], subject[1]))
      return True;
    if (o3 === 0 && this.checkOnSegment(control[0], subject[0], control[1]))
      return True;
    if (o4 === 0 && this.checkOnSegment(control[0], subject[1], control[1]))
      return True;

    return False;
  }

  getOrientation(start, end, control) {
    let orientation =
      (end[1] - start[1]) * (control[0] - end[0]) -
      (end[0] - start[0]) * (control[1] - end[1]);

    if (orientation === 0) return 0;
    return orientation > 0 ? 1 : 2;
  }

  checkOnSegment(start, end, control) {
    return (
      end[0] <= Math.max(start[0], control[0]) &&
      end[0] >= Math.min(start[0], control[0]) &&
      end[1] <= Math.max(start[1], control[1]) &&
      end[1] >= Math.min(start[1], control[1])
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
