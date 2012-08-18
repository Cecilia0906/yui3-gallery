if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "C:\\Workspace\\yui3-gallery\\src\\gallery-imagecropper\\build_tmp\\gallery-imagecropper.js",
    code: []
};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"].code=["YUI.add('gallery-imagecropper', function(Y) {","","'use strict';","/**"," * @description <p>Creates an Image Cropper control.</p>"," * @requires widget, dd-drag, dd-constrain, resize-base, resize-constrain, gallery-event-arrow"," * @module gallery-imagecropper"," */","","var Lang = Y.Lang,","	isNumber = Lang.isNumber,","	YArray = Y.Array,","	getClassName = Y.ClassNameManager.getClassName,","	IMAGE_CROPPER = 'imagecropper',","	RESIZE = 'resize',","	MASK = 'mask',","	KNOB = 'knob',","	","	_classNames = {","		cropMask: getClassName(IMAGE_CROPPER, MASK),","		resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, KNOB),","		resizeMask: getClassName(IMAGE_CROPPER, RESIZE, MASK)","	};","","/**"," * @constructor"," * @class ImageCropper"," * @description <p>Creates an Image Cropper control.</p>"," * @extends Widget"," * @param {Object} config Object literal containing configuration parameters.","*/","/**"," * The identity of the widget."," *"," * @property ImageCropper.NAME"," * @type String"," * @default 'imagecropper'"," * @readOnly"," * @protected"," * @static"," */","function ImageCropper() {","	ImageCropper.superclass.constructor.apply(this, arguments);","}","Y.extend(ImageCropper, Y.Widget, {","	","	CONTENT_TEMPLATE: '<img/>',","	","	_toggleKeys: function (e) {","		if (e.newVal) {","			this._bindArrows();","		} else {","			this._unbindArrows();","		}","	},","	","	_moveResizeKnob: function (e) {","		e.preventDefault(); // prevent scroll in Firefox","		","		var resizeKnob = this.get('resizeKnob'),","			contentBox = this.get('contentBox'),","			","			knobWidth = resizeKnob.get('offsetWidth'),","			knobHeight = resizeKnob.get('offsetHeight'),","		","			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),","			direction = e.direction,","			","			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,","			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,","			","			x = resizeKnob.getX() + tickH,","			y = resizeKnob.getY() + tickV,","			","			minX = contentBox.getX(),","			minY = contentBox.getY(),","			","			maxX = minX + contentBox.get('offsetWidth') - knobWidth,","			maxY = minY + contentBox.get('offsetHeight') - knobHeight,","			","			o;","			","		if (x < minX) {","			x = minX;","		} else if (x > maxX) {","			x = maxX;","		}","		if (y < minY) {","			y = minY;","		} else if (y > maxY) {","			y = maxY;","		}","		resizeKnob.setXY([x, y]);","		","		o = {","			width: knobWidth,","			height: knobHeight,","			left: resizeKnob.get('offsetLeft'),","			top: resizeKnob.get('offsetTop'),","			sourceEvent: e.type","		};","		","		o[e.type + 'Event'] = e;","		this.fire('crop:start', o);","		this.fire('crop:crop', o);","		this.fire('crop:end', o);","		","		this._syncResizeMask();","	},","	","	_defCropMaskValueFn: function () {","		return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);","	},","","	_defResizeKnobValueFn: function () {","		return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);","	},","","	_defResizeMaskValueFn: function () {","		return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);","	},","","	_renderCropMask: function (boundingBox) {","		var node = this.get('cropMask');","		if (!node.inDoc()) {","			boundingBox.append(node);","		}","	},","","	_renderResizeKnob: function (boundingBox) {","		var node = this.get('resizeKnob');","		if (!node.inDoc()) {","			boundingBox.append(node);","		}","		node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');","	},","","	_renderResizeMask: function () {","		var node = this.get('resizeMask');","		if (!node.inDoc()) {","			this.get('resizeKnob').append(node);","		}","	},","","	_handleSrcChange: function (e) {","		this.get('contentBox').set('src', e.newVal);","		this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');","	},","	","	_syncResizeKnob: function () {","		var initialXY = this.get('initialXY');","		","		this.get('resizeKnob').setStyles({","			left: initialXY[0],","			top: initialXY[1],","			width: this.get('initWidth'),","			height: this.get('initHeight')","		});","	},","	","	_syncResizeMask: function () {","		var resizeKnob = this.get('resizeKnob');","		resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');","	},","	","	_syncResizeAttr: function (e) {","		if (this._resize) {","			this._resize.con.set(e.attrName, e.newVal);","		}","	},","	","	_icEventProxy: function (target, ns, eventType) {","		var sourceEvent = ns + ':' + eventType,","			resizeKnob = this.get('resizeKnob');","			","		target.on(sourceEvent, function (e) {","			","			var o = {","				width: resizeKnob.get('offsetWidth'),","				height: resizeKnob.get('offsetHeight'),","				left: resizeKnob.get('offsetLeft'),","				top: resizeKnob.get('offsetTop')","			};","			o[ns + 'Event'] = e;","			","			/**","			* @event resize:start","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event resize:resize","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event resize:end","			* @description Relay of the Resize utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:start","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:resize","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event drag:end","			* @description Relay of the Drag utility event.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			this.fire(sourceEvent, o);","			","			o.sourceEvent = sourceEvent;","			","			/**","			* @event crop:start","			* @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event crop:crop","			* @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			/**","			* @event crop:end","			* @description Fires at the end of a crop operation. Unifies drag:end and resize:end.","			* @param {EventFacade} event An Event Facade object with the following specific property added:","			* <dl>","			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>","			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>","			* <dt>width</dt><dd>The new width of the crop area.</dd>","			* <dt>height</dt><dd>The new height of the crop area.</dd>","			* </dl>","			* @type {CustomEvent}","			*/","			this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);","			","		}, this);","	},","	","	_bindArrows: function () {","		this._arrowHandler = this.get('resizeKnob').on('arrow', this._moveResizeKnob, this);","	},","	","	_unbindArrows: function () {","		if (this._arrowHandler) {","			this._arrowHandler.detach();","		}","	},","	","	_bindResize: function (resizeKnob, contentBox) {","		var resize = this._resize = new Y.Resize({","			node: resizeKnob","		});","		resize.on('resize:resize', this._syncResizeMask, this);","		resize.plug(Y.Plugin.ResizeConstrained, {","			constrain: contentBox,","			minHeight: this.get('minHeight'),","			minWidth: this.get('minWidth'),","			preserveRatio: this.get('preserveRatio')","		});","		YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));","	},","	","	_bindDrag: function (resizeKnob, contentBox) {","		var drag = this._drag = new Y.DD.Drag({","			node: resizeKnob,","			handles: [this.get('resizeMask')]","		});","		drag.on('drag:drag', this._syncResizeMask, this);","		drag.plug(Y.Plugin.DDConstrained, {","			constrain2node: contentBox","		});","		YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));","	},","	","	initializer: function () {","		this.set('initialXY', this.get('initialXY') || [10, 10]);","		this.set('initWidth', this.get('initWidth'));","		this.set('initHeight', this.get('initHeight'));","","		this.after('sourceChange', this._handleSrcChange);","		this.after('useKeysChange', this._toggleKeys);","		","		this._icHandlers = [];","		","		YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {","			this.after(attr + 'Change', this._syncResizeAttr);","		}, this);","	},","	","	renderUI: function () {","		var boundingBox = this.get('boundingBox');","		","		this._renderCropMask(boundingBox);","		this._renderResizeKnob(boundingBox);","		this._renderResizeMask();","	},","	","	bindUI: function () {","		var contentBox = this.get('contentBox'),","			resizeKnob = this.get('resizeKnob');","			","		this._icHandlers.push(","			resizeKnob.on('focus', this._attachKeyBehavior, this),","			resizeKnob.on('blur', this._detachKeyBehavior, this),","			resizeKnob.on('mousedown', resizeKnob.focus, resizeKnob)","		);","		","		this._bindArrows();","		","		this._bindResize(resizeKnob, contentBox);","		this._bindDrag(resizeKnob, contentBox);","	},","	","	syncUI: function () {","		this.get('contentBox').set('src', this.get('source'));","		","		this._syncResizeKnob();","		this._syncResizeMask();","	},","	","	/**","	 * Returns the coordinates needed to crop the image","	 * ","	 * @method getCropCoords","	 * @return {Object} The top, left, height, width and image url of the image being cropped","	 */","	getCropCoords: function () {","		var resizeKnob = this.get('resizeKnob'),","			result, xy;","		","		if (resizeKnob.inDoc()) {","			result = {","				left: resizeKnob.get('offsetLeft'),","				top: resizeKnob.get('offsetTop'),","				width: resizeKnob.get('offsetWidth'),","				height: resizeKnob.get('offsetHeight')","			};","		} else {","			xy = this.get('initialXY');","			result = {","				left: xy[0],","				top: xy[1],","				width: this.get('initWidth'),","				height: this.get('initHeight')","			};","		}","		result.image = this.get('source');","		","		return result;","	},","	","	/**","	 * Resets the crop element back to it's original position","	 * ","	 * @method reset","	 * @chainable","	 */","	reset: function () {","		var initialXY = this.get('initialXY');","		this.get('resizeKnob').setStyles({","			left: initialXY[0],","			top: initialXY[1],","			width: this.get('initWidth'),","			height: this.get('initHeight')","		});","		this._syncResizeMask();","		return this;","	},","	","	destructor: function () {","		if (this._resize) {","			this._resize.destroy();","		}","		if (this._drag) {","			this._drag.destroy();","		}","		","		YArray.each(this._icHandlers, function (handler) {","			handler.detach();","		});","		this._unbindArrows();","		","		this._drag = this._resize = null;","	}","	","}, {","","	NAME: 'imagecropper',","	","	/**","	 * Template that will contain the ImageCropper's mask.","	 *","	 * @property ImageCropper.CROP_MASK_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-mask]\">&lt;/div>","	 * @protected","	 * @static","	 */","	CROP_MASK_TEMPLATE: '<div class=\"' + _classNames.cropMask + '\"></div>',","	/**","	 * Template that will contain the ImageCropper's resize node.","	 *","	 * @property ImageCropper.RESIZE_KNOB_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-resize-knob]\" tabindex=\"0\">&lt;/div>","	 * @protected","	 * @static","	 */","	RESIZE_KNOB_TEMPLATE: '<div class=\"' + _classNames.resizeKnob + '\" tabindex=\"0\"></div>',","	/**","	 * Template that will contain the ImageCropper's resize mask.","	 *","	 * @property ImageCropper.RESIZE_MASK_TEMPLATE","	 * @type {HTML}","	 * @default &lt;div class=\"[...-resize-mask]\">&lt;/div>","	 * @protected","	 * @static","	 */","	RESIZE_MASK_TEMPLATE: '<div class=\"' + _classNames.resizeMask + '\"></div>',","	","	/**","	 * Array of events to relay from the Resize utility to the ImageCropper ","	 *","	 * @property ImageCropper.RESIZE_EVENTS","	 * @type {Array}","	 * @private","	 * @static","	 */","	RESIZE_EVENTS: ['start', 'resize', 'end'],","	/**","	 * Array of attributes to relay from the ImageCropper to the Resize utility ","	 *","	 * @property ImageCropper.RESIZE_ATTRS","	 * @type {Array}","	 * @private","	 * @static","	 */","	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],","	/**","	 * Array of events to relay from the Drag utility to the ImageCropper ","	 *","	 * @property ImageCropper.DRAG_EVENTS","	 * @type {Array}","	 * @private","	 * @static","	 */","	DRAG_EVENTS: ['start', 'drag', 'end'],","	","	HTML_PARSER: {","		","		source: function (srcNode) {","			return srcNode.get('src');","		},","		","		cropMask: '.' + _classNames.cropMask,","		resizeKnob: '.' + _classNames.resizeKnob,","		resizeMask: '.' + _classNames.resizeMask","		","	},","	","	/**","	 * Static property used to define the default attribute configuration of","	 * the Widget.","	 *","	 * @property ImageCropper.ATTRS","	 * @type {Object}","	 * @protected","	 * @static","	 */","	ATTRS: {","		","		/**","		 * The source attribute of the image we are cropping","		 *","		 * @attribute source","		 * @type {String}","		 */","		source: { value: '' },","		","		/**","		 * The resize mask used to highlight the crop area","		 *","		 * @attribute resizeMask","		 * @type {Node}","		 */","		resizeMask: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.resizeMask);","				}","				return node;","			},","","			valueFn: '_defResizeMaskValueFn'","		},","		","		/**","		 * The resized element","		 *","		 * @attribute resizeKnob","		 * @type {Node}","		 */","		resizeKnob: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.resizeKnob);","				}","				return node;","			},","","			valueFn: '_defResizeKnobValueFn'","		},","		","		/**","		 * Element used to shadow the part of the image we're not cropping","		 *","		 * @attribute cropMask","		 * @type {Node}","		 */","		cropMask: {","			setter: function (node) {","				node = Y.one(node);","				if (node) {","					node.addClass(_classNames.cropMask);","				}","				return node;","			},","","			valueFn: '_defCropMaskValueFn'","		},","		","		/**","		 * Array of the XY position that we need to set the crop element to when we build it","		 *","		 * @attribute initialXY","		 * @type {Array}","		 * @default [10, 10]","		 */","		initialXY: {","			validator: Lang.isArray","		},","		","		/**","		 * The pixel tick for the arrow keys","		 *","		 * @attribute keyTick","		 * @type {Number}","		 * @default 1","		 */","		keyTick: {","			value: 1,","			validator: isNumber","		},","		","		/**","		 * The pixel tick for shift + the arrow keys","		 *","		 * @attribute shiftKeyTick","		 * @type {Number}","		 * @default 10","		 */","		shiftKeyTick: {","			value: 10,","			validator: isNumber","		},","		","		/**","		 * Should we use the Arrow keys to position the crop element","		 *","		 * @attribute useKeys","		 * @type {Boolean}","		 * @default true","		 */","		useKeys: {","			value: true,","			validator: Lang.isBoolean","		},","		","		/**","		 * Show the Resize and Drag utilities status","		 *","		 * @attribute status","		 * @type {Boolean}","		 * @readOnly","		 */","		status: {","			readOnly: true,","			getter: function () {","				var resizing = this._resize ? this._resize.get('resizing') : false,","					drag = this._drag ? this._drag.get('dragging') : false;","				return resizing || drag;","			}","		},","		","		/**","		 * MinHeight of the crop area","		 *","		 * @attribute minHeight","		 * @type {Number}","		 * @default 50","		 */","		minHeight: {","			value: 50,","			validator: isNumber","		},","		","		/**","		 * MinWidth of the crop area","		 *","		 * @attribute minWidth","		 * @type {Number}","		 * @default 50","		 */","		minWidth: {","			value: 50,","			validator: isNumber","		},","		","		/**","		 * Set the preserveRatio config option of the Resize Utlility","		 *","		 * @attribute preserveRatio","		 * @type {Boolean}","		 * @default false","		 */","		preserveRatio: {","			value: false,","			validator: Lang.isBoolean","		},","		","		/**","		 * Set the initlal height of the crop area, defaults to minHeight","		 *","		 * @attribute initHeight","		 * @type {Number}","		 */","		initHeight: {","			value: 0,","			validator: isNumber,","			setter: function (value) {","				var minHeight = this.get('minHeight');","				return value < minHeight ? minHeight : value;","			}","		},","		","		/**","		 * Set the initlal width of the crop area, defaults to minWidth","		 *","		 * @attribute initWidth","		 * @type {Number}","		 */","		initWidth: {","			value: 0,","			validator: isNumber,","			setter: function (value) {","				var minWidth = this.get('minWidth');","				return value < minWidth ? minWidth : value;","			}","		}","		","	}","	","});","","Y.ImageCropper = ImageCropper;","","","","}, '@VERSION@' ,{skinnable:true, requires:['widget','dd-drag','dd-constrain','resize-base','resize-constrain','gallery-event-arrow']});"];
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"].lines = {"1":0,"3":0,"10":0,"42":0,"43":0,"45":0,"50":0,"51":0,"53":0,"58":0,"60":0,"83":0,"84":0,"85":0,"86":0,"88":0,"89":0,"90":0,"91":0,"93":0,"95":0,"103":0,"104":0,"105":0,"106":0,"108":0,"112":0,"116":0,"120":0,"124":0,"125":0,"126":0,"131":0,"132":0,"133":0,"135":0,"139":0,"140":0,"141":0,"146":0,"147":0,"151":0,"153":0,"162":0,"163":0,"167":0,"168":0,"173":0,"176":0,"178":0,"184":0,"240":0,"242":0,"280":0,"286":0,"290":0,"291":0,"296":0,"299":0,"300":0,"306":0,"310":0,"314":0,"315":0,"318":0,"322":0,"323":0,"324":0,"326":0,"327":0,"329":0,"331":0,"332":0,"337":0,"339":0,"340":0,"341":0,"345":0,"348":0,"354":0,"356":0,"357":0,"361":0,"363":0,"364":0,"374":0,"377":0,"378":0,"385":0,"386":0,"393":0,"395":0,"405":0,"406":0,"412":0,"413":0,"417":0,"418":0,"420":0,"421":0,"424":0,"425":0,"427":0,"429":0,"498":0,"534":0,"535":0,"536":0,"538":0,"552":0,"553":0,"554":0,"556":0,"570":0,"571":0,"572":0,"574":0,"637":0,"639":0,"689":0,"690":0,"704":0,"705":0,"713":0};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"].functions = {"ImageCropper:42":0,"_toggleKeys:49":0,"_moveResizeKnob:57":0,"_defCropMaskValueFn:111":0,"_defResizeKnobValueFn:115":0,"_defResizeMaskValueFn:119":0,"_renderCropMask:123":0,"_renderResizeKnob:130":0,"_renderResizeMask:138":0,"_handleSrcChange:145":0,"_syncResizeKnob:150":0,"_syncResizeMask:161":0,"_syncResizeAttr:166":0,"(anonymous 2):176":0,"_icEventProxy:172":0,"_bindArrows:285":0,"_unbindArrows:289":0,"_bindResize:295":0,"_bindDrag:309":0,"(anonymous 3):331":0,"initializer:321":0,"renderUI:336":0,"bindUI:344":0,"syncUI:360":0,"getCropCoords:373":0,"reset:404":0,"(anonymous 4):424":0,"destructor:416":0,"source:497":0,"setter:533":0,"setter:551":0,"setter:569":0,"getter:636":0,"setter:688":0,"setter:703":0,"(anonymous 1):1":0};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"].coveredLines = 124;
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js"].coveredFunctions = 36;
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 1);
YUI.add('gallery-imagecropper', function(Y) {

_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "(anonymous 1)", 1);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 3);
'use strict';
/**
 * @description <p>Creates an Image Cropper control.</p>
 * @requires widget, dd-drag, dd-constrain, resize-base, resize-constrain, gallery-event-arrow
 * @module gallery-imagecropper
 */

_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 10);
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
	};

