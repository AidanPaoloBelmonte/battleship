const GameBoard = require("./gameboard");

class Player {
  gameboard = null;

  clickEvent = null;
  hoverEvent = null;

  constructor() {
    this.gameboard = new GameBoard();

    this.clickEvent = () => {
      console.log("Wowers");
    };
    this.hoverEvent = () => {};
  }
}

class Computer extends Player {
  gameboard = null;
  lastSuccessfulHitPosition = null;
  lastSuccessfulHitDirection = null;
  conquerChaseAttempts = 0;
  conquerChaseCount = 0;

  clickEvent = null;
  hoverEvent = null;

  constructor() {
    super();

    this.gameboard = new GameBoard();
    this.lastSuccessfulHitPosition = null;
    this.conquerChaseAttempts = 0;
    this.conquerChaseCount = 0;

    this.clickEvent = () => {};
    this.hoverEvent = () => {};
  }

  makeMove() {
    let move = { x: 0, y: 0 };

    if (this.lastSuccessfulHitPosition) move = this.conqueringMove();
    else move = this.randomMove();

    let hit = this.gameboard.receiveAttack(move.x, move.y);

    if (this.lastSuccessfulHitPosition) {
      if (hit) {
        const dir = this.gameboard.getDirection(
          this.lastSuccessfulHitPosition,
          move,
        );

        this.resetConquerState(move, dir);
      } else this.rollGiveUpConquerChase();
    } else if (hit) this.resetConquerState(move);

    return {
      index: this.gameboard.positionToIndex(move.x, move.y),
      hit: hit,
    };
  }

  randomMove() {
    const move = this.gameboard.getRandomFreePosition();

    if (!move) {
      console.error("No more free moves are available!");
      return { x: 0, y: 0 };
    }

    return move;
  }

  conqueringMove() {
    if (!this.lastSuccessfulHitDirection) return this.exploreMove();
    return this.followMove();
  }

  exploreMove() {
    let move = this.lastSuccessfulHitPosition;
    let count = this.conquerChaseCount;
    while (!this.gameboard.isMoveAvailable(move.x, move.y)) {
      move = this.exploreAround(this.lastSuccessfulHitPosition, count);

      count++;
      if (count > 3) {
        this.resetConquerState();
        return this.randomMove();
      }
    }

    this.conquerChaseCount = count;
    return move;
  }

  exploreAround(move, index) {
    if (index == 0) return { x: move.x + 1, y: move.y };
    else if (index == 1) return { x: move.x - 1, y: move.y };
    else if (index == 2) return { x: move.x, y: move.y + 1 };
    else if (index == 3) return { x: move.x, y: move.y - 1 };

    return null;
  }

  followMove() {
    let nextMove = {
      x: this.lastSuccessfulHitPosition.x + this.lastSuccessfulHitDirection.x,
      y: this.lastSuccessfulHitPosition.y + this.lastSuccessfulHitDirection.y,
    };

    if (!this.gameboard.isMoveAvailable(nextMove.x, nextMove.y))
      return this.exploreMove();

    return nextMove;
  }

  resetConquerState(move = null, dir = null) {
    this.conquerChaseAttempts = 0;
    this.conquerChaseCount = 0;
    this.lastSuccessfulHitPosition = move;
    this.lastSuccessfulHitDirection = dir;
  }

  rollGiveUpConquerChase() {
    if (this.conquerChaseAttempts <= 0) return;
    giveUpConquerChance =
      10 +
      ((this.conquerChaseAttempts * (this.conquerChaseAttempts + 1)) / 2) * 6;

    if (giveUpConquerChance < Math.random() * 100) {
      this.resetConquerState();
    }
  }
}

module.exports = {
  Player: Player,
  Computer: Computer,
};
