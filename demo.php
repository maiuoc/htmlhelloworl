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
	</div>
	<div class="right-content">
		<canvas id="c" style="border:1px solid black;" ></canvas>
	</div>
</div>

<script type="text/javascript">
jQuery(document).ready(function(){
	
  var canvas = new fabric.Canvas('c');
	canvas.setWidth(800);
	canvas.setHeight(800);
  fabric.Image.fromURL('assets/overlay.png', function(img) {
		img.set({
			width: 800, 
			height: 800, 
			originX: 'left', 
			originY: 'top',
			top: -1,
			left: -1,
			alignX: 'none', // none, mid, min, max
			alignY: 'none',
			meetOrSlice: 'meet', // meet,
			selectable: false,
			evented: false,
			object_type: 'mask',
			price : 5,
		});
		canvas.setOverlayImage(img, canvas.renderAll.bind(canvas));
	});
	//change brackround color
	var redircetBgColor = new fabric.Rect({
		width: 800,
		height: 800,
		top : 0,
		left: 0,
		fill : '#13874E',
		object_type: 'background_color',
		selectable: false,
		evented : false,
		price : 5,
	});
	canvas.insertAt(redircetBgColor,0);
	//images
	fabric.Image.fromURL('assets/cat.jpg', function(img) {
    img.set({ 
	left: 100,
	top: 250, 
	angle: 0, 
	meetOrSlice: 'slice',
	selectable: true,
	hasBorders: true,
	object_type: 'image',
    evented: true,
	price : 10,
	});
	img.setControlVisible('mt', false);
	img.setCoords();
	canvas.centerObject(img);
	canvas.add(img).setActiveObject(img);
	console.log('test');
  });
	// canvas.renderAll();
	//add text
	var newText = new fabric.Text('This is test test',
	{
		left :  100,
		top : 100,
		fill : '#FF0000',
		price : 6,
		
	}
	);
	canvas.add(newText);
	//add svg image
	fabric.loadSVGFromURL('assets/shape-143295572519.svg', function(objects, options){
		var shape = fabric.util.groupSVGElements(objects, options);
		shape.setFill('red');
		canvas.add(shape.scale(0.6));
		shape.set({ left: 200, top: 350,price : 3 }).setCoords();
		// canvas.renderAll();
		/* canvas.forEachObject(function(obj) {
		  var setCoords = obj.setCoords.bind(obj);
		  obj.on({
			moving: setCoords,
			scaling: setCoords,
			rotating: setCoords
		  });
		}) */
	});
	var total = 0;
	/* canvas.forEachObject(function(o) {
		console.log(o)
		_objectPrice = parseFloat(o.price || 0);
		total += _objectPrice;
		
	});
	console.log(total); */
	objects = canvas.getObjects();
	objects.forEach(function(o) {
		console.log(o);
	});
})
</script>
</body>