<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Admin</title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta property="og:title" content="" />
    <meta property="og:type" content="" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="" />
    <meta property="og:site_name" content=""/>
    <meta property="og:description" content="" />

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="<?= base_url() ?>css/style.css">

	<script src="<?= base_url() ?>js/libs/modernizr-2.0.min.js"></script>
	<script src="<?= base_url() ?>js/libs/respond.min.js"></script>
	<script src="http://connect.facebook.net/en_US/all.js"></script>
	<script type="text/javascript">
		var facebookappid = '152845701437825';
	</script>
</head>
<body class="fbtab">
	<div id="page">
		<!-- Begin App Content -->
		Total Cards: <?=$cardcount?>
		<br/>
		<br/>
		<a href="#" onclick="SendPost('http://code.google.com/p/facebook-app-starter/', 'Facebook App Starter Kit', 'Everything you need to get started with a facebook iframe app', 'http://code.google.com/p/facebook-app-starter/logo?cct=0', null, 'Custom message.'); return false;">Send Post</a>
		<br/>
		<br/>
		<a href="#" onclick="RequestPost('http://code.google.com/p/facebook-app-starter/', 'Facebook App Starter Kit', 'Everything you need to get started with a facebook iframe app', 'http://code.google.com/p/facebook-app-starter/logo?cct=0', null, 'Custom message.'); return false;">Request Post</a>
		<div id="fb-root"></div>
	</div>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/libs/jquery-1.6.2.min.js"><\/script>')</script>
	
	<script src="<?= base_url() ?>/js/tab.js"></script>
</body>
</html>
