console.log("hi")

let config = {
    type: Phaser.AUTO, //chooses the render type (WebGL or Canvas, if browser supports WebGL will use WebGL, otherwise Canvas)
    parent: 'phaser-example', //renders the game in an existing <canvas> element with 'phaser-example' if it exists, otherwise creates it
    width: 800, //screen width/height
    height: 600,
    physics: {
        default: 'arcade', //Phaser stuff
        arcade: {
            debug: false,
            gravity: {y: 0} //0 gravity
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('ship', '/assets/spaceShips_001.png')
}

function create() {
    let self = this;
    this.socket = io();
    this.socket.on('currentPlayers', function(players) { //Listens for currentPlayers event, executes function when triggered
        //Creates an array from the players object that was passed in from the event in server.js
        Object.keys(players).forEach(function (id) { 
            if(players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]); //pass current player info and reference to current scene
            }
        })
    })
}

function update() {

}

function addPlayer(self, playerInfo) {
    //adds the ship w/ arcade physics
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40); 
    if(playerInfo.team === 'blue') {
        self.ship.setTint(0x0000ff);
    } else {
        self.ship.setTint(0xff0000);
    }
    self.ship.setDrag(100); //resistance the object will face when moving
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200); //max speed

}
