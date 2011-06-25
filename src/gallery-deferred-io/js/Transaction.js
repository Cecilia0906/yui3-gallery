
	function normalizeConfig(config, args) {
		config = config || {};
		config.on = config.on || {};
		if (Y.Lang.isFunction(config)) {
			config = { on: { complete: config } };
		}
		return Y.mix(config, args, true);
	}

	/**
	 * Represents the promise of a transaction being completed
	 * @class Transaction
	 * @constructor
	 * @extends Promise
	 */
	function Transaction(config) {
		config = config || {};
		config.emitFacade = true;
		Transaction.superclass.constructor.call(this, config);
	}
	Y.extend(Transaction, Y.Promise);
	
	Y.mix(Y.io, {
		
		Transaction: Transaction,
		
		_defer: function (uri, config) {
			config = normalizeConfig(config);
			var transaction = new Y.io.Transaction();
			
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
				},
				failure: function (id, response) {
					var args = { responseXML: response.responseXML, responseText: response.responseText };
					transaction.fire('failure', args);
				}
			};
			
			return Y.mix(transaction, Y.io(uri, config));
		},
		
		addMethod: function (fn, name) {
			Y.io[name] = fn;
			Transaction.prototype[name] = function () {
				return fn.apply(Y.io, arguments);
			};
		}
		
	});

	Y.each({
		get: function (uri, config) {
			return Y.io._defer(uri, normalizeConfig(config, {
				method: 'GET'
			}));
		},
		
		post: function (uri, data, config) {
			return Y.io._defer(uri, normalizeConfig(config, {
				method: 'POST',
				data: data
			}));
		},
		
		postForm: function (uri, id, config) {
			return Y.io._defer(uri, normalizeConfig(config, {
				method: 'POST',
				form: { id: id }
			}));
		}
	}, Y.io.addMethod);
	
	if (Y.JSON) {
		Y.io.addMethod('getJSON', function (uri, config) {
			config = normalizeConfig(config);
			config.parser = Y.JSON.parse;
			
			return Y.io._defer(uri, config);
		});
	}
	
	if (Y.jsonp) {
		Y.io.addMethod('jsonp', function (uri, config) {
			config = normalizeConfig(config);
			var transaction = new Y.io.Transaction();
			
			if (config.on) {
				transaction.on(config.on);
			}
			
			config.on = {
				success: function (data) {
					transaction.fire('success', { data: data });
				},
				failure: function (data) {
					transaction.fire('failure', { data: data });
				}
			};
			
			Y.jsonp(uri, config);
			
			return transaction;
		});
	}
