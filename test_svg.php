<!DOCTYPE html>  
<html>  
<head>
    <meta charset="utf-8">
    <title>New Demo</title>
	<script src="js/jquery-1.8.3.min.js" ></script>
	<script src="js/fabric2.js" ></script>
	<script src="js/gunny.js" ></script>
	<link href="js/style.css" media="all" type="text/css" rel="stylesheet">
	
 </head>
<body>
<?php 
$dataJsonfile = fopen(__DIR__ .'/svg.txt', "r") or die("Unable to open file!");
		$canvasSide = fread($dataJsonfile,filesize(__DIR__ .'/svg.txt'));
echo $canvasSide;
?>
</body>
</html> 
