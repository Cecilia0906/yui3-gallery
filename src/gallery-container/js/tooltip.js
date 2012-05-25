function TooltipBase() {
	this._arrowNode = Y.Node.create(this.ARROW_TEMPLATE);
}
TooltipBase.prototype = {
	ARROW_TEMPLATE: '<div class="yui3-tooltip-arrow"></div>',
	_alignOnVisible: function (e) {
		if (e.newVal) {
			this.align();
		}
	},
	initializer: function () {
		this._arrowNode = Y.Node.create(this.ARROW_TEMPLATE);
		this.after({
			htmlChange: this._syncHTML,
			visibleChange: this._alignOnVisible
		});
	},
	renderUI: function () {
		this.get('boundingBox').prepend(this._arrowNode);
	}
};

Y.Tooltip = Y.Base.create('tooltip', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain, TooltipBase], {
	ARROW_TEMPLATE: '<div class="yui3-tooltip-arrow"></div>',
	
	_syncHTML: function (e) {
		this.get('contentBox').setHTML(e.newVal);
	},
	initializer: function () {
		this.after('htmlChange', this._syncHTML);
	}
}, {
	Base: TooltipBase,
	HTML_PARSER: {
		html: function (srcNode) {
			return srcNode.getHTML();
		}
	},
	ATTRS: {
		html: {
			//validator: check for unsafe stuff?
			value: ''
		}
	}
});