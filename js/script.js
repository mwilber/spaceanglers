/* Author: Matthew Wilber mwilber@gmail.com

*/

var images = new Array();
var numberOfImagesLoaded = 0;
var startTick;

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
var multiplierTraq = 0;
var presets = {
	margin: 100,
	g: 0.2,			// Gravity
	beampwr: 5,		// speed beam lifts actors
	ground: 70,		// y distance from bottom actors are spawned
	ceiling: 100,	// min height ship can reach
	lastlevel: 3, 	// # represents array idx
	dmgDrain: 0.005,
	dmgShell: 10,
	maxCiv: 4,
	srCiv:60,
	maxMil: 0,
	srMil: 60,
	maxPol: 0,
	srPol: 30,
	abductVal: 100,
	fps: 24,
	freqBullet: 15,
	drainCiv: 0.05,
	accelerometerSensitivity:10,
	accelerometerYOffset:7,
	nrgGainCar:50,
	splatV:16,
};
var tallyMon = {
	"abducted": 0,
	"energy": 100,
	"score": 0
}
var gameStatus = "start";
var skipChecklist = true;
var upsideDown = false;
var endTimer = 0;

var manifest = [
		{id:"begin", src:"assets/Game-Spawn.mp3|assets/Game-Spawn.ogg"},
		{id:"break", src:"assets/Game-Break.mp3|assets/Game-Break.ogg", data:6},
		{id:"death", src:"assets/Game-Death.mp3|assets/Game-Death.ogg"},
		{id:"laser", src:"assets/Game-Shot.mp3|assets/Game-Shot.ogg", data:6},
		
		{id:"beam_loop", src:"assets/snd_beam_loop.mp3|assets/snd_beam_loop.wav|assets/snd_beam_loop.ogg"},
		{id:"beam_start", src:"assets/snd_beam_start.mp3|assets/snd_beam_start.wav|assets/snd_beam_start.ogg"},
		{id:"pistol", src:"assets/snd_pistol.mp3|assets/snd_pistol.wav|assets/snd_pistol.ogg"},
		{id:"police_siren", src:"assets/snd_police_siren.mp3|assets/snd_police_siren.wav|assets/snd_police_siren.ogg"},
		{id:"rocket", src:"assets/snd_rocket.mp3|assets/snd_rocket.wav|assets/snd_rocket.ogg"},
		{id:"splat", src:"assets/snd_splat.mp3|assets/snd_splat.wav|assets/snd_splat.ogg"},
		{id:"car_splat", src:"assets/snd_car_splat.mp3|assets/snd_car_splat.wav|assets/snd_car_splat.ogg"},
		{id:"scream", src:"assets/snd_scream.mp3|assets/snd_scream.wav|assets/snd_scream.ogg"},
		{id:"energy", src:"assets/snd_energy.mp3|assets/snd_energy.wav|assets/snd_energy.ogg"},
		{id:"hit", src:"assets/snd_hit.mp3|assets/snd_hit.wav|assets/snd_hit.ogg"},
		{id:"coin", src:"assets/snd_coin.mp3|assets/snd_coin.wav|assets/snd_coin.ogg"},
		{id:"energy_plop", src:"assets/snd_energy_plop.mp3|assets/snd_energy_plop.wav|assets/snd_energy_plop.ogg"},
		{id:"abduct", src:"assets/snd_abduct.mp3|assets/snd_abduct.wav|assets/snd_abduct.ogg"},
		{id:"music_intro", src:"assets/snd_music_intro.mp3|assets/snd_music_intro.wav|assets/snd_music_intro.ogg"},
		{id:"warp_in", src:"assets/snd_warp_in.mp3|assets/snd_warp_in.wav|assets/snd_warp_in.ogg"},
		{id:"warp_out", src:"assets/snd_warp_out.mp3|assets/snd_warp_out.wav|assets/snd_warp_out.ogg"},
		
		{id:"ship", src:"assets/ship.png"},
		{id:"civilian", src:"assets/civilian.png"},
		{id:"military", src:"assets/military.png"},
		{id:"police", src:"assets/police.png"},
		{id:"car", src:"assets/car.png"},
		{id:"energy", src:"assets/energy.png"},
		{id:"starfield_blue", src:"images/starfield_blue.png"},
		{id:"ground", src:"assets/ground.png"},
		{id:"starfield", src:"assets/sky.png"},
		{id:"intro_page_1", src:"assets/intro_pg_1.png"},
		{id:"intro_page_2", src:"assets/intro_pg_2.png"},
		{id:"intro_page_3", src:"assets/intro_pg_3.png"},
		{id:"intro_page_4", src:"assets/intro_pg_4.png"},
		{id:"panel_bkg", src:"assets/panel_bkg.jpg"},
		{id:"panel_bkg_blank", src:"assets/panel_bkg_blank.jpg"},
		{id:"share_fb", src:"assets/share_fb.png"},
		{id:"share_tw", src:"assets/share_tw.png"},
		{id:"share_gp", src:"assets/share_gp.png"},
	];