/**
 * @constructor
 * @class ImageCropper
 * @description <p>Creates an Image Cropper control.</p>
 * @extends Widget
 * @param {Object} config Object literal containing configuration parameters.
*/
/**
 * The identity of the widget.
 *
 * @property ImageCropper.NAME
 * @type String
 * @default 'imagecropper'
 * @readOnly
 * @protected
 * @static
 */
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 42);
function ImageCropper() {
	_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "ImageCropper", 42);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 43);
ImageCropper.superclass.constructor.apply(this, arguments);
}
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 45);
Y.extend(ImageCropper, Y.Widget, {
	
	CONTENT_TEMPLATE: '<img/>',
	
	_toggleKeys: function (e) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_toggleKeys", 49);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 50);
if (e.newVal) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 51);
this._bindArrows();
		} else {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 53);
this._unbindArrows();
		}
	},
	
	_moveResizeKnob: function (e) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_moveResizeKnob", 57);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 58);
e.preventDefault(); // prevent scroll in Firefox
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 60);
var resizeKnob = this.get('resizeKnob'),
			contentBox = this.get('contentBox'),
			
			knobWidth = resizeKnob.get('offsetWidth'),
			knobHeight = resizeKnob.get('offsetHeight'),
		
			tick = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),
			direction = e.direction,
			
			tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,
			tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,
			
			x = resizeKnob.getX() + tickH,
			y = resizeKnob.getY() + tickV,
			
			minX = contentBox.getX(),
			minY = contentBox.getY(),
			
			maxX = minX + contentBox.get('offsetWidth') - knobWidth,
			maxY = minY + contentBox.get('offsetHeight') - knobHeight,
			
			o;
			
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 83);
if (x < minX) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 84);
x = minX;
		} else {_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 85);
