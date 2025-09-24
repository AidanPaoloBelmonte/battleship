import "../styles/style.css";

import { ClassWatcher } from "./watcher";
import { Player, Computer } from "./player";

const menu = document.querySelector("#main-menu");
const results = document.querySelector("#end-game");

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

let p1Manager = new Player();
let p2Manager = new Computer();

let watcher = null;

let current_player = 0;

function startComputerGame() {
  p1Manager = new Player();
  p2Manager = new Computer();

  prepareBoard(p1Field, p1Manager);
  prepareBoard(p2Field, p2Manager);

  p1Field.classList.add("focus-field");
}

function prepareBoard(field, player) {
  const board = field.querySelector(".board");

  generateBoard(board);

  board.addEventListener("click", (e) => attack(e, player));

  if (player instanceof Computer)
    watcher = new ClassWatcher(field, "focus-field", computerTurn);
  else watcher = null;
}

function generateBoard(board) {
  if (!board) return;

  if (board.children) {
    while (board.firstChild) {
      board.removeChild(board.lastChild);
    }
  }

  for (let l = 0; l < 81; l++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("active");

    board.appendChild(cell);
  }
}

function attack(e, player) {
  if (!e.target.classList.contains("active")) return;

  const cell = e.target;
  const index = Array.from(cell.parentNode.children).indexOf(cell);

  const y = Math.floor(index / 9);
  const x = index - y * 9;
  const hit = player.gameboard.receiveAttack(x, y);

  updateCell(cell, hit);
  if (!player.gameboard.areAllShipsSunken()) changeTurn();
  else endGame();
}

function computerTurn() {
  const result = p2Manager.makeMove();
  const index = result.index;

  const board = p2Field.querySelector(".board");
  const cell = board.children[index];

  updateCell(cell, result.hit);
  if (!p2Manager.gameboard.areAllShipsSunken()) changeTurn();
  else endGame();
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

function endGame() {
  let declaration = "Tie?";
  if (current_player) {
    p2Field.classList.remove("focus-field");
    p2Field.classList.add("lost");

    declaration = "You Won!";
  } else {
    p1Field.classList.remove("focus-field");
    p1Field.classList.add("lost");

    declaration = "You Lost!";
  }
  results.querySelector("h1").textContent = declaration;

  results.showModal();
}

window.onload = () => {
  generateBoard(p1Field.querySelector(".board"));
  generateBoard(p2Field.querySelector(".board"));

  menu.showModal();
};

menu.addEventListener("click", (e) => {
  if (!e.target.classList.contains("menu-button")) return;
  const id = e.target.id;

  console.log(id === "vs-com");
  if (id === "vs-com") {
    startComputerGame();
    menu.close();
  }
});
