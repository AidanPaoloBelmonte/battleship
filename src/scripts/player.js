class Player {
  gameboard = null;

  constructor() {
    this.gameboard = new GameBoard();
  }
}

class Computer extends Player {
  gameboard = null;
  lastSuccessfulHitPosition = null;

  constructor() {
    super();

    this.lastSuccessfulHitPosition = null;
  }

  makeMove() {
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
}
