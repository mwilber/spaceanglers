function Energy(pName, pStartX, pStartY, pImg) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"energy",
		"startkey":"walk_h",
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 0, "walk"],
				"stun": [0, 0, "stun"],
				"splat": [0, 0, "splat"]
			},
			"images": [pImg],
			"frames":
			{"regX": 22, "width": 44, "count": 17, "regY": 0, "height": 58}
		},
		"position":{
			"x":pStartX,
			"y":pStartY
		},
		"velocity":{
			"x":0,
			"y":0
		},
		"radius":20
	});
}

Energy.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
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

Energy.prototype.SetStatus = function(pStatus) {
	
	this.actor.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Energy.prototype.GetStatus = function() {
	
	return this.actor.status;
	
}

Energy.prototype.Levitate = function(pAmt){
	
	this.actor.velocity.y = -pAmt;
	this.actor.sprite.x = pChars[shipIdx].actor.sprite.x;
	
}