if (x > maxX) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 86);
x = maxX;
		}}
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 88);
if (y < minY) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 89);
y = minY;
		} else {_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 90);
if (y > maxY) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 91);
y = maxY;
		}}
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 93);
resizeKnob.setXY([x, y]);
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 95);
o = {
			width: knobWidth,
			height: knobHeight,
			left: resizeKnob.get('offsetLeft'),
			top: resizeKnob.get('offsetTop'),
			sourceEvent: e.type
		};
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 103);
o[e.type + 'Event'] = e;
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 104);
this.fire('crop:start', o);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 105);
this.fire('crop:crop', o);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 106);
this.fire('crop:end', o);
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 108);
this._syncResizeMask();
	},
	
	_defCropMaskValueFn: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_defCropMaskValueFn", 111);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 112);
return Y.Node.create(ImageCropper.CROP_MASK_TEMPLATE);
	},

	_defResizeKnobValueFn: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_defResizeKnobValueFn", 115);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 116);
return Y.Node.create(ImageCropper.RESIZE_KNOB_TEMPLATE);
	},

	_defResizeMaskValueFn: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_defResizeMaskValueFn", 119);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 120);
return Y.Node.create(ImageCropper.RESIZE_MASK_TEMPLATE);
	},

	_renderCropMask: function (boundingBox) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_renderCropMask", 123);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 124);
