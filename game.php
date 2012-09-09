<?php
	$SHARE_DESCRIPTION = "Join the Space Anglers tournament and compete for the highest score! Grab as many humans as you can before your energy runs out. Space Anglers, a GreenZeta production, is an HTML5 canvas experiment using the CreateJS library.";
	$SHARE_TITLE = "SPACE ANGLERS";
	if(isset($_GET['score'])){
		$SHARE_TITLE = "I scored ".$_GET['score']." on Space Anglers!";
	}
	$SHARE_LINK = "http://spaceanglers.com/";
	$SHARE_IMAGE = "http://spaceanglers.com/images/icon.png";
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->

<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->

<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->

<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title><?php echo $SHARE_TITLE ?></title>

	<meta name="description" content="<?php echo $SHARE_DESCRIPTION ?>">
	<meta name="author" content="Matthew Wilber">
	<meta property="og:title" content="<?php echo $SHARE_TITLE ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?php echo $SHARE_LINK; ?>" />
    <meta property="og:image" content="<?php echo $SHARE_IMAGE; ?>" />
    <meta property="og:site_name" content="<?php echo $SHARE_TITLE ?>"/>
    <meta property="fb:admins" content="631337813" />
    <meta property="og:description" content="<?php echo $SHARE_DESCRIPTION ?>" />

	<meta name="viewport" content="width=900">

	<link href='http://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/jquery.facebook.multifriend.select.css" />
	<link rel='stylesheet' id='camera-css'  href='css/flexslider.css' type='text/css' media='all'>
	
	<script type="text/javascript">
		var social = [];
		social['title'] = "<?=$SHARE_TITLE?>";
		social['description'] = "<?=$SHARE_DESCRIPTION?>";
		social['image'] = "<?=$SHARE_IMAGE?>";
		social['link'] = "<?=$SHARE_LINK?>";
		
		// this sets the namespace for CreateJS to the window object, so you can instantiate objects without specifying 
		// the namespace: "new Graphics()" instead of "new createjs.Graphics()"
		var createjs = window;
	</script>
	
	<script type="text/javascript" src="js/libs/preloadjs-0.2.0.min.js"></script>
	<script type="text/javascript" src="js/libs/easeljs-0.5.0.min.js"></script>
	
	<script src="js/libs/easeljs/utils/UID.js"></script>
	<script src="js/libs/easeljs/geom/Matrix2D.js"></script>
	<script src="js/libs/easeljs/events/MouseEvent.js"></script>
	<script src="js/libs/easeljs/utils/SpriteSheetUtils.js"></script>
	<script src="js/libs/easeljs/display/SpriteSheet.js"></script>
	<script src="js/libs/easeljs/display/Shadow.js"></script>
	<script src="js/libs/easeljs/display/DisplayObject.js"></script>
	<script src="js/libs/easeljs/display/Container.js"></script>
	<script src="js/libs/easeljs/display/Stage.js"></script>
	<script src="js/libs/easeljs/display/Graphics.js"></script>
	<script src="js/libs/easeljs/display/Shape.js"></script>
	<script src="js/libs/easeljs/display/Bitmap.js"></script>
	<script src="js/libs/easeljs/display/BitmapAnimation.js"></script>
	<script src="js/libs/easeljs/display/Text.js"></script>
	<script src="js/libs/easeljs/utils/Ticker.js"></script>
	<script src="js/libs/easeljs/geom/Rectangle.js"></script>
	<script src="js/libs/easeljs/geom/Point.js"></script>
	<script type="text/javascript" src="js/libs/soundjs/SoundJS.js"></script>
	<script type="text/javascript" src="js/libs/soundjs/HTMLAudioPlugin.js"></script>
	<script type="text/javascript" src="js/libs/swfobject.js"></script>
	<script type="text/javascript" src="js/libs/soundjs/FlashPlugin.js"></script>


	<script src="js/libs/modernizr.custom.35563.js"></script>
	
	<script type="text/javascript" src="js/fbconfig.js"></script>
	
