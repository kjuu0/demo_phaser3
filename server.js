const app = require('express')(); //requires express module and creates instance of express
const server = require('http').Server(app); //allows server to handle http
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV != 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

io.on('connect', socket => {
    socket.emit('now', {
        message: 'zeit' //sends message to clinet
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