/////////////////////////////////////////////////////////////////////////////
//	Event Handlers
/////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	
	createjs.FlashPlugin.BASE_PATH = "js/libs/soundjs/" // Initialize the base path from this document to the Flash Plugin
	if (!createjs.SoundJS.checkPlugin(true)) {
		//alert('No Sound Support');
		//document.getElementById("main").style.display = "none";
		//return;
		skipChecklist = false;
		$('#checklist #supported #sound').show();
	}
	
	if (!Modernizr.canvas) {
		skipChecklist = false;
		$('#checklist #supported #canvas').show();
	}
	
	if (Modernizr.touch && !Modernizr.devicemotion) {
		skipChecklist = false;
		$('#checklist #supported #motion').show();
	}
	
	if( skipChecklist ){
		_gaq.push(['_trackEvent', 'No Limitations', 'trigger', '']);
		PagePreInit();
	}else{
		_gaq.push(['_trackEvent', 'Show Limitations', 'trigger', '']);
		$('#checklist').show();
	}

});

function PagePreInit(){
	// begin loading content (only sounds to load)
	preload = new createjs.PreloadJS();
	preload.onComplete = DoneLoading;
	preload.onProgress = HandleLoadProgress;
	preload.installPlugin(createjs.SoundJS);
	preload.loadManifest(manifest);
}


