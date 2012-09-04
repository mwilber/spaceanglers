function Military(pName, pStartX, pStartY, pEndX, pImg, pStartKey) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"military",
		"startkey":pStartKey,
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 9, "walk"],
				"stun": [10, 15, "stun"],
				"splat": [16, 16, "splat"],
				"aim": [17, 17, "aim"], /* hard coded reference to this number in Move function */
				"fire": [17, 21, "aim"]
			},
			"images": [pImg],
			"frames":
			{"regX":25, "width": 49, "count": 22, "regY": 0, "height": 61}
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
	
	this.startX = pStartX;
	this.endX = pEndX;
	this.dmgBullet = 10;
	this.pause = 0;
}

Military.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			if( (this.startX < 0 && this.actor.GetPos().x >= this.endX) || (this.startX > screen_width && this.actor.GetPos().x <= this.endX) ){
				this.actor.status = "fire";
				this.actor.sprite.gotoAndPlay("aim");
				this.actor.velocity.x = 0;
			}else if( this.actor.GetPos().x < this.endX ){
				this.actor.velocity.x = 4;
			}
			else if( this.actor.GetPos().x > this.endX ){
				this.actor.velocity.x = -4;
			}
			break;
		case "fire":
			if( this.pause == 0 ){
				if(this.actor.GetPos().x < pChars[shipIdx].actor.sprite.x){
					this.actor.sprite.gotoAndPlay("aim_h");	
				}else{
					this.actor.sprite.gotoAndPlay("aim");	
				}
			}else{
				this.pause--;
			}
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
			createjs.SoundJS.play("splat", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.5);
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
	this.actor.sprite.x = pChars[shipIdx].actor.sprite.x;
	
}
