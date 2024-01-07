
import { strToGrid } from "./helpers/strToGrid.js";
import { packageGame, unpackGame } from "./helpers/apiHelper.js";
import { activateTabControls, activateBoardControls } from "./helpers/activateControls.js";
import { populateBoard } from "./helpers/board.js";
import { startGame } from "./helpers/chess.js";

// main
document.rejectAiMove = false;
activateTabControls();
populateBoard(); // also activates dragging, selecting, and piece move behavior
activateBoardControls();


// ^ main ^







// initial render
// updateBoard(game.grid);


// recursiveMakeNextMove(game, 500);

// document.turns = 0;





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