/* Author: Matthew Wilber mwilber@gmail.com

*/

var imgMonsterARun = new Image();
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
var beamIdx = -1;
var shipIdx = -1;
var presets = {
	margin: 100,
	g: 0.2,			// Gravity
	beampwr: 2,		// speed beam lifts actors
	ground: 50,		// y distance from bottom actors are spawned
	ceiling: 150,	// min height ship can reach
	lastlevel: 3, 	// # represents array idx
	dmgBullet: 1,
	dmgShell: 10,
	maxActor: 5
};
var tallyMon = {
	"abducted": 0
}


/////////////////////////////////////////////////////////////////////////////
//	Event Handlers
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	
	//FB.init({appId: FBconfig.app.id, status : true, cookie: true, xfbml : true});
	//SetFrame();
	
	screen_width = document.getElementById("gamecanvas").width;
	screen_height = document.getElementById("gamecanvas").height;

	
	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(document.getElementById("gamecanvas"));
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(window);
	
	for( idx=0; idx<presets.maxActor; idx++ ){
		var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
		npChars.push(new Civilian("civilian"+idx, tmpPos, screen_height-presets.ground));
		DebugOut("civ added: "+npChars.length);
		stage.addChild(npChars[npChars.length-1].actor.sprite);	
	}
	
	pChars.push(new Beam("p1_beam"));
	stage.addChild(pChars[pChars.length-1].actor.sprite);
	// Keep tabs on the beam for hte mouse events
	beamIdx = pChars.length-1;
	
	pChars.push(new Ship("p1"));
	// Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
	stage.addChild(pChars[pChars.length-1].actor.sprite);
	shipIdx = pChars.length-1;
	
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

function tick(){
	var npCt = 0;
	// Handle the Player Characters
	for( idx in pChars ){
		pChars[idx].Move();
	}
	// Handle the Non-Player Characters
	for( idx in npChars ){
		
		if( npChars[idx].actor.type == "civilian" ){
			// Giving the beam a specialized hittest
			if(pChars[beamIdx].actor.sprite.visible && pChars[beamIdx].hitTest(npChars[idx].actor.GetPos())){
				if(npChars[idx].GetStatus() != "stun"){
					npChars[idx].SetStatus("stun");
				}
				npChars[idx].Levitate(5);
			}
			if(pChars[shipIdx].actor.hitRadius(npChars[idx].actor.sprite.x-95, npChars[idx].actor.sprite.y, 30)){
				Abduct(idx);	
			}else{
				npCt++;
			}
		}
		npChars[idx].Move();
	}
	if( npCt < presets.maxActor ){
		var tmpPos = Math.floor(Math.random()*(screen_width-(presets.margin*2)))+presets.margin;
		npChars.splice(0,0,new Civilian("civilian", tmpPos, screen_height-presets.ground));
		stage.addChild(npChars[0].actor.sprite);
	}
	// Redraw canvas
	stage.update();
}

function Abduct(pIdx){
	// Don't accidentally abduct the wrong thing
	if(npChars[pIdx].actor.type == "civilian"){
		stage.removeChild(npChars[pIdx].actor.sprite);
		npChars.splice(pIdx,1);
		tallyMon.abducted++;
		DebugOut(tallyMon.abducted);
		$('#abducted span').html(tallyMon.abducted);
	}
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

