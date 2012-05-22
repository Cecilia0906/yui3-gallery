Y.Tooltip.prototype.getClassName = function () {
	return Y.Array(arguments).join('-');
};

function TooltipPlugin(config) {
	Y.mix(config, TooltipPlugin.defaults);
	
	var node = config.host,
		points,
		useFocus = config.trigger === 'focus',
		inEvent = useFocus ? 'focus' : 'mouseover',
		outEvent = useFocus ? 'blur' : 'mouseout';
		
	switch (config.placement) {
		case 'bottom':
			points = ['tc', 'bc'];
			break;
		case 'left':
			points = ['rc', 'lc'];
			break;
		case 'right':
			points = ['lc', 'rc'];
			break;
		default:
			points = ['bc', 'tc'];
	}
	
	this._tooltip = new Y.Tooltip({
		animation: config.animation,
		align: {
			node: node,
			points: points
		}
	}).render();
	
	this._inHandler = node.on(inEvent, this.show, this);
	this._outHandler = node.on(outEvent, this.hide, this);
}
TooltipPlugin.defaults = {};
Y.mix(TooltipPlugin.prototype, {
	show: function () {
		this._plugin.show();
	},
	hide: function () {
		this._plugin.hide();
	},
	toggle: function () {
		var tooltip = this._tooltip;
		tooltip.set('visible', !tooltip.get('visible'));
	},
	destructor: function () {
		this._inHandler.detach();
		this._outHandler.detach();
	}
});
