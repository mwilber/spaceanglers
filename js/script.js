/* Author: Matthew Wilber (mwilber@gmail.com)

*/
project.currentStyle.strokeColor = 'white';

var frameCt = 0;

// Game Preferences
////////////////////////////////////////////////////////////////////////////
var presets = {
	margin: 100,
	g: 0.2,			// Gravity
	beampwr: 2,		// speed beam lifts actors
	ground: 10,		// y distance from bottom actors are spawned
	ceiling: 100,	// min height ship can reach
	lastlevel: 3, 	// # represents array idx
	dmgBullet: 1,
	dmgShell: 10,
};

var levels = [
	{
		title: 'Abduct All Civilians.',
		mils: 0,
		milreact: 50,
		arts: 0,
		artreact: 1,
		accuracy: 30,
		civs: 3,
		quota: 1,
		beamDrainCiv: .01,
		beamDrainMil: .05,
		beamDrainArt: .1,
	},
	{
		title: 'Don\'t screw up.',
		mils: 3,
		milreact: 10,
		arts: 0,
		artreact: 1,
		accuracy: 30,
		civs: 5,
		quota: 5,
		beamDrainCiv: .01,
		beamDrainMil: .05,
		beamDrainArt: .1,
	},
	{
		title: 'Avoid getting shot.',
		mils: 5,
		milreact: 10,
		arts: 1,
		artreact: 2,
		accuracy: 15,
		civs: 10,
		quota: 7,
		beamDrainCiv: .01,
		beamDrainMil: .05,
		beamDrainArt: .1,
	},
	{
		title: 'Dropping tanks is fun.',
		mils: 10,
		milreact: 50,
		arts: 3,
		artreact: 5,
		accuracy: 0,
		civs: 10,
		quota: 8,
		beamDrainCiv: .01,
		beamDrainMil: .05,
		beamDrainArt: .1,
	}
];

var trackerLine = new Path(new Point(0,0), new Point(0,0));


// Event Methods
////////////////////////////////////////////////////////////////////////////
function onFrame(event) {
	
	//var angle = Math.atan2(Ship.item.position.y - view.size.height-presets.ground, Ship.item.position.x - view.size.width/2);
	//angle = Math.floor(360-(180*(((-angle*100)/3)/100)));
	//document.getElementById('debug').innerHTML = angle;
	
	Bullets.move();
	Shells.move();
	Beam.checkCollisions();
	Ship.checkCollisions();
	Ship.animate();
	for( idx in Actors.Civ ){
		switch( Actors.Civ[idx].status ){
			case 'alive':
				Actors.Civ[idx].ambulate();
				break;
			case 'rising':
				Actors.Civ[idx].levitate();
				break;
			case 'falling':
				Actors.Civ[idx].gravitate();
				break;
		}
		Actors.Civ[idx].animate();
	}
	for( idx in Actors.Mil ){
		switch( Actors.Mil[idx].status ){
			case 'alive':
				Actors.Mil[idx].ambulate();
				break;
			case 'rising':
				Actors.Mil[idx].levitate();
				break;
			case 'falling':
				Actors.Mil[idx].gravitate();
				break;
			case 'firing':
				Actors.Mil[idx].obliterate();
				break;
		}
		
	}
	for( idx in Actors.Art ){
		switch( Actors.Art[idx].status ){
			case 'alive':
				Actors.Art[idx].ambulate();
				break;
			case 'rising':
				Actors.Art[idx].levitate();
				break;
			case 'falling':
				Actors.Art[idx].gravitate();
				break;
			case 'firing':
				Actors.Art[idx].obliterate();
				break;
		}
		
	}
	Ship.stabilize();
	if(frameCt==14){
		frameCt = 0;
	}else{
		frameCt++;
	}
}

function onKeyUp(event) {

	if (event.key == 'r') {
		Score.resetGame();
	}
	if( event.key == 'd') {
		Energy.deplete(1);
	}
	if( event.key == 'l') {
		Score.levelUp();
	}
	if( event.key == 's') {
		Bullets.fire(new Point(200,200), 0);
	}
	// Show stats:
//	if (event.key == 'f') {
//		var statHolder = document.getElementById('statholder');
//		statHolder.style.display = (statHolder.style.display == 'block')
//				? 'none' : 'block';
//	}
}