var node = this.get('cropMask');
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 125);
if (!node.inDoc()) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 126);
boundingBox.append(node);
		}
	},

	_renderResizeKnob: function (boundingBox) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_renderResizeKnob", 130);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 131);
var node = this.get('resizeKnob');
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 132);
if (!node.inDoc()) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 133);
boundingBox.append(node);
		}
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 135);
node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');
	},

	_renderResizeMask: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_renderResizeMask", 138);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 139);
var node = this.get('resizeMask');
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 140);
if (!node.inDoc()) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 141);
this.get('resizeKnob').append(node);
		}
	},

	_handleSrcChange: function (e) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_handleSrcChange", 145);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 146);
this.get('contentBox').set('src', e.newVal);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 147);
this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');
	},
	
	_syncResizeKnob: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_syncResizeKnob", 150);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 151);
var initialXY = this.get('initialXY');
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 153);
this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
	},
	
	_syncResizeMask: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_syncResizeMask", 161);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 162);
var resizeKnob = this.get('resizeKnob');
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 163);
resizeKnob.setStyle('backgroundPosition', (-resizeKnob.get('offsetLeft')) + 'px ' + (-resizeKnob.get('offsetTop')) + 'px');
	},
	
	_syncResizeAttr: function (e) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_syncResizeAttr", 166);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 167);
