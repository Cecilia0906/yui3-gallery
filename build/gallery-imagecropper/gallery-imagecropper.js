YUI.add('gallery-imagecropper', function(Y) {


/**
 * @description <p>Creates a Image Cropper control.</p>
 * @requires base, widget, resize
 * @module imagecropper
 */

var Lang = Y.Lang,
	isNumber = Lang.isNumber,
	YArray = Y.Array,
	getClassName = Y.ClassNameManager.getClassName,
	IMAGE_CROPPER = 'imagecropper',
	RESIZE = 'resize',
	MASK = 'mask',
	KNOB = 'knob',
	
	_classNames = {
		cropMask: getClassName(IMAGE_CROPPER, MASK),
		resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, KNOB),
		resizeMask: getClassName(IMAGE_CROPPER, RESIZE, MASK)
	},

/**
 * @constructor
 * @class ImageCropper
 * @description <p>Creates a Image Cropper control.</p>
 * @extends Widget
 * @param {Object} config Object liternal containing configuration parameters.
*/
ImageCropper = Y.ImageCropper = Y.Base.create('imagecropper', Y.Widget, [], {
	
	CONTENT_TEMPLATE: '<img/>',
	
	_moveResizeKnob: function (e) {
		e.preventDefault(); // prevent scroll in Firefox
		
		var resizeKnob = e.target,
			contentBox = this.get('contentBox'),
		
			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),
			direction = e.direction,
			
			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,
			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,
			
			x = resizeKnob.getX() + tickH,
			y = resizeKnob.getY() + tickV,
			
			minX = contentBox.getX(),
			minY = contentBox.getY(),
			
			maxX = minX + contentBox.get('offsetWidth') - resizeKnob.get('offsetWidth'),
			maxY = minY + contentBox.get('offsetHeight') - resizeKnob.get('offsetHeight');
			
		if (x < minX) {
			x = minX;
		} else if (x > maxX) {
			x = maxX;
		}
		if (y < minY) {
			y = minY;
		} else if (y > maxY) {
			y = maxY;
		}
		resizeKnob.setXY([x, y]);
		
		this._syncResizeMask();
	},
	
	_defCropMaskValueFn: function () {
		return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);
	},

	_defResizeKnobValueFn: function () {
		return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);
	},

	_defResizeMaskValueFn: function () {
		return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);
	},

	_renderCropMask: function (boundingBox) {
		var node = this.get('cropMask');
		if (!node.inDoc()) {
			boundingBox.append(node);
		}
	},

	_renderResizeKnob: function (boundingBox) {
		var node = this.get('resizeKnob');
		if (!node.inDoc()) {
			boundingBox.append(node);
		}
		node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');
	},

	_renderResizeMask: function () {
		var node = this.get('resizeMask');
		if (!node.inDoc()) {
			this.get('resizeKnob').append(node);
		}
	},

	_handleSrcChange: function (e) {
		this.get('contentBox').set('src', e.newVal);
		this.get('cropResizeMask').setStyle('backgroundImage', 'url(' + e.newVal + ')');
	},
	
	_syncResizeKnob: function () {
		var initialXY = this.get('initialXY');
		
		this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
	},
	
	_syncResizeMask: function () {
		var resizeKnob = this.get('resizeKnob');
		resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');
	},
	
	_syncResizeAttr: function (e) {
		if (this._resize) {
			this._resize.con.set(e.attrName, e.newVal);
		}
	},
	
	_icEventProxy: function (target, ns, eventType) {
		var sourceEvent = ns + ':' + eventType,
			resizeKnob = this.get('resizeKnob');
			
		target.on(sourceEvent, function (e) {
			
			var o = {
				coords: {
					width: resizeKnob.get('offsetWidth'),
					height: resizeKnob.get('offsetHeight'),
					left: resizeKnob.get('offsetLeft'),
					top: resizeKnob.get('offsetTop')
				}
			};
			o[ns + 'Event'] = e;
			
			this.fire(sourceEvent, o);
			
			o.sourceEvent = sourceEvent;
			
			// instead of firing crop:drag and crop:resize, fire crop:crop to have a unified event for all changes in the crop area
			this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);
			
		}, this);
	},
	
	_bindResize: function (resizeKnob, contentBox) {
		var resize = this._resize = new Y.Resize({
			node: resizeKnob
		});
		resize.on('resize:resize', this._syncResizeMask, this);
		resize.plug(Y.Plugin.ResizeConstrained, {
			constrain: contentBox,
			minHeight: this.get('minHeight'),
			minWidth: this.get('minWidth'),
			preserveRatio: this.get('preserveRatio')
		});
		YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));
	},
	
	_bindDrag: function (resizeKnob, contentBox) {
		var drag = this._drag = new Y.DD.Drag({
			node: resizeKnob,
			handles: [this.get('resizeMask')]
		});
		drag.on('drag:drag', this._syncResizeMask, this);
		drag.plug(Y.Plugin.DDConstrained, {
			constrain2node: contentBox
		});
		YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));
	},
	
	initializer: function () {
		this.set('initialXY', this.get('initialXY') || [10, 10]);
		this.set('initWidth', this.get('initWidth'));
		this.set('initHeight', this.get('initHeight'));

		this.after('srcChange', this._handleSrcChange);
		
		this._icHandlers = [];
		
		YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {
			this.after(attr + 'Change', this._syncResizeAttr);
		}, this);
	},
	
	renderUI: function () {
		var boundingBox = this.get('boundingBox');
		
		this._renderCropMask(boundingBox);
		this._renderResizeKnob(boundingBox);
		this._renderResizeMask();
	},
	
	bindUI: function () {
		
		var contentBox = this.get('contentBox'),
			resizeKnob = this.get('resizeKnob');
			
		this._icHandlers.push(
			resizeKnob.on('focus', this._attachKeyBehavior, this),
			resizeKnob.on('blur', this._detachKeyBehavior, this),
			resizeKnob.on('arrow', this._moveResizeKnob, this)
		);
		
		this._bindResize(resizeKnob, contentBox);
		this._bindDrag(resizeKnob, contentBox);
	},
	
	syncUI: function () {
		this.get('contentBox').set('src', this.get('source'));
		
		this._syncResizeKnob();
		this._syncResizeMask();
	},
	
	getCropCoords: function () {
		var resizeKnob = this.get('resizeKnob');
		return {
			left: resizeKnob.get('offsetLeft'),
			top: resizeKnob.get('offsetTop'),
			width: resizeKnob.get('offsetWidth'),
			height: resizeKnob.get('offsetHeight')
		};
	},
	
	destructor: function () {
		if (this._resize) {
			this._resize.destroy();
		}
		if (this._drag) {
			this._drag.destroy();
		}
		YArray.each(this._icHandlers, function (handler) {
			handler.detach();
		});
		
		this._drag = this._resize = null;
	}
	
}, {
	
	CROP_MASK_TEMPLATE: '<div class="' + _classNames.cropMask + '"></div>',
	RESIZE_KNOB_TEMPLATE: '<div class="' + _classNames.resizeKnob + '" tabindex="0"></div>',
	RESIZE_MASK_TEMPLATE: '<div class="' + _classNames.resizeMask + '"></div>',
	
	RESIZE_EVENTS: ['start', 'resize', 'end'],
	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],
	DRAG_EVENTS: ['start', 'drag', 'end'],
	
	HTML_PARSER: {
		
		source: function (srcNode) {
			return srcNode.get('src');
		},
		
		cropMask: '.' + _classNames.cropMask,
		resizeKnob: '.' + _classNames.resizeKnob,
		resizeMask: '.' + _classNames.resizeMask
		
	},
	
	ATTRS: {
		
		source: {
			value: ''
		},
		
		resizeMask: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.resizeMask);
				}
				return node;
			},

			valueFn: '_defResizeMaskValueFn'
		},
		
		resizeKnob: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.resizeKnob);
				}
				return node;
			},

			valueFn: '_defResizeKnobValueFn'
		},
		
		cropMask: {
			setter: function (node) {
				node = Y.one(node);
				if (node) {
					node.addClass(_classNames.cropMask);
				}
				return node;
			},

			valueFn: '_defCropMaskValueFn'
		},
		
		initialXY: {
			validator: Lang.isArray
		},
		
		keyTick: {
			value: 1,
			validator: isNumber
		},
		
		shiftKeyTick: {
			value: 10,
			validator: isNumber
		},
		
		useKeys: {
			value: true,
			validator: Lang.isBoolean
		},
		
		status: {
			value: true,
			validator: Lang.isBoolean
		},
		
		minHeight: {
			value: 50,
			validator: isNumber
		},
		
		minWidth: {
			value: 50,
			validator: isNumber
		},
		
		preserveRatio: {
			value: false,
			validator: Lang.isBoolean
		},
		
		initHeight: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				var minHeight = this.get('minHeight');
				return value < minHeight ? minHeight : value;
			}
		},
		
		initWidth: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				var minWidth = this.get('minWidth');
				return value < minWidth ? minWidth : value;
			}
		}
		
	}
	
});



}, '@VERSION@' ,{requires:['widget','resize','gallery-event-arrow']});
