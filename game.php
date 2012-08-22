<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->

<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->

<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->

<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Facebook App Starter Kit</title>
	<meta name="description" content="FASK provides a ready made starting point for building facebook apps using the facebook javascript api.">
	<meta name="author" content="Matthew Wilber">
	<meta property="og:title" content="Facebook App Starter Kit" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://apps.facebook.com/appstarterkit/" />
	<meta property="og:image" content="https://fask.herokuapp.com/images/fask.png" />
	<meta property="og:site_name" content="https://fask.herokuapp.com/" />
	<meta property="fb:admins" content="631337813" />
	<meta property="og:description" content="FASK provides a ready made starting point for building facebook apps using the facebook javascript api." />

	<meta name="viewport" content="width=950">

	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/jquery.facebook.multifriend.select.css" />
	
	<script>
		// this sets the namespace for CreateJS to the window object, so you can instantiate objects without specifying 
		// the namespace: "new Graphics()" instead of "new createjs.Graphics()"
		var createjs = window;
	</script>
	
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


	<script src="js/libs/modernizr-2.0.6.min.js"></script>
	
	<script type="text/javascript" src="js/fbconfig.js"></script>
	
</head>
<body>
<div id="container">
	<header>
		<h2>InsertTitleHere</h2>
	</header>
	<div id="scoreboard">
		<div id="abducted">Abducted: <span>0</span></div>
		<div id="energy">Energy: <span>100%</span></div>
	</div>
	<div id="main" role="main">
		<div id="canvasbkg">
			<canvas id="gamecanvas" width="800" height="500"></canvas>
		</div>
		<div id="firebutton"></div>
	</div>
	<div id="fb-root"></div>
	<div id="jfmfs-dialog">
		<a href="#" class="button" onclick="$(this).parent().hide(); return false;">Close</a>
		<label>Message:</label><textarea id="jfmfs-message"></textarea>
		<div id="jfmfs-container"></div>
		<button id="jfmfs-post" class="button">POST</button>
	</div>
</div> <!--! end of #container -->
<div id="endgame" class="dialog">
	<h2>Game Over</h2>
	<div id="score">Final Score: <span>0</span></div>
</div>
<script type="text/javascript" src="http://connect.facebook.net/en_US/all.js"></script>	
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>

<script src="js/script.js"></script>
<script src="js/fb.js"></script>

<!-- Load Game Files -->
<script src="js/cActor.js"></script>
<script src="js/cShip.js"></script>
<script src="js/cMonster.js"></script>
<script src="js/cCivilian.js"></script>
<script src="js/cPolice.js"></script>
<script src="js/cMilitary.js"></script>
<script src="js/cBullet.js"></script>
<script src="js/cBeam.js"></script>

<script type="text/javascript" src="js/libs/jquery.facebook.multifriend.select.js"></script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-76054-11']);
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