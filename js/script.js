/* Author: Matthew Wilber mwilber@gmail.com

*/

var images = new Array();
var numberOfImagesLoaded = 0;


var canvas;
var stage;
var screen_width;
var screen_height;
var mousePos = {
	"x":0,
	"y":0
}
var pChars = new Array();
var npChars = new Array();
var bulletz = new Array();
var beamIdx = -1;
var shipIdx = -1;
var presets = {
	margin: 100,
	g: 0.2,			// Gravity
	beampwr: 5,		// speed beam lifts actors
	ground: 70,		// y distance from bottom actors are spawned
	ceiling: 150,	// min height ship can reach
	lastlevel: 3, 	// # represents array idx
	dmgDrain: 0.05,
	dmgShell: 10,
	maxActor: 5,
	abductVal: 100,
	fps: 24,
	freqBullet: 20,
	drainCiv: 0.05
};
var tallyMon = {
	"abducted": 0,
	"energy": 100,
	"score": 0
}
var gameStatus = "start";

/////////////////////////////////////////////////////////////////////////////
//	Event Handlers
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	
	//FB.init({appId: FBconfig.app.id, status : true, cookie: true, xfbml : true});
	//SetFrame();
	
	images['ship'] = new Image();
	images['ship'].onload = HandleImageLoad;
	images['ship'].onerror = HandleImageError;
	images['ship'].src = "assets/anim_ship_spin.png";
	images['civilian'] = new Image();
	images['civilian'].onload = HandleImageLoad;
	images['civilian'].onerror = HandleImageError;
	images['civilian'].src = "assets/civilian.png";
	images['military'] = new Image();
	images['military'].onload = HandleImageLoad;
	images['military'].onerror = HandleImageError;
	images['military'].src = "assets/military.png";
	
	screen_width = document.getElementById("gamecanvas").width;
	screen_height = document.getElementById("gamecanvas").height;

	
	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(document.getElementById("gamecanvas"));
	
	createjs.Ticker.setFPS(presets.fps);
	createjs.Ticker.addListener(window);

});

$('#gamecanvas').mousemove(function(e) {
    var pos = findPos(this);
    mousePos.x = e.pageX - pos.x;
    mousePos.y = e.pageY - pos.y;
    //var coordinateDisplay = "x=" + x + ", y=" + y;
    //writeCoordinateDisplay(coordinateDisplay);
});

$('#gamecanvas').mousedown(function(e) {
    pChars[beamIdx].On();
    return false;
});

$('#gamecanvas').mouseup(function(e) {
    pChars[beamIdx].Off();
    return false;
});


$('body').bind('AuthorizedUser', function(event, authObj) {
	fb_auth.id = authObj.authResponse.userID;
	fb_auth.token = authObj.authResponse.accessToken;
	
	if( fb_auth.id != '' && fb_auth.token != ''){
		DebugOut('FB User logged in:');
		DebugOut(fb_auth);
	}
});

$('body').bind('UnauthorizedUser', function() {
	DebugOut('FB User NOT logged in. Try calling Login() method:');
	DebugOut(fb_auth);
});

$('body').bind('LikeStatus', function(event, pLikeStatus) {
	if(pLikeStatus){
		//user likes target
		DebugOut('user likes target');
		window.location = FBconfig.likegate.redirect;
	}else{
		//user does not like target
		DebugOut('user does not like target');
		window.location = FBconfig.likegate.gatepage;
	}
});

/////////////////////////////////////////////////////////////////////////////
//	Game Functions
/////////////////////////////////////////////////////////////////////////////

function HandleImageLoad(e) {
    numberOfImagesLoaded++;
    
    DebugOut(numberOfImagesLoaded+" images loaded of "+images.length+1);
    DebugOut(e);

    if (numberOfImagesLoaded == images.length+1) {
		numberOfImagesLoaded = 0;
        StartGame();
	}
}

function HandleImageError(e) {
    DebugOut('error on image load');
}

function StartGame(){
	for( idx=0; idx<(presets.maxActor); idx++ ){
		var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
		npChars.push(new Civilian("civilian"+idx, tmpPos, screen_height-presets.ground, images['civilian']));
		DebugOut("civ added: "+npChars.length+" of "+presets.maxActor);
		stage.addChild(npChars[npChars.length-1].actor.sprite);	
	}
	
	var tmpStartPos = -(Math.floor(Math.random()*(screen_width/4)));
	var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/4);
	npChars.push(new Military("military", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['military']));
	stage.addChild(npChars[npChars.length-1].actor.sprite);
	
	pChars.push(new Beam("p1_beam"));
	stage.addChild(pChars[pChars.length-1].actor.sprite);
	// Keep tabs on the beam for hte mouse events
	beamIdx = pChars.length-1;
	
	pChars.push(new Ship("p1", images['ship']));
	// Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
	stage.addChild(pChars[pChars.length-1].actor.sprite);
	shipIdx = pChars.length-1;
}

