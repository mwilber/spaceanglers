function Actor(pData){
	this.name = pData.name;
	this.type = pData.type;
	this.sprite = new createjs.BitmapAnimation(new createjs.SpriteSheet(pData.spritesheet));
	this.sprite.x = pData.position.x;
	this.sprite.y = pData.position.y;
	this.sprite.gotoAndPlay(pData.startkey);
	this.height = pData.spritesheet.frames.height;
	this.width = pData.spritesheet.frames.width;
}

Actor.prototype.GetPos = function(){
	return {
		"x":this.sprite.x,
		"y":this.sprite.y
	}
}

Actor.prototype.SetPos = function(pPos){
	this.sprite.x = pPos.x;
	this.sprite.y = pPos.y;
}


/*
 * 
 */