var text;
var text2;
var text3;
var player;
var cursors;

var star;
var stars;
var starList = [];

var level = 0;

var stone;
var stones;

var tempX;
var tempY;

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function()
{
    game.load.image('background', 'assets/sprite/dirt.png');
    game.load.spritesheet('sprite', 'assets/sprite/move.png', 72, 62, 4);
    game.load.spritesheet('swamp', 'assets/sprite/swamp.png');
    game.load.image('star', 'assets/sprite/star.png');
};

Game.create = function ()
{
    Client.getStones();
    Client.getStars();

    Game.playerMap = {};
    var testKey= game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    game.add.tileSprite(0, 0, 1600, 1600, 'background');
    game.world.setBounds(0, 0, 1600, 1600);

    stones = game.add.group();
    stones.enableBody = true;

    stars = game.add.group();
    stars.enableBody = true;

    player = this.add.sprite(Game.spawnPlayer()[0], Game.spawnPlayer()[1], 'sprite'); //game.world.centerX, game.world.centerY, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.enableBody = true;
    game.camera.follow(player);
    player.renderable = false;

    cursors = this.input.keyboard.createCursorKeys();

    Client.askNewPlayer();

    text = game.add.text(1050, 30, "Current Location: \n", {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });
    text.fixedToCamera = true;

    text2 = game.add.text(1100, 260, "", {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });
    text2.fixedToCamera = true;
};

Game.addNewStone = function(x,y){
    var random_boolean = Math.random() >= 0.5;
    if(random_boolean){
        stone = stones.create(x, y, 'swamp');
        game.physics.enable(stone, Phaser.Physics.ARCADE);
        stone.body.immovable = true;
        stone.scale.setTo(0.3,0.3);
    }
    else{
        stone = stones.create(x, y, 'swamp');
        game.physics.enable(stone, Phaser.Physics.ARCADE);
        stone.body.immovable = true;
        stone.scale.setTo(0.3,0.3);
    }
};

Game.addNewStar = function(x,y){
    star = stars.create(x, y, 'star');
    starList += star;
    game.physics.enable(star, Phaser.Physics.ARCADE);
    star.body.immovable = true;
};

function collectStar (player, star) {
    star.kill();
    level += 1;
}

Game.levelup = function(id, level){
    Game.playerMap[id].level = level;
    for(ply in Game.playerMap){
        console.log(id + " level is: " + Game.playerMap[id].level)
    }
};

Game.resetGroup = function(){
    stars.removeAll();
    console.log("removing alllllll")
};

//all the key listeners
Game.update = function()
{
    Game.getRanking();
    Client.getStars();

    var hitPlatform = game.physics.arcade.collide(player, stones);
    game.physics.arcade.collide(player, stars, collectStar, null, this);

    var hitButt = game.physics.arcade.collide(player, stars);
    if(cursors.up.isDown && (hitPlatform === false)){
        player.y -= 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.down.isDown && (hitPlatform === false)){
        player.y += 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.left.isDown && (hitPlatform === false)){
        player.x -= 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.right.isDown && (hitPlatform === false)){
        player.x += 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if (cursors.up.isDown && hitPlatform) {
        player.y -= 1;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if (cursors.down.isDown && hitPlatform) {
        player.y += 1;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if (cursors.right.isDown && hitPlatform) {
        player.x += 1;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if (cursors.left.isDown && hitPlatform) {
        player.x -= 1;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.up.isDown && hitButt){
        player.y -= 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.down.isDown && hitButt){
        player.y += 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.left.isDown && hitButt){
        player.x -= 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if(cursors.right.isDown && hitButt){
        player.x += 7;
        tempX = player.x;
        tempY = player.y;
        Client.sendLocation(tempX, tempY);
    }
    if (game.input.activePointer.isDown) {
        Game.showText();
        player.tint = 0xff0000;
        Client.sendLocation(player.x, player.y);
    }
    else if (game.input.activePointer.isUp) {
        Game.showText();
        player.tint = 0xffffff;
        Client.sendLocation(player.x, player.y);
    }
};

//debug text
Game.showText = function () {
    text.setText("Current Location: \n" + player.x + ", " + player.y + "\nTotal player: \n" + Object.keys(Game.playerMap).length + "\n\nLeaderboard:\n");
};

Game.addNewPlayer = function(id, x, y){
    Game.playerMap[id] = game.add.sprite(x, y,'sprite');
    text3 = game.add.text(20, -30, "ID: " + id, {font: "17px Arial", fill: "#ffffff"});
    Game.playerMap[id].addChild(text3);
};

Game.getRanking = function(){
    Client.getRanking();
};

Game.showRanking = function(data){
    var strRank = "";
    for(i = 0; i<data.length; i++){
        strRank += ("ID: " + data[i][0] +"\nLevel: " + data[i][1] + "\n")
    }
    text2.setText(strRank);
};

Game.movePlayer = function(id,x,y){
    var newPlayer = Game.playerMap[id];
    newPlayer.x = x;
    newPlayer.y = y;
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.spawnPlayer = function(){
    var x = Math.floor(Math.random()*1450);
    var y = Math.floor(Math.random()*1450);
    return [x, y];
};

//debug info
Game.render = function() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 600);
    game.debug.spriteInfo(player, 32, 350);
};