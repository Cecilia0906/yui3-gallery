
/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
Y.defer = function (fn, context) {
	var promise = new Y.Promise();
	fn(promise);
	return promise;
};

/**
 * Waits for a series of asynchronous calls to be completed
 * @method when
 * @param {Promise|Array|Function} deferred Any number of Promise instances or arrays of instances. If a function is provided, it is executed at once
 * @return {Promise} a promise
 * @static
 * @for YUI
 */
Y.when = function () {
	var deferreds = Y.Promise._flatten(YArray(arguments)),
		args = [],
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify(i, _args) {
			args[i] = YArray(_args);
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
			notify(this._index, arguments);
		}
		
		function fail() {
			rejected++;
			notify(this._index, arguments);
		}

		YArray.each(deferreds, function (deferred, i) {
			// Quick hackish fix
			// TODO make it more elegant
			deferred._index = i;
			if (Y.Lang.isFunction(deferred)) {
				done(deferred());
			} else {
				deferred.then(done, fail);
			}
		});
	});
};