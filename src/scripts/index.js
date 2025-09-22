import "../styles/style.css";

import { Player, Computer } from "./player";

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

const p1Manager = new Player();
const p2Manager = new Player();

function generateBoard(field, player) {
  const board = field.querySelector(".board");

  if (!board) return;

  for (let l = 0; l < 81; l++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("active");

    board.appendChild(cell);
  }

  board.addEventListener("click", (e) => attack(e, player));
}

function attack(e, player) {
  if (!e.target.classList.contains("active")) return;

  const cell = e.target;
  const index = Array.from(cell.parentNode.children).indexOf(cell);

  const y = Math.floor(index / 9);
  const x = index - y * 9;
  const hit = player.gameboard.receiveAttack(x, y);

  cell.classList.remove("active");
  if (hit) cell.classList.add("hit");
  else cell.classList.add("miss");
}

window.onload = () => {
  generateBoard(p1Field, p1Manager);
  generateBoard(p2Field, p2Manager);
};
