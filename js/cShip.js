function Ship(pName, pImg) {
	
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
			"images": [pImg],
			"frames":
			{
				"regX": 0,
				"regY": 20,
				"height": 63,
				"width":191.8333,
				"count": 6
			}
		},
		"position":{
			"x":0,
			"y":0
		},
		"velocity":{
			"x":0,
			"y":0
		},
		"radius":30
	});
}

Ship.prototype.Move = function() {
	
	 // Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
	
	this.actor.SetPos({'x':mousePos.x-(this.actor.width/2), 'y':mousePos.y-(this.actor.height/2)});
}