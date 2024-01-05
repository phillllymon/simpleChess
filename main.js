
import { strToGrid } from "./helpers/strToGrid.js";
import { packageGame, unpackGame } from "./helpers/apiHelper.js";
import { activateTabControls } from "./helpers/activateControls.js";
import { populateBoard } from "./helpers/board.js";
import { startGame } from "./helpers/chess.js";

// main
activateTabControls();
populateBoard(); // also activates dragging, selecting, and piece move behavior
// activateGameControls();


// ^ main ^







// initial render
// updateBoard(game.grid);


// recursiveMakeNextMove(game, 500);

// document.turns = 0;

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



// fetch("https://airbackend.com/chessMove/api.php", {
//     method: "POST",
//     body: JSON.stringify({
//         gameState: packageGame(game)
//     })
// }).then((res) => {
//     res.json().then((r) => {
//         game = unpackGame(r.next);
//         updateBoard(game.grid);

//         console.log("&&&&&&&");
//         console.log(r);

//         fetch("https://airbackend.com/chessMove/api.php", {
//             method: "POST",
//             body: JSON.stringify({
//                 gameState: packageGame(game)
//             })
//         }).then((s) => {
//             s.json().then((t) => {
//                 game = unpackGame(t.next);
//                 updateBoard(game.grid);

//                 console.log("#######");
//                 console.log(r);

//             });
//         });

//     });
// });