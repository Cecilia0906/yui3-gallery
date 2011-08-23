
/**
 * Methods for working with asynchronous calls
 * @class YUI~deferred
 * @static
 */

/**
 * Returns a promise for a (possibly) asynchronous call.
 * Calls a given function that receives the new promise as parameter and must call resolve()
 * or reject() at a certain point
 * @method Y.defer
 * @param {Function} fn A function that encloses an async call.
 * @return {Deferred} a promise
 */
Y.defer = function (fn, context) {
	var promise = new Y.Deferred();
	fn(promise);
	return promise;
};

/**
 * @method Y.when
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