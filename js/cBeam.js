function Beam(pName) {
	
	this.status = "ready";
	this.actor = new Object();
	
	var g = new Graphics()
		.beginFill(Graphics.getRGB(255,255,255,0.6))
		.moveTo(115, 0).lineTo(130,screen_height).lineTo(70,screen_height).lineTo(85,0)
		.endStroke()
		.beginFill(Graphics.getRGB(255,255,128,0.3))
		.moveTo(110, 0).lineTo(115,screen_height).lineTo(85,screen_height).lineTo(90,0)
		.endStroke();
	this.actor.sprite = new Shape(g);
	this.actor.sprite.visible = false;
	
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
	
	this.actor.sprite.x = mousePos.x-100;
	this.actor.sprite.y = mousePos.y;
	
	var scale = 1-(mousePos.y/screen_height);
	
	//DebugOut(scale);
	this.actor.sprite.scaleY = scale;
}