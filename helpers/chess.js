import { requestComputerMove } from "./apiHelper.js";
import { unpackGame } from "./apiHelper.js";
import { updateBoard } from "./board.js";


export function requestAndMakeComputerMove() {
    return new Promise((resolve) => {
        const level = document.game.aiLevels[document.game.turn];
        requestComputerMove(level).then((nextMove) => {
            if (nextMove.length < 64) {
                let message = {
                    "w is checkmated": "Black wins!",
                    "b is checkmated": "White wins!",
                    "stalemate": "Game over: stalemate",
                    "insufficient": "Game over: draw by insufficient material"
                }[nextMove];
                if (message === undefined) {
                    message = "Game over";
                }
                document.getElementById("endgame_message").innerHTML = message;
                document.getElementById("modal_container").classList.remove("hidden");

            } else {
                if (!document.rejectAiMove) { // see activateControls.js/switchSides
                    const updatedGame = unpackGame(nextMove);
                    document.game.grid = updatedGame.grid;
                    document.game.canCastle = updatedGame.canCastle;
                    document.game.turn = updatedGame.turn;
                    if (updatedGame.enPassant) {
                        document.game.enPassant = updatedGame.enPassant;
                    }
                    updateBoard(updatedGame.grid);
                    resolve(true);
                } else {
                    document.rejectAiMove = false;
                }
            }
        }).catch((err) => {
            console.log("ERROR " + err.message);
            resolve(false);
        });
    });
}