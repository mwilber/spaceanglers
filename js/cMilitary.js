function Military(pName, pStartX, pStartY, pEndX, pImg) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"military",
		"startkey":"walk_h",
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 9, "walk"],
				"stun": [10, 15, "stun"],
				"splat": [16, 16, "splat"],
				"aim": [17, 17, "aim"],
				"fire": [17, 21, "aim"]
			},
			"images": [pImg],
			"frames":
			{"regX": 0, "width": 49, "count": 22, "regY": 0, "height": 61}
		},
		"position":{
			"x":pStartX,
			"y":pStartY
		},
		"velocity":{
			"x":4,
			"y":0
		},
		"radius":20
	});
	
	this.endX = pEndX;
	this.dmgBullet = 1;
}

Military.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			if( this.actor.GetPos().x >= this.endX ){
				this.actor.status = "fire";
				this.actor.sprite.gotoAndPlay("aim");
				this.actor.velocity.x = 0;
			}else if( this.actor.GetPos().x < this.endX ){
				this.actor.velocity.x = 4;
			}
			else if( this.actor.GetPos().x > this.endX ){
				this.actor.velocity.x = -4;
			}
			//if ( (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
			//	this.actor.velocity.x = -this.actor.velocity.x;
			//}else if( Math.floor(Math.random()*50) == 0 ){
			//	this.actor.velocity.x = -this.actor.velocity.x;
			//}
			break;
		case "stun":
			this.actor.velocity.x = 0;
			break;
	}
	
	//Add in gravity
	if(this.actor.sprite.y+this.actor.velocity.y < screen_height-presets.ground){
		//this.velocity.y *= 1.5;
		this.actor.velocity.y += 1;
	}else{
		if(this.actor.status == "stun" && this.actor.velocity.y > 20){
			this.actor.status = "splat";
			this.actor.velocity.y = 0;
			this.actor.velocity.x = 0;
			this.actor.sprite.y = screen_height-presets.ground;
			this.actor.sprite.gotoAndPlay("splat");
		}else if(this.actor.status == "stun" && this.actor.velocity.y > 1){
			this.actor.status = "walk";
			this.actor.sprite.gotoAndPlay("walk_h");
			this.actor.velocity.y = 0;
			this.actor.velocity.x = 4;
			this.actor.sprite.y = screen_height-presets.ground;
		}
	}

	this.actor.UpdatePos();
	
}

Military.prototype.SetStatus = function(pStatus) {
	
	this.actor.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Military.prototype.GetStatus = function() {
	
	return this.actor.status;
	
}

Military.prototype.Levitate = function(pAmt){
	
	this.actor.velocity.y = -pAmt;
	this.actor.sprite.x = mousePos.x;
	
}
