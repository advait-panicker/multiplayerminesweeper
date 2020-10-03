document.addEventListener('contextmenu', event => event.preventDefault());
let socket = io();
let inGame = false;
function onJoin() {
    let name = document.getElementById('username-input').value;
    socket.emit('signIn', name);
    document.getElementById('login-wrapper').style.display = "none";
    document.getElementById('game').style.display = "block";
    inGame = true;
}
let grid;
socket.on('currBoard', (newboard) => {
    grid = newboard.board;
    gridWidth = newboard.size;
    gridSize = gridWidth * gridWidth;
    cellSize = width/gridWidth;
    mineimg.resize(cellSize, cellSize);
    flagimg.resize(cellSize, cellSize); 
});
socket.on('win', (win) => {
    if (inGame) {
        document.getElementById('win-box').style.display = win ? 'block' : 'none';
    }
});
function restart() {
    let size = parseInt(document.getElementById('size-input').value, 10);
    console.log(size >= 10, size <= 30);
    if (size >= 10 && size <= 30) {
        socket.emit('restart', size);
    }
}
socket.on('newPlayer', (PLAYER_LIST) => {
    let list = document.getElementById('player-list').children[0];
    list.innerHTML = '<th>Player</th><th>Mines</th><th>Flags</th><th>Uncovers</th>';
    for (let v in PLAYER_LIST) {
        const {name, color, mines, flags, uncovers} = PLAYER_LIST[v];
        const player = document.createElement("tr");
        player.innerHTML = `<td>${name}</td><td>${mines}</td><td>${flags}</td><td>${uncovers}</td>`;
        player.style =  `color:rgb(${color[0]*256},${color[1]*256},${color[2]*256});`;
        list.append(player);
    }
});
let gridWidth = 10;
let gridSize = gridWidth * gridWidth;
let cellSize = 50;
let cv = 32;
const dirs = [
    {xoff :  0, yoff : -1,   x1 : 0, y1 : 0, x2 : 1, y2 : 0},
    {xoff :  0, yoff :  1,   x1 : 0, y1 : 1, x2 : 1, y2 : 1},
    {xoff : -1, yoff :  0,   x1 : 0, y1 : 0, x2 : 0, y2 : 1},
    {xoff :  1, yoff :  0,   x1 : 1, y1 : 0, x2 : 1, y2 : 1}
];
let mineimg, flagimg;
function preload() {
    mineimg = loadImage('images/mine.png');
    flagimg = loadImage('images/flag.png');
}
function setup() {
    let canvas = createCanvas(gridWidth*cellSize,gridWidth*cellSize);
    canvas.parent('game');
    mineimg.resize(cellSize, cellSize);
    flagimg.resize(cellSize, cellSize);
}
function draw() {
    background(0);
    textSize(cellSize);
    if (grid != undefined) {
        strokeWeight(1);
        for (let i = 0; i < gridSize; i++) {
            const x = (i % gridWidth)*cellSize;
            const y = ((i-x/cellSize)/gridWidth)*cellSize;
            const c = grid[i].color;
            if (c) {
                fill(c[0]*cv, c[1]*cv, c[2]*cv);
            } else {
                fill(0);
            }
            stroke(50);
            rect(x, y, cellSize, cellSize);
            switch (grid[i].value) {
                case true:
                    image(flagimg, x, y);
                    break;
                case false:
                    fill(100);
                    rect(x, y, cellSize, cellSize);
                    break;
                case -1:
                    image(mineimg, x, y);
                    break;
                case 0:
                    fill(c[0]*cv, c[1]*cv, c[2]*cv);
                    rect(x, y, cellSize, cellSize);
                    break;
                default:
                    fill(c[0]*cv, c[1]*cv, c[2]*cv);
                    rect(x, y, cellSize, cellSize);
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
    if (inGame) {
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
}