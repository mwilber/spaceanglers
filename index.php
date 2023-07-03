<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title></title>
	<meta name="description" content="">
	<meta name="author" content="">

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="css/style.css">

	<script src="js/libs/modernizr-2.0.6.min.js"></script>
	<script src="js/libs/paper.js"></script>
	<script src="js/libs/Stats.js"></script>
	<script type="text/javascript">
	
		var actref;
		var scoretot = 0;
		var touchCt = 1;
		var rastergfx = true;
		
		var scorevals = {
			Civ:{
				Abduct:10,
				Splatter:-10,
				Piledriver:-50,
			},
			Mil:{
				Abduct:0,
				Splatter:10,
				Piledriver:50,
			},
			Art:{
				Abduct:0,
				Splatter:20,
				Piledriver:0,
			},
		};
		
		function startGame(pTitle){
			$('#levelbanner').html(pTitle);
			announceLevel();
		}
		
		function announceScore(pTitle, pTrackr){
			$('#levelbanner').html(pTitle);
			//$('#scorebox').html(pTrackr.Civ.Abduct);
			console.log(pTrackr);
			
			var scr_abduct = pTrackr.Civ.Abduct*scorevals.Civ.Abduct;
			var scr_splatter = (pTrackr.Mil.Splatter*scorevals.Mil.Splatter)+(pTrackr.Art.Splatter*scorevals.Art.Splatter);
			var scr_piledriver = (pTrackr.Civ.Piledriver*-scorevals.Civ.Piledriver)+(pTrackr.Mil.Piledriver*scorevals.Mil.Piledriver);
			var scr_deadciv = (pTrackr.Civ.Splatter*scorevals.Civ.Splatter)+(pTrackr.Civ.Piledriver*scorevals.Civ.Piledriver);
			var scr_total = scr_abduct+scr_splatter+scr_piledriver+scr_deadciv;
			
			$('#scr_abduct').html(scr_abduct);
			$('#scr_splatter').html(scr_splatter);
			$('#scr_piledriver').html(scr_piledriver);
			$('#scr_deadciv').html(scr_deadciv);
			$('#scr_title').html(scr_total);
			$('#scorebox').show();
			
			scoretot += scr_total;
			//setTimeout('announceLevel("'+pTitle+'")',4000);
		}
		
		function announceLevel(){
			$('#score').html(scoretot);
			$('#scorebox').hide();
			$('#levelbanner').show();
			setTimeout('startLevel()',3000);
		}
		
		function startLevel(){
			$('#levelbanner').hide();
			actref.init();
		}
		
		function defenselessBonus(){
			$('#defenseless').fadeIn('fast', function() {
				$('#defenseless').delay(1000).fadeOut();
			});
		}
		
		if(Modernizr.touch){
			touchCt = 2;
		}
		
	</script>
	
</head>
<body>
	<div id="score">0</div>
	<div id="level">Level <span id="levelnum">1</span></div>
	<div id="debug"></div>
	<canvas style="position:absolute" id="canvas" resize></canvas>
	<div id="assets">
		<img id="ship_001" src="images/ship_001.png"/>
		<img id="ship_002" src="images/ship_002.png"/>
		<img id="ship_003" src="images/ship_003.png"/>
		<img id="ship_004" src="images/ship_004.png"/>
		<img id="ship_005" src="images/ship_005.png"/>
		<img id="ship_006" src="images/ship_006.png"/>
		<img id="civ_001" src="images/civ_001.png"/>
		<img id="civ_002" src="images/civ_002.png"/>
		<img id="civ_003" src="images/civ_003.png"/>
		<img id="civ_004" src="images/civ_004.png"/>
		<img id="civ_005" src="images/civ_005.png"/>
		<img id="civ_levitate" src="images/civ_levitate.png"/>
		<img id="civ_fall" src="images/civ_fall.png"/>
		<img id="civ_dead" src="images/civ_dead.png"/>
		<img id="art_001" src="images/art_001.png"/>
		<img id="art_dead" src="images/art_dead.png"/>
		<img id="mil_001" src="images/mil_001.png"/>
		<img id="mil_dead" src="images/mil_dead.png"/>
	</div>
	<div id="levelbanner" class="gameover"></div>
	<div id="scorebox" class="gameover">
		<h1>Score</h1>
		<div class="scoreline">Abductions <span id="scr_abduct"></span></div>
		<div class="scoreline">Splatter Bonus <span id="scr_splatter"></span></div>
		<div class="scoreline">Pile Driver Bonus <span id="scr_piledriver"></span></div>
		<div class="scoreline">Dead Civilians <span id="scr_deadciv"></span></div>
		<div class="scoretotal"> <span id="scr_title"></span></div>
		<a id="btn_continue" href="#" onclick="announceLevel(); return false;">Continue</a>
	</div>
	<div id="defenseless" class="gameover">DEFENSELESS!</div>
	<div id="loser" class="gameover">Game Over.  <a href="index.php">Play again</a>?</div>
	<div id="winner" class="gameover">You Win.  <a href="index.php">Play again</a>?</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>

<script type="text/paperscript" src="js/script.js" canvas="canvas"></script>
<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']]; // Change UA-XXXXX-X to be your site's ID
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
	g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

<!--[if lt IE 7 ]>
	<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
	<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->

</body>
</html>
