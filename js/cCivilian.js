function Civilian(pName, pStartX, pStartY, pImg) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"civilian",
		"startkey":"walk_h",
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 9, "walk"],
				"stun": [10, 15, "stun"],
				"splat": [16, 16, "splat"]
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
			"x":4,
			"y":0
		},
		"radius":20
	});
}

Civilian.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			if ( (Math.floor(Math.random()*50) == 0) || (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
				this.actor.velocity.x = -this.actor.velocity.x;
				if(this.actor.velocity.x > 0){
					this.actor.sprite.gotoAndPlay("walk_h");
				}else{
					this.actor.sprite.gotoAndPlay("walk");
				}
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
		if( this.actor.sprite.y < (screen_height-presets.ground-150) && this.actor.velocity.y == 1 ){
			createjs.SoundJS.play("scream", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.5);
		}
	}else{
		if(this.actor.status == "stun" && this.actor.velocity.y > presets.splatV){
			this.Splat();
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

Civilian.prototype.Splat = function(){
	this.actor.status = "splat";
	this.actor.velocity.y = 0;
	this.actor.velocity.x = 0;
	this.actor.sprite.y = screen_height-presets.ground;
	this.actor.sprite.gotoAndPlay("splat");
	createjs.SoundJS.play("splat", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.5);
}

Civilian.prototype.SetStatus = function(pStatus) {
	
	this.actor.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Civilian.prototype.GetStatus = function() {
	
	return this.actor.status;
	
}

Civilian.prototype.Levitate = function(pAmt){
	
	this.actor.velocity.y = -pAmt;
	this.actor.sprite.x = pChars[shipIdx].actor.sprite.x;
	
}
