document.addEventListener('contextmenu', event => event.preventDefault());
let socket = io();
let grid;
socket.on('currBoard', (newboard) => {
    grid = newboard;
});
const gridWidth = 10;
const gridSize = gridWidth * gridWidth;
const cellSize = 50;
function setup() {
    createCanvas(500,500);
}
function draw() {
    background(0);
    textSize(50);
    if (grid != undefined) {
        for (let i = 0; i < gridSize; i++) {
            const x = (i % gridWidth)*cellSize;
            const y = ((i-x/cellSize)/gridWidth)*cellSize;
            if (grid[i]) {
                fill(255);
                text(grid[i].value, x+10, y+cellSize-5);
            } else {
                fill(100);
                rect(x, y, cellSize, cellSize);
            }
        }
    }
}
function mouseClicked(event) {
    const x = Math.floor(mouseX/cellSize);
    const y = Math.floor(mouseY/cellSize);
    const pos = y * gridWidth + x;
    console.log({x, y, pos, event});
    if (mouseButton === LEFT) {
        socket.emit('uncover', pos);
    }
    // if (mouseButton === RIGHT) {
    //     socket.emit('flag', pos);
    // }
}