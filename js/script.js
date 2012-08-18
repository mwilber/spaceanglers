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
var npCharsCiv = new Array();
var npCharsPol = new Array();
var npCharsMil = new Array();
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
	maxCiv: 4,
	srCiv:60,
	maxMil: 0,
	srMil: 60,
	maxPol: 0,
	srPol: 30,
	abductVal: 100,
	fps: 24,
	freqBullet: 20,
	drainCiv: 0.05,
	accelerometerSensitivity:10,
	accelerometerYOffset:7
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
	images['police'] = new Image();
	images['police'].onload = HandleImageLoad;
	images['police'].onerror = HandleImageError;
	images['police'].src = "assets/police.png";
	
	screen_width = document.getElementById("gamecanvas").width;
	screen_height = document.getElementById("gamecanvas").height;
	
	mousePos.x = screen_width/2;
	mousePos.y = screen_height/2;

	
	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(document.getElementById("gamecanvas"));
	
	createjs.Ticker.setFPS(presets.fps);
	createjs.Ticker.addListener(window);
	
	//StartGame();
	
	if(Modernizr.touch){
		$('#firebutton').show();
	}else{
		$('#firebutton').hide();
	}

});


if(Modernizr.touch){
	$(window).bind("devicemotion", function(e){
		var movitBaby = e.originalEvent,
			acelera = movitBaby.accelerationIncludingGravity,
			x = acelera.x,
			y = acelera.y,
			z = acelera.z;
			
		
		if( mousePos.x < 0 ){
			mousePos.x = 0;
		}else if( mousePos.x > screen_width ){
			mousePos.x = screen_width;
		}else{
			mousePos.x += Math.floor(x)*presets.accelerometerSensitivity;
		}
		if( mousePos.y < 0 ){
			mousePos.y = 0;
		}else if( mousePos.y > screen_height ){
			mousePos.y = screen_height;
		}else{
			mousePos.y -= Math.floor(y+presets.accelerometerYOffset)*presets.accelerometerSensitivity;
		}
	});
	
	$("#firebutton").bind('touchstart', function(){
		pChars[beamIdx].On();
		return false;
	}).bind('touchend', function(){
		pChars[beamIdx].Off();
		return false;
	});
}else{
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
}

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
    
    DebugOut(numberOfImagesLoaded+" images loaded of "+(GetObjectPropertyCount(images)));
    DebugOut(e);

    if (numberOfImagesLoaded == (GetObjectPropertyCount(images))) {
		numberOfImagesLoaded = 0;
        StartGame();
	}
}

function HandleImageError(e) {
    DebugOut('error on image load');
}

