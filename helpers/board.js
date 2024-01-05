import { getPieceSymbol } from "./getPieceSymbol.js";
import { requestAndMakeComputerMove } from "./chess.js";

export function populateBoard() {
    document.game = {
        grid: [
            ["R", "N", "B", "Q", "K", "B", "N", "R"],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["r", "n", "b", "q", "k", "b", "n", "r"]
        ],
        // grid: [
        //     ["K", "-", "-", "-", "-", "-", "-", "-"],
        //     ["-", "p", "k", "-", "-", "-", "-", "-"],
        //     ["-", "-", "-", "-", "-", "-", "-", "-"],
        //     ["-", "-", "-", "-", "-", "-", "-", "-"],
        //     ["-", "-", "-", "-", "-", "-", "-", "-"],
        //     ["-", "-", "-", "-", "-", "-", "-", "-"],
        //     ["-", "r", "-", "-", "-", "-", "-", "-"],
        //     ["-", "-", "-", "-", "-", "-", "-", "-"]
        // ],
        turn: "w",
        canCastle: [1, 1, 1, 1],
        enPassant: undefined,
        // frontend use only
        gameOver: false,
        players: {
            "w": "human",
            "b": "api"
        },
        selectedSpace: false
    }
    document.selectedPieces = {
        dragging: false,
        selected: false
    }
    updateBoard(document.game.grid);
}

export function updateBoard(grid) {
    document.getElementById("board").innerHTML = "";
    grid.forEach((row, r) => {
        row.forEach((piece, c) => {
            const space = document.createElement("div");
            space.id = "" + r + c;
            space.classList.add("space");
            if ((r + c) % 2 === 0) {
                space.classList.add("white_space");
            } else {
                space.classList.add("black_space");
            }
            if (piece !== "-") {
                space.innerHTML = getPieceSymbol(piece);
                space.classList.add("piece");
                space.addEventListener("mousedown", (e) => {
                    handleMousedown(e.target);
                });
            }
            space.addEventListener("click", (e) => {
                handleSelect(e.target);
            });
            space.addEventListener("mouseup", (e) => {
                handleMouseup(e.target);
            });
            if ([r, c] === document.game.selectedSpace?.id?.split("")) {
                space.classList.add("selected");
            }
            document.getElementById("board").appendChild(space);
        });
    });
}

function handleSelect(space) {
    if (!document.game.selectedSpace) {
        document.game.selectedSpace = space;
        space.classList.add("selected");
    } else {
        if (space.id === document.game.selectedSpace.id) {
            document.game.selectedSpace = false;
            space.classList.remove("selected");
        } else {
            if (handleMoveAttempt(document.game.selectedSpace, space)) {
                document.game.selectedSpace = false;
            } else {
                document.game.selectedSpace.classList.remove("selected");
                document.game.selectedSpace = space;
                space.classList.add("selected");
            }
        }
    }
}

function handleMousedown(space) {
    console.log("down " + space.id);
}

function handleMouseup(space) {
    console.log("up " + space.id);
}

function handleMoveAttempt(from, to) {
    console.log(from.id + " to " + to.id);

    // temp
    const fromPos = from.id.split("").map((ele) => {
        return parseInt(ele);
    });
    const toPos = to.id.split("").map((ele) => {
        return parseInt(ele);
    });
    const fromPiece = document.game.grid[fromPos[0]][fromPos[1]];
    if (fromPiece !== "-") {
        document.game.grid[toPos[0]][toPos[1]] = document.game.grid[fromPos[0]][fromPos[1]];
        document.game.grid[fromPos[0]][fromPos[1]] = "-";
        updateBoard(document.game.grid);
        document.game.turn = document.game.turn === "w" ? "b" : "w";
        requestAndMakeComputerMove();
        return true;
    }
    return false;
}
