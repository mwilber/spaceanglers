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
				"regX": 100,
				"regY": 31,
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
		"radius":20
	});
}

Ship.prototype.Move = function() {
	
	 // Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
    
    distX = ((mousePos.x-(this.actor.width/2))-this.actor.GetPos().x);
    
    this.actor.sprite.rotation = distX*.1;
    
    newX = this.actor.GetPos().x+( distX*0.2 );
    newY = this.actor.GetPos().y+( ((mousePos.y-(this.actor.height/2))-this.actor.GetPos().y)*0.2 );
	
	this.actor.SetPos({'x':newX, 'y':newY});
	
	pChars[beamIdx].Move();
}