
	/**
	 * Represents the promise of an IO request being completed
	 * @class io.Request
	 * @constructor
	 * @extends Promise
	 */
	function Request() {
		Request.superclass.constructor.apply(this, arguments);
		var eventConfig = { emitFacade: true };
		this.publish('success', eventConfig);
		this.publish('failure', eventConfig);
		this.publish('complete', eventConfig);
	}
	Y.extend(Request, Y.Promise, null, {
		NAME: 'io-request'
	});
	
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
			var transaction = new Y.io.Request();
			
			if (config.on) {
				transaction.on(config.on);
			}
				
			config.on = {
				success: function (id, response) {
					var args = { responseXML: response.responseXML, responseText: response.responseText };
					if (config.parser) {
						try {
							args.data = config.parser(response.responseText);
						} catch (e) {
							transaction.fire('failure', response);
							return;
						}
					}
					transaction.fire('success', args);
					transaction.fire('complete', args);
				},
				failure: function (id, response) {
					var args = { responseXML: response.responseXML, responseText: response.responseText };
					transaction.fire('failure', args);
					transaction.fire('complete', args);
				}
			};
			
			return Y.mix(transaction, Y.io(uri, config));
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
		 * Makes a new GET HTTP transaction
		 * @method get
		 * @param {String} uri Path to the transaction resource
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
		 * Makes a new POST HTTP transaction
		 * @method get
		 * @param {String} uri Path to the transaction resource
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
		 * Makes a new POST HTTP transaction sending the content of a form
		 * @method get
		 * @param {String} uri Path to the transaction resource
		 * @param {String} id The id of the form to serialize and send in the transaction
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
		 * Makes a new GET HTTP transaction and parses the result as JSON data
		 * @method getJSON
		 * @param {String} uri Path to the transaction resource
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
		 * Makes a new JSONP transaction
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
				request.on(config.on);
			}
			
			config.on = {};
			Y.Array.each(['success', 'failure', 'complete'], function (eventName) {
				config.on[eventName] = function (data) {
					request.fire(eventName, { data: data });
				};
			});
			
			Y.jsonp(uri, config);
			
			return request;
		});
	}
