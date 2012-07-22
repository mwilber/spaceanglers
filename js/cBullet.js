function Bullet(pStartPos, pVector, pDamage) {
	
	this.status = "ready";
	this.actor = new Object();
	this.hit = 0;
	this.damage = pDamage;
	
	var g = new Graphics()
		.beginStroke("#FFFFFF").moveTo(-1, 0).lineTo(1, 0)
		.endStroke();
	this.actor.sprite = new Shape(g);
	this.actor.sprite.visible = true;
	
	//DebugOut(this.actor.sprite);
	this.actor.sprite.x = pStartPos.x;
	this.actor.sprite.y = pStartPos.y;
	
	this.actor.velocity = {
			"x":pVector.x,
			"y":pVector.y
	};
	
	DebugOut("bullet created");
}

Bullet.prototype.Move = function() {
	
	DebugOut("Bullet Moving x:"+this.actor.sprite.x+" y:"+this.actor.sprite.y);
	
	this.actor.sprite.x+=this.actor.velocity.x;
	this.actor.sprite.y+=this.actor.velocity.y;
}

Bullet.prototype.hitTest = function( pPos ) {
	
	var lBound = this.actor.sprite.x - 30;
	var rBound = this.actor.sprite.x + 30;
	
	if( pPos.x > lBound && pPos.x < rBound ){
		return true;
	}else{
		return false;
	}
}