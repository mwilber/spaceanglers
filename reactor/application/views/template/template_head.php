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

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="<?= base_url() ?>css/style.css">

	<script src="<?= base_url() ?>js/libs/modernizr-2.0.min.js"></script>
	<script src="<?= base_url() ?>js/libs/respond.min.js"></script>
</head>
<body class="<?=$this->uri->segment(1);?>">
	<div id="header-container">
		<header class="wrapper">
			<img id="title" src="<?= base_url() ?>images/logo.png" alt="Admin" width="110" height="110" />
			<nav>
				<ul>
					<? if( $this->session->userdata('userEmail') ): ?>
						<li><a href="<?= base_url() ?>score" class="score">Scores</a></li>
						<li><a href="<?= base_url() ?>users" class="users">Users</a></li>
						<li><a href="<?= base_url() ?>welcome/logout" class="logout">Log Out</a></li>
					<? else: ?>
						<li><a href="<?= base_url() ?>welcome/login" class="login">Log In</a></li>
					<? endif; ?>
				</ul>
			</nav>
		</header>
	</div>
	<div id="main" class="wrapper">
		<div id="content">