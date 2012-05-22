Y.Tooltip = Y.Base.create('tooltip', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain], {
	_syncHTML: function (e) {
		this.get('contentBox').setHTML(e.newVal);
	},
	_syncAnimationClass: function (e) {
		this.get('boundingBox').toggleClass(this.getClassName('fade'), e.newVal);
	},
	initializer: function () {
		this.after({
			htmlChange: this._syncHTML,
			animateChange: this._syncAnimationClass
		});
	},
	syncUI: function () {
		this._syncAnimationClass({ newVal: this.get('animation') });
	}
}, {
	HTML_PARSER: {
		html: function (srcNode) {
			return srcNode.getHTML();
		}
	},
	ATTRS: {
		html: {
			//validator: check for unsafe stuff?
			value: ''
		},
		animation: {
			value: false,
			validator: Y.Lang.isBoolean
		}
	}
});