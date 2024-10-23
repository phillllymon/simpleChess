import { computerTakeTurn, updateBoard } from "./board.js";

export function activateTabControls() {
    const playTab = document.getElementById("play_tab");
    const apiGuideTab = document.getElementById("api_guide_tab");
    const exploreApiTab = document.getElementById("explore_api_tab");
    const playSection = document.getElementById("play_section");
    const apiGuideSection = document.getElementById("api_guide_section");
    const exploreApiSection = document.getElementById("explore_api_section");
    playTab.addEventListener("click", () => {
        playSection.classList.remove("hidden");
        apiGuideSection.classList.add("hidden");
        exploreApiSection.classList.add("hidden");
        playTab.classList.remove("inactive_tab");
        apiGuideTab.classList.add("inactive_tab");
        exploreApiTab.classList.add("inactive_tab");
    });
    apiGuideTab.addEventListener("click", () => {
        playSection.classList.add("hidden");
        apiGuideSection.classList.remove("hidden");
        exploreApiSection.classList.add("hidden");
        playTab.classList.add("inactive_tab");
        apiGuideTab.classList.remove("inactive_tab");
        exploreApiTab.classList.add("inactive_tab");
    });
    exploreApiTab.addEventListener("click", () => {
        playSection.classList.add("hidden");
        apiGuideSection.classList.add("hidden");
        exploreApiSection.classList.remove("hidden");
        playTab.classList.add("inactive_tab");
        apiGuideTab.classList.add("inactive_tab");
        exploreApiTab.classList.remove("inactive_tab");
    });
    
}

export function activateBoardControls() {
    activatePlayerButtons();
    activateLevelButtons();
    activateNeutralButtons();
    activateRestartButton();
    document.getElementById("endgame_button").addEventListener("click", () => {
        document.getElementById("modal_container").classList.add("hidden");
        document.getElementById("endgame_modal").classList.add("hidden");
    });
}

function activateNeutralButtons() {
    const messageBox = document.getElementById("neutral_button_message");
    const turnButton = document.getElementById("turn_board_button");
    const switchButton = document.getElementById("switch_sides_button");
    switchButton.addEventListener("mouseenter", () => {
        messageBox.innerHTML = "switch sides";
    });
    switchButton.addEventListener("mouseleave", () => {
        messageBox.innerHTML = "";
    });
    turnButton.addEventListener("mouseenter", () => {
        messageBox.innerHTML = "flip perspective";
    });
    turnButton.addEventListener("mouseleave", () => {
        messageBox.innerHTML = "";
    });
    turnButton.addEventListener("click", flipPerspective);
    switchButton.addEventListener("click", switchSides);
}

function switchSides() {
    const opp = document.game.turn === "w" ? "b" : "w";
    if (document.game.players[document.game.turn] === "human") {
        if (document.game.players[opp] === "ai") {
            // was human, now ai
            computerTakeTurn();
        }
    }
    if (document.game.players[document.game.turn] === "ai") {
        if (document.game.players[opp] === "human") {
            // was ai, now human
            document.rejectAiMove = true; // reject the ai move we expect to receive soon (see chess.js)
            document.playerControl = true;
        }
    }
    const oldWPlayer = {
        player: document.game.players.w,
        aiLevel: document.game.aiLevels.w
    }
    document.game.players.w = document.game.players.b;
    document.game.aiLevels.w = document.game.aiLevels.b;
    document.game.players.b = oldWPlayer.player;
    document.game.aiLevels.b = oldWPlayer.aiLevel;
    flipPerspective(); // makes sense to do this too - can easily flip back if this isn't desired
    flipVisibility();
}

function flipVisibility() {
    [
        "black",
        "white"
    ].forEach((color) => {
        const gameColor = color === "white" ? "w" : "b";
        const humanButton = document.getElementById(`${color}_human_button`);
        const aiButton = document.getElementById(`${color}_ai_button`);
        const human = document.getElementById(`${color}_human`);
        const selectLevel = document.getElementById(`${color}_select_level`);
        const yourTurn = document.getElementById(`${color}_turn`);
        const levels1 = document.getElementById(`${color}_ai_levels_1`);
        const levels2 = document.getElementById(`${color}_ai_levels_2`);
        if (document.game.players[gameColor] === "human") {
            humanButton.classList.add("control_button_selected");
            aiButton.classList.remove("control_button_selected");
            human.classList.remove("hidden");
            if (document.game.turn === gameColor) {
                yourTurn.classList.remove("hidden");
            } else {
                yourTurn.classList.add("hidden");
            }
            selectLevel.classList.add("hidden");
            levels1.classList.add("hidden");
            levels2.classList.add("hidden");
        } else {
            humanButton.classList.remove("control_button_selected");
            aiButton.classList.add("control_button_selected");
            human.classList.add("hidden");
            selectLevel.classList.remove("hidden");
            yourTurn.classList.add("hidden");
            levels1.classList.remove("hidden");
            levels2.classList.remove("hidden");
        }
        document.getElementById(`${color}_message`).classList.add("hidden");
    });
}

