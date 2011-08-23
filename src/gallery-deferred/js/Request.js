
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
