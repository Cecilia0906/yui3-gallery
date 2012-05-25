Y.WidgetStdMod.prototype._getStdModTemplate = function(section) {
	var templates = this.TEMPLATES || Y.WidgetStdMod.TEMPLATES;
    return Y.Node.create(templates[section], this._stdModNode.get('ownerDocument'));
};

widgets.Popover = Y.Base.create('popover', widgets.Tooltip, [Y.WidgetStdMod], {
	ARROW_TEMPLATE: '<div class="arrow"></div>',
	TEMPLATES: {
        header : '<h3 class="popover-title"></h3>',
        body : '<div class="popover-content"></div>',
        footer : '<div class="popover-footer"></div>'
    }
}, {
	CSS_PREFIX: 'popover'
});