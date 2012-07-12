function Monster(pName, pStartX, pStartY) {
	
	this.actor = new Actor({
		"name":pName,
		"type":"monster",
		"startkey":"walk",
		"status":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 9, "walk"],
				"stun": [11, 19, "stun"]
			},
			"images": ["assets/anim_monster_comp.png"],
			"frames":
			{
				"regX": 32,
				"regY": 32,
				"height": 64,
				"width":64,
				"count": 20
			}
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

Monster.prototype.Move = function() {

	switch(this.actor.status){
		case "walk":
			if ( (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
				this.actor.velocity.x = -this.actor.velocity.x;
			}else if( Math.floor(Math.random()*50) == 0 ){
				this.actor.velocity.x = -this.actor.velocity.x;
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
		if(this.actor.status != "walk"){
			this.actor.status = "walk";
			this.actor.sprite.gotoAndPlay("walk");
			this.actor.velocity.y = 0;
			this.actor.velocity.x = 4;
			this.actor.sprite.y = screen_height-presets.ground;
		}
	}

	this.actor.UpdatePos();
	
}

Monster.prototype.SetStatus = function(pStatus) {
	
	this.actor.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Monster.prototype.GetStatus = function() {
	
	return this.actor.status;
	
}

Monster.prototype.Levitate = function(pAmt){
	
	this.actor.velocity.y = -pAmt;
	this.actor.sprite.x = mousePos.x;
	
}
