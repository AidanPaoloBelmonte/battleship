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
}

window.onload = () => {
  generateBoard(p1Field);
  generateBoard(p2Field);
};
