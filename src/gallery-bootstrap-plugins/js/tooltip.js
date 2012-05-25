var BS = Y.namespace('Bootstrap'),
	widgets = Y.namespace('Bootstrap.widgets');

widgets.Tooltip = Y.Base.create('tooltip', Y.Tooltip, [], {
	ARROW_TEMPLATE: '<div class="tooltip-arrow"></div>',

	_syncBoxDisplay: function (e) {
		this.get('boundingBox').setStyle('display', e.newVal ? 'block' : '');
	},
	_setVisibleClassName: function (e) {
		this.get('boundingBox').toggleClass('in', e.newVal);
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
		this.after({
			visibleChange: this._setVisibleClassName,
			animationChange: this._uiSetAnimation
		});
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