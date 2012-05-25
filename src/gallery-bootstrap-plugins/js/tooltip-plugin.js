var CAMEL_VENDOR_PREFIX = '',
	DOCUMENT = Y.config.doc,
    DOCUMENT_ELEMENT = 'documentElement',
    TRANSITION_CAMEL = 'Transition',
	VENDORS = [
        'Webkit',
        'Moz'
    ],
    VENDOR_TRANSITION_END = {
        Webkit: 'webkitTransitionEnd'
    },
	TRANSITION_END = 'transitionEnd';

Y.Array.each(VENDORS, function(val) { // then vendor specific
    var property = val + TRANSITION_CAMEL;
    if (property in DOCUMENT[DOCUMENT_ELEMENT].style) {
        CAMEL_VENDOR_PREFIX = val;
    }
});

TRANSITION_END = VENDOR_TRANSITION_END[CAMEL_VENDOR_PREFIX] || TRANSITION_END;

Y.Node.DOM_EVENTS[TRANSITION_END] = 1;

function TooltipPlugin(config) {
	TooltipPlugin.superclass.constructor.apply(this, arguments);
	this._delay = config.delay;
}
Y.extend(TooltipPlugin, Y.Bootstrap.Base, {
	dataAttrs: {
		title: 'title'
	},
	defaults: {
		animation: true,
		placement: 'right',
		trigger: 'hover',
		title: '',
		delay: 0
	},
	_cancel: function () {
		this._timeout.cancel();
		this._timeout = null;
	},
	_uiShowOnTrigger: function () {
		var delay = this._delay;
		if (this._timeout) {
			this._cancel();
		}
		if (typeof delay === 'number' && delay > 0) {
			this._timeout = Y.later(delay, this, this.show);
		} else {
			this.show();
		}
	},
	_transitionEnd: function () {
		this.fire(this._widget.get('visible') ? 'shown' : 'hidden');
	},

	hide: function () {
		if (this._timeout) {
			this._cancel();
		}
		return TooltipPlugin.superclass.hide.call(this);
	},
	_renderUI: function (config) {
		var points;
		switch (config.placement) {
			case 'top':
				points = ['tc', 'bc'];
				break;
			case 'bottom':
				points = ['bc', 'tc'];
				break;
			case 'left':
				points = ['lc', 'rc'];
				break;
			default:
				points = ['rc', 'lc'];
		}

		this._widget = new Y.Bootstrap.widgets.Tooltip({
			classNames: [config.placement],
			animation: config.animation,
			html: config.title,
			align: {
				node: config.host,
				points: points
			},
			visible: false,
			render: true
		});
		this._node.set('title', '');
	},
	_bindUI: function (config) {
		var node = this._node,
			handles = this._handles;
		if (config.trigger === 'hover') {
			handles.push(
				node.on('hover', Y.bind(this._uiShowOnTrigger, this), Y.bind(this.hide, this))
			);
		} else {
			handles.push(
				node.on('focus', this._uiShowOnTrigger, this),
				node.on('blur', this.hide, this)
			);
		}
		if (config.animation) {
			handles.push(
				this._widget.get('boundingBox').on(TRANSITION_END, this._transitionEnd, this)
			);
		}
	},
	destructor: function () {
		this._node.set('title', this._widget.get('html'));
	}
}, {
	NS: 'tooltip'
});

BS.Tooltip = TooltipPlugin;