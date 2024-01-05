import { requestComputerMove } from "./apiHelper.js";
import { unpackGame } from "./apiHelper.js";
import { updateBoard } from "./board.js";


export function requestAndMakeComputerMove() {
    requestComputerMove(3).then((nextMove) => {
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