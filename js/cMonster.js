function Monster(pName) {
	
	this.status = "ready";
	
	this.velocity = {
			"x":4,
			"y":0
	};
	
	this.actor = new Actor({
		"name":pName,
		"type":"ship",
		"startkey":"walk",
		"spritesheet":{
			"animations":
			{
				"walk": [0, 9, "walk"]
			},
			"images": ["assets/anim_monster_run.png"],
			"frames":
			{
				"regX": 32,
				"regY": 32,
				"height": 64,
				"width":64,
				"count": 10
			}
		},
		"position":{
			"x":20,
			"y":300
		}
	});
}

Monster.prototype.Move = function() {

	if ( (this.actor.GetPos().x >= screen_width - 16) || (this.actor.GetPos().x < 16) ){
		this.velocity.x = -this.velocity.x;
	}
	
	this.actor.SetPos({'x':this.actor.GetPos().x+this.velocity.x, 'y':this.actor.GetPos().y+this.velocity.y});
	
}