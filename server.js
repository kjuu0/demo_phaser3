/*const app = require('express')(); //requires express module and creates instance of express
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const nextApp = next(process.env.NODE_ENV);
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;

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
})*/

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const next = require('next');

const dev = process.env.NODE_ENV
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })
    
    server.listen(process.env.PORT, (err) => {
        if (err) throw err
        console.log(`> Ready on {process.env.PORT}`)
    })
})


let players = {}; //stores all players in an object

let star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
}

let scores = {
    blue: 0,
    red: 0
}

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
    socket.emit('starLocation', star);
    socket.emit('scoreUpdate', scores);
    socket.broadcast.emit('newPlayer', players[socket.id]); //passing new player's object to all other players so they can render
    socket.on('disconnect', function() {
        console.log('Disconnect')
        delete players[socket.id]; //removes the player
        io.emit('disconnect', socket.id); //tells all other clients to remove the player
    })
    socket.on('playerMovement', function(movementData) { //updates the player data in the server
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;
        socket.broadcast.emit('playerMoved', players[socket.id]); //tells the clients to update their player positions
    })
    socket.on('starCollected', function() {
        if(players[socket.id].team === 'red') {
            scores.red += 10;
        } else {
            scores.blue += 10;
        }
        star.x = Math.floor(Math.random() * 700) + 50;
        star.y = Math.floor(Math.random() * 500) + 50;
        io.emit('starLocation', star); //creates a new star
        io.emit('scoreUpdate', scores); //updates score
    })
})
