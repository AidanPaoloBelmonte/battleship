class Player {
  gameboard = null;

  constructor() {
    this.gameboard = new GameBoard();
  }
}

class Computer extends Player {
  gameboard = null;
  lastSuccessfulHitPosition = null;
  conquerChaseAttempts = 0;
  conquerChaseCount = 0;

  constructor() {
    super();

    this.lastSuccessfulHitPosition = null;
  }

  makeMove() {
    if (!this.lastSuccessfulHitPosition) this.conqueringMove();
    else randomMove();
  }

  randomMove() {
    let move = {
      x: Math.ceil(Math.random() * 9),
      y: Math.ceil(Math.random() * 9),
    };
    while (this.gameboard.isMoveAvailable(move.x, move.y))
      move = {
        x: Math.ceil(Math.random() * 9),
        y: Math.ceil(Math.random() * 9),
      };

    if (gameboard.receiveAttack(move.x, move.y)) {
      this.lastSuccessfulHitPosition = move;
    }
  }

  conqueringMove() {
    let move = this.lastSuccessfulHitPosition();

    count = this.conquerChaseAttempts;
    while (this.gameboard.isMoveAvailable(move.x, move.y)) {
      move = this.exploreAround(this.lastSuccessfulHitPosition, count);

      count++;
      if (count > 8) {
        this.conquerChaseAttempts = 0;
        this.conquerChaseCount = 0;
        this.lastSuccessfulHitPosition = null;

        this.randomMove();
      }
    }

    let giveUpConquerChance = 0;

    if (this.gameboard.receiveAttack(move.x, move.y)) {
      this.conquerChaseAttempts = 0;
      this.conquerChaseCount = 0;
      this.lastSuccessfulHitPosition = move;
      return;
    }

    if (this.conquerChaseCount > 0)
      giveUpConquerChance =
        10 + ((this.conquerChaseCount * (this.conquerChaseCount + 1)) / 2) * 5;
    if (giveUpConquerChance < Math.random()) {
      this.conquerChaseAttempts = 0;
      this.conquerChaseCount = 0;
      this.lastSuccessfulHitPosition = null;
    }
  }

  exploreAround(move, index) {
    const newMove = { x: move.x, y: move.y };

    if (Math.floor(index / 3) === 1) {
      newMove.x = move.x + 1;
    } else if (Mathh.floor(index / 3) >= 2) {
      newMove.x = move.x - 1;
    }

    if (index % 3 === 1) {
      newMove.y = move.y + 1;
    } else if (index % 3 >= 2) {
      newMove.y = move.y - 1;
    }

    return newMove;
  }
}

module.exports = {
  Player: Player,
  Computer: Computer,
};
