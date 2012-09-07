function Energy(pName, pStartX, pStartY, pImg) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"energy",
		"startkey":"walk_h",
		"status":"stun",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 19, "walk"],
				"stun": [0, 19, "stun"],
				"splat": [0, 19, "splat"]
			},
			"images": [pImg],
			"frames":
			{"regX":24, "width": 48, "count": 20, "regY":-10, "height": 48}
		},
		"position":{
			"x":pStartX,
			"y":pStartY
		},
		"velocity":{
			"x":5,
			"y":-10
		},
		"radius":20
	});
	this.startPosX = pStartX;
	this.startPosY = pStartY;
}

Energy.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			break;
		case "stun":
			//this.actor.velocity.x = 0;
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
			createjs.SoundJS.play("energy_plop", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
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

Energy.prototype.Splat = function(){
	this.actor.status = "splat";
	this.actor.velocity.y = 0;
	this.actor.velocity.x = 0;
	this.actor.sprite.visible = false;
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
