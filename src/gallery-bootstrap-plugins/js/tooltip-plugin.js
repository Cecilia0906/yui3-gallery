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
	_notifyVisibility: function (e) {
		this.fire(e.newVal ? 'shown' : 'hidden');
	},
	_transitionEnd: function () {
		this._notifyVisibility({ newVal: this._widget.get('visible') });
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
		if (config.animation && Y.support.transitions) {
			handles.push(
				this._widget.get('boundingBox').on('transitionend', this._transitionEnd, this)
			);
		} else {
			this._widget.after('visibleChange', this._notifyVisibility, this);
		}
	},
	destructor: function () {
		this._node.set('title', this._widget.get('html'));
	}
}, {
	NS: 'tooltip'
});

BS.Tooltip = TooltipPlugin;