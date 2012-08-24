function Prop(pData){
	this.name = pData.name;
	this.type = pData.type;
	this.status = pData.status;
	this.ss = new createjs.SpriteSheet(pData.spritesheet);
	SpriteSheetUtils.addFlippedFrames(this.ss, true, false, false);
	this.sprite = new createjs.BitmapAnimation(this.ss);
	this.sprite.x = pData.position.x;
	this.sprite.y = pData.position.y;
	this.sprite.gotoAndPlay(pData.startkey);
	this.height = pData.spritesheet.frames.height;
	this.width = pData.spritesheet.frames.width;
	this.velocity = {
			"x":pData.velocity.x,
			"y":pData.velocity.y
	};
	this.hit = pData.radius;
	this.decay = 100;
}

Prop.prototype.GetPos = function(){
	return {
		"x":this.sprite.x,
		"y":this.sprite.y
	}
}

Prop.prototype.SetPos = function(pPos){
	this.sprite.x = pPos.x;
	this.sprite.y = pPos.y;
}

Prop.prototype.hitPoint = function (tX, tY) {
        return this.hitRadius(tX, tY, 0);
}

Prop.prototype.hitRadius = function (tX, tY, tHit) {
	
    //early returns speed it up
    if (tX - tHit > this.sprite.x + this.hit) { return; }
    if (tX + tHit < this.sprite.x - this.hit) { return; }
    if (tY - tHit > this.sprite.y + this.hit) { return; }
    if (tY + tHit < this.sprite.y - this.hit) { return; }

    //now do the circle distance test
    return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.sprite.x - tX), 2) + Math.pow(Math.abs(this.sprite.y - tY), 2));
}

Prop.prototype.UpdatePos = function (){
	
	// Then update the screen position
	this.SetPos({'x':this.GetPos().x+this.velocity.x, 'y':this.GetPos().y+this.velocity.y});
	
}


/*
 * 
 */