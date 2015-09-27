<?php
	$SHARE_DESCRIPTION_SHORT = "Join the Space Anglers tournament and compete for the highest score! a GreenZeta production";
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
	<link href='https://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
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
	<div id="banner_group" style="height: 90px; margin-bottom: 10px;">
	<div id="gzad_container" style="position:absolute; z-index:10000; margin: 0px; width: 100%; height:90px; -webkit-transition: height 0.25s linear 0.25s, -webkit-transform 0.25s linear 0.25s; transition: height 0.25s linear 0.25s, transform 0.25s linear 0.25s;">
	<a id="banner_close" href="#" onclick="GZAD_collapse(); return false;" class="banner_close fa fa-times" style="margin-top:75px; margin-left:90%; display: none; position: absolute; width: auto; height: auto; z-index: 60000; background: #000; border-radius: 50%; border: solid 2px #fff; color: #fff; font-size: 24px; font-weight: bold; text-decoration: none; text-align: center; line-height: 32px;"></a>
	<iframe id="gzad_banner" src="" scrolling="no" border="0" marginwidth="0" style="width:100%; height:100%; /*border:solid 1px #e3343f;*/ margin-bottom:20px; position: absolute; padding:0px; overflow: hidden; -webkit-transition: height 0.25s linear 0.25s, -webkit-transform 0.25s linear 0.25s; transition: height 0.25s linear 0.25s, transform 0.25s linear 0.25s;  -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;" frameborder="0"></iframe>
	</div>
	</div>
	<script type="text/javascript">
		function GZAD_externallink(pURL){
		    //'?utm_source=gzad&utm_medium=app&utm_campaign=gzad_banner'
		    window.open(pURL,'_system');
		}

		function GZAD_expand(){
		    //alert('expand here');
		    //$('#banner_group').addClass('expanded');
		    document.getElementById('gzad_container').style.height = '620px';
		    document.getElementById('banner_close').style.display = "block";
		}

		function GZAD_collapse(){
		    //alert('expand here');
		    document.getElementById('gzad_container').style.height = '90px';
		    document.getElementById('banner_close').style.display = "none";
		}
		//$(document).ready(function(){
			var al = 'https://s3.amazonaws.com/gzads/live.html';
			var ifrm = document.getElementById('gzad_banner');
			var request = new XMLHttpRequest();
			request.open('GET', al, true);

			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
				    // Success!
					ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
					ifrm.document.open();
					ifrm.document.write(request.responseText);
					ifrm.document.close();
					} else {
					// We reached our target server, but it returned an error
					document.getElementById('gzad_banner').src = 'https://s3.amazonaws.com/gzads/backup.html';
					}
			};

			request.onerror = function() {
					// There was a connection error of some sort
					document.getElementById('gzad_banner').src = 'https://s3.amazonaws.com/gzads/backup.html';
			};

			request.send();

		//});
	</script>
	<header>
		<div id="likegroup">
			<div class="fb-like" data-href="<?=$SHARE_LINK?>" data-send="false" data-layout="button_count" data-width="90" data-show-faces="false"></div>
			<g:plusone size="medium" href="<?=$SHARE_LINK?>"></g:plusone>
			<a href="https://twitter.com/share" class="twitter-share-button" data-url="<?=$SHARE_LINK?>" data-text="<?=$SHARE_DESCRIPTION_SHORT?>" data-hashtags="SPACEANGLERS">Tweet</a>
		</div>
		<a href="http://www.greenzeta.com/" target="_blank"><img src="images/logo_header.png"/></a>
	</header>
	<div id="main" role="main">
		<div id="canvasbkg">
			<div id="checklist" class="panel" style="z-index:600;">
				<h1>The following features are not supported in this browser:</h1>
				<ul id="supported">
					<li id="canvas">X&nbsp;&nbsp;HTML5 Canvas</li>
					<li id="sound">X&nbsp;&nbsp;Sound</li>
					<li id="motion">X&nbsp;&nbsp;Motion/Touch Controls<br/>&nbsp;&nbsp;&nbsp;(iPad/iPhone only for now)</li>
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
					<li><a id="btn_about" href="#" onclick="return false;">About</a></li>
				</ul>
			</div>
			<div id="about" class="panel" style="z-index:350;">
				<a id="btn_homeb" href="#" onclick="return false;">Back</a>
				<h1>About</h1>
				<ul>
					<li>SPACE ANGLERS is an experiment in HTML5 Canvas developed with the <a href="http://createjs.com/#!/CreateJS" target="_blank">CreateJS</a> library.</li>
					<li>Created by Internet software developer Matthew Wilber. For more information, visit <a href="http://www.mwilber.com" target="_blank">mwilber.com</a>.</li>
					<li>Ship's warp sound courtesy of <a href="http://www.freesound.org/people/Corsica_S/" target="_blank">Corsica_S</a></li>
				</ul>
			</div>
			<div id="intro" class="panel" style="z-index:300;">
				<div class="flexslider">
				  <ul class="slides">
				    <li>
				      <img src="assets/intro_pg_1.png" width="800" height="450"/>
				    </li>
				    <li>
				      <img id="introcontrols" src="assets/intro_pg_2.png" width="800" height="450"/>
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
				<div id="igscore">Score:<span>0</span></div>
				<div id="abducted"><img src="images/civ.png"/>:<span>0</span></div>
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
<footer>
	<div class="col">
		<!--
			<a style="float:left; width:auto;" href="https://play.google.com/store/apps/details?id=com.greenzeta.greenzeta.jawsconverter" target="_blank"><img src="images/playstore.png" style="height:45px;"/></a>
			<a style="float:left; width:auto;" href="https://chrome.google.com/webstore/detail/lbaefopnbomfajgakfbmoejkinmgcjed" target="_blank"><img src="images/chromestore.png" style="height:45px;"/></a>
		-->
		<h1>About</h1>
		<p>
			SPACE ANGLERS is an experiment in HTML5 Canvas by Internet software developer Matthew Wilber.
			&lt;canvas&gt; animation and sound were developed with the <a href="http://createjs.com/#!/CreateJS" target="_blank">CreateJS</a> libraries.
			For more information, visit <a href="http://www.mwilber.com" target="_blank">mwilber.com</a>.
		</p>
		<p>
			Ship's warp sound courtesy of <a href="http://www.freesound.org/people/Corsica_S/" target="_blank">Corsica_S</a>
		</p>
	</div>
	<a id="gzlink" href="http://www.greenzeta.com" target="_blank">A GreenZeta Production</a>
</footer>
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
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>


<!--[if lt IE 7 ]>
	<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
	<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->

</body>
</html>
