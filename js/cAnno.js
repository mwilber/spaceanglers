function Anno(pName) {
	
	this.status = "ready";
	this.actor = new Object();
	this.hit = 0;
	this.charIdx = -1;
	
	var g = new Text ( 'x'+pName , "18px bold 'Press Start 2P'" , '#FF0' );
		//.beginFill(Graphics.getRGB(255,255,255,0.6))
		//.moveTo(10, 0).lineTo(30,screen_height).lineTo(-30,screen_height).lineTo(-20,0)
		//.endStroke()
		//.beginFill(Graphics.getRGB(255,255,128,0.3))
		//.moveTo(5, 0).lineTo(15,screen_height).lineTo(-15,screen_height).lineTo(-15,0)
		//.endStroke();
	this.actor.type = 'anno';
	this.actor.sprite = new Shape(g);
	this.actor.sprite.visible = true;
	this.actor.sprite.regX = 0;
	this.actor.sprite.x = pChars[shipIdx].actor.sprite.x;
	this.actor.sprite.y = pChars[shipIdx].actor.sprite.y;
	this.actor.decay = 10;
}

Anno.prototype.Move = function() {
	
	this.actor.sprite.y--;
	
	/*var shipX = pChars[shipIdx].actor.sprite.x;
	//shipX += pChars[shipIdx].actor.width/2;
	var shipY = pChars[shipIdx].actor.sprite.y;
	shipY -= 20;
	
	// Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
	
	this.actor.sprite.x = shipX;
	this.actor.sprite.y = shipY;
	
	var scale = 1-(shipY/screen_height);
	
	//DebugOut(scale);
	this.actor.sprite.scaleY = scale;*/
}

