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
<style type="text/css">
            @font-face {
        font-family: 'gooddog';
        src: url('js/fonts/gooddog.otf');
    }
            @font-face {
        font-family: 'lobster';
        src: url('js/fonts/lobster.otf');
    }
            @font-face {
        font-family: 'lokicola';
        src: url('js/fonts/lokicola.ttf');
    }
            @font-face {
        font-family: 'madewithb';
        src: url('js/fonts/madewithb.ttf');
    }
            @font-face {
        font-family: 'montague';
        src: url('js/fonts/montague.ttf');
    }
            @font-face {
        font-family: 'organo';
        src: url('js/fonts/organo.ttf');
    }
            @font-face {
        font-family: 'playball';
        src: url('js/fonts/playball.ttf');
    }
            @font-face {
        font-family: 'riesling';
        src: url('js/fonts/riesling.ttf');
    }
    </style>
	<?php $arfonts = array('gooddog','lobster','lokicola','madewithb','montague','playball','riesling'); ?>
<div class="main-content">
	<input id="base-url" type="hidden" name="base_url" value="http://<?php echo $_SERVER['SERVER_NAME'].'/htmlhelloworl/'; ?>" />
	<?php $jsonFile = ''; ?>
	<?php 
	$myfile = fopen(__DIR__ .'/'."file_json.txt", "r") or die("Unable to open file!");
		$jsonFile = fread($myfile,filesize(__DIR__ .'/'."file_json.txt"));
		echo fread($myfile,filesize(__DIR__ .'/'."file_json.txt"));
	fclose($myfile);
	?>
	<input type="hidden" id="current-json-file" name="current_json_file" value="<?php echo $jsonFile; ?>" />
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
		<div class="content-action gunny-font-family" style="display : none;">
			<div class="background-color-list">
				<label>Select font-family</label>
				<select name="gunny_font" id="gunny_font">
					<?php foreach($arfonts as $arfont) : ?>
						<option value="<?php echo $arfont; ?>"><?php echo $arfont ?></option>
					<?php endforeach; ?>
				</select>
			</div>
		</div>
		<div class="content-action" style="">
			<button id="preview-canvas" type="button">Preview</button>
		</div>
		<div class="content-action" style="">
			<button id="save-to-json" type="button">Save To json</button>
		</div>
	</div>
	<div class="right-content">
		<canvas id="c" style="border:1px solid black;" ></canvas>
	</div>
	<div class="canvas-preview"></div>
</div>

<script type="text/javascript">
jQuery(document).ready(function(){
gunny.init();

});
</script>
</body>