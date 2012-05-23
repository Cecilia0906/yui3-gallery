Y.Widget.ATTRS.classNames = {
	valueFn: function () {
		return [];
	}
};

Y.mix(Y.Widget.prototype, {
	_addExtraClassNames: function () {
		var boundingBox = this.get('boundingBox');
		Y.Array.each(this.get('classNames'), function (className) {
			boundingBox.addClass(className);
		}, this);
	},
	_renderUI: function() {
		this._renderBoxClassNames();
		this._addExtraClassNames();
		this._renderBox(this._parentNode);
	},
	toggleView: function (visible) {
		return this.set('visible', Y.Lang.isBoolean(visible) ? visible : !this.get('visible'));
	}
}, true);