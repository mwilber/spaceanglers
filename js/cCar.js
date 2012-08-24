function Car(pName, pStartX, pStartY, pEndX, pImg, pStartKey) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"car",
		"startkey":pStartKey,
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 0, "walk"],
				"stun": [10, 10, "stun"],
				"splat": [16, 16, "splat"],
				"aim": [17, 17, "aim"],
				"fire": [17, 21, "aim"]
			},
			"images": [pImg],
			"frames":
			{"regX": 22, "width": 44, "count": 22, "regY": 0, "height": 60}
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
	this.dmgBullet = 2;
	this.pause = 0;
	
	if( this.actor.GetPos().x < this.endX ){
		//this.actor.velocity.x = 4;
	}
	else if( this.actor.GetPos().x > this.endX ){
		//this.actor.velocity.x = -4;
	}
}

Car.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			if( (this.startX < 0 && this.actor.GetPos().x >= this.endX) || (this.startX > screen_width && this.actor.GetPos().x <= this.endX) ){
				this.actor.status = "wait";
				//this.actor.sprite.gotoAndPlay("aim");
				this.actor.velocity.x = 0;
				// Let out the officer
				var tmpStartPos = this.actor.GetPos().x;
				var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/4);
				var tmpStartKey = "walk_h";
				npCharsPol.splice(0,0,new Police("police", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['police'], tmpStartKey));
				stage.addChild(npCharsPol[0].actor.sprite);
			}else if( this.actor.GetPos().x < this.endX ){
				//this.actor.velocity.x = 4;
			}
			else if( this.actor.GetPos().x > this.endX ){
				//this.actor.velocity.x = -4;
			}
			//if ( (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
			//	this.actor.velocity.x = -this.actor.velocity.x;
			//}else if( Math.floor(Math.random()*50) == 0 ){
			//	this.actor.velocity.x = -this.actor.velocity.x;
			//}
			break;
		case "fire":
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
			// Create the energy bonus
			npCharsPol.splice(0,0,new Energy("energy", this.actor.GetPos().x, screen_height-presets.ground, images['energy']));
			stage.addChild(npCharsPol[0].actor.sprite);	
		}else if(this.actor.status == "stun" && this.actor.velocity.y > 1){
			this.actor.status = "walk";
			this.actor.sprite.gotoAndPlay("walk_h");
			this.actor.velocity.y = 0;
			this.actor.velocity.x = 0;
			this.actor.sprite.y = screen_height-presets.ground;
		}
	}

	this.actor.UpdatePos();
	
}

Car.prototype.SetStatus = function(pStatus) {
	
	this.actor.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Car.prototype.GetStatus = function() {
	
	return this.actor.status;
	
}

Car.prototype.Levitate = function(pAmt){
	
	this.actor.velocity.y = -pAmt;
	this.actor.sprite.x = pChars[shipIdx].actor.sprite.x;
	
}
