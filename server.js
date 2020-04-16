var express = require('express'); //express module
var app = express(); //create instance of express
var server = require('http').Server(app); //allows server to handle http

app.use(express.static(__dirname + '/public')); //tells server where to find static files

app.get('/', function(req, res) {
    res.sendFile(__dirname + 'index.html'); //serves index.html as root page
});

server.listen(8081, () => {
    console.log(`listening on ${server.address().port}`); //tells server to listen on port 8081
});

