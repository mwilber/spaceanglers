function Monster(name) {
	this.name = name;
	this.type = "monster";
	this.startkey = "spin";
	this.ss = new createjs.SpriteSheet({
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
		});
	this.sprite = new createjs.BitmapAnimation(this.ss);
	this.sprite.x = 50;
	this.sprite.y = 300;
	this.vX = 4;
	this.sprite.gotoAndPlay("walk");
	this.init = function() {
		
	}
	this.move = function() {
		// Hit testing the screen width, otherwise our sprite would disappear
	    if ( (this.sprite.x >= screen_width - 16) || (this.sprite.x < 16) ){
	        // We've reached the right side of our screen
	        // We need to walk left now to go back to our initial position
	        this.vX = -this.vX;
		}
	
		this.sprite.x -= this.vX;
	}
}