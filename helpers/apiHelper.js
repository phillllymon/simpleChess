import { gridToStr, strToGrid } from "./strToGrid.js";
import { updateBoard } from "./board.js";

export function validateMove(move) {
    return new Promise((resolve) => {
        // see if it's a human player's turn
        if (document.game.players[document.game.turn] === "human") {
            fetch("https://airbackend.com/chessMove/api.php", {
                method: "POST",
                body: JSON.stringify({
                    request: "checkMove",
                    gameState: packageGame(document.game),
                    move: move
                })
            }).then((res) => {
                res.json().then((r) => {
                    resolve(r.moveValid);
                });
            });
        } else {
            resolve(false);
        }
    });
}

export function requestComputerMove(level = 3) {
    return new Promise((resolve) => {
        fetch("https://airbackend.com/chessMove/api.php", {
            method: "POST",
            body: JSON.stringify({
                request: "nextMove",
                gameState: packageGame(document.game),
                level: level
            })
        }).then((res) => {
            res.json().then((r) => {
                if (r.gameOver) {
                    resolve(r.gameOver);
                } else {
                    resolve(r.next);
                }
            });
        });
    });

    
}

export function packageGame(game) {
    let answer = gridToStr(game.grid);
    answer += game.turn;
    answer += game.canCastle.join("");
    if (game.enPassant) {
        answer += game.enPassant.join("");
    }
    return answer;
}

export function unpackGame(str) {
    return {
        grid: strToGrid(str),
        turn: str[64],
        canCastle: str.split("").slice(65, 69),
        enPassant: str.length > 69 ? (
            str.split("").slice(69, 71)
        ) : undefined
    }
}