var app = (function () {
	var self = {};
	
	self.init = function () {
        
        self.canvas = document.querySelector("canvas");
        self.canvas.width = document.body.clientWidth;
        self.canvas.height = document.body.clientHeight;
        
        self.context = self.canvas.getContext("2d");
        
        self.firstEventCoords = null;
        self.coordsLatestEvent = null;
        
        self.angle = null;
        self.force = null;
        
        self.shotSpeed = 40;
        self.shots = [];
        
        dragUi.init(self.context);
        
        self.update();
        
		forcedrag({
            selector: "canvas",
            down: self.down,
            move: self.move,
            up: self.up,
            inverted: false
        });
	};
    
    self.down = function (e) {
        dragUi.down(e);
        
        //console.log("Down", e);
    };
    
    self.move = function (e) {
        dragUi.move(e);
        
        //console.log("Move", e);
    };
    
    self.up = function (e) {
        dragUi.up(e);
        
        self.shots.push({ coords: e.coordsFirstEvent, angle: e.angle, force: e.force, width: 50 * e.force });
        
        //console.log("Up", e);
    };
    
    self.update = function () {
        self.updateShots();
        
        self.render();
        
        setTimeout(self.update, 17);
    };
    
    self.render = function () {
        
        var ctx = self.context;
        ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        
        dragUi.render();
        self.renderShots();
    };
    
    self.updateShots = function () {
        for(var i = 0; i < self.shots.length; i++) {
            var shot = self.shots[i];
            
            var speed = self.shotSpeed * shot.force;
            
            var theta = Math.PI * 2 / 360 * shot.angle;
            
            shot.coords.x += speed * Math.cos(theta);
            shot.coords.y += speed * Math.sin(theta);
            
            if (shot.coords.x < 0) {
                shot.angle = 180 - shot.angle;
                shot.coords.x = 0;
            }
            if (shot.coords.x > self.canvas.width) {
                shot.angle = 180 - shot.angle;
                shot.coords.x = self.canvas.width;
            }
            if (shot.coords.y < 0) {
                shot.angle = 360 - shot.angle;
                shot.coords.y = 0;
            }
            if (shot.coords.y > self.canvas.height) {
                shot.angle = 360 - shot.angle;
                shot.coords.y = self.canvas.height;
            }
            
        }
    };
	
    self.renderShots = function () {
        var ctx = self.context;
        ctx.fillStyle = "black";
        
        for(var i = 0; i < self.shots.length; i++) {
            var shot = self.shots[i];
            
            var w = shot.width;
            
            //ctx.fillRect(shot.coords.x - w/2, shot.coords.y - w/2, w, w);
            
            ctx.beginPath();
            ctx.arc(shot.coords.x - w/2, shot.coords.y - w/2, w, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    };
    
    
	return self;
})();

var dragUi = (function () {
    var self = {};
    
    self.context = null;
    
    self.angle = null;
    self.force = null;
    self.coordsFirstEvent = null;
    self.coordsLatestEvent = null;
    
    self.init = function (ctx) {
        self.context = ctx;
        
        return self;
    };
    
    self.render = function (ctx) {
        if(self.angle && self.force && self.coordsFirstEvent && self.coordsLatestEvent) {
            
            var ctx = self.context;
            
            ctx.lineWidth = 10 * self.force;
            
            ctx.beginPath();
            ctx.moveTo(self.coordsFirstEvent.x, self.coordsFirstEvent.y);
            ctx.lineTo(self.coordsLatestEvent.x, self.coordsLatestEvent.y);
            ctx.stroke();
            ctx.closePath();
            
            
            var textX = (self.coordsLatestEvent.x + self.coordsFirstEvent.x) / 2;
            var textY = (self.coordsLatestEvent.y + self.coordsFirstEvent.y) / 2;
            
            var theta = Math.PI * 2 / 360 * (self.angle + 90);
            
            textX += 150 * Math.cos(theta);
            textY += 150 * Math.sin(theta);
            
            ctx.font="30px Verdana";
            ctx.textAlign="center";
            ctx.textBaseline="middle"; 
            ctx.fillText(Math.round(self.angle * 100) / 100 + "deg", textX, textY);
            ctx.fillText(Math.round(self.force * 100) / 100 + "f", textX, textY + 30);
        }
    };
    
    self.down = function (e) {
        
    };
    
    self.move = function (e) {
        self.angle = e.angle;
        self.force = e.force;
        self.coordsFirstEvent = e.coordsFirstEvent;
        self.coordsLatestEvent = e.coords;
    };
    
    self.up = function (e) {
        self.angle = null;
    };
    
    return self;
})();