function onMouseDown(event) {
	if( Score.gameon ){
		Beam.armed--;
		if( Beam.armed == 0 ){
			Beam.item.visible = true;
		}	
	}
}

function onMouseUp(event) {
	if( Score.gameon ){
		Beam.item.visible = false;
		Beam.armed = touchCt;
		Beam.beaming = false;
	}
}

function onMouseMove(event) {
    mousePos = event.point;
    // Do not let the ship fly lower than the ceiling
    if(mousePos.y > view.size.height-presets.ceiling){
    	mousePos.y = view.size.height-presets.ceiling;
    }
    Ship.moveTo( mousePos );
    // Adjust the shape of the beam so that it always touches bottom
    Beam.moveTo( Ship.item.position+[0,40] );
    Beam.item.children[1].segments[2].point = new Point(mousePos.x+15,view.size.height);
	Beam.item.children[1].segments[3].point = new Point(mousePos.x-15,view.size.height);
	Beam.item.children[0].segments[2].point = new Point(mousePos.x+25,view.size.height);
	Beam.item.children[0].segments[3].point = new Point(mousePos.x-25,view.size.height);
    
}


// Game Control Objects
////////////////////////////////////////////////////////////////////////////
var Score = new function(){
	return{
		level: 0,
		total: 0,
		//abducted: 0,
		gameon: true,
		trackr: {
			Civ:{
				Abduct:0,
				Splatter:0,
				Piledriver:0,
			},
			Mil:{
				Abduct:0,
				Splatter:0,
				Piledriver:0,
			},
			Art:{
				Abduct:0,
				Splatter:0,
				Piledriver:0,
			},
		},
		plusone: function(){
			this.trackr.Civ.Abduct++;
			//if( this.abducted >= levels[Score.level].quota ){
			//	console.log('LEVEL COMPLETE!');
			//	this.levelUp();
			//}else{
				this.checkDead();
			//}
		},
		levelUp: function(){
			if( this.level < presets.lastlevel ){
				this.level++;
				Actors.destroy();
				//Actors.init();
				Energy.reset();
				this.abducted = 0;
				document.getElementById('levelnum').innerHTML = (this.level+1);
				announceScore(levels[Score.level].title, this.trackr);
				this.trackr = {Civ:{Abduct:0,Splatter:0,Piledriver:0,},Mil:{Abduct:0,Splatter:0,Piledriver:0,},Art:{Abduct:0,Splatter:0,Piledriver:0,}}
			}else{
				this.endGame();
			}
		},
		endGame: function(){
			console.log('GAME COMPLETE!');
			this.gameon = false;
			if( this.level == presets.lastlevel && this.abducted >= levels[Score.level].quota ){
				Actors.destroy();
				document.getElementById('winner').style.display = 'block';
				Beam.item.visible = false;
			}else{
				document.getElementById('loser').style.display = 'block';
				Beam.item.visible = false;
			}
		},
		resetLevel: function(){
			Actors.destroy();
			this.abducted = 0;
			Actors.init();
			Energy.reset();
		},
		resetGame: function(){
			Actors.destroy();
			this.abducted = 0;
			this.level = 0;
			Actors.init();
			Energy.reset();
		},
		checkDead: function(){
			if((this.trackr.Mil.Splatter + this.trackr.Art.Splatter+this.trackr.Mil.Piledriver == levels[Score.level].mils+levels[Score.level].arts) && (this.trackr.Civ.Abduct+this.trackr.Civ.Splatter+this.trackr.Civ.Piledriver == 0)){
				defenselessBonus();
			}
			if( this.trackr.Civ.Abduct+this.trackr.Civ.Splatter == levels[Score.level].civs ){
				this.levelUp();
			}
		},
	}
}


