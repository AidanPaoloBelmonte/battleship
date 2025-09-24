const Player = require("../scripts/player");

test("Construction", () => {
  const player = new Player.Player();

  expect(player).not.toBeNull();
});

// test("Explore Around I", () => {
//   const computer = new Player.Computer();
//   const sample = { x: 5, y: 5 };
//   const expectation = { x: 6, y: 5 };

//   expect(computer.exploreAround(sample, 3)).toMatchObject(expectation);
// });

// test("Explore Around II", () => {
//   const computer = new Player.Computer();
//   const sample = { x: 5, y: 5 };
//   const expectation = { x: 4, y: 6 };

//   expect(computer.exploreAround(sample, 7)).toMatchObject(expectation);
// });