function flipPerspective() {
    const board = document.getElementById("board");
    const controls = document.getElementById("board_controls");
    if (board.classList.contains("board_flipped")) {
        board.classList.remove("board_flipped");
        controls.classList.remove("board_controls_flipped");
    } else {
        board.classList.add("board_flipped");
        controls.classList.add("board_controls_flipped");
    }
}

function activateRestartButton() {
    document.getElementById("restart_button").addEventListener("click", () => {
        restartGame();
    });
}

function activateLevelButtons() {
    ["white", "black"].forEach((color) => {
        const buttonsIdArr = [
            `${color}_${0}_button`,
            `${color}_${1}_button`,
            `${color}_${2}_button`,
            `${color}_${3}_button`,
            `${color}_${4}_button`,
            `${color}_${5}_button`
        ];
        for (let i = 0; i < 6; i++) {
            const buttonId = `${color}_${i}_button`;
            document.getElementById(buttonId).addEventListener("click", () => {
                selectSingleOption(buttonsIdArr, buttonId, () => {
                    if (color === "white") {
                        document.game.aiLevels.w = i;
                    } else {
                        document.game.aiLevels.b = i;
                    }
                });
            });
        }
    });
}

function activatePlayerButtons() {
    ["white", "black"].forEach((color) => {
        const aiButton = document.getElementById(`${color}_ai_button`);
        const humanButton = document.getElementById(`${color}_human_button`);
        const playerButtons = [`${color}_ai_button`, `${color}_human_button`];
        const gameColor = color === "white" ? "w" : "b";
        aiButton.addEventListener("click", () => {
            if (document.game.turn === gameColor && document.game.players[gameColor] !== "ai") {
                computerTakeTurn();
            }
            selectSingleOption(playerButtons, `${color}_ai_button`, () => {
                if (color === "white") {
                    document.game.players.w = "ai";
                } else {
                    document.game.players.b = "ai";
                }
            });
            [
                `${color}_human`,
                `${color}_turn`
            ].forEach((eleId) => {
                document.getElementById(eleId).classList.add("hidden");
            });
            [
                `${color}_select_level`,
                `${color}_ai_levels_1`,
                `${color}_ai_levels_2`
            ].forEach((eleId) => {
                document.getElementById(eleId).classList.remove("hidden");
            });
        });
        humanButton.addEventListener("click", () => {
            selectSingleOption(playerButtons, `${color}_human_button`, () => {
                if (color === "white") {
                    document.game.players.w = "human";
                } else {
                    document.game.players.b = "human";
                }
            });
            [
                `${color}_select_level`,
                `${color}_ai_levels_1`,
                `${color}_ai_levels_2`,
                `${color}_message`
            ].forEach((eleId) => {
                document.getElementById(eleId).classList.add("hidden");
            });
            [
                `${color}_human`
            ].forEach((eleId) => {
                document.getElementById(eleId).classList.remove("hidden");
            });
            if (document.game.turn === gameColor) {
                document.getElementById(`${color}_turn`).classList.remove("hidden");
            }
        });
    });
}

function selectSingleOption(buttonsIdArr, selectId, callback) {
    buttonsIdArr.forEach((buttonId) => {
        document.getElementById(buttonId).classList.remove("control_button_selected");
    });
    document.getElementById(selectId).classList.add("control_button_selected");
    callback();
}

export function restartGame() {
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
        turn: "w",
        canCastle: [1, 1, 1, 1],
        enPassant: false,
        // frontend use only
        gameOver: false,
        players: {
            "w": document.game.players.w,
            "b": document.game.players.b
        },
        aiLevels: {
            "w": document.game.aiLevels.w,
            "b": document.game.aiLevels.b
        },
        selectedSpace: false
    }
    document.selectedPieces = {
        dragging: false,
        selected: false
    }
    updateBoard(document.game.grid, false);
    if (document.game.players[document.game.turn] === "human") {
        document.playerControl = true;
    } else {
        document.playerControl = false;
        computerTakeTurn();
    }
}