if (this._resize) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 168);
this._resize.con.set(e.attrName, e.newVal);
		}
	},
	
	_icEventProxy: function (target, ns, eventType) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_icEventProxy", 172);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 173);
var sourceEvent = ns + ':' + eventType,
			resizeKnob = this.get('resizeKnob');
			
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 176);
target.on(sourceEvent, function (e) {
			
			_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "(anonymous 2)", 176);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 178);
var o = {
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight'),
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop')
			};
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 184);
o[ns + 'Event'] = e;
			
			/**
			* @event resize:start
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:resize
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event resize:end
			* @description Relay of the Resize utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:start
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:resize
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event drag:end
			* @description Relay of the Drag utility event.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 240);
this.fire(sourceEvent, o);
			
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 242);
o.sourceEvent = sourceEvent;
			
			/**
			* @event crop:start
			* @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:crop
			* @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			/**
			* @event crop:end
			* @description Fires at the end of a crop operation. Unifies drag:end and resize:end.
			* @param {EventFacade} event An Event Facade object with the following specific property added:
			* <dl>
			* <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
			* <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
			* <dt>width</dt><dd>The new width of the crop area.</dd>
			* <dt>height</dt><dd>The new height of the crop area.</dd>
			* </dl>
			* @type {CustomEvent}
			*/
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 280);
this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);
			
		}, this);
	},
	
	_bindArrows: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_bindArrows", 285);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 286);
