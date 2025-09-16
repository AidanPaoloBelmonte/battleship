const Ship = require("../scripts/ship");

test("Construction", () => {
  const expectation = {
    length: 5,
    hits: 0,
  };
  const test = new Ship(5);

  expect(test).toMatchObject(expectation);
});

test("Hit", () => {
  const test = new Ship(5);
  test.hit();
  test.hit();
  test.hit();

  expect(test.hits).toBe(3);
});

test("State Sunken I", () => {
  const test = new Ship(3);
  test.hit();
  test.hit();
  test.hit();

  expect(test.isSunk()).toBe(true);
});

test("State Sunken", () => {
  const test = new Ship(4);
  test.hit();
  test.hit();
  test.hit();

  expect(test.isSunk()).toBe(false);
});
