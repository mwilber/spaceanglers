function Ship(pName, pImg) {
	
	this.status = "ready";
	
	this.actor = new Actor({
		"name":pName,
		"type":"ship",
		"startkey":"warpin",
		"spritesheet":{
			"animations":
			{
				"spin": [0, 9, "spin"],
				"warp": [10, 49, ""],
				"warpin": [50,89, "spin"],
				"lownrg": [90,99, "lownrg"]
			},
			"images": [pImg],
			"frames":
			{"count": 100, "regY": 50, "width": 195, "regX": 97, "height": 175}
		},
		"position":{
			"x":0,
			"y":0
		},
		"velocity":{
			"x":0,
			"y":0
		},
		"radius":40
	});
}

Ship.prototype.Move = function() {
	
	 // Do not let the ship fly lower than the ceiling
    if(mousePos.y > screen_height-presets.ceiling){
    	mousePos.y = screen_height-presets.ceiling;
    }
    
    distX = ((mousePos.x)-this.actor.GetPos().x);
    
    this.actor.sprite.rotation = distX*.1;
    
    newX = this.actor.GetPos().x+( distX*0.2 );
    newY = this.actor.GetPos().y+( ((mousePos.y-(this.actor.height/2))-this.actor.GetPos().y)*0.2 );
	
	this.actor.SetPos({'x':newX, 'y':newY});
	
	pChars[beamIdx].Move();
}