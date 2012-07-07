/* Author: Matthew Wilber mwilber@gmail.com

*/

var imgMonsterARun = new Image();
var canvas;
var stage;

var actors = new Array();


/////////////////////////////////////////////////////////////////////////////
//	Event Handlers
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	
	//FB.init({appId: FBconfig.app.id, status : true, cookie: true, xfbml : true});
	//SetFrame();
	
	init();
	
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

function init() {

	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(document.getElementById("gamecanvas"));
	
	$.get('json/ship.json', HandleActorJson, "json");
}

function HandleActorJson(response){
	// Define a spritesheet. Note that this data was exported by Zoë.
	var ss = new createjs.SpriteSheet(response.spritesheet);

	var grant = new createjs.BitmapAnimation(ss);
	grant.x = response.init.position.x;
	grant.y = response.init.position.y;

	grant.gotoAndPlay(response.init.startkey);

	// Add Grant to the stage, and add it as a listener to Ticker to get updates each frame.
	stage.addChild(grant);
	createjs.Ticker.setFPS(response.init.fps);
	createjs.Ticker.addListener(stage);
}


/////////////////////////////////////////////////////////////////////////////
//	Utility Functions
/////////////////////////////////////////////////////////////////////////////

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

