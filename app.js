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
const io = require('socket.io')(serv, {});
io.sockets.on('connect', function(socket) {
    console.log(socket.id);
    socket.on('uncover', pos => {
        board.uncover(pos);
    });
});

// Game loop
setInterval(function() {
    io.emit('currBoard', board.viewable);
},80);