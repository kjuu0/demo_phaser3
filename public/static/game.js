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
    this.load.image('otherPlayer', 'assets/enemyBlack5.png')
}

function create() {
    let self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group(); //Create group to manage other players, makes collision way easier
    this.socket.on('currentPlayers', function(players) { //Listens for currentPlayers event, executes function when triggered
        //Creates an array from the players object that was passed in from the event in server.js
        Object.keys(players).forEach(function (id) { 
            if(players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]); //pass current player info and reference to current scene
            } else {
                addOtherPlayers(self, players[id]);
            }
        })
    })
    this.socket.on('newPlayer', function(playerInfo) {
        addOtherPlayers(self, playerInfo); //adds new player to the game
    })
    this.socket.on('disconnect', function(playerId) { 
        self.otherPlayers.getChildren().forEach(function(otherPlayer) { //getChildren() returns all members of a group in an array
            if(playerId === otherPlayer.playerId) { //Removes the game object from the game
                otherPlayer.destroy();
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

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if(playerInfo.team === 'blue') {
        otherPlayer.setTint(0x0000ff);
    } else {
        otherPlayer.setTint(0xff0000);
    }
    otherPlayer.playerId = playerInfo.playerId; 
    self.otherPlayers.add(otherPlayer); //adds the player to the list
}
