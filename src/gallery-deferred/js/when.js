
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
 * @return Promise
 */
Y.defer = function (fn, context) {
	var deferred = new Y.Promise();
	return deferred.defer(fn, context);
};

/**
 * @method when
 * @description Waits for a series of asynchronous calls to be completed
 * @param {Deferred|Array} deferred Any number of Deferred instances or arrays of instances
 * @return Promise
 */
Y.when = function () {
	var deferreds = YArray._spread(YArray(arguments)),
		args = [null],
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify() {
			if (rejected > 0) {
				promise.reject.apply(promise, args);
			} else {
				promise.resolve.apply(promise, args);
			}
		}
			
		function done() {
			args.push(YArray(arguments));
			resolved++;
			if (resolved + rejected === deferreds.length) {
				notify();
			}
		}
		
		function fail() {
			args.push(YArray(arguments));
			rejected++;
			if (resolved + rejected === deferreds.length) {
				notify();
			}
		}

		YArray.each(deferreds, function (deferred) {
			deferred.then(done, fail);
		});
	});
};