function StartGame(){
	
	DebugOut("-- START GAME --")
	for( idx=0; idx<(presets.maxCiv); idx++ ){
		var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
		npCharsCiv.push(new Civilian("civilian"+idx, tmpPos, screen_height-presets.ground, images['civilian']));
		DebugOut("civ added: "+npCharsCiv.length+" of "+presets.maxCiv+" ("+idx+")");
		stage.addChild(npCharsCiv[npCharsCiv.length-1].actor.sprite);	
	}
	
	
	for( idx=0; idx<(presets.maxMil); idx++ ){
		var tmpStartPos = -(Math.floor(Math.random()*(screen_width/4)));
		var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/4)+(10*idx);
		var tmpStartKey = "walk_h";
		if( Math.random()*10 > 5 ){
			tmpStartPos = screen_width+(-tmpStartPos);
			tmpEndPos = screen_width-tmpEndPos;
			tmpStartKey = "walk";
		}
		npCharsMil.push(new Military("military", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['military'], tmpStartKey));
		stage.addChild(npCharsMil[npCharsMil.length-1].actor.sprite);
	}
	
	for( idx=0; idx<(presets.maxPol); idx++ ){
		var tmpStartPos = -(Math.floor(Math.random()*(screen_width/4)));
		var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/8)+(10*idx);
		var tmpStartKey = "walk_h";
		if( Math.random()*10 > 5 ){
			tmpStartPos = screen_width+(-tmpStartPos);
			tmpEndPos = screen_width-tmpEndPos;
			tmpStartKey = "walk";
		}
		npCharsPol.push(new Police("police", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['police'], tmpStartKey));
		stage.addChild(npCharsPol[npCharsPol.length-1].actor.sprite);
	}
	
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
		
		///////////////////////////
		// Handle the Player Characters
		///////////////////////////
		for( idx in pChars ){
			pChars[idx].Move();
		}
		
		///////////////////////////
		// Handle the Non-Player Characters
		///////////////////////////
		var doBeamReset = true;
		for( idx in npCharsCiv ){
			if( !HandleNPChars(npCharsCiv, idx) ) doBeamReset=false;
		}
		for( idx in npCharsMil ){
			if( !HandleNPChars(npCharsMil, idx) ) doBeamReset=false;
		}
		for( idx in npCharsPol ){
			if( !HandleNPChars(npCharsPol, idx) ) doBeamReset=false;
		}
		if( doBeamReset ){
			pChars[beamIdx].charIdx = -1;
		}
		
		///////////////////////////
		// Handle de bulletz
		///////////////////////////
		for( idx in bulletz ){
			bulletz[idx].Move();
			if(bulletz[idx].actor.sprite.y < 0 || bulletz[idx].actor.sprite.x < 0 || bulletz[idx].actor.sprite.x > screen_width){
				Disarm(idx);
			}else if(pChars[shipIdx].actor.hitRadius(bulletz[idx].actor.sprite.x-(pChars[shipIdx].actor.width/2), bulletz[idx].actor.sprite.y, pChars[shipIdx].actor.hit)){
				EnergyUpdate(-bulletz[idx].damage);
				Disarm(idx);
			}
		}
		
		///////////////////////////
		// Respawn
		///////////////////////////
		if( npCharsCiv.length < presets.maxCiv ){
			Respawn(npCharsCiv, "civ");
		}
		if( npCharsPol.length < presets.maxPol ){
			Respawn(npCharsPol, "pol");
		}
		if( npCharsMil.length < presets.maxMil ){
			Respawn(npCharsMil, "mil");
		}
		EnergyUpdate(-presets.dmgDrain);
		
		///////////////////////////
		// Redraw canvas
		///////////////////////////
		stage.update();
		
		///////////////////////////
		// Add new NPCs
		///////////////////////////
		if( createjs.Ticker.getTicks() % (presets.srCiv*presets.fps) == 0) presets.maxCiv++;
		if( createjs.Ticker.getTicks() == 150 || (createjs.Ticker.getTicks() % (presets.srPol*presets.fps) == 0)) presets.maxPol++;
		if( createjs.Ticker.getTicks() == 500 || (createjs.Ticker.getTicks() % (presets.srMil*presets.fps) == 0)) presets.maxMil++;
	}
}

