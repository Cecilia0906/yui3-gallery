function PopoverPlugin(config) {
	PopoverPlugin.superclass.constructor.apply(this, arguments);
	var node = config.host;

	if (!config.title) {
		config.title = node.getData('title');
	}
	if (!config.content) {
		config.content = node.getData('content');
	}
}
Y.extend(PopoverPlugin, TooltipPlugin, {
	_renderUI: function () {
		var config = this._config;
		this._widget = new Y.Popover({
			headerContent: config.title,
			bodyContent: config.content,
			visible: false,
			render: true
		});
	},
	destructor: function () {
	}
});

Y.Plugin.Popover = PopoverPlugin;