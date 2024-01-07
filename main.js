import { activateTabControls, activateBoardControls } from "./helpers/activateControls.js";
import { populateBoard } from "./helpers/board.js";


// main

activateTabControls();
populateBoard(); // also activates dragging, selecting, and piece move behavior
activateBoardControls();

document.rejectAiMove = false;  // needed only if switch sides

// piece dragging ui
document.dragging = false;
document.dragOrigin = false;
const board = document.getElementById("board");
const dragEle = document.getElementById("dragging_piece");
board.addEventListener("mousemove", (e) => {
    if (document.dragging) {
        console.log(dragEle);
        console.log(e.clientX);
        dragEle.style.left = `${e.clientX - 40}px`;
        dragEle.style.top = `${e.clientY - 40}px`;
    }
});
board.addEventListener("mouseleave", (e) => {
    document.dragOrigin.style.color = "black";
    document.dragging = false;
    document.dragOrigin = false;
    dragEle.innerHTML = "";
});

// trying out animations for computer thinking....
const thinks = [
    "thinking&nbsp;&nbsp;&nbsp;&nbsp;",
    "thinking.&nbsp;&nbsp;&nbsp;",
    "thinking..&nbsp;&nbsp;",
    "thinking...&nbsp;",
    "thinking...."
];
let i = 0;
setInterval(() => {
    i += 1;
    if (i > thinks.length - 1) {
        i = 0;
    }
    [
        "black",
        "white"
    ].forEach((color) => {
        document.getElementById(`${color}_message`).innerHTML = thinks[i];
    });
}, 750);

// ^ main ^