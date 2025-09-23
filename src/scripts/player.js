const GameBoard = require("./gameboard");

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

    this.gameboard = new GameBoard();
    this.lastSuccessfulHitPosition = null;
  }

  makeMove() {
    let move = { x: 0, y: 0 };

    if (this.lastSuccessfulHitPosition) move = this.conqueringMove();
    else move = this.randomMove();

    let hit = this.gameboard.receiveAttack(move.x, move.y);

    if (this.lastSuccessfulHitPosition) {
      if (hit) this.resetConquerState(move);
      else this.rollGiveUpConquerChase();
    } else if (hit) this.resetConquerState(move);

    return {
      x: move.x,
      y: move.y,
      hit: hit,
    };
  }

  randomMove() {
    let move = {
      x: Math.ceil(Math.random() * 8),
      y: Math.ceil(Math.random() * 8),
    };

    let count = 0;
    while (!this.gameboard.isMoveAvailable(move.x, move.y)) {
      move = {
        x: Math.ceil(Math.random() * 8),
        y: Math.ceil(Math.random() * 8),
      };

      count++;

      if (count > 100) {
        console.error("Took too long to decide a move!");
        return 0;
      }
    }

    return move;
  }

  conqueringMove() {
    let move = this.lastSuccessfulHitPosition;

    let count = this.conquerChaseAttempts;
    while (this.gameboard.isMoveAvailable(move.x, move.y)) {
      move = this.exploreAround(this.lastSuccessfulHitPosition, count);

      count++;
      if (count > 8) {
        this.resetConquerState();
        return this.randomMove();
      }
    }

    return move;
  }

  resetConquerState(newPosition = null) {
    this.conquerChaseAttempts = 0;
    this.conquerChaseCount = 0;
    this.lastSuccessfulHitPosition = newPosition;
  }

  rollGiveUpConquerChase() {
    if (this.conquerChaseAttempts <= 0) return;
    giveUpConquerChance =
      10 +
      ((this.conquerChaseAttempts * (this.conquerChaseAttempts + 1)) / 2) * 5;

    if (giveUpConquerChance < Math.random() * 100) {
      this.resetConquerState();
    }
  }

  exploreAround(move, index) {
    const newMove = { x: move.x, y: move.y };

    if (Math.floor(index / 3) === 1) {
      newMove.x = move.x + 1;
    } else if (Math.floor(index / 3) >= 2) {
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
