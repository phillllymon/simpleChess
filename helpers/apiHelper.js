import { gridToStr, strToGrid } from "./strToGrid.js";
import { updateBoard } from "./board.js";

export function validateMove(move) {
    return new Promise((resolve) => {
        fetch("https://airbackend.com/chessMove/api.php", {
            method: "POST",
            body: JSON.stringify({
                request: "checkMove",
                gameState: packageGame(document.game),
                move: move
            })
        }).then((res) => {
            res.json().then((r) => {
                console.log("---------------");
                console.log(r);
                console.log("---------------");
                resolve(r.moveValid);
            });
        });
    });
}

export function requestComputerMove(level = 3) {
    console.log(packageGame(document.game));
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
                console.log("---------------");
                console.log(r);
                console.log("---------------");
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
    // console.log(game.enPassant.join(""));
    if (game.enPassant) {
        answer += game.enPassant.join("");
    }
    // console.log(game.enPassant);
    // console.log(game.enPassant.join(""));
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