const Ship = require("../scripts/ship");
const GameBoard = require("../scripts/gameboard");

test("Construction", () => {
  const gameBoard = new GameBoard();

  expect(gameBoard.ships.length).toBeGreaterThan(0);
});

test("Overlap Detection", () => {
  const gameboard = new GameBoard();
  const controlShip = new Ship(5, 5, 5, { x: 1, y: 0 });
  const testShip = new Ship(6, 7, 8, { x: 0, y: -1 });
  console.log("Overlap Dtection");
  console.log(controlShip.position, controlShip.getEndPoint());
  console.log(testShip.position, testShip.getEndPoint());

  expect(gameboard.checkOverlap(testShip, controlShip)).toBe(true);
});
