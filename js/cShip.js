function Ship(pName) {
	
	this.status = "ready";
	
	this.actor = new Actor({
		"name":pName,
		"type":"ship",
		"startkey":"spin",
		"spritesheet":{
			"animations":
			{
				"spin": [0, 5, "spin"]
			},
			"images": ["assets/anim_ship_spin.png"],
			"frames":
			{
				"regX": 0,
				"regY": 0,
				"height": 63,
				"width":191.8333,
				"count": 6
			}
		},
		"position":{
			"x":0,
			"y":0
		}
	});
}

Ship.prototype.Move = function() {
	
	this.actor.SetPos({'x':mousePos.x-(this.actor.width/2), 'y':mousePos.y-(this.actor.height/2)});
}