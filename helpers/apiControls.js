export function activateApiControls() {
    const requestInput = document.getElementById("request_input");
    const stateInput = document.getElementById("state_input");
    const levelInput = document.getElementById("level_input");
    const moveInput = document.getElementById("move_input");
    const requestDisplay = document.getElementById("request_display");
    const stateDisplay = document.getElementById("state_display");
    const levelDisplay = document.getElementById("level_display");
    const moveDisplay = document.getElementById("move_display");
    const requestValue = document.getElementById("request_value");
    const stateValue = document.getElementById("state_value");
    const levelValue = document.getElementById("level_value");
    const moveValue = document.getElementById("move_value");

    const initialValues = [
        "nextMove",
        "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNRw1111",
        3,
        "[[0, 1], [2, 2]]"
    ];

    [
        [requestInput, requestDisplay, requestValue],
        [stateInput, stateDisplay, stateValue],
        [levelInput, levelDisplay, levelValue],
        [moveInput, moveDisplay, moveValue]
    ].forEach((varSet, i) => {
        const [input, display, value] = varSet;
        const initialValue = initialValues[i];

        input.value = initialValue;
        value.innerText = initialValue;
        input.addEventListener("change", () => {
            value.innerText = input.value;
            if (input.value === "") {
                display.classList.add("hidden");
            } else {
                display.classList.remove("hidden");
            }
        });
    });

    document.getElementById("api_submit_button").addEventListener("click", () => {
        const request = requestInput.value;
        const state = stateInput.value;
        const level = levelInput.value;
        const move = moveInput.value;

        const params = {};
        const names = ["request", "gameState", "level", "move"];
        [request, state, level, move].forEach((ele, i) => {
            const name = names[i];
            let varToUse = ele;
            if (name === "level") {
                varToUse = parseInt(ele);
            }
            if (name === "move") {
                varToUse = JSON.parse(ele);
            }
            if (ele.length > 0) {
                params[name] = varToUse;
            }
        });

        const responseBox = document.getElementById("response_show_box");
        responseBox.classList.add("center_loader");
        const loader = document.createElement("div");
        loader.classList.add("loader");
        responseBox.innerHTML = "";
        responseBox.appendChild(loader);

        fetch("https://airbackend.com/chessMove/api.php", {
            method: "POST",
            body: JSON.stringify(params)
        }).then((result) => {
            result.json().then((jsonResult) => {
                responseBox.classList.remove("center_loader");
                responseBox.innerHTML = makeFriendly(JSON.stringify(jsonResult));
            });
        });
    });
}

function makeFriendly(json) {
    let answer = "";
    let spaces = "";
    let i = 0;
    while (json[i] !== undefined) {
        const char = json[i];
        if (char === "{") {
            answer += "{";
            answer += "<br/>";
            spaces += "&nbsp;&nbsp;";
            answer += spaces;
        } else if (char === "}") {
            answer += "<br/>";
            spaces -= "&nbsp;&nbsp;";
            answer += "}";
        } else if (char === ",") {
            answer += ",";
            if (json[i + 1] === `"`) {
                answer += "<br/>";
                answer += spaces;
            }
        } else if (char === ":") {
            answer += ": ";
        } else {
            answer += char;
        }
        i ++;
    }



    return answer;
}