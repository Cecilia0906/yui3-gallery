
	/**
	 * A deferred plugin for Node that has methods for dealing with asynchronous calls such as transition()
	 * @class Node.Deferred
	 * @constructor
	 * @extends Deferred
	 * @param {Object} config An object literal containing plugin configuration
	 */
	function NodeDeferred(config) {
		NodeDeferred.superclass.constructor.apply(this, arguments);
		this.host = config.host;
	}
	
	if (Y.Node && Y.Plugin) {
		Y.extend(NodeDeferred, Y.Deferred, null, {
			/**
			 * Plugin namespace
			 * @property {String} NS
			 * @default 'deferred'
			 * @static
			 */
			NS: 'deferred',
			
			/**
			 * Imports a method from Y.Node so that they return instances of this same plugin representing promises
			 * @method importMethod
			 * @param {String} method Name of the method to import from Y.Node
			 * @static
			 */
			importMethod: function (method) {
				NodeDeferred.prototype[method] = function () {
					// this.host[NS] === this means this is the first time the plugin is instanciated and plugged
					// in that case it should be resolved, because it doesn't represent any promises yet
					if (this.host.deferred === this) {
						this.resolve();
					}
					
					if (this.host[method]) {
						var args = Y.Array(arguments),
							deferred,
							callback;
							
						if (Y.Lang.isFunction(args[args.length - 1])) {
							callback = args.pop();
						}
						
						deferred = this.defer(function (promise) {
							this.host[method].apply(this.host, args.concat([Y.bind(promise.resolve, promise)]));
						});
						if (callback) {
							deferred.done(callback);
						}
						return deferred;
						
					} else {
						if (Y.instanceOf(this.host, Y.NodeList) && method == 'load') {
							Y.error('NodeList doesn\'t have a ' + method + '() method');
						} else {
							Y.error('Missing required module for ' + method);
						}
					}
					return this;
				};
			}
		});
		
		Y.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.importMethod);
		
		Y.Node.Deferred = NodeDeferred;
	}
