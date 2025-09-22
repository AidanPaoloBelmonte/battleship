import "../styles/style.css";

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

function generateBoard(field) {
  const board = field.querySelector(".board");

  if (!board) return;

  for (let l = 0; l < 81; l++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("active");

    board.appendChild(cell);
  }

  board.addEventListener("click", (e) => attack(e));
}

function attack(e) {
  if (!e.target.classList.contains("active")) return;

  const cell = e.target;
  const index = Array.from(cell.parentNode.children).indexOf(cell);

  const y = Math.floor(index / 9);
  const x = index - y * 9;
  console.log(x, y);

  cell.classList.remove("active");
}

window.onload = () => {
  generateBoard(p1Field);
  generateBoard(p2Field);
};
