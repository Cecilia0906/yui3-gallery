YUI.add('gallery-deferred', function(Y) {

/*
 * Copyright (c) 2011, Juan Ignacio Dopazo. All rights reserved.
 * Code licensed under the BSD License
 * http://yuilibrary.com/gallery/show/deferred
 */
var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype;
	
/**
 * A promise keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made. Use it as an extension or inherit from it
 * @class Deferred
 * @constructor
 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
 */
function Deferred(config) {
	this._config = config || {};
	
	var et = this._et = new Y.EventTarget();
	
	var eventConf = {
		emitFacade: false,
		fireOnce: true,
		preventable: false
	};
	et.publish('success', eventConf);
	et.publish('failure', eventConf);
	et.publish('complete', eventConf);
}
Y.mix(Deferred.prototype, {
	_on: function () {
		return this._et.on.apply(this._et, arguments);
	},
	_fire: function () {
		this._et.fire.apply(this._et, arguments);
		return this;
	},
	/**
	 * @method then
	 * @description Adds callbacks to the list of callbacks tracked by the promise
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		var self = this;
		YArray.each(Deferred._flatten(doneCallbacks), function (callback) {
			self._on('success', callback);
		});
		YArray.each(Deferred._flatten(failCallbacks), function (callback) {
			self._on('failure', callback);
		});
		return this;
	},
	
	/**
	 * @method done
	 * @description Listens to the 'success' event
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */
	done: function () {
		return this.then(Y.Array(arguments));
	},
	
	/**
	 * @method fail
	 * @description Listens to the 'failure' event
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	fail: function () {
		return this.then(null, Y.Array(arguments));
	},
	
	/**
	 * @method always
	 * @description Listens to the 'complete' event
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	always: function () {
		var self = this;
		YArray.each(Y.Array(arguments), function (callback) {
			self._on('complete', callback);
		});
		return this;
	},
	
	/**
	 * @method resolve
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolve: function () {
		var args = Y.Array(arguments);
		this._fire.apply(this, ['success'].concat(args));
		return this._fire.apply(this, ['complete'].concat(args));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		var args = Y.Array(arguments);
		this._fire.apply(this, ['failure'].concat(args));
		return this._fire.apply(this, ['complete'].concat(args));
	},
	
	/**
	 * @method defer
	 * @description Returns a new promise. This method will be mostly used by implementors that extend this class to create
	 * additional asynchronous functionalityu. For example:
	 * <pre><code>
	 * wait: function (delay) {
	 *		return this.defer(function (promise) {
	 *		Y.later(delay || 0, promise, promise.resolve);
	 * });
	 * }</code></pre>
	 * @return {Deferred}
	 */
	defer: function (callback, context) {
		var promise = new this.constructor(this._config);
		this.then(Y.bind(callback, context || this, promise));
		return promise;
	}
	
});

Y.mix(Deferred, {
	/*
	 * Turns a value into an array with the value as its first element, or takes an array and spreads
	 * each array element into elements of the parent array
	 * @method _flatten
	 * @param {Object|Array} args The value or array to spread
	 * @return Array
	 * @private
	 * @static
	 */
	_flatten: function (arr) {
		var i = 0;
		arr = YArray(arr).concat();
		while (i < arr.length) {
			if (Y.Lang.isArray(arr[i])) {
				Array.prototype.splice.apply(arr, [i, 1].concat(arr[i]));
			} else {
				i++;
			}
		}
		return arr;
	}
});

Y.Deferred = Deferred;


/**
 * Methods for working with asynchronous calls
 * @class YUI~deferred
 * @static
 */

/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Deferred} a promise
 */
Y.defer = function (fn, context) {
	var promise = new Y.Deferred();
	fn(promise);
	return promise;
};

/**
 * @method when
 * @description Waits for a series of asynchronous calls to be completed
 * @param {Deferred|Array|Function} deferred Any number of Deferred instances or arrays of instances. If a function is provided, it is executed at once
 * @return {Deferred} a promise
 */
Y.when = function () {
	var deferreds = Y.Deferred._flatten(arguments),
		args = [],
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify(_args) {
			args.push(YArray(_args));
			if (resolved + rejected === deferreds.length) {
				if (rejected > 0) {
					promise.reject.apply(promise, args);
				} else {
					promise.resolve.apply(promise, args);
				}
			}
		}
			
		function done() {
			resolved++;
			notify(arguments);
		}
		
		function fail() {
			rejected++;
			notify(arguments);
		}

		YArray.each(deferreds, function (deferred) {
			if (Y.Lang.isFunction(deferred)) {
				done(deferred());
			} else {
				deferred.then(done, fail);
			}
		});
	});
};


	/**
	 * Represents the promise of an IO request being completed
	 * @class io.Request
	 * @constructor
	 * @extends Deferred
	 */
	function Request() {
		Request.superclass.constructor.apply(this, arguments);
		var et = this._et;
		var eventConfig = { emitFacade: true };
		et.publish('success', eventConfig);
		et.publish('failure', eventConfig);
		et.publish('complete', eventConfig);
	}
	Y.extend(Request, Y.Deferred, null, {
		NAME: 'io-request'
	});
	
	if (Y.io) {
		Y.mix(Y.io, {
			
			Request: Request,
			
			/**
			 * Utility function for normalizing an IO configuration object.
			 * If a function is providad instead of a configuration object, the function is used
			 * as a 'complete' event handler.
			 * @method _normalizeConfig
			 * @for io
			 * @private
			 * @static
			 */
			_normalizeConfig: function (config, args) {
				if (Y.Lang.isFunction(config)) {
					config = { on: { complete: config } };
				} else {
					config = config || {};
					config.on = config.on || {};
				}
				return Y.mix(config, args, true);
			},
			
			/**
			 * Makes an IO request and returns a new io.Request object for it.
			 * It also normalizes callbacks as event handlers with an EventFacade
			 * @method _defer
			 * @for io
			 * @private
			 * @static
			 */
			_defer: function (uri, config) {
				config = Y.io._normalizeConfig(config);
				var request = new Y.io.Request();
				
				function relayEvent(eventName) {
					return function (id, response) {
						var args = { responseXML: response.responseXML, responseText: response.responseText };
						request._fire(eventName, args);
					}
				}
					
				if (config.on) {
					request._on(config.on);
				}
				
				config.on = {
					success: function (id, response) {
						var args = { responseXML: response.responseXML, responseText: response.responseText };
						if (config.parser) {
							try {
								args.data = config.parser(response.responseText);
							} catch (e) {
								request._fire('failure', response);
								return;
							}
						}
						request._fire('success', args);
					},
					failure: relayEvent('failure'),
					complete: relayEvent('complete')
				};
				
				return Y.mix(request, Y.io(uri, config));
			},
			
	        /**
	         * Add a deferred function to Y.io and add it as a method of Y.Request
	         * @method addMethod
	         * @for Y.io
	         * @static
	         * @param {String} name Name of the method
	         * @param {Function} fn Method
	         */
			addMethod: function (name, fn) {
				Y.io[name] = fn;
				Request.prototype[name] = function () {
					return Y.io[name].apply(Y.io, arguments);
				};
			},
			
			/**
			 * Adds multiple methods to Y.io and Y.Request from an object
			 * @method addMethods
			 * @for Y.io
			 * @static
			 * @param {Obejct} methods Key/value pairs of names and functions
			 */
			addMethods: function (methods) {
				Y.Object.each(methods, function (fn, name) {
					Y.io.addMethod(name, fn);
				});
			}
		});
	
		Y.io.addMethods({
			/**
			 * Makes a new GET HTTP request
			 * @method get
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for io
			 * @static
			 */
			get: function (uri, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'GET'
				}));
			},
			
			/**
			 * Makes a new POST HTTP request
			 * @method get
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for io
			 * @static
			 */
			post: function (uri, data, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'POST',
					data: data
				}));
			},
			
			/**
			 * Makes a new POST HTTP request sending the content of a form
			 * @method get
			 * @param {String} uri Path to the request resource
			 * @param {String} id The id of the form to serialize and send in the request
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for io
			 * @static
			 */
			postForm: function (uri, id, config) {
				return Y.io._defer(uri, Y.io._normalizeConfig(config, {
					method: 'POST',
					form: { id: id }
				}));
			}
		});
		
		if (Y.JSON) {
			/**
			 * Makes a new GET HTTP request and parses the result as JSON data
			 * @method getJSON
			 * @param {String} uri Path to the request resource
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for io
			 * @static
			 */
			Y.io.addMethod('getJSON', function (uri, config) {
				config = Y.io._normalizeConfig(config);
				config.parser = Y.JSON.parse;
				
				return Y.io._defer(uri, config);
			});
		}

		if (Y.jsonp) {
			/**
			 * Makes a new JSONP request
			 * @method jsonp
			 * @param {String} uri Path to the jsonp service
			 * @param {Function|Object} config Either a callback for the complete event or a full configuration option
			 * @return io.Request
			 * @for io
			 * @static
			 */
			Y.io.addMethod('jsonp', function (uri, config) {
				config = Y.io._normalizeConfig(config);
				var request = new Y.io.Request();
				
				if (config.on) {
					request._on(config.on);
				}
				
				config.on = {};
				Y.Array.each(['success', 'failure', 'complete'], function (eventName) {
					config.on[eventName] = function (data) {
						request._fire(eventName, { data: data });
					};
				});
				
				Y.jsonp(uri, config);
				
				return request;
			});
		}
	}


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
			 * @property {String} NS 'deferred'
			 * @static
			 */
			NS: 'deferred',
			
			/**
			 * Imports a method from Y.Node so that they return instances of this same plugin representing promises
			 * @method importMethod
			 * @param {String} method Name of the method to import from Y.Node
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
							callback;
							
						if (Y.Lang.isFunction(args[args.length - 1])) {
							callback = args.pop();
						}
						
						return this.defer(function (promise) {
							this.host[method].apply(this.host, args.concat([Y.bind(promise.resolve, promise)]));
						}).done(callback);
						
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
		
		Y.Array.each(['hide', 'load', 'show', 'transition', 'once', 'onceAfter'], NodeDeferred.importMethod);
		
		Y.Node.Deferred = NodeDeferred;
	}



}, '@VERSION@' ,{optional:['node','plugin','node-load','transition','io-base','json','jsonp'], requires:['event-custom']});
