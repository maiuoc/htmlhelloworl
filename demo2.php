<!DOCTYPE html>    
<head>
    <meta charset="utf-8">
    <title>New Demo</title>
	
	<!-- Get version 1.1.0 of Fabric.js from CDN -->
	<script src="js/jquery-1.8.3.min.js" ></script>
	<script src="js/fabric2.js" ></script>
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
		</div>
	</div>
	<div class="right-content">
		<canvas id="c" style="border:1px solid black;" ></canvas>
	</div>
</div>

<script type="text/javascript">
jQuery(document).ready(function(){
	gunny  = {
		allCanvas : {},
		saveToJson : function ()
		{
			var currentCanvans = this.getActiveCanvas(1);
			console.log(JSON.stringify(currentCanvans));
			var objects = currentCanvans.getObjects()
			objects.forEach(function(o) {
				console.log(o);
			});
		},
		prepareCanvans : function()
		{
			this.allCanvas[1] = new fabric.Canvas('c');
			this.allCanvas[1].setWidth(800);
			this.allCanvas[1].setHeight(800);
		},
		initCanvas : function()
		{
			//add background
			currentCanvans = this.getActiveCanvas(1);
			var options = {price : 10};
			this.addBackgroundLayer('assets/blue-background.png',options);
			//add mask layer
			this.addOverlayLayer('assets/overlay.png',options);
			//add background color
			 this.addBackgroundColorLayer('#09F745');
		},
		addImage : function(imageSrc,options,callback)
		{
			var options = options || {};
			var _canvans = this.getActiveCanvas(1);
			var ext = imageSrc.split(".");
			if(ext[ext.length -1] != 'svg') {
				fabric.Image.fromURL(imageSrc,function(image){
					image.set({
						angle : 0,
						isrc : imageSrc,
						price : options.price || 0,
						scaleX: (_canvans.width / image.width / 2),
						scaleY: (_canvans.height / image.height / 2),
						object_type: options.object_type || 'image',
						borderColor : '#808080',
						cornerColor : 'rgba(68,180,170,0.7)',
						cornerSize: 12,
						cornerRadius: 16,
						transparentCorners: false,
						centeredScaling:true,
						rotatingPointOffset: 40,
						padding: 5
					});
					image.setControlVisible('mt', false);
					image.setCoords();
					_canvans.centerObject(image);
					_canvans.add(image).setActiveObject(image);
					callback && callback();
				});
			}
			else
			{
				this.addSvgImage(imageSrc,options,callback);
			}
			
		},
		addSvgImage : function(imageSrc,options,callback)
		{
			var options = options || {};
			var _canvans = this.getActiveCanvas(1); 
			fabric.loadSVGFromURL(imageSrc,function(objects,_svgOptions){
				var loadObject = fabric.util.groupSVGElements(objects,_svgOptions);
				loadObject.set({
					angle : 0,
					fill : '#13F94D',
					isrc : imageSrc,
					price : options.price || 0,
					scaleX: (_canvans.width / loadObject.width / 2),
                    scaleY: (_canvans.height / loadObject.height / 2),
					object_type: options.object_type || 'image',
					borderColor : '#808080',
					cornerColor : 'rgba(68,180,170,0.7)',
					cornerSize: 12,
					cornerRadius: 16,
					transparentCorners: false,
					centeredScaling:true,
					rotatingPointOffset: 40,
					padding: 5
				});
				loadObject.setControlVisible('mt',false);
				loadObject.setCoords();
				_canvans.centerObject(loadObject);
				_canvans.add(loadObject).setActiveObject(loadObject);
				
			})
		},
		addText : function (text, fontSize,options)
		{
			var options = options || {};
			var _canvans = this.getActiveCanvas(1); 
			var textObjbect = new fabric.Text(text,{
				fontFamily: 'Arial',
                //left: center.left,
                //top: center.top,
                fontSize: fontSize || 25,
                textAlign: "left",
                //perPixelTargetFind : true,
                fill: "#000",
                price: options.price,
                lineHeight: 1.3,
                borderColor: '#808080',
				cornerColor: 'rgba(68,180,170,0.7)',
				cornerSize: 16,
				cornerRadius: 12,
				transparentCorners: false,
				centeredScaling:true,
				rotatingPointOffset: 40,
				padding: 5
			});
			textObjbect.setControlVisible('mt',false);
			_canvans.centerObject(textObjbect);
			_canvans.add(textObjbect).setActiveObject(textObjbect);
		},
		addBackgroundLayer : function(imageSrc,options,_canvans)
		{
			var options = options || {},
			_canvans = _canvans || this.getActiveCanvas(1);
			fabric.Image.fromURL(imageSrc,function(image){
				image.set({
					width : _canvans.getWidth(),
					height : _canvans.getHeight(),
					price : options.price || 0,
					id : Date.now(),
					object_type: 'background',
					originX : 'left',
					originY : 'top',
					alignX : options.alignX || 'min', // none, mid, min, max
					alignY : options.alignY || 'min',
					meetOrSlice: options.meetOrSlice || 'slice',	// meet
					isrc : imageSrc,
					selectTable : false,
					hasBorder : false,
					evented : false
				});
				_canvans.insertAt(image,1);
				_canvans.renderAll();
			})
		},
		addOverlayLayer : function(imageSrc,options,_canvans)
		{
			var _canvans = _canvans || this.getActiveCanvas(1),
			options = options || options;
			fabric.Image.fromURL(imageSrc,function(image){
				image.set({
					width : _canvans.getWidth(),
					height : _canvans.getHeight(),
					price : options.price || 0,
					id : Date.now(),
					object_type : 'mask',
					top : 0,
					left : 0,
					originX : 'left',
					originY : 'top',
					alignX : options.alignX || 'none',
					alignY : options.alignY || 'none',
					meetOrSlice : options.meetOrSlice || 'meet',
					isrc : imageSrc,
					selectTable : false,
					evented : false,
					hasBorder : false
				});
				_canvans.setOverlayImage(image, _canvans.renderAll.bind(_canvans));
			})
		},
		addBackgroundColorLayer : function(color, options,_canvans)
		{
			var _canvans = _canvans || this.getActiveCanvas(1),
			options = options || {},
			color = color || '#ffffff'
			var redirctBgColor = new fabric.Rect({
				width: _canvans.getWidth(),
				height : _canvans.getHeight(),
				fill : color,
				object_type : 'background_color',
				price : options.price || 0,
				selectTable : false,
				evented: false,
				hasBorder : false,
			});
			_canvans.insertAt(redirctBgColor,0);
			_canvans.renderAll();
		},
		getActiveCanvas : function(sideId)
		{
			return this.allCanvas[sideId];
		},
		init : function()
		{
			var self = this;
			self.prepareCanvans();
			self.initCanvas();
			//event jquery
			$('#save-canvas').click(function(){
				self.saveToJson();
			});
			$('.list-image').click(function(){
				var imageSrc = $(this).attr('src');
				var options = {price : 5};
				self.addImage(imageSrc,options);
			});
			//add text
			$('#pdc-add-text').click(function(){
				var text = $('#pdc-text').val();
				if($.trim(text) != '')
				{
					self.addText(text,30);
				}
			})
		}
	}
	gunny.init();
})
</script>
</body>