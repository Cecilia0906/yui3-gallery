var BS = Y.namespace('Bootstrap'),
	widgets = Y.namespace('Bootstrap.widgets');

function BootstrapWidget() {

}
BootstrapWidget.prototype = {
	_uiSetVisible: function (val) {
		this.get('boundingBox').toggleClass('in', val);
	}
};

widgets.Tooltip = Y.Base.create('tooltip', Y.Tooltip, [BootstrapWidget], {
	ARROW_TEMPLATE: '<div class="tooltip-arrow"></div>',

	_syncBoxDisplay: function (e) {
		var boundingBox = this.get('boundingBox');
		if (e.newVal) {
			boundingBox.setStyle('display', 'block');
		} else if (!Y.support.transitions || !this.get('animation')) {
			boundingBox.setStyle('display', '');
		}
	},
	_uiSetAnimation: function (e) {
		this.get('boundingBox').toggleClass('fade', e.newVal);
	},
	_renderBoxClassNames: function () {
		this.get('boundingBox').addClass(this.constructor.CSS_PREFIX || Y.ClassNameManager.getClassName(Y.Widget.NAME.toLowerCase()));
		this.get('contentBox').addClass(this.getClassName('inner'));
	},
	
	initializer: function () {
		this.on('visibleChange', this._syncBoxDisplay);
		this.after('animationChange', this._uiSetAnimation);
	},
	renderUI: function () {
		widgets.Tooltip.superclass.renderUI.apply(this, arguments);
		this._uiSetAnimation({ newVal: this.get('animation') });
	}
}, {
	CSS_PREFIX: 'tooltip',
	ATTRS: {
		animation: {
			value: true
		}
	}
});