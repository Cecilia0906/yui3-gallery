function PluginBase(config) {
	PluginBase.superclass.constructor.apply(this);
	var node = config.host,
		attrName;

	for (attrName in this.dataAttrs) {
		if (this.dataAttrs.hasOwnProperty(attrName) && !config.hasOwnProperty('attrName')) {
			config[attrName] = node.getData(this.dataAttrs[attrName]);
		}
	}
	Y.mix(config, this.defaults);

	this._node = node;
	this._handles = [];

	this.publish('show', {
		emitFacade: true,
		defaultFn: this._show
	});
	this.publish('hide', {
		emitFacade: true,
		defaultFn: this._hide
	});

	this._renderUI(config);
	this._bindUI(config);
}
Y.extend(PluginBase, Y.EventTarget, {
	defaults: {},
	dataAttrs: {},

	_renderUI: function () {},
	_bindUI: function () {},
	_show: function () {
		this._widget.show();
	},
	show: function () {
		return this.fire('show');
	},
	_hide: function () {
		this._widget.hide();
	},
	hide: function () {
		return this.fire('hide');
	},
	toggle: function () {
		return this.fire(this._widget.get('visible') ? 'hide' : 'show');
	},
	destructor: function () {},
	destroy: function () {
		var i = 0, length = this._handles.length;
		this.destructor();

		for (; i < length; i++) {
			this._handles[i].detach();
		}
		this._handles = this._widget = this._node = null;
	}
});

BS.Base = PluginBase;