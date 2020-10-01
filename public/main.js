document.addEventListener('contextmenu', event => event.preventDefault());
let socket = io();
let grid;
socket.on('currBoard', (newboard) => {
    grid = newboard;
});
socket.on('win', () => {
    document.getElementById('win-box').style.display = 'block';
});
function restart() {
    socket.emit('restart');
    document.getElementById('win-box').style.display = 'none';
}
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
            switch (grid[i]) {
                case true:
                    fill(255, 0, 0);
                    rect(x, y, cellSize, cellSize);
                    break;
                case false:
                    fill(100);
                    rect(x, y, cellSize, cellSize);
                    break;
                case -1:
                    fill(50);
                    ellipse(x+0.5*cellSize, y+0.5*cellSize, cellSize*0.9, cellSize*0.9);
                    break;
                default:
                    fill(255);
                    text(grid[i], x+10, y+cellSize-5);    
            }
        }
    }
}
function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        const x = Math.floor(mouseX/cellSize);
        const y = Math.floor(mouseY/cellSize);
        const pos = y * gridWidth + x;
        // console.log({x, y, pos});
        if (mouseButton === LEFT) {
            socket.emit('uncover', pos);
        }
        if (mouseButton === RIGHT) {
            console.log('works');
            socket.emit('flag', pos);
        }
    }
}