</head>
<body>
<div id="container">
<div id="ground">
	<header>
		<a href="http://www.greenzeta.com/" target="_blank"><img src="images/logo_header.png"/></a>
	</header>
	<div id="main" role="main">
		<div id="canvasbkg">
			<div id="checklist" class="panel" style="z-index:600;">
				<h1>The following features are not supported in this browser:</h1>
				<ul id="supported">
					<li id="canvas">X&nbsp;&nbsp;HTML5 Canvas</li>
					<li id="sound">X&nbsp;&nbsp;Sound</li>
					<li id="motion">X&nbsp;&nbsp;Motion/Touch Controls<br/>&nbsp;&nbsp;&nbsp;(iPad/iPhone only)</li>
				</ul>
				<a id="btn_proceed" href="#" onclick="return false;">Continue Anyway</a>
			</div>
			<div id="loading" class="panel" style="z-index:500;">
				<h1>Loading...</h1>
				<h1 id="percent" style="margin-top:0px;"></h1>
			</div>
			<div id="start" class="panel" style="z-index:400;">
				<h1>Main Menu</h1>
				<ul>
					<li><a id="btn_start" href="#" onclick="return false;">Start Game</a></li>
					<li><a id="btn_skip" href="#" onclick="return false;">Skip Instructions</a></li>
					<li><a id="btn_highscore" href="#" onclick="return false;">High Score</a></li>
				</ul>
			</div>
			<div id="intro" class="panel" style="z-index:300;">
				<div class="flexslider">
				  <ul class="slides">
				    <li>
				      <img src="assets/intro_pg_1.png" width="800" height="450"/>
				    </li>
				    <li>
				      <img src="assets/intro_pg_2.png" width="800" height="450"/>
				    </li>
				    <li>
				      <img src="assets/intro_pg_3.png" width="800" height="450"/>
				    </li>
				    <li>
				      <img src="assets/intro_pg_4.png" width="800" height="450"/>
				    </li>
				  </ul>
				</div>
				<a id="btn_intro_start" href="#" onclick="return false;">Start Game</a>
			</div>
			<div id="scorebox" class="panel" style="z-index:200;">
				<a id="btn_home" href="#" onclick="return false;">Back</a>
				<h1>High Score</h1>
				<div id="scores"><ul><li>Loading...</li></ul></div>
			</div>
			<div id="endgame" class="panel" style="z-index:150;">
				<h1>Game Over</h1>			
				<ul style="margin-top:40px;">
					<li id="score">Final Score: <span>0</span></li>
					<li id="grp_savescore"><input type="text" id="scorename" value="Name" onfocus="if($(this).val()=='Name') $(this).val('');" onblur="if($(this).val()=='') $(this).val('Name');"/> <a id="btn_savescore" href="#" onclick="return false;">Save</a></li>
					<li id="grp_savedscore">Saved! <a id="btn_viewhighscore" href="#" onclick="return false;">High Scores</a></li>
					<li style="margin-top:40px;">Share: <a id="facebook" href="#"><img src="assets/share_fb.png"/></a> <a id="tweeters" href="#"><img src="assets/share_tw.png"/></a> <a id="googleplus" href="#"><img src="assets/share_gp.png"/></a></li>
					<li style="margin-top:40px;"><a id="btn_restart" href="#" onclick="return false;">Main Menu ></a></li>
				</ul>
			</div>
			<div id="hud" style="z-index: 110;">
				<div id="abducted">Abducted: <span>0</span></div>
				<div id="energybarframe">
					<div id="energybar"><div id="energy">Energy: <span>100%</span></div></div>
				</div>
			</div>
			<canvas id="gamecanvas" width="800" height="500" style="z-index:100;">
			</canvas>
		</div>
	</div>
	<div id="fb-root"></div>
	<div id="jfmfs-dialog">
		<a href="#" class="button" onclick="$(this).parent().hide(); return false;">Close</a>
		<label>Message:</label><textarea id="jfmfs-message"></textarea>
		<div id="jfmfs-container"></div>
		<button id="jfmfs-post" class="button">POST</button>
	</div>
</div><!--! end of #ground -->
</div> <!--! end of #container -->
<script type="text/javascript" src="http://connect.facebook.net/en_US/all.js"></script>	
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>

<script src="js/libs/jquery.flexslider-min.js"></script>
<script src="js/script.js"></script>
<script src="js/fb.js"></script>

<!-- Load Game Files -->
<script src="js/cActor.js"></script>
<script src="js/cShip.js"></script>
<script src="js/cMonster.js"></script>
<script src="js/cCivilian.js"></script>
<script src="js/cPolice.js"></script>
<script src="js/cCar.js"></script>
<script src="js/cMilitary.js"></script>
<script src="js/cBullet.js"></script>
<script src="js/cBeam.js"></script>
<script src="js/cAnno.js"></script>
<script src="js/cEnergy.js"></script>

<script type="text/javascript" src="js/libs/jquery.facebook.multifriend.select.js"></script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-76054-18']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

<!--[if lt IE 7 ]>
	<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
	<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->

</body>
</html>