export function strToGrid(str) {
    const grid = [];
    const arr = str.split("");
    for (let i = 7; i > -1; i--) {
        grid.push(arr.slice(8 * i, (8 * i) + 8));
    }
    return grid;
}

export function gridToStr(grid) {
    let answer = "";
    for (let i = 7; i > -1; i--) {
        answer += grid[i].join("");
    }
    return answer;
}