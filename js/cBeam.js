function Beam(pName) {
	
	this.status = "ready";
	this.actor = new Object();
	this.hit = 0;
	this.charIdx = -1;
	
	var g = new Graphics()
		.beginFill(Graphics.getRGB(255,255,255,0.6))
		.moveTo(10, 0).lineTo(30,screen_height).lineTo(-30,screen_height).lineTo(-20,0)
		.endStroke()
		.beginFill(Graphics.getRGB(255,255,128,0.3))
		.moveTo(5, 0).lineTo(15,screen_height).lineTo(-15,screen_height).lineTo(-15,0)
		.endStroke();
	this.actor.sprite = new Shape(g);
	this.actor.sprite.visible = false;
	this.actor.sprite.regX = 0;
	
	DebugOut(this.actor.sprite);
	this.actor.sprite.x = 100;
	this.actor.sprite.y = 100;
}

Beam.prototype.On = function() {
	this.status = "firing";
	this.actor.sprite.visible = true;
	createjs.SoundJS.play("beam_start", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.1);
	createjs.SoundJS.play("beam_loop", createjs.SoundJS.INTERRUPT_NONE, 0, 0, 1, 0.3);
}

Beam.prototype.Off = function() {
	this.status = "ready";
	this.actor.sprite.visible = false;
}

Beam.prototype.Move = function() {
	
	var shipX = pChars[shipIdx].actor.sprite.x;
	//shipX += pChars[shipIdx].actor.width/2;
	var shipY = pChars[shipIdx].actor.sprite.y;
	shipY += 10;
	
	// Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
	
	this.actor.sprite.x = shipX;
	this.actor.sprite.y = shipY;
	
	var scale = 1-(shipY/screen_height);
	
	//DebugOut(scale);
	this.actor.sprite.scaleY = scale;
}

Beam.prototype.hitTest = function( pPos ) {
	
	var lBound = this.actor.sprite.x - 30;
	var rBound = this.actor.sprite.x + 30;
	
	if( pPos.x > lBound && pPos.x < rBound && pPos.y > pChars[shipIdx].actor.sprite.y ){
		return true;
	}else{
		return false;
	}
}