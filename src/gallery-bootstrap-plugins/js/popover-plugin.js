function PopoverPlugin() {
	PopoverPlugin.superclass.constructor.apply(this, arguments);
}
Y.extend(PopoverPlugin, Y.Bootstrap.Tooltip, {
	dataAttrs: {
		title: 'original-title',
		content: 'content'
	},
	defaults: {
		animation: true,
		placement: 'right',
		trigger: 'hover',
		title: '',
		content: '',
		delay: 0
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
				points = ['rc', 'lc'];
				break;
			default:
				points = ['lc', 'rc'];
		}

		this._widget = new widgets.Popover({
			classNames: [config.placement],
			headerContent: config.title,
			bodyContent: config.content,
			animation: config.animation,
			align: {
				node: config.host,
				points: points
			},
			visible: false,
			render: true
		});
	}
}, {
	NS: 'popover'
});

BS.Popover = PopoverPlugin;