this._arrowHandler = this.get('resizeKnob').on('arrow', this._moveResizeKnob, this);
	},
	
	_unbindArrows: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_unbindArrows", 289);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 290);
if (this._arrowHandler) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 291);
this._arrowHandler.detach();
		}
	},
	
	_bindResize: function (resizeKnob, contentBox) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_bindResize", 295);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 296);
var resize = this._resize = new Y.Resize({
			node: resizeKnob
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 299);
resize.on('resize:resize', this._syncResizeMask, this);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 300);
resize.plug(Y.Plugin.ResizeConstrained, {
			constrain: contentBox,
			minHeight: this.get('minHeight'),
			minWidth: this.get('minWidth'),
			preserveRatio: this.get('preserveRatio')
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 306);
YArray.each(ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));
	},
	
	_bindDrag: function (resizeKnob, contentBox) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "_bindDrag", 309);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 310);
var drag = this._drag = new Y.DD.Drag({
			node: resizeKnob,
			handles: [this.get('resizeMask')]
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 314);
drag.on('drag:drag', this._syncResizeMask, this);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 315);
drag.plug(Y.Plugin.DDConstrained, {
			constrain2node: contentBox
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 318);
YArray.each(ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));
	},
	
	initializer: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "initializer", 321);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 322);
this.set('initialXY', this.get('initialXY') || [10, 10]);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 323);
this.set('initWidth', this.get('initWidth'));
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 324);
this.set('initHeight', this.get('initHeight'));

		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 326);
this.after('sourceChange', this._handleSrcChange);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 327);
this.after('useKeysChange', this._toggleKeys);
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 329);
this._icHandlers = [];
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 331);
YArray.each(ImageCropper.RESIZE_ATTRS, function (attr) {
			_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "(anonymous 3)", 331);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 332);
this.after(attr + 'Change', this._syncResizeAttr);
		}, this);
	},
	
	renderUI: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "renderUI", 336);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 337);
var boundingBox = this.get('boundingBox');
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 339);
this._renderCropMask(boundingBox);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 340);
this._renderResizeKnob(boundingBox);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 341);
this._renderResizeMask();
	},
	
	bindUI: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "bindUI", 344);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 345);
