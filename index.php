<!doctype html>
<html lang="en">
<head>
	<?php require_once('./includes/gtmHead.php'); ?>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">

	<!-- Meta information -->
	<title>Farbige Pi Visualisierung - webzeug.net</title>
	<meta name="description" content="Eine farbige Visualisierung der ersten 1000 Stellen von Pi.">
	<meta name="author" content="Klaus Hörmann-Engl<klaus@webzeug.net>">
	
	<!-- Facebook OpenGraph -->
	<meta property="og:title" content="Farbie Visualisierung von Pi - webzeug.net" />
	<meta property="og:image" content="https://piviz.webzeug.net/assets/images/piviz.png" />
	<meta property="og:description" content="Eine farbige Visualisierung der ersten 1000 Stellen der Zahl Pi. Ihr könnt den Feynman Punkt leicht ausmachen: Schaut einfach auf 6 aufeinander folgende braune Punkte." />

	<!-- Header includes -->
	<link rel="stylesheet" href="assets/css/styles.css">
	
</head>
<body>
	<?php require_once('./includes/gtmBody.php'); ?>
	<div id="dots"></div>
	<div id="info">
		<h2>Inspiration:</h2>
		<p>http://www.numberphile.com/videos/pi_visualisation.html</p>
		<h2>Uses:</h2>
		<ul>
			<li><a href="http://jquery.com/" target="_blank">Jquery</a></li>
			<li><a href="http://cosinekitty.com/pi.html" target="_blank">BigMath</a></li>
		</ul>
	</div>
	<script src="external/js/jquery-2.1.1.min.js"></script>
	<script src="external/js/bigmath.js"></script>
	<script src="assets/js/script.js"></script>
</body>
</html>