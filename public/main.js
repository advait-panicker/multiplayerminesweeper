document.addEventListener('contextmenu', event => event.preventDefault());
let socket = io();
let grid;
socket.on('currBoard', (newboard) => {
    grid = newboard;
});
socket.on('win', (win) => {
    document.getElementById('win-box').style.display = win ? 'block' : 'none';
});
function restart() {
    socket.emit('restart');
}

const gridWidth = 10;
const gridSize = gridWidth * gridWidth;
const cellSize = 50;
const dirs = [
    {xoff :  0, yoff : -1,   x1 : 0, y1 : 0, x2 : 1, y2 : 0},
    {xoff :  0, yoff :  1,   x1 : 0, y1 : 1, x2 : 1, y2 : 1},
    {xoff : -1, yoff :  0,   x1 : 0, y1 : 0, x2 : 0, y2 : 1},
    {xoff :  1, yoff :  0,   x1 : 1, y1 : 0, x2 : 1, y2 : 1}
];
function setup() {
    createCanvas(gridWidth*cellSize,gridWidth*cellSize);
}
function draw() {
    background(0);
    textSize(cellSize);
    if (grid != undefined) {
        strokeWeight(1);
        for (let i = 0; i < gridSize; i++) {
            const x = (i % gridWidth)*cellSize;
            const y = ((i-x/cellSize)/gridWidth)*cellSize;
            fill(0);
            stroke(50);
            rect(x, y, cellSize, cellSize);
            switch (grid[i].value) {
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
                case 0:
                    break;
                default:
                    fill(255);
                    text(grid[i].value, x+cellSize/5, y+0.9*cellSize);    
            }
        }
        strokeWeight(5);
        grid.forEach((v, k) => {
            if (v.color != null) {
                stroke(v.color[0]*256, v.color[1]*256, v.color[2]*256);
                let x = (k % gridWidth);
                let y = (k - x) / gridWidth;
                for (let i = 0; i < 4; i++) {
                    let {xoff, yoff, x1, y1, x2, y2} = dirs[i];
                    x1 += x; x2 += x;
                    y1 += y; y2 += y;
                    const c = grid[k+yoff*gridWidth+xoff]; 
                    if (!compColor(c == undefined ? null : c.color, v.color)) {
                        line(x1*cellSize, y1*cellSize, x2*cellSize, y2*cellSize);
                    }
                }
            }
        });
    }
}
function outOfBounds(x, y) {
    // console.log(x, y);
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridWidth) {return true;}
    return false;
}
function compColor(c1, c2) {
    if (c1 == null) {
        return false;
    }
    for (let i = 0; i < 3; i++) {
        if (c1[i] != c2[i]) {
            return false;
        }
    }
    return true;
}
function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        const x = Math.floor(mouseX/cellSize);
        const y = Math.floor(mouseY/cellSize);
        const pos = y * gridWidth + x;
        if (mouseButton === LEFT) {
            socket.emit('uncover', pos);
        }
        if (mouseButton === RIGHT) {
            socket.emit('flag', pos);
        }
    }
}