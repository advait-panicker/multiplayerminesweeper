const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/public`));
const serv = require('http').Server(app);

// Setup
serv.on('error', (err) => {
    console.error('Server error: ', err);
});

serv.listen(process.env.PORT || 2000, () => {
    console.log('Server Started');
});

// Connection
const io = require('socket.io')(serv, {});
io.sockets.on('connect', function(socket) {
    console.log(socket.id);
});
// Board setup
let grid = [];
let mines = [];
let mineCount = 10;
let boardWidth = 10;
let boardSize = boardWidth*boardWidth;
for (let i = 0; i < boardSize; i++) {
    grid[i] = 0;
}
while (mines.length < mineCount) {
    const pos = Math.floor(Math.random()*boardSize);
    if (mines.indexOf(pos) == -1) {
        mines.push(pos);
        for (let y = -1; y < 2; y++) {
            for (let x = -1; x < 2; x++) {
                let xpos = pos % boardWidth + x;
                let ypos = Math.floor(pos/boardWidth) + y;
                if (!(xpos >= boardWidth || xpos < 0 || ypos >= boardWidth || ypos < 0) && grid[pos+y*boardWidth+x] != -1) {
                    grid[pos+y*boardWidth+x]++;
                }
            }
        }
        grid[pos] = -1;
    }
}
console.log(mines);
console.log(grid);
// Game loop
setInterval(function() {

},80);