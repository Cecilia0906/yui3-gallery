/**
A Plugin which provides Expandable behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

@module gallery-bootstrap-collapsed
**/

/**
A Plugin which provides Expandable behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

It possible to have dynamic behaviors without incorporating any
JavaScript by setting <code>data-toggle=collapse</code> on any element.

However, it can be manually plugged into any node or node list.

@example

    var node = Y.one('.someNode');
    node.plug( Y.Bootstrap.Collapse, config );

    node.collapse.show();

@class Bootstrap.Collapse
**/

function CollapsiblePlugin(config) {
    CollapsiblePlugin.superclass.constructor.apply(this, arguments);
}

CollapsiblePlugin.NAME = 'Bootstrap.Collapse';
CollapsiblePlugin.NS   = 'expandable';

Y.extend(CollapsiblePlugin, Y.Plugin.Base, {
    defaults : {
        duration  : 0.25,
        easing    : 'ease-in',
        showClass : 'in',
        hideClass : 'out',

        groupSelector : '> .accordion-group > .in'
    },

    transitioning: false,

    initializer : function(config) {
        this._node = config.host;

        this.config = Y.mix( config, this.defaults );

		this.after('collapsedChange', this._syncExpandedState);
        this._node.on('click', this._uiOnHostClicked, this);
    },

    _getTarget: function() {
        var node = this._node,
            container;

        Y.log('_getTarget for node: ' + node, 'debug', 'Bootstrap.Collapse');
        Y.log('fetching collapse target, looking at data-target: ' + node.getData('target'), 'debug', 'Bootstrap.Collapse');
        if ( node.getData('target') ) {
            container = Y.one( node.getData('target') );
        }
        else if ( node.getAttribute('href').indexOf('#') >= 0 ) {
            Y.log('No target, looking at href: ' + node.getAttribute('href'), 'debug', 'Bootstrap.Collapse');
            container = Y.one( node.getAttribute('href').substr( node.getAttribute('href').indexOf('#') ) );
        }
        return container;
    },
    
    _uiOnHostClicked: function (e) {
    	e.preventDefault();
    	if (!this.transition) {
	    	this.toggle();
    	}
    },
    
    show: function() {
    	return this.set('collapsed', false);
    },
    hide: function() {
    	return this.set('collapsed', true);
    },
    toggle: function(collapsed) {
    	return this.set('collapsed', Y.Lang.isBoolean(collapsed) ? collapsed : !this.get('collapsed'));
    },
    
    _syncExpandedState: function(e) {
    	this._transition(this._getTarget(), e.newVal);
    },

    /**
    @method _transition
    @description Handles the transition between showing and hiding.
    @protected
    @param node {Node} node to apply transitions to
    @param collapsed {Boolean} new state
    **/
    _transition : function(node, collapsed) {
        var self        = this,
            config      = this.config,
            duration    = config.duration,
            easing      = config.easing,
            // If we are hiding, then remove the show class.
            removeClass = collapsed ? config.showClass : config.hideClass,
            // And if we are hiding, add the hide class.
            addClass    = collapsed ? config.hideClass : config.showClass,

            to_height   = collapsed ? 0 : null,
            event       = collapsed ? 'hidden' : 'shown',

            complete = function() {
                node.removeClass(removeClass).addClass(addClass);
                self.transitioning = false;
                self.fire( event );
            };

        if ( to_height === null ) {
            to_height = 0;
            node.all('> *').each(function(el) {
                to_height += el.get('scrollHeight');
            });
        }

		// Ideally we'd do node.stop() instead of this
        this.transitioning = true;

        node.transition({
            height   : to_height +'px',
            duration : duration,
            easing   : easing
        }, complete);
    }

}, {
	ATTRS: {
		collapsed: {
			valueFn: function () {
				return this._getTarget().hasClass(this.config.hideClass);
			}
		}
	}
});

NS.Collapse = CollapsiblePlugin;