const Ship = require("../scripts/ship");

test("Construction", () => {
  const expectation = {
    position: { x: 3, y: 3 },
    length: 5,
    direction: { x: 1, y: 0 },
    hits: 0,
  };
  const test = new Ship(5, 3, 3, { x: 1, y: 0 });

  expect(test).toMatchObject(expectation);
});

test("End Point Calculation I", () => {
  const expectation = { x: 8, y: 3 };
  const test = new Ship(5, 3, 3, { x: 1, y: 0 });

  expect(test.getEndPoint()).toMatchObject(expectation);
});

test("End Point Calculation II", () => {
  const expectation = { x: 5, y: 0 };
  const test = new Ship(5, 5, 5, { x: 0, y: -1 });

  expect(test.getEndPoint()).toMatchObject(expectation);
});

test("Hit", () => {
  const test = new Ship(5, 3, 3, { x: 1, y: 0 });
  test.hit();
  test.hit();
  test.hit();

  expect(test.hits).toBe(3);
});

test("State Sunken I", () => {
  const test = new Ship(3, 3, 3, { x: 1, y: 0 });
  test.hit();
  test.hit();
  test.hit();

  expect(test.isSunk()).toBe(true);
});

test("State Sunken", () => {
  const test = new Ship(4, 3, 3, { x: 1, y: 0 });
  test.hit();
  test.hit();
  test.hit();

  expect(test.isSunk()).toBe(false);
});
