<!DOCTYPE html>    
<head>
    <meta charset="utf-8">
    <title>New Demo</title>
	<script src="js/jquery-1.8.3.min.js" ></script>
	<script src="js/fabric2.js" ></script>
	<script src="js/gunny.js" ></script>
	<link href="js/style.css" media="all" type="text/css" rel="stylesheet">
 </head>
<body>
<div class="main-content">
	<div class="left-content">
		<div class="content-action">
			<button type="button" id="save-canvas">Save Canvas</button>
		</div>
		<div class="content-action">
			<img class="list-image" src="assets/cat.jpg" />
			<img class="list-image" src="assets/baybe.jpg" />
			<img class="list-image" src="assets/shape-143295572519.svg" />
		</div>
		<div class="content-action action-text">
			<textarea id="pdc-text" name="pdc_text"></textarea>
			<button type="button" id="pdc-add-text">Add Text</button>
			<button type="button" id="pdc-update-text">update Text</button>
		</div>
		<?php $arrayBg = array('FFFFFF','F2F3E2','FDF027','FAD431','EFA14A','E7722F','E45D2C','C20034','9B0F33','EF7490','D01A74','D0A2C8','8766A6','692C89','23529E','333181','7EACD8','81D1CF','1B96A8','13874E'); ?>
		<div class="content-action list-background">
		  <div class="background-color-list">
			 <label>Choose background color</label>
			 <ul class="pdc-background-color-list">
				<?php foreach($arrayBg as $bg) : ?>
				<li>
				   <a title="White" style="background-color:#<?php echo $bg; ?>; color:#<?php echo $bg; ?>;">
					ABC
				   </a>
				</li>
				<?php endforeach; ?>
			 </ul>
		  </div>
		</div>
		<div class="content-action color-svg" style="display : none;">
			<div class="background-color-list">
				<label>Choose background For svg</label>
				<ul class="pdc-background-color-svg">
					<?php foreach($arrayBg as $bg) : ?>
					<li>
					   <a title="White" style="background-color:#<?php echo $bg; ?>; color:#<?php echo $bg; ?>;">
						ABC
					   </a>
					</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</div>
	<div class="right-content">
		<canvas id="c" style="border:1px solid black;" ></canvas>
	</div>
</div>

<script type="text/javascript">
jQuery(document).ready(function(){
gunny.init();

});
</script>
</body>