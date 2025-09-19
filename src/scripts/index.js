import "../styles/style.css";

const p1Field = document.querySelector("#p1");
const p2Field = document.querySelector("#p2");

function event() {
  p1Field.classList.toggle("focus-field");
  p2Field.classList.toggle("focus-field");

  setTimeout(event, 2000);
}

event();
