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

}

function create() {

}

function update() {

}

