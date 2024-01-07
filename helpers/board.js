import { getPieceSymbol } from "./getPieceSymbol.js";
import { requestAndMakeComputerMove } from "./chess.js";
import { validateMove } from "./apiHelper.js";

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
        enPassant: false,
        // frontend use only
        gameOver: false,
        players: {
            "w": "human",
            "b": "ai"
        },
        aiLevels: {
            "w": 3,
            "b": 3
        },
        selectedSpace: false
    }
    updateBoard(document.game.grid);
    if (document.game.players[document.game.turn] === "human") {
        document.playerControl = true;
    } else {
        document.playerControl = false;
    }
}

function startPlayerControl() {
    document.playerControl = true;
}

function stopPlayerControl() {
    document.playerControl = false;
}

export function updateBoard(grid, highlight = true) {
    const board = document.getElementById("board");
    const oldGrid = board.children;
    const oldGridHTML = [];
    for (let i = 0; i < oldGrid.length; i++) {
        oldGridHTML.push("" + oldGrid[i].innerHTML);
    }
    board.innerHTML = "";
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
            if (oldGridHTML.length > 0 && highlight) {
                if (oldGridHTML[(8 * r) + c] !== space.innerHTML) {
                    space.classList.add("highlighted_space");
                }
            }
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
    console.log(document.playerControl);
    if (document.playerControl) {
        if (!document.game.selectedSpace) {
            document.game.selectedSpace = space;
            space.classList.add("selected");
        } else {
            if (space.id === document.game.selectedSpace.id) {
                document.game.selectedSpace = false;
                space.classList.remove("selected");
            } else {
                handleMoveAttempt(document.game.selectedSpace, space).then((moveValid) => {
                    if (moveValid) {
                        document.game.selectedSpace = false;
                    } else {
                        document.game.selectedSpace.classList.remove("selected");
                        document.game.selectedSpace = space;
                        space.classList.add("selected");
                    }
                });
            }
        }
    }
}

function handleMousedown(space) {
    document.dragging = true;
    document.dragOrigin = space;
    space.style.color = "rgba(0, 0, 0, 0.5)";
    const dragEle = document.getElementById("dragging_piece");
    dragEle.innerHTML = space.innerHTML;
    dragEle.style.top = `${space.getBoundingClientRect().top}px`;
    dragEle.style.left = `${space.getBoundingClientRect().left}px`;
}

function handleMouseup(space) {
    const dragEle = document.getElementById("dragging_piece");
    if (document.dragging && document.dragOrigin.id === space.id) {
        dragEle.innerHTML = "";
        document.dragOrigin.style.color = "black";
        document.dragging = false;
        document.dragOrigin = false;
        handleSelect(space);
    } else if (document.dragging) {
        handleMoveAttempt(document.dragOrigin, space);
        dragEle.innerHTML = "";
        document.dragOrigin.style.color = "black";
        document.dragging = false;
        document.dragOrigin = false;
    } else {
        handleSelect(space);
    }
}

function handleMoveAttempt(from, to) {
    stopPlayerControl();
    return new Promise((resolve) => {
        const fromPos = from.id.split("").map((ele) => {
            return parseInt(ele);
        });
        const toPos = to.id.split("").map((ele) => {
            return parseInt(ele);
        });
    
        const move = packageMove(fromPos, toPos);

        validateMove(move).then((valid) => {
            if (valid) {
                makeMove(document.game.grid, move);
                updateBoard(document.game.grid);
                const color = document.game.turn === "b" ? "black" : "white";
                document.getElementById(`${color}_turn`).classList.add("hidden");
                document.game.turn = document.game.turn === "w" ? "b" : "w";
                // see if next move is computer
                if (document.game.players[document.game.turn] === "ai") {
                    computerTakeTurn();
                    const oppColor = document.game.turn === "b" ? "white" : "black";
                    const yourTurn = document.getElementById(`${oppColor}_turn`);
                    yourTurn.classList.add("hidden");
                } else {
                    startPlayerControl();
                    const oppColor = document.game.turn === "w" ? "white" : "black";
                    const yourTurn = document.getElementById(`${oppColor}_turn`);
                    yourTurn.classList.remove("hidden");
                }
                resolve(true);
            } else {
                startPlayerControl();
                resolve(false);
            }
        });
    })
}

