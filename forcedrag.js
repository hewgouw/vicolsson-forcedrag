window.forcedrag = function (options) {
    var self = {};
    
    self.selector = null;
    self.element = null;
    
    self.maxWidth = null;
    self.maxHeight = null;
    
    self.inverted = false;
    
    self.firstEventCoords = null;
    self.lastEventCoords = null;
    
    self.callbacks = {
        down: null,
        move: null,
        up: null
    };
    
    self.init = function (options) {
        if (options) {
            self.selector = options.selector;
            if (!self.selector) throw 'Error, no selector specified';
            
            if (options.down) self.callbacks.down = options.down;
            if (options.move) self.callbacks.move = options.move;
            if (options.up) self.callbacks.up = options.up;
            
            if (options.inverted) self.inverted = options.inverted;
        }
        
        self.initElement();
    };
    
    self.initListeners = function () {
        var addEventListener = self.element.addEventListener;
        addEventListener('mousedown', self.down);
        addEventListener('mousemove', self.move);
        addEventListener('mouseup', self.up);
        
        addEventListener('touchstart', self.down);
        addEventListener('touchmove', self.move);
        addEventListener('touchend', self.up);
    };
    
    self.initElement = function () {
        
        self.element = document.querySelector(self.selector);
        if (!self.element) throw 'Error, no element found with the selector \'' + self.selector + '\'';
        
        self.maxWidth = self.element.clientWidth;
        self.maxHeight = self.element.clientHeight;
        
        self.initListeners();
    };
    
    self.down = function (e) {
        var coords = self.getCoordinateOfEvent(e);
        
        self.firstEventCoords = coords;
        self.lastEventCoords = coords;
        
        if (typeof self.callbacks.down === 'function') {
            self.callbacks.down({ coords: coords });
        }
    };
    
    self.move = function (e) {
        if (!self.firstEventCoords) return;
        
        var coords = self.getCoordinateOfEvent(e);
        self.lastEventCoords = coords;
        
        var angle = self.getAngleBetweenCoordinates(self.firstEventCoords, coords);
        var force = self.getForceBetweenCoordinates(self.firstEventCoords, coords);
        
        if (typeof self.callbacks.move === 'function') {
            self.callbacks.move({
                coords: coords,
                angle: angle,
                force: force,
                coordsFirstEvent: self.firstEventCoords});  
        } 
    };
    
    self.up = function (e) {
        if (!self.firstEventCoords) return;
        
        var coords = self.getCoordinateOfEvent(e);
        self.lastEventCoords = coords
        
        var angle = self.getAngleBetweenCoordinates(self.firstEventCoords, coords);
        var force = self.getForceBetweenCoordinates(self.firstEventCoords, coords);
        
        if (typeof self.callbacks.up === 'function') {
            self.callbacks.up({
                coords: coords,
                angle: angle,
                force: force,
                coordsFirstEvent: self.firstEventCoords});
        }
        
        self.firstEventCoords = null;
    };
    
    self.getCoordinateOfEvent = function (e) {
        var x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else if(e.clientX && e.clientY) {
            x = e.clientX;
            y = e.clientY;
        } else {
            return self.lastEventCoords;
        }
        return { x: x, y: y };
    };
    
    self.getAngleBetweenCoordinates = function (coords1, coords2) {
        var dX = coords1.x - coords2.x;
        var dY = coords1.y - coords2.y;
        
        var angle = Math.atan2(dX, dY) * -180 / Math.PI + 90;
        
        if (angle < 0) angle = 360 + angle;
        
        if (self.inverted) angle += 180;
        if (angle >= 360) angle -= 360;
        
        return angle;
    };
    
    self.getForceBetweenCoordinates = function (coords1, coords2) {
        var dX = coords1.x - coords2.x;
        var dY = coords1.y - coords2.y;
        
        var distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        
        var maximumDistance = Math.sqrt(Math.pow(self.maxWidth, 2) + Math.pow(self.maxHeight, 2));
        
        var force = distance / maximumDistance;
        
        return force;
    };
    
    
    self.init(options);
    
    
    return self;
};