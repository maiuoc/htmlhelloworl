jQuery(document).ready(function(){
	var undoManager = new UndoManager();
	gunny  = {
		allCanvas : {},
		urlSaveJsonFile : $('#base-url').length ? $('#base-url').val() : '',
		canvas_default_zoom : 100,
		default_width : 0,
		default_height : 0,
		people : {},
		historyJson : [],
		historyId : 0,
		saveToJson : function (exportFileJson)
		{
			
			//canvassie available
			var arCanvasSide = {color_code : '',color_id : '0', filename : '',final_price : 0.00,product_id : 2};
			var currentCanvans = this.getActiveCanvas(1);
			// console.log(this.gunnyZoom.resetZoomBeforeSave(currentCanvans));
			var customAttrs = ['name', 'isrc', 'price', 'object_type', 'selectable', 'scale', 'evented'];
			//console.log(JSON.stringify(currentCanvans));
			var objects = currentCanvans.getObjects();
			// console.log(currentCanvans.toJSON(customAttrs));
			arCanvasSide.json = currentCanvans.toJSON(customAttrs);
			if(exportFileJson == 1)
			{
				arCanvasSide.svg = currentCanvans.toSVG();
			}
			
			// console.log(arCanvasSide);
			objects.forEach(function(o) {
				// console.log(o);
				if(!isNaN(o.price) && parseFloat(o.price) > 0)
				{
					arCanvasSide.final_price += parseFloat(o.price);
				}
			});
			if(exportFileJson == 1)
			{
				this.saveJsonFile(arCanvasSide,function(response){
					response = JSON.parse(response);
					if(response.status == 'success') 
					{
						//preview svg image
						var svgCanvas = currentCanvans.toSVG();
						$('.canvas-preview').html(svgCanvas);
					}
					else
					{
						alert('error');
					}
				})
			}
			else
			{
				return arCanvasSide;
			}
			
		},
		checkGunnyCanvas : function()
		{
			currentCanvans = this.getActiveCanvas(1);
			var objects = currentCanvans.getObjects();
			objects.forEach(function(o) {
				console.log(o);
			});
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
			this.allCanvas[1].setWidth(500);
			this.allCanvas[1].setHeight(500);
		},
		initCanvas : function()
		{
			//add background
			currentCanvans = this.getActiveCanvas(1);
			var options = {price : 10};
			this.default_width = currentCanvans.getWidth();
			this.default_height = currentCanvans.getHeight();
			this.addBackgroundLayer('assets/blue-background.png',options);
			
			//add mask layer
			// this.addOverlayLayer('assets/overlay.png',options);
			//add background color
			this.addBackgroundColorLayer('#09F745');
			// this.addHistories();
		},
		gunnyLoadFromJson : function(stringJson)
		{
			currentCanvans = this.getActiveCanvas(1);
			// currentCanvans.setOverlayImage(null, currentCanvans.renderAll.bind(currentCanvans));
			//remove overlay canvas
			currentCanvans.setOverlayImage(null,currentCanvans.renderAll.bind(currentCanvans));
			var self = this;
			currentCanvans.loadFromJSON(stringJson,function()
			{
				//update overlay size when size image is not correct
				self.gunnyZoom.updateOverlaySize(currentCanvans);
				currentCanvans.renderAll();
				this.default_width = currentCanvans.getWidth();
				this.default_height = currentCanvans.getHeight();
				
			}, function (o,object)
			{
				if(object)
				{
					/* object.set({
						borderColor: '#808080',
						cornerColor: 'rgba(68,180,170,0.7)',
						cornerSize: 16,
						cornerRadius: 12,
						transparentCorners: false,
						centeredScaling:true,
						rotatingPointOffset: 40,
						padding: 5
					});
					object.setControlVisible('mt', false); */
				}
				// currentCanvans.renderAll();
			});
			//currentCanvans.loadFromJSON('{"objects":[{"type":"rect","left":50,"top":50,"width":20,"height":20,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0},{"type":"circle","left":100,"top":100,"width":100,"height":100,"fill":"red","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"radius":50}],"background":"rgba(0, 0, 0, 0)"}')
			//currentCanvans.renderAll();
			// console.log(currentCanvans.getWidth());
			
		},
		canvasZoomOut : function(percent)
		{
			_canvans = this.getActiveCanvas(1);
			var defaultWith = this.default_width;
			var defaultHeight = this.default_height;
			this.gunnyZoom.ZoomOut(_canvans,defaultWith,defaultHeight,percent);
		},
		canvasZoomIn : function(percent)
		{
			_canvans = this.getActiveCanvas(1);
			var defaultWith = this.default_width;
			var defaultHeight = this.default_height;
			this.gunnyZoom.ZoomIn(_canvans,defaultWith,defaultHeight,percent);
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
		gunnyZoom : {
			default_zoom : 1,
			default_scaleX : 1,
			default_scaleY : 1,
			resetZoomBeforeSave : function(_canvas)
			{
				var self = this;
                if(!_canvas) return;
                _canvas.scale = _canvas.scale || 1;
                _canvas.setHeight(_canvas.getHeight() * (1 / _canvas.scale));
                _canvas.setWidth(_canvas.getWidth() * (1 / _canvas.scale));
                var objects = _canvas.getObjects();
                for (var i in objects) {
                    var scaleX = objects[i].scaleX;
                    var scaleY = objects[i].scaleY;
                    var left = objects[i].left;
                    var top = objects[i].top;

                    var tempScaleX = scaleX * (1 / _canvas.scale);
                    var tempScaleY = scaleY * (1 / _canvas.scale);
                    var tempLeft = left * (1 / _canvas.scale);
                    var tempTop = top * (1 / _canvas.scale);

                    objects[i].scaleX = tempScaleX;
                    objects[i].scaleY = tempScaleY;
                    objects[i].left = tempLeft;
                    objects[i].top = tempTop;

                    objects[i].setCoords();
                }
                 this.updateOverlaySize(_canvas);
                _canvas.renderAll();
                return _canvas;  
			},
			updateOverlaySize: function(_canvas) {
                if(_canvas && _canvas.overlayImage) {
                    _canvas.overlayImage.width = _canvas.getWidth();
                    _canvas.overlayImage.height = _canvas.getHeight();
                    //_canvas.renderAll();
                }
            },
			ZoomOut : function(_canvans,defaultWith,defaultHeight,percent)
			{
				var mWidth = defaultWith;
				var mHeight = defaultHeight;
				var mScale = percent / 100;
				mWidth = mWidth * mScale;
				mHeight = mHeight * mScale;
				if(_canvans.overlayImage)
				{
					_canvans.overlayImage.width = mWidth;
                    _canvans.overlayImage.height = mHeight;
				}
				//update side objects
				var objects = _canvans.getObjects();
				objects.forEach(function(o){
					
					if(o.object_type == 'background' || o.object_type == 'background_color')
					{
						o.setWidth(mWidth);
						o.setHeight(mHeight);
					}
					else
					{
						var omLeft = o.left;
						var omTop = o.top;
						console.log(o.width);
						o.setScaleX(mScale / 2);
						o.setScaleY(mScale / 2);
						console.log(o.width);
						// var omWidht = o.width * (mScale / 2);
						// var omHeight = o.height * (mScale / 2);
						// o.setWidth(omWidht);
						// o.setHeight(omHeight);
						// console.log('aa '+omLeft+' - '+ omTop +' - '+ omWidht +' - '+ omHeight);
						// console.log(omWidht +' - '+ omHeight);
					}
				});
				_canvans.setWidth(mWidth);
				_canvans.setHeight(mHeight);
				_canvans.renderAll();
				
			},
			ZoomIn : function(_canvans,defaultWith,defaultHeight,percent)
			{
				console.log('default'+defaultWith+defaultHeight+percent);
				var mWidth = defaultWith;
				var mHeight = defaultHeight
				var mScale = percent / 100;
				mWidth = mWidth * mScale;
				mHeight = mHeight * mScale;
				console.log(mWidth);
				console.log(mHeight);
				_canvans.setWidth(mWidth);
				_canvans.setHeight(mHeight);
				
			},
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
						borderColor : '#FF0000',
						padding: 1
					});
					image.setControlVisible('mt', false);
					image.setCoords();
					_canvans.centerObject(image);
					_canvans.add(image).setActiveObject(image);
					callback && callback();
				});
				this.addHistories();
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
			this.addHistories();
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
				padding: 1
			});
			textObjbect.setControlVisible('mt',false);
			_canvans.centerObject(textObjbect);
			_canvans.add(textObjbect).setActiveObject(textObjbect);
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
			// console.log(_canvans.toSVG());
			var svgCanvas = _canvans.toSVG();
			$('.canvas-preview').html(svgCanvas);
		},
		canvasEvent : function()
		{
			currentCanvans = this.getActiveCanvas(1);
				currentCanvans.on('object:selected', function(e) { // or 'object:added'
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
			currentCanvans.on("mouse:up",function(e){
				console.log('Test 9099');
			});
		},
		removeObjecHistory : function(id)
		{
			var tempHistory = this.historyJson;
			console.log(tempHistory);
			var i = 0, index = -1;
			for (i = 0; i < tempHistory.length; i += 1) {
				if (tempHistory[i].id === id) {
					index = i;
				}
			}
			if (index !== -1) {
				tempHistory.splice(index, 1);
			}
			this.historyJson = tempHistory;
			this.undoResoCanvas();
		},
		//add history for canvas
		addHistories : function(attrs)
		{
			var self = this;
			var tempHistory = this.historyJson;
			tempHistory.push(attrs);
			this.undoResoCanvas();
			undoManager.add({
				undo: function () {
					self.removeObjecHistory(attrs.id);
				},
				redo: function () {
					self.addHistories(attrs);
				}
			});
		},
		undoResoCanvas : function()
		{
			var canvasHistoies = this.historyJson;
			console.log(canvasHistoies);
			var currentHistoryJson = null;
			for(var key in canvasHistoies)
			{
				currentHistoryJson = canvasHistoies[key];
				// currentHistoryJson = JSON.stringify(currentHistoryJson);
				console.log(key);
			}
			// console.log(currentHistoryJson);
			/* if(currentHistoryJson)
			{
				this.gunnyLoadFromJson(currentHistoryJson);
			} */
		},
		fuckKingFunction : function()
		{
			var dmObjects = this.people;
			for(var key in dmObjects)
			{
				console.log(key + dmObjects[key]);
			}
		},
		init : function()
		{
			var idHistory = 0;
			var self = this;
			self.prepareCanvans();
			self.initCanvas();
			self.canvasEvent();
			//event jquery
			$('#save-canvas').click(function(){
				self.saveToJson(1);
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
			/* $('#save-to-json').click(function(){
				self.saveToJson();
			}) */
			$('#laod-from-json').click(function(){
				var stringJson = $('#data-json-code').val();
				//console.log(stringJson);
				self.gunnyLoadFromJson(stringJson);
			});
			$('#gunny-zoom-out').click(function(){
				var zoomValue = parseInt(self.canvas_default_zoom);
				zoomValue += 10;
				self.canvas_default_zoom = zoomValue
				self.canvasZoomOut(zoomValue);
				$('#gunny-zoom-label').html(zoomValue+ ' %');
			});
			$('#gunny-zoom-in').click(function(){
				var zoomValue = parseInt(self.canvas_default_zoom);
				zoomValue -= 10;
				self.canvas_default_zoom = zoomValue
				self.canvasZoomIn(zoomValue);
				$('#gunny-zoom-label').html(zoomValue+ ' %');
			});
			$('#gunny-check-obj').click(function(){
				self.checkGunnyCanvas();
			});
			$('#undo').click(function(){
				undoManager.undo();
				//self.undoResoCanvas();
			})
			$('#redo').click(function(){
				undoManager.redo();
				//self.undoResoCanvas();
			});
			$('#add-test-obj').click(function(){
				self.historyId++;
				var attrs = {
					id : self.historyId,
					text : 'maiuoc '+self.historyId
				}
				self.addHistories(attrs);
			});
		}
	}
	// gunny.init();
})