var player;
var height;
var width;
var obstacles = [];
var mySound;
var saut;

function startGame() {
    mySound = new sound("boom.mp3");
    saut = new sound("saut.m4a");
    Game.start();
    player = new component(width/20, width/20, "combefis.png", 100, 100, "player");
}

var Game = {
    canvas : document.createElement("canvas"),
    start : function() {
        width = window.innerWidth;
        height = window.innerHeight;
        this.canvas.height = height;
        this.canvas.width = width;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 1;
        window.addEventListener('keydown', function (e) {
            Game.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            Game.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, width, height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
      if (type == "player") {
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.jump = 0;
    this.gravity = 0;
    this.update = function(){
        ctx = Game.context;
        if (type == "player") {
            ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if(type == "player"){
            this.y += this.jump;
            this.y += this.gravity;
        }
    }
    this.crash = function(o){
        var U = this.y;
        var D = this.y + (this.height);
        var R = this.x + (this.width);
        var L = this.x;
        var OU = o.y;
        var OD = o.y + (o.height);
        var OR = o.x + (o.width);
        var OL = o.x;
        if((R<OL)||(L>OR)||(U>OD)||D<OU){
            return false;
        }
        return true;
    }
    
}

function updateGameArea() {
    Game.frameNo +=1 ;
    for (i = 0; i < obstacles.length; i += 1) {
        console.log(player.crash(obstacles[i]));
        if (player.crash(obstacles[i])) {
            mySound.play();
            Game.stop();
            return;
        } 
    }
    Game.clear();
    addObstacle(200);
    player.jump = 0;
    player.gravity = 0;
    if (Game.key && Game.key == 32) {
        saut.play();
        if(player.y-10 >=0)
         player.jump -= 10;
    } 
    if(player.y + player.height +4 < Game.canvas.height){
        player.gravity = 4;
    }
    else {
        player.gravity = 0;
    }
    for (i = 0; i < obstacles.length; i += 1) {
        if(obstacles[i].x -10 <0){
            obstacles.splice(0, 1);
        }
        else{
            obstacles[i].x -=10;
        }

        obstacles[i].update();
    }
    player.newPos();
    player.update();

}

function addObstacle (n) {
    var gap = height/4;
    x = Game.frameNo /100 + 10;
    if(Game.frameNo % n != 0)
        return;
    var number = Math.random()*(height-gap);
    obstacles.push(new component(x,number,"#6800e6",width,0));
    obstacles.push(new component(x,height-number-gap,"#6800e6",width,number+gap));
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