function HandleNPChars(pArr, pIdx){
	var resetBeam = true;
	if( pArr[pIdx].actor.status == "fire" ){
		if( Math.floor(Math.random()*1000) < presets.freqBullet ){
			var vX = (pChars[shipIdx].actor.sprite.x+(pChars[shipIdx].actor.width/2)) - pArr[pIdx].actor.GetPos().x;
			var vY = (pChars[shipIdx].actor.sprite.y+(pChars[shipIdx].actor.height/2)) - pArr[pIdx].actor.GetPos().y;
			var vS = vX/vY;
			
			bulletz.push(new Bullet(pArr[pIdx].actor.GetPos(), {'x':(-10*vS),'y':(-10)}, pArr[pIdx].dmgBullet));
			stage.addChild(bulletz[bulletz.length-1].actor.sprite);
			if(pArr[pIdx].actor.GetPos().x < pChars[shipIdx].actor.sprite.x){
				pArr[pIdx].actor.sprite.gotoAndPlay("fire_h");	
			}else{
				pArr[pIdx].actor.sprite.gotoAndPlay("fire");	
			}
			//pArr[pIdx].actor.sprite.gotoAndPlay("fire");
			pArr[pIdx].pause = 5;
		}
	}
	if( pArr[pIdx].actor.status != "splat" ){
		// Giving the beam a specialized hittest
		if(pChars[shipIdx].actor.hitRadius(pArr[pIdx].actor.sprite.x, pArr[pIdx].actor.sprite.y, pChars[shipIdx].actor.hit)){
			Abduct(pArr, pIdx);
		}else if(pChars[beamIdx].actor.sprite.visible && pChars[beamIdx].hitTest(pArr[pIdx].actor.GetPos())){
			if( pChars[beamIdx].charIdx < 0 || pChars[beamIdx].charIdx == pIdx ){
				resetBeam = false;
				pChars[beamIdx].charIdx = pIdx;
				if(pArr[pIdx].GetStatus() != "stun"){
					pArr[pIdx].SetStatus("stun");
				}
				pArr[pIdx].Levitate(presets.beampwr);
				EnergyUpdate(-presets.drainCiv);
			}
		}
		
		pArr[pIdx].Move();
	}else{
		Decay(pArr, pIdx);
	}
	return resetBeam;
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

function Respawn(pArr, pType){
	switch(pType){
		case "civ":
			var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
			npCharsCiv.splice(0,0,new Civilian("civilian", tmpPos, screen_height-presets.ground, images['civilian']));
			stage.addChild(npCharsCiv[0].actor.sprite);	
			break;
		case "pol":
			var tmpStartPos = -(Math.floor(Math.random()*(screen_width/4)));
			var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/8)+(10*idx);
			var tmpStartKey = "walk_h";
			if( Math.random()*10 > 5 ){
				tmpStartPos = screen_width+(-tmpStartPos);
				tmpEndPos = screen_width-tmpEndPos;
				tmpStartKey = "walk";
			}
			npCharsPol.splice(0,0,new Police("police", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['police'], tmpStartKey));
			stage.addChild(npCharsPol[0].actor.sprite);
			break;
		case "mil":
			var tmpStartPos = -(Math.floor(Math.random()*(screen_width/4)));
			var tmpEndPos = Math.floor(Math.random()*(screen_width/4))+(screen_width/4)+(10*idx);
			var tmpStartKey = "walk_h";
			if( Math.random()*10 > 5 ){
				tmpStartPos = screen_width+(-tmpStartPos);
				tmpEndPos = screen_width-tmpEndPos;
				tmpStartKey = "walk";
			}
			npCharsMil.splice(0,0,new Military("military", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['military'], tmpStartKey));
			stage.addChild(npCharsMil[0].actor.sprite);
			break;
	}
}

function Abduct(pArr, pIdx){
	// Don't accidentally abduct the wrong thing
	if(pArr[pIdx].actor.type == "civilian"){
		//stage.removeChild(pArr[pIdx].actor.sprite);
		//pArr.splice(pIdx,1);
		pArr[pIdx].actor.status = "splat";
		pArr[pIdx].actor.sprite.x = -100;
		pArr[pIdx].actor.sprite.y = -100;
		tallyMon.abducted++;
		tallyMon.score += presets.abductVal;
		DebugOut(tallyMon.abducted);
		$('#abducted span').html(tallyMon.abducted);
	}
}

function Decay(pArr, pIdx){
	// Don't accidentally decay the wrong thing
	//if(npChars[pIdx].actor.type == "civilian"){
		pArr[pIdx].actor.decay-=.5;
		if(pArr[pIdx].actor.decay <= 0){
			stage.removeChild(pArr[pIdx].actor.sprite);
			pArr.splice(pIdx,1);
		}
	//}
}

function Disarm(pIdx){
	stage.removeChild(bulletz[pIdx].actor.sprite);
	bulletz.splice(pIdx,1);
}


/////////////////////////////////////////////////////////////////////////////
//	Utility Functions
/////////////////////////////////////////////////////////////////////////////

function GetObjectPropertyCount(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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

