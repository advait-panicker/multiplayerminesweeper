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
let board = new Grid(10, 10);

// Connection
const io = require('socket.io')(serv, {});
io.sockets.on('connect', function(socket) {
    console.log(socket.id);
    newState();
    socket.on('uncover', pos => {
        board.uncover(pos);
        newState();
    });
    socket.on('flag', pos => {
        board.flag(pos);
        newState();
    });
});

function newState() {
    io.emit('currBoard', board.viewable);
}