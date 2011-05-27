/**
 * Represents the promise of a transaction being completed.
 * Can also be aborted
 * @class Transaction
 * @constructor
 * @extends Promise
 */
function Transaction() {
	Transaction.superclass.constructor.apply(this, arguments);
}
Y.extend(Transaction, Deferred, {
	
	/**
	 * @method abort
	 * @description Aborts the request if available (doesn't work on JSONP transactions)
	 * @chainable
	 */
	abort: function () {
		if (this._request && this._request.abort) {
			this._request.abort();
		}
		return this.reject();
	}
	
	/**
	 * @method io
	 * @description Calls Y.io and returns a new Transaction
	 * @param {String} url The url for the io request
	 * @param {Object} config Config options for the io request (see Y.io)
	 * @return Transaction
	 */
	
	/**
	 * @method jsonp
	 * @description Calls Y.jsonp and returns a new Transaction
	 * @param {String} url The url for the jsonp request
	 * @param {Object} config Config options for the jsonp request (see Y.io)
	 * @return Transaction
	 */
	
}, {
	
	addMethod: function (name, fn) {
		Transaction.prototype[name] = function (url, opts) {
			var config = (!Lang.isObject(opts) || Lang.isFunction(opts)) ? {} : opts,
				on = config.on || (config.on = {}),
				success = on.success,
				failure = on.failure;
			if (Lang.isFunction(opts)) {
				success = opts;
			}
			return this.defer(function (promise) {
				on.success = Y.bind(promise.resolve, promise);
				on.failure = Y.bind(promise.reject, promise);
				this._request = fn(url, config);
			}).then(success, failure);
		};
	}
	
});

Y.Transaction = Transaction;

/**
 * Deferred version of the io method
 * @method defer
 * @for io
 * @return Transaction
 */
/**
 * Deferred version of the jsonp method
 * @method defer
 * @for jsonp
 * @return Transaction
 */
YArray.each(['io', 'jsonp'], function (method) {
	if (Y[method]) {
		Transaction.addMethod(method, Y[method]);
		
		Y[method].defer = function () {
			var transaction = new Y.Transaction();
			transaction.resolved = true;
			return transaction[method].apply(transaction, arguments);
		};
	}
});