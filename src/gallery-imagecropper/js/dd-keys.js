/**
@description A Plugin for enabling keyboard support in a Drag instance
@requires plugin, gallery-event-arrow
@module dd-keys
*/

/**
Enables keyboard support in a Drag instance

@constructor
@class Plugin.DDKeys
@extends Plugin.Base
@param {Object} config Object literal containing configuration parameters
*/
function DDKeys() {
    DDKeys.superclass.constructor.apply(this, arguments);
}
Y.extend(DDKeys, Y.Plugin.Base, {
    initializer: function () {
        var node = this.get('host').get('node');
        
        this._handler = node.on({
            mousedown: node.focus,
            keypress: Y.bind(this._onKey, this)
        });
    },
    destructor: function () {
        this._handler.detach();
        this._handler = null;
    },
    _onKey: function (e) {
        console.log(e);
    },
    /**
    @method _onArrow
    @param {EventFacade} e
    @private
    */
    _onArrow: function (e) {
        var host = this.get('host'),
            direction = e.direction,
            delta = e.shiftKey ? this.get('shiftKeyTick') : this.get('keyTick'),
            xy = host.get('node').getXY();
        
        if (direction.indexOf('n') > -1) {
            xy[1] -= delta;
        } else if (direction.indexOf('s') > -1) {
            xy[1] += delta;
        }
        if (direction.indexOf('w') > -1) {
            xy[0] -= delta;
        } else if (direction.indexOf('e') > -1) {
            xy[0] += delta;
        }
        
        host._alignNode(xy);
    }
});

/**
Plugin namespace

@property NS
@type {String}
@default 'keys'
@static
*/
DDKeys.NS = 'keys';

Y.Plugin.DDKeys = DDKeys;