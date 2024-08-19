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
            color : [Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5],
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
    socket.on('restart', (size) => {
        if (board.checkState()) {
            board = new Grid(size, Math.floor(size*size*0.2));
            for (let a in PLAYER_LIST) {
                console.log(PLAYER_LIST[a]);
                PLAYER_LIST[a].mines = 0;
                PLAYER_LIST[a].flags = 0;
                PLAYER_LIST[a].uncovers = 0;
            }
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
    io.emit('currBoard', {board : board.viewable, size : board.gridWidth});
    io.emit('win', board.checkState());
}