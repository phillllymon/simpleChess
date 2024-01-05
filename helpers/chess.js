import { requestComputerMove } from "./apiHelper.js";
import { unpackGame } from "./apiHelper.js";
import { updateBoard } from "./board.js";


export function requestAndMakeComputerMove() {
    requestComputerMove().then((nextMove) => {
        if (nextMove.length < 64) {
            alert(nextMove);
        } else {
            const updatedGame = unpackGame(nextMove);
            document.game = {...updatedGame};
            updateBoard(updatedGame.grid);
        }
    }).catch((err) => {
        console.log("ERROR " + err.message);
    });
}







function recursiveMakeNextMove(game, delay) {

    document.turns += 1;

    fetch("https://airbackend.com/chessMove/api.php", {
        method: "POST",
        body: JSON.stringify({
            gameState: packageGame(game),
            level: 4
        })
    }).then((res) => {
        res.json().then((r) => {
            console.log(r);
            if (r.gameOver) {
                console.log(r.gameOver);
            } else {

                if (document.turns > 20) {
                    console.log("max turns reached");
                } else {
                    setTimeout(() => {
                        const updatedGame = unpackGame(r.next);
                        console.log(r.score);
                        updateBoard(updatedGame.grid);
                        recursiveMakeNextMove(updatedGame, delay);
                    }, delay);
                }
            }
        });
    })
}