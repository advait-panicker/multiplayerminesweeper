const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/public`));
const serv = require('http').Server(app);

let Grid = require('./game/grid.js');

// Setup
serv.on('error', (err) => {
    console.error('Server error: ', err);
});

serv.listen(process.env.PORT || 2000, () => {
    console.log('Server Started');
});

// Board setup
let board = new Grid(10, 20);

// Connection
let PLAYER_LIST = {};

const io = require('socket.io')(serv, {});
io.sockets.on('connect', function(socket) {
    PLAYER_LIST[socket.id] = {color : [Math.random(), Math.random(), Math.random()]};
    console.log(PLAYER_LIST[socket.id]);
    newState();
    socket.on('uncover', pos => {
        board.uncover(pos, PLAYER_LIST[socket.id].color);
        newState();
    });
    socket.on('flag', pos => {
        board.flag(pos, PLAYER_LIST[socket.id].color);
        newState();
    });
    socket.on('restart', () => {
        if (board.checkState()) {
            board = new Grid(10, 20);
            newState();
        }
    });
});

function newState() {
    io.emit('currBoard', board.viewable);
    io.emit('win', board.checkState());
}