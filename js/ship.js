function Ship(name) {
	this.name = name;
	this.type = "ship";
	this.startkey = "spin";
	this.ss = new createjs.SpriteSheet({
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
	});
	DebugOut(this.ss);
	this.sprite = new createjs.BitmapAnimation(this.ss);
	this.sprite.x = 100;
	this.sprite.y = 100;
	this.vX = 1;
	this.sprite.gotoAndPlay("spin");
	this.init = function() {
		
	}
	this.move = function() {
		// Hit testing the screen width, otherwise our sprite would disappear
	    if ( (this.sprite.x >= screen_width - 16) || (this.sprite.x < 16) ){
	        // We've reached the right side of our screen
	        // We need to walk left now to go back to our initial position
	        this.vX = -this.vX;
		}
	
		this.sprite.x = mousePos.x-(this.ss._frameWidth/2);
		this.sprite.y = mousePos.y-(this.ss._frameHeight/2);
	}
}