var contentBox = this.get('contentBox'),
			resizeKnob = this.get('resizeKnob');
			
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 348);
this._icHandlers.push(
			resizeKnob.on('focus', this._attachKeyBehavior, this),
			resizeKnob.on('blur', this._detachKeyBehavior, this),
			resizeKnob.on('mousedown', resizeKnob.focus, resizeKnob)
		);
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 354);
this._bindArrows();
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 356);
this._bindResize(resizeKnob, contentBox);
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 357);
this._bindDrag(resizeKnob, contentBox);
	},
	
	syncUI: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "syncUI", 360);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 361);
this.get('contentBox').set('src', this.get('source'));
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 363);
this._syncResizeKnob();
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 364);
this._syncResizeMask();
	},
	
	/**
	 * Returns the coordinates needed to crop the image
	 * 
	 * @method getCropCoords
	 * @return {Object} The top, left, height, width and image url of the image being cropped
	 */
	getCropCoords: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "getCropCoords", 373);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 374);
var resizeKnob = this.get('resizeKnob'),
			result, xy;
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 377);
if (resizeKnob.inDoc()) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 378);
result = {
				left: resizeKnob.get('offsetLeft'),
				top: resizeKnob.get('offsetTop'),
				width: resizeKnob.get('offsetWidth'),
				height: resizeKnob.get('offsetHeight')
			};
		} else {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 385);
xy = this.get('initialXY');
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 386);
result = {
				left: xy[0],
				top: xy[1],
				width: this.get('initWidth'),
				height: this.get('initHeight')
			};
		}
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 393);
result.image = this.get('source');
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 395);
return result;
	},
	
	/**
	 * Resets the crop element back to it's original position
	 * 
	 * @method reset
	 * @chainable
	 */
	reset: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "reset", 404);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 405);
var initialXY = this.get('initialXY');
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 406);
this.get('resizeKnob').setStyles({
			left: initialXY[0],
			top: initialXY[1],
			width: this.get('initWidth'),
			height: this.get('initHeight')
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 412);
this._syncResizeMask();
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 413);
return this;
	},
	
	destructor: function () {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "destructor", 416);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 417);
if (this._resize) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 418);
this._resize.destroy();
		}
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 420);
if (this._drag) {
			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 421);
this._drag.destroy();
		}
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 424);
YArray.each(this._icHandlers, function (handler) {
			_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "(anonymous 4)", 424);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 425);
handler.detach();
		});
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 427);
this._unbindArrows();
		
		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 429);
this._drag = this._resize = null;
	}
	
}, {

	NAME: 'imagecropper',
	
	/**
	 * Template that will contain the ImageCropper's mask.
	 *
	 * @property ImageCropper.CROP_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	CROP_MASK_TEMPLATE: '<div class="' + _classNames.cropMask + '"></div>',
	/**
	 * Template that will contain the ImageCropper's resize node.
	 *
	 * @property ImageCropper.RESIZE_KNOB_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-knob]" tabindex="0">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_KNOB_TEMPLATE: '<div class="' + _classNames.resizeKnob + '" tabindex="0"></div>',
	/**
	 * Template that will contain the ImageCropper's resize mask.
	 *
	 * @property ImageCropper.RESIZE_MASK_TEMPLATE
	 * @type {HTML}
	 * @default &lt;div class="[...-resize-mask]">&lt;/div>
	 * @protected
	 * @static
	 */
	RESIZE_MASK_TEMPLATE: '<div class="' + _classNames.resizeMask + '"></div>',
	
	/**
	 * Array of events to relay from the Resize utility to the ImageCropper 
	 *
	 * @property ImageCropper.RESIZE_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_EVENTS: ['start', 'resize', 'end'],
	/**
	 * Array of attributes to relay from the ImageCropper to the Resize utility 
	 *
	 * @property ImageCropper.RESIZE_ATTRS
	 * @type {Array}
	 * @private
	 * @static
	 */
	RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],
	/**
	 * Array of events to relay from the Drag utility to the ImageCropper 
	 *
	 * @property ImageCropper.DRAG_EVENTS
	 * @type {Array}
	 * @private
	 * @static
	 */
	DRAG_EVENTS: ['start', 'drag', 'end'],
	
	HTML_PARSER: {
		
		source: function (srcNode) {
			_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "source", 497);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 498);
