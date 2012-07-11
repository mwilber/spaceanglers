function Beam(pName) {
	
	this.status = "ready";
	this.actor = new Object();
	this.hit = 0;
	
	var g = new Graphics()
		.beginFill(Graphics.getRGB(255,255,255,0.6))
		.moveTo(15, 0).lineTo(30,screen_height).lineTo(-30,screen_height).lineTo(-15,0)
		.endStroke()
		.beginFill(Graphics.getRGB(255,255,128,0.3))
		.moveTo(10, 0).lineTo(15,screen_height).lineTo(-15,screen_height).lineTo(-10,0)
		.endStroke();
	this.actor.sprite = new Shape(g);
	//this.actor.sprite.visible = false;
	
	DebugOut(this.actor.sprite);
	this.actor.sprite.x = 100;
	this.actor.sprite.y = 100;
}

Beam.prototype.On = function() {
	this.status = "firing";
	this.actor.sprite.visible = true;
}

Beam.prototype.Off = function() {
	this.status = "ready";
	this.actor.sprite.visible = false;
}

Beam.prototype.Move = function() {
	
	// Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
	
	this.actor.sprite.x = mousePos.x;
	this.actor.sprite.y = mousePos.y;
	
	var scale = 1-(mousePos.y/screen_height);
	
	//DebugOut(scale);
	this.actor.sprite.scaleY = scale;
}

Beam.prototype.hitPoint = function (tX, tY) {
        return this.hitRadius(tX, tY, 0);
}

Beam.prototype.hitRadius = function (tX, tY, tHit) {
	
    //early returns speed it up
    if (tX - tHit > this.actor.sprite.x + this.hit) { return; }
    if (tX + tHit < this.actor.sprite.x - this.hit) { return; }
    if (tY - tHit > this.actor.sprite.y + this.hit) { return; }
    if (tY + tHit < this.actor.sprite.y - this.hit) { return; }

    //now do the circle distance test
    return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.actor.sprite.x - tX), 2) + Math.pow(Math.abs(this.actor.sprite.y - tY), 2));
}