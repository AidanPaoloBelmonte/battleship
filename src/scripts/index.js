import "../styles/style.css";

import { ClassWatcher } from "./watcher";
import { Player, Computer } from "./player";

const CustomManager = require("./custom-manager");

const menu = document.querySelector("#main-menu");
const boardMenu = document.querySelector("#board-setup");
const results = document.querySelector("#end-game");
const previous = document.querySelector(".previous");
const customizeUI = document.querySelector("#customize-ui");
const ready = customizeUI.querySelector("#ready");

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

let p1Manager = new Player();
let p2Manager = new Computer();

let watcher = null;

let lastMode = null;
let currentPlayer = 0;

function onPlayer1Click(e, player) {
  p1Manager.clickEvent(e, player);
}

function onPlayer2Click(e, player) {
  p2Manager.clickEvent(e, player);
}

function onPlayer1Hover(e, player) {
  p1Manager.hoverEvent(e, player);
}

function onPlayer2Hover(e, player) {
  p2Manager.hoverEvent(e, player);
}

function startComputerGame() {
  lastMode = startComputerGame;

  p1Manager = new Player();
  p2Manager = new Computer();

  setupFields();
}

function startVersusGame() {
  lastMode = startVersusGame;

  p1Manager = new Player();
  p2Manager = new Player();

  setupFields();
}

function startCustomGame() {
  lastMode = startBoardCustomize;

  const p1Ships = p1Manager.ships;
  const p2Ships = p2Manager.ships;

  p1Manager = new Player(p1Ships);
  p2Manager = new Player(p2Ships);

  setupFields();
}

function startBoardCustomize() {
  customizeUI.classList.remove("hide");

  p1Manager = new CustomManager();
  p2Manager = new CustomManager();

  trackBoardCustomization(p1Manager, p1Field);
  trackBoardCustomization(p2Manager, p2Field);

  resetFieldStatus();
}

function trackBoardCustomization(player, field) {
  const board = field.querySelector(".board");
  if (!board) return;

  generateBoard(board);

  player.clickEvent = (e) => defineShipPoints(e, player);
  player.hoverEvent = (e) => validateShipPoints(e, player);
}

function defineShipPoints(e, player) {
  if (!e.target.classList.contains("cell")) return;
  if (e.target.classList.contains("hit")) return;

  const cell = e.target;
  const cells = Array.from(cell.parentNode.children);
  const index = cells.indexOf(cell);

  const status = player.trackCell(index);
  if (status === -1) {
    trackCell(cell);
  } else if (status > -1) {
    const indexes = player.getIntermediaryCells(status, index);
    indexes.push(status);

    const intermediaries = indexes.map((i) => {
      return cells[i];
    });

    fillCells(intermediaries);
    ready.classList.add("enabled");
  } else {
    untrackCell(cell);
  }
}

function validateShipPoints(e, player) {
  if (player.baseCell === null) return;
  if (!e.target.classList.contains("active")) return;

  const cell = e.target;
  const cells = Array.from(cell.parentNode.children);
  const index = cells.indexOf(cell);

  const isValidEndPoint = player.isValidEndPoint(index);

  if (isValidEndPoint) {
    const indexes = player.getIntermediaryCells(player.baseCell, index);

    const intermediaries = indexes.map((i) => {
      return cells[i];
    });

    scoutCells(intermediaries);
  } else {
    cell.classList.toggle("invalid");
  }
}

function setupFields() {
  currentPlayer = 0;

  prepareBoard(p1Field, p1Manager);
  prepareBoard(p2Field, p2Manager);

  resetFieldStatus();
}

function prepareBoard(field, player) {
  const board = field.querySelector(".board");

  generateBoard(board);

  if (player instanceof Computer)
    watcher = new ClassWatcher(field, "focus-field", computerTurn);
  else {
    if (watcher) watcher.disconnect();
    player.clickEvent = (e) => attack(e, player);
  }
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

  hitCell(cell, hit);
  if (!player.gameboard.areAllShipsSunken()) changeTurn();
  else endGame();
}