export function computerTakeTurn() {
    stopPlayerControl();
    const color = document.game.turn === "w" ? "white" : "black";
    const oppColor = document.game.turn === "b" ? "white" : "black";
    const yourTurn = document.getElementById(`${oppColor}_turn`);
    yourTurn.classList.add("hidden");
    const aiMessage = document.getElementById(`${color}_message`);
    aiMessage.classList.remove("hidden");
    requestAndMakeComputerMove().then((success) => {
        if (success) {
            aiMessage.classList.add("hidden");
            if (document.game.players[document.game.turn] === "ai") {
                computerTakeTurn();
            } else {
                startPlayerControl();
                yourTurn.classList.remove("hidden");
            }
        }
    });
}

// move in backend notation, grid is frontend grid
export function makeMove(grid, move) {
    const from = translatePos(move[0]); // back to frontend notation
    const to = translatePos(move[1]);   // back to frontend notation
    const piece = grid[from[0]][from[1]];

    // check for castle
    if (move[2] === "castle") {
        if (to[1] > from[1]) {
            grid[to[0]][(from[1] + to[1]) / 2] = grid[to[0]][7];
            grid[to[0]][7] = "-";
        } else {
            grid[to[0]][(from[1] + to[1]) / 2] = grid[to[0]][0];
            grid[to[0]][0] = "-";
        }
    }

    // check for enPassant
    if (document.game.enPassant) {
        if (piece === "p") {
            if (to[1] === document.game.enPassant[1]) {
                const frontCapPos = translatePos(document.game.enPassant);
                if (to[0] === frontCapPos[0] - 1) {
                    grid[frontCapPos[0]][frontCapPos[1]] = "-";
                }
            }
        }
        if (piece === "P") {
            if (to[1] === document.game.enPassant[1]) {
                const frontCapPos = translatePos(document.game.enPassant);
                if (to[0] === frontCapPos[0] + 1) {
                    grid[frontCapPos[0]][frontCapPos[1]] = "-";
                }
            }
        }
    }


    // record enPassant
    if (piece === "p") {
        if (from[0] - to[0] > 1) {
            document.game.enPassant = translatePos(to); // store enPassant in backend notation
        } else {
            document.game.enPassant = false;
        }
    }
    if (piece === "P") {
        if (to[0] - from[0] > 1) {
            document.game.enPassant = translatePos(to); // store enPassant in backend notation
        } else {
            document.game.enPassant = false;
        }
    }

    // move piece as usual
    grid[to[0]][to[1]] = grid[from[0]][from[1]];
    grid[from[0]][from[1]] = "-";
}

// between frontend and backend
export function translatePos(pos) {
    return [7 - pos[0], pos[1]];
}

export function packageMove(f, t) {
    const from = translatePos(f);   // change to backend notation
    const to = translatePos(t);     // change to backend notation
    const move = [from, to];
    const piece = document.game.grid[f[0]][f[1]];
    
    // check for castle attempt
    if (piece === "k" || piece === "K"){
        if (t[1] - f[1] > 1 || f[1] - t[1] > 1) {
            move.push("castle");
        }
    }

    // check for enPassant attempt
    if (piece === "p" || piece === "P") {
        if (to[1] !== from[1]) {
            if (document.game.grid[t[0]][t[1]] === "-") {
                move.push("enPassant");
            }
        }
    }
    
    // check for pawn promotion
    if (piece === "p" || piece === "P") {
        if (to[0] === 0 || to[0] === 7) {
            move.push(piece === "p" ? "q" : "Q"); // autoqueen for now TODO: prompt user to select
        }
    }
    
    return move;
}
