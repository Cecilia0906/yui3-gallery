
function PopoverPlugin(config) {
	this.init.apply(this, arguments);
}
PopoverPlugin.NS = 'popover';

Y.mix(PopoverPlugin.prototype, {
	dataAttrs: {
		content: 'content',
		title: 'original-title'
	},
	defaults: {
		placement: 'right',
		animation: true
	},
	init: function (config) {
		var node = config.host,
			points,
			popover,
			classNames;
		
		Y.Object.each(this.dataAttrs, function (dataAttr, attrName) {
			if (!config[attrName]) {
				config[attrName] = node.getData(dataAttr);
			}
		});
		Y.mix(config, this.defaults);
		
		classNames = [config.placement];
			
		switch (config.placement) {
			case 'top':
				points = ['bc', 'tc'];
				break;
			case 'bottom':
				points = ['tc', 'bc'];
				break;
			case 'left':
				points = ['rc', 'lc'];
				break;
			default:
				points = ['lc', 'rc'];
		}
		
		if (config.animation) {
			classNames.push('fade');
		}
		
		popover = new Y.Bootstrap.Widgets.Popover({
			classNames: classNames,
			headerContent: config.title,
			bodyContent: config.content,
			align: {
				node: node,
				points: points
			},
			visible: false
		});
		popover.getClassName = this._getClassName;
		popover.render();
			
		this._widget = popover;
		
		this._inHandle = node.on('mouseover', this.show, this);
		this._outHandle = node.on('mouseout', this.hide, this);
	},
	_getClassName: function (className) {
		var newClassName = '';
		switch (className) {
			case 'content':
				newClassName = [this._cssPrefix, 'inner'].join('-');
				break;
			case 'arrow':
				newClassName = 'arrow';
				break;				
			default:
				newClassName = Y.Bootstrap.Widgets.Popover.superclass.getClassName.apply(this, arguments);
		}
		return newClassName;
	},
	show: function () {
		this._widget.show();
		return this;
	},
	hide: function () {
		this._widget.hide();
		return this;
	},
	toggle: function () {
		this._widget.toggleView();
		return this;
	},
	destroy: function () {
		this._inHandle.detach();
		this._outHandle.detach();
		this._widget.destroy();
	}
});

Y.namespace('Bootstrap').Popover = PopoverPlugin;