function computerTurn() {
  const result = p2Manager.makeMove();
  const index = result.index;

  const board = p2Field.querySelector(".board");
  const cell = board.children[index];

  hitCell(cell, result.hit);
  if (!p2Manager.gameboard.areAllShipsSunken()) changeTurn();
  else endGame();
}

function changeTurn() {
  currentPlayer = (currentPlayer + 1) % 2;

  p1Field.classList.toggle("focus-field");
  p2Field.classList.toggle("focus-field");
}

function hitCell(cell, hit) {
  cell.classList.remove("active");
  if (hit) cell.classList.add("hit");
  else cell.classList.add("miss");
}

function trackCell(cell) {
  cell.classList.remove("active");
  cell.classList.add("track");
}

function untrackCell(cell) {
  cell.classList.add("active");
  cell.classList.remove("track");
}

function fillCells(cells) {
  cells.forEach((cell) => {
    cell.classList.remove("active");
    cell.classList.remove("track");
    cell.classList.remove("hint");
    cell.classList.add("hit");
  });
}

function scoutCells(cells) {
  cells.forEach((cell) => {
    cell.classList.toggle("hint");
  });
}

function endGame() {
  let declaration = "Tie?";
  if (currentPlayer) {
    p1Field.classList.remove("focus-field");
    p1Field.classList.add("lost");

    if (watcher) declaration = "You Lost!";
    else declaration = "Player 2 Wins!";
  } else {
    p2Field.classList.remove("focus-field");
    p2Field.classList.add("lost");

    if (watcher) declaration = "You Won!";
    else declaration = "Player 1 Wins!";
  }
  results.querySelector("h1").textContent = declaration;

  results.showModal();
}

function resetFieldStatus() {
  p1Field.className = "player";
  p2Field.className = "player";

  p1Field.classList.add("focus-field");
}

function openBoardSetupMenu() {
  boardMenu.classList.add("open");
  previous.classList.add("appear");
}

function closeBoardSetupMenu() {
  boardMenu.classList.remove("open");
  previous.classList.remove("appear");
}

window.onload = () => {
  const p1Board = p1Field.querySelector(".board");
  const p2Board = p2Field.querySelector(".board");

  p1Board.addEventListener("click", onPlayer1Click);
  p2Board.addEventListener("click", onPlayer2Click);
  p1Board.addEventListener("mouseover", onPlayer1Hover);
  p2Board.addEventListener("mouseover", onPlayer2Hover);
  p1Board.addEventListener("mouseout", onPlayer1Hover);
  p2Board.addEventListener("mouseout", onPlayer2Hover);

  generateBoard(p1Board);
  generateBoard(p2Board);

  menu.showModal();
};

menu.addEventListener("click", (e) => {
  if (!e.target.classList.contains("menu-button")) return;
  const id = e.target.id;

  if (id === "vs-com") {
    startComputerGame();
    menu.close();
  } else if (id === "vs-player") {
    openBoardSetupMenu();
  } else if (id === "random-board") {
    closeBoardSetupMenu();
    startVersusGame();
    menu.close();
  } else if (id === "custom-board") {
    startBoardCustomize();
    menu.close();
  } else if (e.target.classList.contains("previous")) {
    closeBoardSetupMenu();
  }
});

results.addEventListener("click", (e) => {
  if (!e.target.classList.contains("menu-button")) return;
  const id = e.target.id;

  if (id === "replay" && lastMode) lastMode();
  else menu.showModal();

  results.close();
  p1Field.classList.add("focus-field");
});

ready.addEventListener("click", (e) => {
  if (!ready.classList.contains("enabled")) return;

  if (currentPlayer === 0) {
    changeTurn();
    generateBoard(p1Field.querySelector(".board"));
    ready.classList.remove("enabled");
  } else {
    startCustomGame();
    ready.classList.remove("enabled");
    customizeUI.classList.add("hide");
  }
});