// Screen Control Objects
////////////////////////////////////////////////////////////////////////////
var Energy = new function() {
	var energy = 100;
	var point = new Point(200, 10);
	var size = new Size(100, 20);
	var rectangle = new Rectangle(point, size);
	var meter = new Path.Rectangle(rectangle);
	meter.strokeColor = 'green';
	meter.fillColor = 'green';
	var border = new Path.Rectangle(rectangle);
	border.strokeColor = 'white';
	
	var group = new Group(meter,border);
	return {
		report: function(){
			return energy;
		},
		item: group,
		deplete: function(amount){
			energy -= amount;
			if( energy <= 0 ){
				Score.endGame();
			}else{
				this.refresh();
			}
		},
		renew: function(amount){
			energy += amount;
			if( energy <= 0 ){
				Score.endGame();
			}else{
				this.refresh();
			}
		},
		reset: function(){
			energy = 100;
			this.refresh();
		},
		refresh: function(){
			group.removeChildren();
			var point = new Point(200, 10);
			var size = new Size(energy, 20);
			var rectangle = new Rectangle(point, size);
			var meter = new Path.Rectangle(rectangle);
			meter.strokeColor = 'green';
			meter.fillColor = 'green';
			size = new Size(100, 20);
			rectangle = new Rectangle(point, size);
			var border = new Path.Rectangle(rectangle);
			border.strokeColor = 'white';
			
			group.addChild(meter);
			group.addChild(border);
		},
	}
}

var Beam = new function() {
	var focus = new Path([-14,20],[11,20],[10,80],[-10,80]);
	focus.fillColor = new RgbColor(1, 1, 1, 0.6);
	focus.strokeColor = new RgbColor(1, 1, 1, 0.3);
	var fade = new Path([-20,20],[17,20],[20,80],[-20,80]);
	fade.fillColor = new RgbColor(1, 1, 0.5, 0.3);
	fade.strokeColor = new RgbColor(1, 1, 0.5, 0.3);
	var group = new Group(fade,focus);
	group.position = view.bounds.center;
	group.visible = false;
	return {
		item: group,
		beaming: false,
		armed: touchCt,
		moveTo: function(position) {
			group.position = position;
		},
		checkCollisions: function() {
			var hitCk = new Array();
			if(this.item.visible){
				for( idx in Actors.Civ ){
					if( Actors.Civ[idx].item != undefined ){
						if (Actors.Civ[idx].status != 'dead' && Actors.Civ[idx].status != 'buried' && Actors.Civ[idx].item.bounds.intersects(this.item.bounds)) {
							hitCk.push(Actors.Civ[idx]);
						}
					}
				}
				for( idx in Actors.Mil ){
					if( Actors.Mil[idx].item != undefined ){
						if (Actors.Mil[idx].status != 'dead' && Actors.Mil[idx].status != 'buried' && Actors.Mil[idx].item.bounds.intersects(this.item.bounds)) {
							hitCk.push(Actors.Mil[idx]);
						}
					}
				}
				for( idx in Actors.Art ){
					if( Actors.Art[idx].item != undefined ){
						if (Actors.Art[idx].status != 'dead' && Actors.Art[idx].status != 'buried' && Actors.Art[idx].item.bounds.intersects(this.item.bounds)) {
							hitCk.push(Actors.Art[idx]);
						}
					}
				}
				var hid;
				for( hid = hitCk.length-1; hid >=0; hid-- ){
					if( hitCk[hid].status == 'falling' ){
						hitCk[hid].mutate('rising');
						break;
					}else if(hid <= 0){
						hitCk[hid].mutate('rising');
					}
				}
			}
		},
	}
}

