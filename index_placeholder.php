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

	<link rel="stylesheet" href="css/style.css">
	<style type="text/css">
		body{
			background-image:url('images/starfield_blue.png');
		}
		header{
			margin:30px auto;
			text-align: center;
		}
		h1{
			font-size:60px;
			color:#fff;
		}
		#main{
			text-align: center;
		}
		#main a{
			font-size:24px;
			text-decoration:none;
			color:#fff;
		}
	</style>

	<script src="js/libs/modernizr-2.0.6.min.js"></script>
	
</head>
<body>
	<header>
		<a href="http://www.greenzeta.com/" target="_blank"><img src="images/logo_header.png"/></a>
	</header>
	<div id="main" role="main">
		<h1 style="font-size:30px;">An HTML5 Canvas video game.</h1>
		<h1 style="margin-top:0px;">Coming October 2012</h1>
		<a href="http://www.greenzeta.com/" target="_blank">www.GreenZeta.com</a>
	</div>
	<div id="fb-root"></div>
	<script type="text/javascript" src="https://connect.facebook.net/en_US/all.js"></script>	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
	
	<script src="js/fb.js"></script>
	
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