<!doctype html>
<html lang="en">
<head>
	<?php require_once('./includes/gtmHead.php'); ?>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
	<title>Farbige Pi Visualisierung - webzeug.net</title>
	<meta name="description" content="Eine farbige Visualisierung der ersten 1000 Stellen von Pi.">
	<meta name="author" content="Klaus Hoermann-Engl<klaus@webzeug.net>">
	<link rel="stylesheet" href="assets/css/styles.css">
	
	<!-- Facebook OpenGraph -->
	<meta property="og:title" content="Visualize Pi - Color dots" />
	<meta property="og:image" content="http://www.diegeneration.net/klaus/img/pivizcolordots.png" />
	<meta property="og:description" content="A visualization of Pi's first 1000 digits to the right. Also you can easily find the Feynman point. What out for 6 consecutive circle in a brownish color." />
	
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