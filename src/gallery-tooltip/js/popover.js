Y.Popover = Y.Base.create('popover', Y.Widget, [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain, Y.WidgetStdMod], {
	
	ARROW_TEMPLATE: '<div></div>',
	
	initializer: function () {
		this.after('visibleChange', function () {
			this.align();
		}, this);
	},
	
	renderUI: function () {
		this._arrowNode = Y.Node.create(this.ARROW_TEMPLATE).addClass(this.getClassName('arrow'));
		this.get('boundingBox').prepend(this._arrowNode);
	},
	
	_getStdModTemplate: function (section) {
		var templates = this.constructor.TEMPLATES || Y.WidgetStdMod.TEMPLATES;
		return Y.Node.create(templates[section], this._stdModNode.get('ownerDocument'));
	}
});

Y.namespace('Bootstrap.Widgets').Popover = Y.Base.create('popover', Y.Popover, [], {
	initializer: function () {
		this.on('visibleChange', this._setBBDisplay);
		this.after('visibleChange', this._setVisibleClass);
	},
	_setBBDisplay: function (e) {
		this.get('boundingBox').setStyle('display', e.newVal ? 'block' : '');
	},
	_setVisibleClass: function (e) {
		this.get('boundingBox').toggleClass('in', e.newVal);
	}
}, {
	TEMPLATES: {
		header: '<h3 class="popover-title"></h3>',
		body: '<div class="popover-content"></div>',
		footer: '<div class="popover-footer"></div>'
	},
	CSS_PREFIX: 'popover'
});