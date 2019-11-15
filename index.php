<?php
require __DIR__ . '/vendor/autoload.php';

$i18n = new i18n('lang/lang_{LANGUAGE}.json', 'langcache/', 'de');
$i18n->init();

$version = PivizWebzeugNet\ApplicationVersion::get();
$language = $i18n->getAppliedLang();
?>

<!doctype html>
<html lang="en">
<head>
	<?php require_once('./includes/gtmHead.php'); ?>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">

	<!-- Meta information -->
	<title><?php echo L::appTitle . " - " . L::domain; ?></title>
	<meta name="description" content="<?php echo L::description; ?>">
	<meta name="author" content="Klaus Hörmann-Engl<klaus@webzeug.net>">
	
	<!-- Facebook OpenGraph -->
	<meta property="og:title" content="<?php echo L::appTitle . " - " . L::domain; ?>" />
	<meta property="og:image" content="https://piviz.webzeug.net/assets/images/piviz.png" />
	<meta property="og:description" content="<?php echo L::description; ?>" />

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