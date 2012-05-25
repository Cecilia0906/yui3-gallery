function ContainerPlugin(config) {
	this._config = config;
	this._node = config.host;
	this._renderUI(config);
	this._bindUI(config);
}
Y.mix(ContainerPlugin.prototype, {
	_show: function () {
		this._widget.show();
	},
	show: function () {
		var delay = this._delay;
		if (typeof delay === 'number' && delay > 0) {
			this._timeout = Y.later(delay, this, this._show);
		} else {
			this._show();
		}
		return this;
	},
	hide: function () {
		if (this._timeout) {
			this._timeout.cancel();
			this._timeout = null;
		}
		this._widget.hide();
		return this;
	},
	toggle: function () {
		this._widget.toggleView();
		return this;
	},
	destructor: function () {},
	destroy: function () {
		var i = 0, length = this._handles.length;

		this.hide();
		this.destructor();

		for (; i < length; i++) {
			this._handles[i].detach();
		}
		this._widget.destroy();
		this._widget = this._config = this._node = this._handles = null;
	}
});

function TooltipPlugin() {
	TooltipPlugin.superclass.constructor.apply(this, arguments);
}
Y.extend(TooltipPlugin, ContainerPlugin, {
	_renderUI: function () {
		var node = this._node;
		this._widget = new Y.Tooltip({
			html: node.get('title'),
			visible: false,
			render: true
		});
		node.set('title', '');
	},
	_bindUI: function () {
		this._handles.push(
			this._node.on('hover', Y.bind(this.show, this), Y.bind(this.hide, this))
		);
	},
	destructor: function () {
		this._node.set('title', this._widget.get('html'));
	}
});

Y.Plugin.Tooltip = TooltipPlugin;