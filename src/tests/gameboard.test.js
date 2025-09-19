const Ship = require("../scripts/ship");
const GameBoard = require("../scripts/gameboard");

test("Construction", () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.ships.length).toBeGreaterThan(2);
});

test("Ship Generation", () => {
  const gameBoard = new GameBoard(40);
  expect(gameBoard.ships.length).toBeGreaterThan(4);
});

test("General Overlap Detection", () => {
  const gameboard = new GameBoard();
  const controlShip = new Ship(5, 5, 5, { x: 1, y: 0 });
  const testShip = new Ship(6, 7, 8, { x: 0, y: -1 });

  expect(gameboard.checkOverlap(testShip, controlShip)).toBe(true);
});

test("Vertex Overlap Detection", () => {
  const gameboard = new GameBoard();
  const controlShip = new Ship(3, 0, 0, { x: 1, y: 0 });
  const testShip = new Ship(7, 0, 0, { x: 0, y: 1 });

  expect(gameboard.checkOverlap(testShip, controlShip)).toBe(true);
});

test("Perpendicular Overlap Detection", () => {
  const gameboard = new GameBoard();
  const controlShip = new Ship(9, 0, 0, { x: 1, y: 0 });
  const testShip = new Ship(9, 5, 8, { x: 0, y: -1 });

  expect(gameboard.checkOverlap(testShip, controlShip)).toBe(true);
});

test("Hit Detection I", () => {
  const gameboard = new GameBoard();
  gameboard.ships = [];

  const testShip = new Ship(1, 5, 5, { x: 1, y: 0 });
  gameboard.ships.push(testShip);

  gameboard.receiveAttack(5, 5);

  expect(gameboard.ships[0].isSunk()).toBe(true);
});

test("Hit Detection II", () => {
  const gameboard = new GameBoard();
  gameboard.ships = [];

  const testShip = new Ship(3, 5, 5, { x: 0, y: 1 });
  gameboard.ships.push(testShip);

  gameboard.receiveAttack(5, 5);

  expect(gameboard.ships[0].hits).toBe(1);
});

test("Hit Detection III", () => {
  const gameboard = new GameBoard();
  gameboard.ships = [];

  const testShip = new Ship(3, 5, 5, { x: 0, y: -1 });
  gameboard.ships.push(testShip);

  gameboard.receiveAttack(5, 4);

  expect(gameboard.ships[0].hits).toBe(1);
});

test("Ship Status Detection I", () => {
  const gameboard = new GameBoard();
  gameboard.ships = [];
  for (let l = 0; l < 5; l++) {
    let newShip = new Ship(1, l, l, { x: 1, y: 0 });
    if (l < 3) newShip.hit();

    gameboard.ships.push(newShip);
  }

  expect(gameboard.areAllShipsSunken()).toBe(false);
});

test("Ship Status Detection II", () => {
  const gameboard = new GameBoard();
  gameboard.ships = [];
  for (let l = 0; l < 5; l++) {
    const newShip = new Ship(1, l, l, { x: 1, y: 0 });
    newShip.hit();
    newShip.hit();

    gameboard.ships.push(newShip);
  }

  expect(gameboard.areAllShipsSunken()).toBe(true);
});

test("Cell Availability I", () => {
  const gameboard = new GameBoard();
  gameboard.missed.push({ x: 1, y: 5 });

  expect(gameboard.isMoveAvailable(1, 5)).toBe(false);
});

test("Cell Availability II", () => {
  const gameboard = new GameBoard();
  gameboard.missed.push({ x: 3, y: 5 });

  expect(gameboard.isMoveAvailable(1, 5)).toBe(true);
});
