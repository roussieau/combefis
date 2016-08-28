var player;
var height;
var width

function startGame() {
    player = new component(100, 100, "combefis.png", 100, 120, "image");
    Game.start();
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
      if (type == "image") {
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.update = function(){
        ctx = Game.context;
        if (type == "image") {
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
        this.y += this.speedY;
        this.y += this.gravity;
    }
    
}

function updateGameArea() {
    Game.clear();
    player.speedY = 0;
    player.gravity = 0;
    if (Game.key && Game.key == 32) { 
        if(player.y-30 >=0)
         player.speedY -= 30;
    } 
    if(player.y + player.height +5 < Game.canvas.height){
        player.gravity = 5;
    }
    else {
        player.gravity = 0;
    }
    player.newPos();
    player.update();

}