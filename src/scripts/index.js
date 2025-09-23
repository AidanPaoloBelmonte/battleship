import "../styles/style.css";

import { ClassWatcher } from "./watcher";
import { Player, Computer } from "./player";

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

const p1Manager = new Player();
const p2Manager = new Computer();

let watcher = null;

let current_player = 1;

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

  if (player instanceof Computer)
    watcher = new ClassWatcher(field, "focus-field", computerTurn);
  else watcher = null;
}

function attack(e, player) {
  if (!e.target.classList.contains("active")) return;

  const cell = e.target;
  const index = Array.from(cell.parentNode.children).indexOf(cell);

  const y = Math.floor(index / 9);
  const x = index - y * 9;
  const hit = player.gameboard.receiveAttack(x, y);

  updateCell(cell, hit);
  changeTurn();
}

function computerTurn() {
  const result = p2Manager.makeMove();
  console.log(result);
  const index = result.y * 9 + result.x;

  const board = p2Field.querySelector(".board");
  const cell = board.children[index];

  updateCell(cell, result.hit);
  changeTurn();
}

function changeTurn() {
  current_player = (current_player + 1) % 2;

  p1Field.classList.toggle("focus-field");
  p2Field.classList.toggle("focus-field");
}

function updateCell(cell, hit) {
  cell.classList.remove("active");
  if (hit) cell.classList.add("hit");
  else cell.classList.add("miss");
}

window.onload = () => {
  generateBoard(p1Field, p1Manager);
  generateBoard(p2Field, p2Manager);

  p1Field.classList.add("focus-field");
};
