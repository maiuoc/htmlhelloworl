jQuery(document).ready(function(){
	gunny  = {
		allCanvas : {},
		urlSaveJsonFile : $('#base-url').length ? $('#base-url').val() : '',
		saveToJson : function ()
		{
			//canvassie available
			var arCanvasSide = {color_code : '',color_id : '0', filename : '',final_price : 0.00,product_id : 2};
			var currentCanvans = this.getActiveCanvas(1);
			var customAttrs = ['name', 'isrc', 'price', 'object_type', 'selectable', 'scale', 'evented'];
			//console.log(JSON.stringify(currentCanvans));
			var objects = currentCanvans.getObjects();
			//console.log(currentCanvans.toJSON(customAttrs));
			arCanvasSide.json = currentCanvans.toJSON(customAttrs);
			arCanvasSide.svg = currentCanvans.toSVG();
			// console.log(arCanvasSide);
			objects.forEach(function(o) {
				// console.log(o);
				if(!isNaN(o.price) && parseFloat(o.price) > 0)
				{
					arCanvasSide.final_price += parseFloat(o.price);
				}
			});
			this.saveJsonFile(arCanvasSide,function(response){
				if(response.status == 'success') 
				{
					//preview svg image
					var svgCanvas = arCanvasSide.svg;
					$('.canvas-preview').html(svgCanvas);
				}
				else
				{
					alert('error');
				}
			})
			
		},
		saveJsonFile : function(canvasSide,callback)
		{
			var tempData = {
				options : {},
                side_config : canvasSide
			};
			$.ajax({
				type: "POST",
				url: this.urlSaveJsonFile+'/saveJson.php',
				data: JSON.stringify(tempData),
				contentType: 'application/json',
				beforeSend: function() {
					console.log("data sending");
				},
				error: function() {
					console.log("Something went wrong...");
                    alert("Something went wrong! This ajax request has failed.");
				}, 
				success: function(response) {
					callback(response);
				}
			});
		},
		doRequest: function (url, data, callback) {
            var self = this;
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				beforeSend: function() {
					console.log("data sending");
				},
				error: function() {
					console.log("Something went wrong...");
                    alert("Something went wrong! This ajax request has failed.");
				}, 
				success: function(response) {
					callback(response);
				}
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
			// this.addBackgroundLayer('assets/blue-background.png',options);
			//add mask layer
			this.addOverlayLayer('assets/overlay.png',options);
			//add background color
			this.addBackgroundColorLayer('#09F745');
		},
		restoreDesignFromJson : function(jsonFile)
		{
			
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
					object_type: options.object_type || 'image_svg',
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
				// fontFamily: 'Area',
                //left: center.left,
                //top: center.top,
                fontSize: fontSize || 25,
                textAlign: "left",
                //perPixelTargetFind : true,
                fill: "#000",
				object_type : 'text',
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
				_canvans.insertAt(image,0);
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
		changeBackrooundColorLayer : function(color)
		{
			this.addBackgroundColorLayer(color);
		},
		addBackgroundColorLayer : function(color, options,_canvans)
		{
			var _canvans = _canvans || this.getActiveCanvas(1),
			options = options || {},
			color = color || '#ffffff';
			_canvans.forEachObject(function(obj){
				if(obj.object_type && obj.object_type == 'background_color')
				{
					_canvans.remove(obj);
				}
			});
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
		updateColorObject : function(color,_canvans)
		{
			var _canvans = _canvans|| this.getActiveCanvas(1);
			obj = _canvans.getActiveObject();
			if(obj.object_type == 'image_svg' || obj.object_type == 'text')
			{
				var newObj = obj;
				_canvans.remove(obj);
				newObj.set({
					fill : color
				});
				_canvans.add(newObj).setActiveObject(newObj);
			}
		},
		updateText : function(mValue,task,_canvans)
		{
			var _canvans = _canvans|| this.getActiveCanvas(1);
			obj = _canvans.getActiveObject();
			if(obj.object_type != 'text')
			{
				return false;
			}
			var newObj = obj;
			_canvans.remove(obj);
			switch(task)
			{
				case  'update_text' :
					newObj.set({
						text : mValue
					});
				break;
				case 'change_fontfamily' :
					newObj.set({
						fontFamily : mValue
					});
			}
			_canvans.add(newObj).setActiveObject(newObj);
			_canvans.renderAll();
		},
		getActiveCanvas : function(sideId)
		{
			return this.allCanvas[sideId];
		},
		explodeCanvas : function(_canvans)
		{
			var _canvans = _canvans|| this.getActiveCanvas(1);
			console.log(_canvans.toSVG());
			var svgCanvas = _canvans.toSVG();
			$('.canvas-preview').html(svgCanvas);
		},
		canvasEvent : function()
		{
			currentCanvans = this.getActiveCanvas(1);
				currentCanvans.on('object:selected', function(e) { // or 'object:added'
				console.log(e.target);
				if(e.target)
				{
					if(e.target.object_type == 'image_svg')
					{
						$('.color-svg').css('display','block');
					}
					else if(e.target.object_type == 'text')
					{
						var text = e.target.text;
						$('.color-svg').css('display','block');
						$('.gunny-font-family').css('display','block');
						$('#pdc-text').val(text);
					}
					else
					{
						$('.color-svg').css('display','none');
						$('.gunny-font-family').css('display','none');
					}
				}
				
			});
		},
		init : function()
		{
			var self = this;
			self.prepareCanvans();
			self.initCanvas();
			self.canvasEvent();
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
				var options = {price : 5};
				if($.trim(text) != '')
				{
					self.addText(text,30,options);
				}
			});
			$('.pdc-background-color-list li a').click(function(){
				var color = $(this).css('background-color');
				console.log(color);
				self.changeBackrooundColorLayer(color);
			});
			$('.pdc-background-color-svg li a').click(function(){
				var color = $(this).css('background-color');
				self.updateColorObject(color);
			});
			$('#pdc-update-text').click(function(){
				var text = $('#pdc-text').val();
				if($.trim(text) != '')
				{
					var mValue = text;
					self.updateText(mValue,'update_text');
				}
			});
			$('#gunny_font').change(function(){
				var font = $(this).val();
				var mValue = font;
				self.updateText(mValue,'change_fontfamily');
			});
			$('#preview-canvas').click(function()
			{
				self.explodeCanvas();
			});
			//save to json
			$('#save-to-json').click(function(){
				self.saveToJson();
			})
		}
	}
	// gunny.init();
})