return srcNode.get('src');
		},
		
		cropMask: '.' + _classNames.cropMask,
		resizeKnob: '.' + _classNames.resizeKnob,
		resizeMask: '.' + _classNames.resizeMask
		
	},
	
	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property ImageCropper.ATTRS
	 * @type {Object}
	 * @protected
	 * @static
	 */
	ATTRS: {
		
		/**
		 * The source attribute of the image we are cropping
		 *
		 * @attribute source
		 * @type {String}
		 */
		source: { value: '' },
		
		/**
		 * The resize mask used to highlight the crop area
		 *
		 * @attribute resizeMask
		 * @type {Node}
		 */
		resizeMask: {
			setter: function (node) {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "setter", 533);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 534);
node = Y.one(node);
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 535);
if (node) {
					_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 536);
node.addClass(_classNames.resizeMask);
				}
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 538);
return node;
			},

			valueFn: '_defResizeMaskValueFn'
		},
		
		/**
		 * The resized element
		 *
		 * @attribute resizeKnob
		 * @type {Node}
		 */
		resizeKnob: {
			setter: function (node) {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "setter", 551);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 552);
node = Y.one(node);
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 553);
if (node) {
					_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 554);
node.addClass(_classNames.resizeKnob);
				}
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 556);
return node;
			},

			valueFn: '_defResizeKnobValueFn'
		},
		
		/**
		 * Element used to shadow the part of the image we're not cropping
		 *
		 * @attribute cropMask
		 * @type {Node}
		 */
		cropMask: {
			setter: function (node) {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "setter", 569);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 570);
node = Y.one(node);
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 571);
if (node) {
					_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 572);
node.addClass(_classNames.cropMask);
				}
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 574);
return node;
			},

			valueFn: '_defCropMaskValueFn'
		},
		
		/**
		 * Array of the XY position that we need to set the crop element to when we build it
		 *
		 * @attribute initialXY
		 * @type {Array}
		 * @default [10, 10]
		 */
		initialXY: {
			validator: Lang.isArray
		},
		
		/**
		 * The pixel tick for the arrow keys
		 *
		 * @attribute keyTick
		 * @type {Number}
		 * @default 1
		 */
		keyTick: {
			value: 1,
			validator: isNumber
		},
		
		/**
		 * The pixel tick for shift + the arrow keys
		 *
		 * @attribute shiftKeyTick
		 * @type {Number}
		 * @default 10
		 */
		shiftKeyTick: {
			value: 10,
			validator: isNumber
		},
		
		/**
		 * Should we use the Arrow keys to position the crop element
		 *
		 * @attribute useKeys
		 * @type {Boolean}
		 * @default true
		 */
		useKeys: {
			value: true,
			validator: Lang.isBoolean
		},
		
		/**
		 * Show the Resize and Drag utilities status
		 *
		 * @attribute status
		 * @type {Boolean}
		 * @readOnly
		 */
		status: {
			readOnly: true,
			getter: function () {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "getter", 636);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 637);
var resizing = this._resize ? this._resize.get('resizing') : false,
					drag = this._drag ? this._drag.get('dragging') : false;
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 639);
return resizing || drag;
			}
		},
		
		/**
		 * MinHeight of the crop area
		 *
		 * @attribute minHeight
		 * @type {Number}
		 * @default 50
		 */
		minHeight: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * MinWidth of the crop area
		 *
		 * @attribute minWidth
		 * @type {Number}
		 * @default 50
		 */
		minWidth: {
			value: 50,
			validator: isNumber
		},
		
		/**
		 * Set the preserveRatio config option of the Resize Utlility
		 *
		 * @attribute preserveRatio
		 * @type {Boolean}
		 * @default false
		 */
		preserveRatio: {
			value: false,
			validator: Lang.isBoolean
		},
		
		/**
		 * Set the initlal height of the crop area, defaults to minHeight
		 *
		 * @attribute initHeight
		 * @type {Number}
		 */
		initHeight: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "setter", 688);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 689);
var minHeight = this.get('minHeight');
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 690);
return value < minHeight ? minHeight : value;
			}
		},
		
		/**
		 * Set the initlal width of the crop area, defaults to minWidth
		 *
		 * @attribute initWidth
		 * @type {Number}
		 */
		initWidth: {
			value: 0,
			validator: isNumber,
			setter: function (value) {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", "setter", 703);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 704);
var minWidth = this.get('minWidth');
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 705);
return value < minWidth ? minWidth : value;
			}
		}
		
	}
	
});

_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-imagecropper\build_tmp\gallery-imagecropper.js", 713);
Y.ImageCropper = ImageCropper;



}, '@VERSION@' ,{skinnable:true, requires:['widget','dd-drag','dd-constrain','resize-base','resize-constrain','gallery-event-arrow']});
