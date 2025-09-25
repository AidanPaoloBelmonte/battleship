const Ship = require("../scripts/ship");
const CustomManager = require("../scripts/custom-manager");

test("Construction", () => {
  const customManager = new CustomManager();
  expect(customManager.baseCell).toBeNull();
});

test("Tracking", () => {
  const customManager = new CustomManager();
  customManager.trackCell(5);

  expect(customManager.baseCell).toBe(5);
});

test("Tracking Cancellation", () => {
  const customManager = new CustomManager();
  customManager.trackCell(5);
  customManager.cancelTrack();

  expect(customManager.baseCell).toBeNull();
});

test("Ship Generation I", () => {
  const customManager = new CustomManager();
  customManager.trackCell(0);
  customManager.trackCell(27);

  const expectation = new Ship(3, 0, 0, { x: 0, y: 1 });

  expect(customManager.ships[0]).toMatchObject(expectation);
});

test("Ship Generation II", () => {
  const customManager = new CustomManager();
  customManager.trackCell(33);
  customManager.trackCell(30);

  const expectation = new Ship(3, 6, 3, { x: -1, y: 0 });

  expect(customManager.ships[0]).toMatchObject(expectation);
});
