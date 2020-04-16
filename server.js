const app = require('express')(); //requires express module and creates instance of express
const server = require('http').Server(app); //allows server to handle http
const io = require('socket.io').listen(server);
const next = require('next');

const dev = process.env.NODE_ENV != 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

let players = {}; //stores all players in an object

io.on('connect', socket => {
    console.log('Connected');
    players[socket.id] = { //on player connect, new player object is created w/ rotation, x-y coords, id, and a random team
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    socket.emit('now', {
        message: 'zeit' //sends message to client
    })
    //Event called currentPlayers passes players object to the new players so their client can render them
    socket.emit('currentPlayers', players); 
    socket.broadcast.emit('newPlayer', players[socket.id]); //passing new player's object to all other players so they can render
    socket.on('disconnect', function() {
        console.log('Disconnect')
        delete players[socket.id]; //removes the player
        io.emit('disconnect', socket.id); //tells all other clients to remove the player
    })
})

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })

    server.listen(port, (err) => {
        if(err) {
            throw err
        } else {
            console.log(`> Ready on http://localhost:${port}`);
        }
    })
})