function tick(){
	if( gameStatus != "over" ){
		// Handle the Player Characters
		for( idx in pChars ){
			pChars[idx].Move();
		}
		// Handle the Non-Player Characters
		for( idx in npChars ){
			if( npChars[idx].actor.status == "fire" ){
				if( Math.floor(Math.random()*1000) < presets.freqBullet ){
					var vX = (pChars[shipIdx].actor.sprite.x+(pChars[shipIdx].actor.width/2)) - npChars[idx].actor.GetPos().x;
					var vY = (pChars[shipIdx].actor.sprite.y+(pChars[shipIdx].actor.height/2)) - npChars[idx].actor.GetPos().y;
					var vS = vX/vY;
					
					bulletz.push(new Bullet(npChars[idx].actor.GetPos(), {'x':(-10*vS),'y':(-10)}, npChars[idx].dmgBullet));
					stage.addChild(bulletz[bulletz.length-1].actor.sprite);
					npChars[idx].actor.sprite.gotoAndPlay("fire");
				}
			}
			if( npChars[idx].actor.status != "splat" ){
				// Giving the beam a specialized hittest
				if(pChars[shipIdx].actor.hitRadius(npChars[idx].actor.sprite.x-(pChars[shipIdx].actor.width/2), npChars[idx].actor.sprite.y, pChars[shipIdx].actor.hit)){
					Abduct(idx);
				}else if(pChars[beamIdx].actor.sprite.visible && pChars[beamIdx].hitTest(npChars[idx].actor.GetPos())){
					if(npChars[idx].GetStatus() != "stun"){
						npChars[idx].SetStatus("stun");
					}
					npChars[idx].Levitate(presets.beampwr);
					EnergyUpdate(-presets.drainCiv);
				}
				
				npChars[idx].Move();
			}else{
				Decay(idx);
			}
		}
		// Handle de bulletz
		for( idx in bulletz ){
			bulletz[idx].Move();
			if(bulletz[idx].actor.sprite.y < 0 || bulletz[idx].actor.sprite.x < 0 || bulletz[idx].actor.sprite.x > screen_width){
				Disarm(idx);
			}else if(pChars[shipIdx].actor.hitRadius(bulletz[idx].actor.sprite.x-(pChars[shipIdx].actor.width/2), bulletz[idx].actor.sprite.y, pChars[shipIdx].actor.hit)){
				EnergyUpdate(-bulletz[idx].damage);
				Disarm(idx);
			}
		}
		if( npChars.length < presets.maxActor ){
			Respawn();
		}
		EnergyUpdate(-presets.dmgDrain);
		// Redraw canvas
		stage.update();
	}
}

function EnergyUpdate(pVal){
	tallyMon.energy += pVal;
	if(tallyMon.energy < 1) tallyMon.energy = 0;
	$('#energy span').html(Math.floor(tallyMon.energy)+"%");
	if( tallyMon.energy <= 0 ){
		EndGame();
	}
}

function EndGame(){
	gameStatus = "over";
	DebugOut("Game Over");
	$('#endgame #score span').html(tallyMon.score);
	$('#endgame').show();
}

function Respawn(){
	var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
	npChars.splice(0,0,new Civilian("civilian", tmpPos, screen_height-presets.ground, images['civilian']));
	stage.addChild(npChars[0].actor.sprite);
}

function Abduct(pIdx){
	// Don't accidentally abduct the wrong thing
	if(npChars[pIdx].actor.type == "civilian"){
		stage.removeChild(npChars[pIdx].actor.sprite);
		npChars.splice(pIdx,1);
		tallyMon.abducted++;
		tallyMon.score += presets.abductVal;
		DebugOut(tallyMon.abducted);
		$('#abducted span').html(tallyMon.abducted);
	}
}

function Decay(pIdx){
	// Don't accidentally decay the wrong thing
	if(npChars[pIdx].actor.type == "civilian"){
		npChars[pIdx].actor.decay-=.5;
		if(npChars[pIdx].actor.decay <= 0){
			stage.removeChild(npChars[pIdx].actor.sprite);
			npChars.splice(pIdx,1);
		}
	}
}

function Disarm(pIdx){
	stage.removeChild(bulletz[pIdx].actor.sprite);
	bulletz.splice(pIdx,1);
}


/////////////////////////////////////////////////////////////////////////////
//	Utility Functions
/////////////////////////////////////////////////////////////////////////////

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

// If the browser has a console, write to it.
function DebugOut(newline){
	try{
		if (typeof console == "object"){ 
			console.log(newline);
		}
	}catch(err){
		
	}
	
}

// Open a popup centered on the screen.
function openpopup(url,name,width,height)
{
	// Set up the window attrubutes
	var attributes = "toolbar=0,location=0,height=" + height;
	attributes = attributes + ",width=" + width;
	var leftprop, topprop, screenX, screenY, cursorX, cursorY, padAmt;
	
	// Get the clients screen size
	if(navigator.appName == "Microsoft Internet Explorer") {
		screenY = screen.height;
		screenX = screen.width;
	}else{
		screenY = window.outerHeight;
		screenX = window.outerWidth;
	}
	
	// Set the x/y position relative to the center of the screen
	leftvar = (screenX - width) / 2;
	rightvar = (screenY - height) / 2;
	if(navigator.appName == "Microsoft Internet Explorer") {
		leftprop = leftvar;
		topprop = rightvar;
	}else {
		leftprop = (leftvar - pageXOffset);
		topprop = (rightvar - pageYOffset);
	}
	attributes = attributes + ",left=" + leftprop;
	attributes = attributes + ",top=" + topprop;

	// Open the window
	window.open(url,name,attributes)
}