if(Modernizr.touch){
	
	$('#introcontrols').attr('src','assets/intro_pg_2b.png');
	
	$(window).bind("devicemotion", function(e){
		if(gameStatus != "over"){
		var movitBaby = e.originalEvent,
			acelera = movitBaby.accelerationIncludingGravity,
			x = acelera.x,
			y = acelera.y,
			z = acelera.z;
			
			if( y > 0 ){
				y=-y;
				x=-x;
			}
			
		if( !upsideDown && Math.abs(x) > 8 ){
			upsideDown = true;
			alert('hold the device upright in portrait orientation.');
		}else if( upsideDown && Math.abs(x) <= 8 ){
			upsideDown = false;
		}
		if( !upsideDown ){
			
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
		}
		}
	});
	
	$("#gamecanvas").bind('touchstart', function(){
		if(gameStatus != "over"){
		pChars[beamIdx].On();
		}
		return false;
	}).bind('touchend', function(){
		pChars[beamIdx].Off();
		return false;
	});
}else{
	$('#gamecanvas').mousemove(function(e) {
		if(gameStatus != "over"){
	    var pos = findPos(this);
	    mousePos.x = e.pageX - pos.x;
	    mousePos.y = e.pageY - pos.y;
	    //var coordinateDisplay = "x=" + x + ", y=" + y;
	    //writeCoordinateDisplay(coordinateDisplay);
	   }
	});
	
	$('#gamecanvas').mousedown(function(e) {
		if(gameStatus != "over"){
	    pChars[beamIdx].On();
	   }
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

$('#btn_proceed').click(function(){
	_gaq.push(['_trackEvent', 'Continue w Limitations', 'clicked', '']);
	$('#checklist').hide();
	PagePreInit();
});

$('#btn_skip').click(function(){
	_gaq.push(['_trackEvent', 'Skip Instructions', 'clicked', '']);
	$('.panel').hide();
	InitGame();
});

$('#btn_start').click(function(){
	_gaq.push(['_trackEvent', 'Instructions', 'clicked', '']);
	$('.panel').hide();
	$('#intro').show();
});

$('#btn_about').click(function(){
	_gaq.push(['_trackEvent', 'About', 'clicked', '']);
	$('.panel').hide();
	$('#about').show();
});

$('#btn_homeb').click(function(){
	_gaq.push(['_trackEvent', 'Home B', 'clicked', '']);
	$('#start').show();
});

$('#btn_intro_start').click(function(){
	_gaq.push(['_trackEvent', 'Start', 'clicked', '']);
	$('.panel').hide();
	InitGame();
});

$('#btn_highscore').click(function(){
	_gaq.push(['_trackEvent', 'Show High Score', 'clicked', '']);
	$('.panel').hide();
	$('#scorebox').show();
	$('#scorebox #scores').load('reactor/score/topten');
});

$('#btn_viewhighscore').click(function(){
	_gaq.push(['_trackEvent', 'Post-Game High Score', 'clicked', '']);
	PageInit();
	$('.panel').hide();
	$('#scorebox').show();
	$('#scorebox #scores').load('reactor/score/topten');
});

$('#btn_home').click(function(){
	$('#start').show();
});

$('#btn_restart').click(function(){
	_gaq.push(['_trackEvent', 'Restart', 'clicked', '']);
	$('#start').show();
	PageInit();
});

$('#btn_savescore').click(function(){
	_gaq.push(['_trackEvent', 'Save High Score', 'clicked', '\''+tallyMon.score+'\'']);
	//tallyMon.score\
	DebugOut(tallyMon);
	DebugOut(tallyMon.score);
	var scorename = $('#scorename').val();
	if(scorename == "Name"){
		alert('Enter your name');
	}else{
		$('#btn_savescore').hide();
		$.post("reactor/score/add", { scoreName: scorename, scoreNumber: tallyMon.score }, function(data){
			//alert("Score Posted!");
			$('#grp_savescore').hide();
			$('#grp_savedscore').show();
			$('#btn_savescore').show();
		} );
	}
});

$('#facebook').click(function(){
	_gaq.push(['_trackEvent', 'Facebook Share', 'clicked', '\''+tallyMon.score+'\'']);
	WallPost(social['link'] , "I scored "+tallyMon.score+" on Space Anglers!", social['description'] , social['image'] , '');
	return false;
});

$('#tweeters').click(function(){
	_gaq.push(['_trackEvent', 'Tweeter Share', 'clicked', '\''+tallyMon.score+'\'']);
	var twcontent = "I scored "+tallyMon.score+" on Space Anglers! An HTML5 canvas game by GreenZeta "+social['link'];
	openpopup('http://twitter.com/home?status='+escape(twcontent),'tweeters',550,450);
	return false;
});

$('#googleplus').click(function(){
	_gaq.push(['_trackEvent', 'GPlus Share', 'clicked', '\''+tallyMon.score+'\'']);
	var url = "https://plus.google.com/share?url="+escape(social['link']+"?score="+tallyMon.score);
	openpopup(url,'gplus',550,450);
	return false;
});
	

/////////////////////////////////////////////////////////////////////////////
//	Game Functions
/////////////////////////////////////////////////////////////////////////////

function PageInit(){
	
	createjs.SoundJS.stop();
	createjs.SoundJS.play("music_intro", createjs.SoundJS.INTERRUPT_ANY, 0, 0, -1, 0.4);
	
	images = new Array();
	numberOfImagesLoaded = 0;
	startTick = createjs.Ticker.getTicks();

	pChars = new Array();
	npCharsCiv = new Array();
	npCharsPol = new Array();
	npCharsMil = new Array();
	bulletz = new Array();
	beamIdx = -1;
	shipIdx = -1;
	multiplierTraq = 0;
	presets.maxCiv = 4;
	presets.maxMil = 0;
	presets.maxPol = 0;
	
	tallyMon.abducted = 0;
	tallyMon.energy = 100;
	tallyMon.score = 0;
	$('#abducted span').html(tallyMon.abducted);
	$('#igscore span').html(tallyMon.score);

	gameStatus = "start";
	endTimer = 0;
	
	$('#grp_savescore').show();
	$('#grp_savedscore').hide();
	
	FB.init({appId: FBconfig.app.id, status : true, cookie: true, xfbml : true});
	SetFrame();
	//$('header').hide();
	
	$('.flexslider').flexslider({
      	animation: "slide",
      	slideshow: false, 
      	controlNav: true,
      	itemMargin: 0,
      	animationLoop: true,
      	directionNav: !Modernizr.touch,
      	start: function(slider) {
      	},
      	after: function(slider) {
      	}
    });
	
	images['ship'] = new Image();
	//images['ship'].onload = HandleImageLoad;
	//images['ship'].onerror = HandleImageError;
	images['ship'].src = "assets/ship.png";
	images['civilian'] = new Image();
	//images['civilian'].onload = HandleImageLoad;
	//images['civilian'].onerror = HandleImageError;
	images['civilian'].src = "assets/civilian.png";
	images['military'] = new Image();
	//images['military'].onload = HandleImageLoad;
	//images['military'].onerror = HandleImageError;
	images['military'].src = "assets/military.png";
	images['police'] = new Image();
	//images['police'].onload = HandleImageLoad;
	//images['police'].onerror = HandleImageError;
	images['police'].src = "assets/police.png";
	images['car'] = new Image();
	//images['car'].onload = HandleImageLoad;
	//images['car'].onerror = HandleImageError;
	images['car'].src = "assets/car.png";
	images['energy'] = new Image();
	//images['energy'].onload = HandleImageLoad;
	//images['energy'].onerror = HandleImageError;
	images['energy'].src = "assets/energy.png";
	
	screen_width = document.getElementById("gamecanvas").width;
	screen_height = document.getElementById("gamecanvas").height;
	
	if(Modernizr.touch){
		$('#firebuttonn').show();
	}else{
		$('#firebuttonn').hide();
	}
	
	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(document.getElementById("gamecanvas"));
}

function DoneLoading(event) {
	
	// start the music
	createjs.SoundJS.play("begin", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.4);
	//SoundInstance play ( value , interrupt 					, delay , offset , loop , volume , pan )
	
	$('#loading').hide();
	//$('.panel').hide();
	//$('#endgame').show();
	PageInit();
}

function HandleLoadProgress(event){
	$('#loading #percent').html(Math.floor(preload.progress*100)+"%");
}

function HandleImageLoad(e) {
    numberOfImagesLoaded++;
    
    DebugOut(numberOfImagesLoaded+" images loaded offff "+(GetObjectPropertyCount(images)));
    DebugOut(e);

    if (numberOfImagesLoaded == (GetObjectPropertyCount(images))) {
		numberOfImagesLoaded = 0;
		$('#loading').hide();
	}
}

function HandleImageError(e) {
    DebugOut('error on image load');
}

function InitGame(){
	
	createjs.SoundJS.stop();
	
	stage.clear();
	
	mousePos.x = screen_width/2;
	mousePos.y = screen_height/2;
	
	createjs.Ticker.setFPS(presets.fps);
	createjs.Ticker.addListener(window);
	
	$('#energybar').removeClass('white');
	
	StartGame();
}

function StartGame(){
	
	DebugOut("-- START GAME --");
	
	createjs.SoundJS.play("coin", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.4);
	
	// Mark the first frame
	startTick = createjs.Ticker.getTicks();
	
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
	createjs.SoundJS.play("warp_in", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
}

function tick(){
	if( gameStatus != "over" || (endTimer > 0 && createjs.Ticker.getTicks() < (endTimer+60)) ){
		//if( gameStatus != "over" ){
			///////////////////////////
			// Handle the Player Characters
			///////////////////////////
			
			for( idx in pChars ){
				pChars[idx].Move();
				if( pChars[idx].actor.type == "anno" ) Decay(pChars, idx);
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
				}else if(pChars[shipIdx].actor.hitRadius(bulletz[idx].actor.sprite.x, bulletz[idx].actor.sprite.y, pChars[shipIdx].actor.hit)){
					EnergyUpdate(-bulletz[idx].damage);
					createjs.SoundJS.play("hit", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.4);
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
			// Add new NPCs
			///////////////////////////
			if( createjs.Ticker.getTicks() % (presets.srCiv*presets.fps) == 0) presets.maxCiv++;
			if( createjs.Ticker.getTicks() == (startTick+10) || (createjs.Ticker.getTicks() % (presets.srPol*presets.fps) == 0)) presets.maxPol++;
			if( createjs.Ticker.getTicks() == (startTick+400) || (createjs.Ticker.getTicks() % (presets.srMil*presets.fps) == 0)) presets.maxMil++;
		
			///////////////////////////
			// Update the energy bar
			///////////////////////////
			$('#energybar').css('width',(tallyMon.energy*3)+"px");
			if( tallyMon.energy < 25 ){
				if( createjs.Ticker.getTicks() % (presets.fps/2) == 0) $('#energybar').toggleClass('white');
			}else if(tallyMon.energy > 25 ){
				$('#energybar').removeClass('white');
			}
		
		//}
	}else if(endTimer == 0){
		endTimer = createjs.Ticker.getTicks();
	}else if(endTimer > 0){
		endTimer = -1;
		EndGame();
	}
	///////////////////////////
	// Redraw canvas
	///////////////////////////
	stage.update();
}

function HandleNPChars(pArr, pIdx){
	var resetBeam = true;
	if( pArr[pIdx].actor.status == "fire" ){
		if( Math.floor(Math.random()*1000) < presets.freqBullet ){
			var vX = (pChars[shipIdx].actor.sprite.x) - pArr[pIdx].actor.GetPos().x;
			var vY = (pChars[shipIdx].actor.sprite.y) - pArr[pIdx].actor.GetPos().y;
			var vS = vX/vY;
			
			bulletz.push(new Bullet(pArr[pIdx].actor.GetPos(), {'x':(-10*vS),'y':(-10)}, pArr[pIdx].dmgBullet));
			stage.addChild(bulletz[bulletz.length-1].actor.sprite);
			
			if( pArr[pIdx].actor.type == "police" ){
				createjs.SoundJS.play("pistol", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.2);
			}else if( pArr[pIdx].actor.type == "military" ){
				createjs.SoundJS.play("rocket", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.2);
			}
			
			
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
				if(pArr[pIdx].actor.type != "civilian"){
					multiplierTraq=0;
				}
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
	
	if(  pArr[pIdx].actor.type == "energy" ){
		Decay(pArr, pIdx);
	}
	
	return resetBeam;
}

function EnergyUpdate(pVal){
	tallyMon.energy += pVal;
	if(tallyMon.energy < 1) tallyMon.energy = 0;
	if(tallyMon.energy > 100) tallyMon.energy = 100;
	$('#energy span').html(Math.floor(tallyMon.energy)+"%");
	if( tallyMon.energy <= 0 && endTimer == 0 ){
		WarpOut();
	}
	if( tallyMon.energy <= 25 && ((tallyMon.energy - pVal) > 25) ){
		pChars[shipIdx].actor.sprite.gotoAndPlay("lownrg");
	}else if( tallyMon.energy >= 25 && ((tallyMon.energy - pVal) < 25) ){
		pChars[shipIdx].actor.sprite.gotoAndPlay("spin");
	}
}

function WarpOut(){
	
	pChars[beamIdx].Off();
	gameStatus = "over";
	createjs.SoundJS.play("warp_out", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
	pChars[shipIdx].actor.sprite.gotoAndPlay("warp");
}

function EndGame(){
	_gaq.push(['_trackEvent', 'End Game', 'trigger', '\''+tallyMon.score+'\'']);
	createjs.SoundJS.play("music_intro", createjs.SoundJS.INTERRUPT_ANY, 0, 0, -1, 0.2);
	DebugOut("Game Over");
	$('#endgame #score span').html(tallyMon.score);
	$('#btn_savescore').show();
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
			//npCharsPol.splice(0,0,new Police("police", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['police'], tmpStartKey));
			//stage.addChild(npCharsPol[0].actor.sprite);
			npCharsPol.splice(0,0,new Car("car", tmpStartPos, screen_height-presets.ground, tmpEndPos, images['car'], tmpStartKey));
			stage.addChild(npCharsPol[0].actor.sprite);
			
			createjs.SoundJS.play("police_siren", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.2);
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
	if(pArr[pIdx].actor.type == "civilian" || pArr[pIdx].actor.type == "energy"){
		//stage.removeChild(pArr[pIdx].actor.sprite);
		//pArr.splice(pIdx,1);
		pArr[pIdx].actor.status = "splat";
		pArr[pIdx].actor.sprite.x = -100;
		pArr[pIdx].actor.sprite.y = -100;
		
		if(pArr[pIdx].actor.type == "civilian"){
			tallyMon.abducted++;
			multiplierTraq++;
			tallyMon.score += (presets.abductVal*multiplierTraq);
			DebugOut(tallyMon.abducted);
			$('#abducted span').html(tallyMon.abducted);
			$('#igscore span').html(tallyMon.score);
			var aVol = (multiplierTraq/10);
			if(aVol > 1) aVol = 1;
			createjs.SoundJS.play("abduct", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, aVol);
			if(multiplierTraq > 1){
				pChars.push(new Anno(multiplierTraq));
				stage.addChild(pChars[pChars.length-1].actor.sprite);
			}
		}
		if(pArr[pIdx].actor.type == "energy"){
			EnergyUpdate(presets.nrgGainCar);
			createjs.SoundJS.play("coin", createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 0.4);
		}
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