var Ship = new function() {
	if(rastergfx){
		var saucer = new Group(new Raster('ship_001'), new Raster('ship_002'), new Raster('ship_003'), new Raster('ship_004'), new Raster('ship_005'), new Raster('ship_006'));
		for( idx in saucer.children ){
			saucer.children[idx].visible = false;
		}
		saucer.children[0].visible = true;
		var group = new Group(saucer);
	}else{
		var saucer = new Path([-90,0],[-30,20],[30,20],[90,0],[40,-20],[-40,-20],[-90,0]);
		saucer.closed = true;
		var seam = new Path([-90,0],[90,0]);
		var bridge = new Path([-40,-20],[-30,-40],[30,-40],[40,-20],[-40,-20]);
		var group = new Group(saucer, seam, bridge);
	}
	group.position = view.bounds.center;
	return {
		item: group,

		angle: 0,

		moveTo: function(position) {
			if( group.position.x < position.x && this.angle < 10 ){
		    	group.rotate(2);
		    	this.angle+=2;
		    }else if( group.position.x > position.x && this.angle > -10  ){
		    	group.rotate(-2);
		    	this.angle-=2;
		    }
		    
			group.position = position;
			//keepInView(group);
		},
		stabilize: function(){
			if(this.angle > 0){
		    	this.angle--;
		    	group.rotate(-1);
		    }else if(this.angle < 0){
		    	this.angle++;
		    	group.rotate(1);
		    }
		},
		checkCollisions: function() {
			if(this.item.visible){
				for( idx in Actors.Civ ){
					if( Actors.Civ[idx].item != undefined ){
						if (Actors.Civ[idx].status != 'abducted' && Actors.Civ[idx].item.bounds.intersects(this.item.bounds)) {
							Actors.Civ[idx].confiscate();
						}
					}
				}
			}
		},
		
		destroy: function() {
			this.destroyedShip = assets.destroyedShip.clone();
			this.destroyedShip.position = this.item.position;
			this.destroyedShip.visible = true;
			this.item.visible = false;
			this.stop();
			this.item.position = view.center;
			this.dying = true;
		},
		
		destroyed: function() {
			this.item.visible = true;
			this.stop();
			this.item.position = view.center;
			this.dying = false;
			this.destroyedShip.visible = false;
		},
		animate: function() {
			for( idx=0; idx<this.item.children[0].children.length; idx++ ){
		    	this.item.children[0].children[idx].visible = false;
			}
			this.item.children[0].children[Math.floor(frameCt/3)].visible = true;
		},
	}
}


var Bullets = new function() {
	var group = new Group();
	var children = group.children;
	return {
		fire: function(position, angle) {
			if (children.length > 4) return; 
			var bullet = new Path.Circle(position, 0.5);
			bullet.fillColor = 'white';
			bullet.strokeWidth = 0;
			bullet.data = {
				vector: new Point({
					angle: angle,
					length: 10
				}),
				timeToDie: 58
			};
			bullet.position += bullet.data.vector;
			group.addChild(bullet);
		},
		move: function() {
			// check for bullet hit
			for (var i = 0; i < children.length; i++) {
				var bullet = children[i];
				bullet.data.timeToDie--;
				if (bullet.data.timeToDie < 1) {
					bullet.remove();
				} else {
					bullet.position += bullet.data.vector;
					if (Ship.item.bounds.contains(bullet.position) ) {
						Energy.deplete(presets.dmgBullet);
						bullet.remove();
					}
//					for (var r = 0; r < Rocks.children.length; r++) {
//						var rock = Rocks.children[r];
//						if (rock.bounds.contains(bullet.position) ) {
//							Score.update(rock.type);
//							Rocks.explode(rock);
//							if (rock.type < Rocks.TYPE_SMALL ) {
//								for (var i = 0; i < 2; i++) {
//									Rocks.add(1, rock.type + 4, rock.position);
//								}
//							}
//							rock.remove();
//							bullet.remove();
//						}
//					}
//					keepInView(bullet);
				}
			}
		}
	};
};


var Shells = new function() {
	var group = new Group();
	var children = group.children;
	return {
		fire: function(position, angle) {
			if (children.length > 4) return; 
			var bullet = new Path(position+[10,10],position+[10,20],position+[20,20],position+[20,10]);
			bullet.fillColor = 'yellow';
			bullet.strokeWidth = 0;
			bullet.data = {
				vector: new Point({
					angle: angle,
					length: 5
				}),
				timeToDie: 150
			};
			bullet.position += bullet.data.vector;
			group.addChild(bullet);
		},
		move: function() {
			// check for bullet hit
			for (var i = 0; i < children.length; i++) {
				var bullet = children[i];
				bullet.data.timeToDie--;
				if (bullet.data.timeToDie < 1) {
					bullet.remove();
				} else {
					bullet.position += bullet.data.vector;
					if(bullet.data.vector.angle > 270){
						bullet.data.vector.angle+=.2;
					}else{
						bullet.data.vector.angle-=.2;
					}
					
					if (Ship.item.bounds.contains(bullet.position) ) {
						Energy.deplete(presets.dmgShell);
						bullet.remove();
					}
				}
			}
		}
	};
};


