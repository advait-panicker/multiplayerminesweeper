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
    socket.on('signIn', (name) => {
        PLAYER_LIST[socket.id] = {
            color : [Math.random(), Math.random(), Math.random()],
            name : name,
            mines : 0,
            flags : 0,
            uncovers : 0
        };
        console.log(PLAYER_LIST[socket.id]);
        newState();
    });
    socket.on('uncover', pos => {
        board.uncover(pos, PLAYER_LIST[socket.id]);
        newState();
    });
    socket.on('flag', pos => {
        board.flag(pos, PLAYER_LIST[socket.id]);
        newState();
    });
    socket.on('restart', () => {
        if (board.checkState()) {
            board = new Grid(10, 20);
            newState();
        }
    });
    socket.on('disconnect', () => {
        delete PLAYER_LIST[socket.id];
        io.emit('newPlayer', PLAYER_LIST);
    });
});

function newState() {
    io.emit('newPlayer', PLAYER_LIST);
    io.emit('currBoard', board.viewable);
    io.emit('win', board.checkState());
}