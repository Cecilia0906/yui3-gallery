
	var Lang = Y.Lang,
		_io = Y.io;
		
	function normalizeConfig(config, args) {
		config = config || {};
		config.on = config.on || {};
		if (Lang.isFunction(config)) {
			config = { on: { complete: config } };
		}
		return Y.mix(config, args);
	}

	/**
	 * Represents the promise of a transaction being completed
	 * @class Transaction
	 * @constructor
	 * @extends Promise
	 */
	function Transaction() {
		Transaction.superclass.constructor.call(this);
	}
	Y.extend(Transaction, Y.Promise);
	
	Y.io = function (uri, config) {
		config = normalizeConfig(config);
		
		var onSuccess = config.on.success,
			onFailure = config.on.failure,
			transaction = new Y.io.Transaction();
			
		function handleFailure(id, response) {
			transaction.fire('failure', response);
			if (onFailure) {
				onFailure.apply(this, arguments);
			}
		}
				
		Y.mix(config.on, {
			success: function (id, response) {
				if (config.parser) {
					try {
						response.response = config.parser(response.responseText);
					} catch (e) {
						handleFailure.apply(this, arguments);
						return;
					}
				}
				transaction.fire('success', response);
				if (onSuccess) {
					onSuccess.call(this, id, response);
				}
			},
			failure: handleFailure
		}, true);
		
		return Y.mix(transaction, _io(uri, config));
	};
	
	Y.mix(Y.io, {
		
		Transaction: Transaction,
		
		defer: function (uri, config) {
			config = normalizeConfig(config);
			var transaction = new Y.io.Transaction();
			
			if (config.on) {
				transaction.on(config.on);
			}
				
			config.on = {
				success: function (id, response) {
					if (config.parser) {
						try {
							response.response = config.parser(response.responseText);
						} catch (e) {
							transaction.fire('failure', response);
							return;
						}
					}
					transaction.fire('success', response);
				},
				failure: function (id, response) {
					transaction.fire('failure', response);
				}
			};
			
			return Y.mix(transaction, _io(uri, config));
		},
		
		addMethod: function (name, fn) {
			Y.io[name] = fn;
			Transaction.prototype[name] = function () {
				return fn.apply(Y.io, arguments);
			};
		},
		
		addMethods: function (methods) {
			Y.each(methods, Y.io.addMethod);
		}
		
	});

	Y.io.addMethods({
		get: function (uri, config) {
			return Y.io.defer(uri, config);
		},
		
		post: function (uri, data, config) {
			return Y.io.defer(uri, normalizeConfig(config, {
				method: 'POST',
				data: data
			}));
		},
		
		postForm: function (uri, id, config) {
			return Y.io.defer(uri, normalizeConfig(config, {
				method: 'POST',
				form: { id: id }
			}));
		},
		
		getJSON: function (uri, config) {
			config = normalizeConfig(config);
			config.parser = Y.JSON.parse;
			
			return Y.io.defer(uri, config);
		}
	});
	
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