var Actors = new function(){
	return{
		Civ: new Array(),
		Mil: new Array(),
		Art: new Array(),
		
		destroy: function(){
			for( idx in Actors.Civ ){
				if( Actors.Civ[idx].item != undefined ){
					Actors.Civ[idx].item.remove();
				}
			}
			for( idx in Actors.Mil ){
				if( Actors.Mil[idx].item != undefined ){
					Actors.Mil[idx].item.remove();
				}
			}
			for( idx in Actors.Art ){
				if( Actors.Art[idx].item != undefined ){
					Actors.Art[idx].item.remove();
				}
			}
			this.Civ = new Array();
			this.Mil = new Array();
			this.Art = new Array();
			
		},
		
		init: function(){
			
			this.Mil = new Array();
			for( idx=0; idx<levels[Score.level].mils; idx++){
				this.Mil[idx] = new function() {
					var endpos = Math.floor(Math.random()*(view.size.width/5));
					endpos  = Math.floor(endpos+(view.size.width/5));
					if( Math.floor(Math.random()*10) < 5 ){
						endpos = Math.floor(endpos+((view.size.width/5)*2));
					}
					var startpos = -Math.floor(Math.random()*presets.margin);
					if( endpos > view.size.width/2 ){
						startpos = view.size.width+Math.floor(Math.random()*presets.margin);
					}
					
					////////////////////////////////////////////////////////////////////////////
					// Set up sprites
					////////////////////////////////////////////////////////////////////////////
					if(rastergfx){
						var head = new Group(new Raster('mil_001'));
					}else{
						var head = new Path.Circle(new Point(startpos, view.size.height-presets.ground), 2);
						head.fillColor = "#0f0";
						head.strokeColor = "#0f0";
					}
					head.position = new Point(startpos, view.size.height-(presets.ground+10));
					if(rastergfx){
						var dead = new Group(new Raster('mil_dead'));
					}else{
						var dead = new Path.Circle(head.position+[0,4], 2);
						dead.fillColor = "#f00";
						dead.strokeColor = "#f00";
						dead.scale(5, .5);
						
					}
					dead.position = head.position+[0,4];
					dead.visible = false;
					////////////////////////////////////////////////////////////////////////////
					
					var group = new Group(head, dead);
					if( group.position.x > endpos ){
						group.scale(-1.0,1.0);
					}
					
					return{
						item: group,
						speed: -1,
						moving: true,
						gforce: presets.g,
						status: 'alive',
						
						levitate: function(){
							this.gforce = presets.g;
							this.item.position.x = Beam.item.position.x;
							//this.item.position.y = this.item.position.y-presets.beampwr;
							if( this.item.bounds.top > Beam.item.bounds.top ){
								this.item.position.y = this.item.position.y-presets.beampwr;
							}
							this.status = 'falling';
							Energy.deplete(levels[Score.level].beamDrainMil);
						},
						gravitate: function(){
							// check if stopped
							if(group.position.y < view.size.height-presets.ground){
								this.gforce += presets.g;
								group.position = group.position+[0,this.gforce];
							}else if( this.gforce > 7 ){
								group.position.y = view.size.height-presets.ground;
								this.terminate();
							}else{
								group.position.y = view.size.height-presets.ground;
								this.status = 'alive';
								this.gforce = presets.g;
							}
						},
						ambulate: function(){
							if(this.moving){
								// Change direction?
								if( group.position.x == endpos ){
									this.status = 'firing';
								}else if( group.position.x > endpos  ){
									this.speed = -1;
								}else{
									this.speed = 1;
								}
								group.position.x += this.speed;
							}	
						},
						obliterate: function(){
							if( Math.floor(Math.random()*1000) < levels[Score.level].milreact ){
								// Take aim
								var angle = Math.atan2(Ship.item.position.y - this.item.position.y, Ship.item.position.x - this.item.position.x);
								angle = Math.floor(360-(180*(((-angle*100)/3)/100)));
								Bullets.fire(this.item.position, angle);
							}
						},
						terminate: function(){
							this.status = 'dead';
							Score.trackr.Mil.Splatter++;
							group.children[0].visible = false;
							group.children[1].visible = true;
							Score.checkDead();
						},
						confiscate: function(){
							this.status = 'abducted';
							Score.plusone();
							console.log("Abductee: "+Score.abducted);
							group.position = new Point(view.size.width-(10*Score.abducted),10);
						},
						mutate: function(pStatus){
							this.status = pStatus;
						}
					}/*end return*/
				}/*end mil */
			}/*end for */
			
			this.Art = new Array();
			for( idx=0; idx<levels[Score.level].arts; idx++){
				this.Art[idx] = new function() {
					var endpos = Math.floor(Math.random()*(view.size.width/5));
					endpos  = Math.floor(endpos+(view.size.width/5));
					if( Math.floor(Math.random()*10) < 5 ){
						endpos = Math.floor(endpos+((view.size.width/5)*2));
					}
					var startpos = -Math.floor(Math.random()*presets.margin);
					if( endpos > view.size.width/2 ){
						startpos = view.size.width+Math.floor(Math.random()*presets.margin);
					}
					
					////////////////////////////////////////////////////////////////////////////
					// Set up sprites
					////////////////////////////////////////////////////////////////////////////
					if(rastergfx){
						var head = new Group(new Raster('art_001'));
						//head.rotate(180);
					}else{
						//var body = new Path([-30,0],[-20,5],[20,5],[30,0],[-30,0]);
						//var tread = new Path([30,0],[20,-10],[-20,-10],[-30,0],[30,0]);
						//var barrel = new Path([0,-10],[20,-30],[30,-20],[20,-10],[0,-10])
						var body = new Path([-30,20],[0,-10],[30,20],[-30,20]);
						body.fillColor = "#0f0";
						body.strokeColor = "#0f0";
						var head = new Group(body);
					}
					head.position = new Point(startpos, view.size.height-(presets.ground+30));

					if(rastergfx){
						var dead = new Group(new Raster('art_dead'));
					}else{
						body = new Path([-30,20],[-20,-5],[20,-5],[30,20],[-30,20]);
						//tread = new Path([30,0],[20,-10],[-20,-10],[-30,0],[30,0]);
						//barrel = new Path([0,-10],[20,-30],[30,-20],[20,-10],[0,-10])
						var dead = new Group(body);
						//dead.fillColor = "#f00";
						dead.strokeColor = "#f00";
						//dead.scale(5, .5);
					}
					dead.position = head.position;
					dead.visible = false;
					////////////////////////////////////////////////////////////////////////////
					
					var group = new Group(head, dead);
					if( group.position.x > endpos ){
						group.scale(-1.0,1.0);
					}
					
					return{
						item: group,
						speed: -1,
						moving: true,
						gforce: presets.g,
						status: 'alive',
						
						levitate: function(){
							this.gforce = presets.g;
							this.item.position.x = Beam.item.position.x;
							//this.item.position.y = this.item.position.y-presets.beampwr;
							if( this.item.bounds.top > Beam.item.bounds.top ){
								this.item.position.y = this.item.position.y-presets.beampwr;
							}
							this.status = 'falling';
							Energy.deplete(levels[Score.level].beamDrainArt);
						},
						gravitate: function(){
							// check if stopped
							if(group.position.y < view.size.height-(presets.ground+10)){
								this.gforce += presets.g;
								group.position = group.position+[0,this.gforce];
							}else if( this.gforce > 10 ){
								group.position.y = view.size.height-(presets.ground+10);
								this.terminate();
							}else{
								group.position.y = view.size.height-(presets.ground+10);
								this.status = 'alive';
								this.gforce = presets.g;
							}
							this.checkCollisions();
						},
						ambulate: function(){
							if(this.moving){
								// Change direction?
								if( group.position.x == endpos ){
									this.status = 'firing';
								}else if( group.position.x > endpos  ){
									this.speed = -1;
								}else{
									this.speed = 1;
								}
								//console.log(this.speed);
								//if(this.speed > 0){
								//	group.scale(1.0,1.0);
								//}else{
								//	group.scale(-1.0,1.0);
								//}
								group.position.x += this.speed;
							}	
						},
						obliterate: function(){
							if( Math.floor(Math.random()*1000) < levels[Score.level].artreact ){
								// Take aim
								var angle = Math.atan2(Ship.item.position.y - this.item.position.y, Ship.item.position.x - this.item.position.x);
								angle = Math.floor(360-(180*(((-angle*100)/3)/100)));
								var offset = ( 15+(Math.floor(Math.random()*levels[Score.level].accuracy)-(levels[Score.level].accuracy/2)) );
								//console.log(offset);
								if(angle > 270){
									angle-=offset;
								}else{
									angle+=offset;
								}
								Shells.fire(this.item.position, angle);
							}
						},
						terminate: function(){
							this.status = 'dead';
							Score.trackr.Art.Splatter++;
							group.children[0].visible = false;
							group.children[1].visible = true;
							Score.checkDead();
						},
						confiscate: function(){
							this.status = 'abducted';
							Score.plusone();
							console.log("Abductee: "+Score.abducted);
							group.position = new Point(view.size.width-(10*Score.abducted),10);
						},
						checkCollisions: function() {
							for( idx in Actors.Civ ){
								if( Actors.Civ[idx] != this ){
									if (Actors.Civ[idx].status == 'alive' && Actors.Civ[idx].item.bounds.intersects(this.item.bounds)) {
										Score.trackr.Civ.Piledriver++;
										Actors.Civ[idx].terminate();
										console.log(Score.trackr);
									}
								}
							}
							for( idx in Actors.Mil ){
								if( Actors.Mil[idx] != this ){
									if ((Actors.Mil[idx].status == 'alive' || Actors.Mil[idx].status == 'firing') && Actors.Mil[idx].item.bounds.intersects(this.item.bounds)) {
										Score.trackr.Mil.Piledriver++;
										Actors.Mil[idx].terminate();
									}
								}
							}
							for( idx in Actors.Art ){
								if( Actors.Art[idx] != this ){
									if ((Actors.Art[idx].status == 'alive' || Actors.Art[idx].status == 'firing') && Actors.Art[idx].item.bounds.intersects(this.item.bounds)) {
										Actors.Art[idx].terminate();
									}
								}
								
							}
						},
						mutate: function(pStatus){
							this.status = pStatus;
						}
					}/*end return*/
				}/*end mil */
			}/*end for */
			
			this.Civ = new Array();
			for( idx=0; idx<levels[Score.level].civs; idx++){
				this.Civ[idx] = new function() {
					
					////////////////////////////////////////////////////////////////////////////
					// Set up sprites
					////////////////////////////////////////////////////////////////////////////
					if(rastergfx){
						var head = new Group(new Raster('civ_001'), new Raster('civ_002'), new Raster('civ_003'), new Raster('civ_004'), new Raster('civ_005'));
						//for( idx in head.children ){
							//head.children[idx].visible = false;
						//}
						//head.children[0].visible = true;
					}else{
						var head = new Path.Circle(new Point(Math.floor(Math.random()*(view.size.width-(presets.margin*2)))+presets.margin, view.size.height-presets.ground), 2);
					}
					head.position = new Point(Math.floor(Math.random()*(view.size.width-(presets.margin*2)))+presets.margin, view.size.height-presets.ground);
					if(rastergfx){
						var levi = new Group(new Raster('civ_levitate'));
					}else{
						var levi = new Path.Circle(head.position+[0,4], 2);
						levi.fillColor = "#000";
						levi.strokeColor = "#000";
						levi.scale(5, .5);
					}
					levi.visible = false;
					levi.position = head.position+[0,4];
					
					if(rastergfx){
						var fall = new Group(new Raster('civ_fall'));
					}else{
						var fall = new Path.Circle(head.position+[0,4], 2);
						fall.fillColor = "#000";
						fall.strokeColor = "#000";
						fall.scale(5, .5);
					}
					fall.visible = false;
					fall.position = head.position+[0,4];
					
					if(rastergfx){
						var dead = new Group(new Raster('civ_dead'));
					}else{
						var dead = new Path.Circle(head.position+[0,4], 2);
						dead.fillColor = "#f00";
						dead.strokeColor = "#f00";
						dead.scale(5, .5);
					}
					dead.visible = false;
					dead.position = head.position+[0,4];
					////////////////////////////////////////////////////////////////////////////
					
					var group = new Group(head, dead, levi, fall);
					return{
						item: group,
						speed: -1,
						moving: true,
						gforce: presets.g,
						status: 'alive',
						
						levitate: function(){
							this.gforce = presets.g;
							this.item.position.x = Beam.item.position.x;
							//console.log(Actors.Civ[idx].item.bounds.top + " | " + this.item.bounds.top);
							if( this.item.bounds.top > Beam.item.bounds.top ){
								this.item.position.y = this.item.position.y-presets.beampwr;
							}
							this.mutate('falling');
							Energy.deplete(levels[Score.level].beamDrainCiv);
						},
						gravitate: function(){
							// check if stopped
							if(group.position.y < view.size.height-10){
								this.gforce += presets.g;
								group.position = group.position+[0,this.gforce];
							}else if( this.gforce > 7 ){
								group.position.y = view.size.height-presets.ground;
								this.terminate();
							}else{
								group.position.y = view.size.height-presets.ground;
								this.mutate('alive');
								this.gforce = presets.g;
							}
						},
						ambulate: function(){
							if(this.moving){
								// Change direction?
								if( group.position.x < presets.margin ){
									this.speed = 1;
									group.scale(-1.0,1.0);
								}else if( group.position.x > (view.size.width-presets.margin) ){
									this.speed = -1;
									group.scale(-1.0,1.0);
								}else if( Math.floor(Math.random()*50) == 0 ){
									this.speed = -this.speed;
									if(this.speed == 1){
										group.scale(-1.0,1.0);
									}else{
										group.scale(-1.0,1.0);
									}
								}
								group.position.x += this.speed;
							}	
						},
						terminate: function(){
							this.mutate('dead');
							Score.trackr.Civ.Splatter++;
							Score.checkDead();
						},
						confiscate: function(){
							this.mutate('abducted');
							Score.plusone();
							console.log("Abductee: "+Score.abducted);
							group.position = new Point(view.size.width-(10*Score.abducted),10);
						},
						mutate: function(pStatus){
							this.status = pStatus;
							switch(this.status){
								case 'alive':
									group.children[0].visible = true;
									group.children[1].visible = false;
									group.children[2].visible = false;
									group.children[3].visible = false;
									break;
								case 'dead':
									group.children[0].visible = false;
									group.children[1].visible = true;
									group.children[2].visible = false;
									group.children[3].visible = false;
									break;
								case 'falling':
									group.children[0].visible = false;
									group.children[1].visible = false;
									group.children[2].visible = true;
									group.children[3].visible = false;
									break;
								case 'rising':
									group.children[0].visible = false;
									group.children[1].visible = false;
									group.children[2].visible = true;
									group.children[3].visible = false;
									break;
								case 'abducted':
									break;
							}
						},
						animate: function() {
							for( idx=0; idx<this.item.children[0].children.length; idx++ ){
						    	this.item.children[0].children[idx].visible = false;
							}
							this.item.children[0].children[Math.floor(frameCt/3)].visible = true;
						},
					}/*end return*/
				}/*end civ */
			}/*end for */
			
		}/*end init */
	}/*end return*/
}/*end actors*/


//Actors.init();
actref = Actors;
scoreref = Score;
startGame(levels[Score.level].title);