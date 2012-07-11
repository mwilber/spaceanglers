function Monster(pName, pStartX, pStartY) {
	
	this.status = "walk";
	
	this.velocity = {
			"x":4,
			"y":0
	};
	
	this.hit = 20;
	
	this.actor = new Actor({
		"name":pName,
		"type":"monster",
		"startkey":"walk",
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
		}
	});
}

Monster.prototype.Move = function() {

	switch(this.status){
		case "walk":
			if ( (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
				this.velocity.x = -this.velocity.x;
			}else if( Math.floor(Math.random()*50) == 0 ){
				this.velocity.x = -this.velocity.x;
			}
			
			this.actor.SetPos({'x':this.actor.GetPos().x+this.velocity.x, 'y':this.actor.GetPos().y+this.velocity.y});
			break;
		case "stun":
			
			break;
	}

	
}

Monster.prototype.SetStatus = function(pStatus) {
	
	this.status = pStatus;
	this.actor.sprite.gotoAndPlay(pStatus);
	
}

Monster.prototype.GetStatus = function() {
	
	return this.status;
	
}

Monster.prototype.hitPoint = function (tX, tY) {
        return this.hitRadius(tX, tY, 0);
}

Monster.prototype.hitRadius = function (tX, tY, tHit) {
	
    //early returns speed it up
    if (tX - tHit > this.actor.sprite.x + this.hit) { return; }
    if (tX + tHit < this.actor.sprite.x - this.hit) { return; }
    if (tY - tHit > this.actor.sprite.y + this.hit) { return; }
    if (tY + tHit < this.actor.sprite.y - this.hit) { return; }

    //now do the circle distance test
    return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.actor.sprite.x - tX), 2) + Math.pow(Math.abs(this.actor.sprite.y - tY), 2));
}
