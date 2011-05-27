YUI.add('gallery-deferred', function(Y) {

var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype,
	SLICE = AP.slice,
	PUSH = AP.push;

/*
 * Turns a value into an array with the value as its first element, or takes an array and spreads
 * each array element into elements of the parent array
 * @param {Object|Array} args The value or array to spread
 * @return Array
 * @private
 */
YArray._spread = function (args) {
	args = Lang.isArray(args) ? args : [args];
	var i = 0;
	while (i < args.length) {
		if (Lang.isArray(args[i])) {
			AP.splice.apply(args, [i, 1].concat(args[i]));
		} else if (!Lang.isValue(args[i])) {
			args.splice(i, 1);
		} else {
			i++;
		}
	}
	return args;
};

	
/**
 * A promise keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made
 * @class Promise
 * @constructor
 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
 */
function Promise() {
	this._done = [];
	this._fail = [];
	this.resolved = false;
	this.rejected = false;
}
Promise.prototype = {
	
	/**
	 * @method then
	 * @description Adds callbacks to the list of callbacks tracked by the promise
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		doneCallbacks = YArray._spread(doneCallbacks);
		failCallbacks = YArray._spread(failCallbacks);
		if (this.resolved) {
			this._notify(doneCallbacks, this._args || [], this);
		} else if (!this.rejected){
			PUSH.apply(this._done, doneCallbacks);
		}
		if (this.rejected) {
			this._notify(failCallbacks, this._args || [], this);
		} else if (!this.resolved){
			PUSH.apply(this._fail, failCallbacks);
		}
		return this;
	},
	
	/**
	 * @method done
	 * @description Adds callbacks to the success list
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */
	done: function () {
		return this.then(SLICE.call(arguments));
	},
	
	/**
	 * @method fail
	 * @description Adds callbacks to the failure list
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	fail: function () {
		return this.then(null, SLICE.call(arguments));
	},
	
	/**
	 * @method always
	 * @description Adds callbacks to both the failure and the success lists
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	always: function () {
		var args = SLICE.call(arguments);
		return this.then(args, args);
	},
	
	/**
	 * @method resolve
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolve: function () {
		return this.resolveWith(this, SLICE.call(arguments));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		return this.rejectWith(this, SLICE.call(arguments));
	},
	
	/**
	 * @method resolveWith
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} context The object to use as context for the callbacks
	 * @param {Array} args A list of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolveWith: function (context, args) {
		this.resolved = true;
		this._args = args;
		return this._notify(this._done, args, context);
	},
	
	/**
	 * @method rejectWith
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} context The object to use as context for the callbacks
	 * @param {Array} args A list of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	rejectWith: function (context, args) {
		this.rejected = true;
		this._args = args;
		return this._notify(this._fail, args, context);
	},
	
	/**
	 * @method notify
	 * @description Notifies the success or failure callbacks
	 * @param {Boolean} success Whether to notify the success or failure callbacks
	 * @param {Array} args A list of arguments to pass to the callbacks
	 * @param {Object} thisp Context to apply to the callbacks
	 * @chainable
	 * @private
	 */
	_notify: function (callbacks, args, thisp) {
		for (var i = 0, length = callbacks.length; i < length; i++) {
			callbacks[i].apply(thisp, args);
		}
		return this;
	},
	
	defer: function (callback, context) {
		var promise = new this.constructor();
		this.then(Y.bind(callback, context || this, promise));
		return promise;
	}
	
};

Y.Promise = Promise;

/**
 * Deferred is a class designed to serve as extension for other classes, allowing them to
 * declare methods that run asynchronously and keep track of its promise
 * @class Deferred
 * @constructor
 */
function Deferred() {
	this._fail = [];
}
Deferred.prototype = {
	
	/**
	 * @method then
	 * @description Adds callbacks to the last promise made. If no promise was made it calls the success callbacks immediately
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		var next = this._next;
		
		if (doneCallbacks || failCallbacks) {
			doneCallbacks = YArray._spread(doneCallbacks);
			if (next) {
				YArray.each(doneCallbacks, function (deferred, i) {
					if (deferred.end) {
						doneCallbacks[i] = function () {
							deferred.end();
						};
					}
				});
				next.then(doneCallbacks, failCallbacks);
			} else {
				doneCallbacks = YArray.filter(doneCallbacks, function (callback) {
					return !callback.end;
				});
				this._notify(doneCallbacks);
			}
		}
		return this;
	},
	
	_switchPromise: function (next) {
		this._current = next;
	},

	defer: function (fn, context) {
		context = context || this;
		var promise = new Promise(),
			switchPromise = Y.bind(this._switchPromise, this, promise);
		
		if (fn) {
			fn = Y.bind(fn, context, promise);
			
			promise.fail(Y.bind(this._notifyFailure, this));
			
			if (this._next) {
				this._next.then([fn, switchPromise], switchPromise);
			} else {
				this._starter = fn;
				this._current = promise;
			}
		}
		this._next = promise;
		return this;
	},
	
	end: function (doneCallbacks, failCallbacks) {
		this.then(doneCallbacks);
		this._fail.push.apply(this._fail, YArray._spread(failCallbacks));
		if (this._starter) {
			this._starter();
		}
		return this;
	},
	
	/**
	 * @method resolveWith
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} context The object to use as context for the callbacks
	 * @param {Array} args A list of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolveWith: function (context, args) {
		var promise = this._current;
		if (promise) {
			promise.resolve.apply(context, args);
		}
		return this;
	},
	
	/**
	 * @method rejectWith
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} context The object to use as context for the callbacks
	 * @param {Array} args A list of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	rejectWith: function (context, args) {
		var promise = this._current;
		if (promise) {
			promise.reject.apply(context, args);
		}
		return this;
	},

	isResolved: function () {
		return this._current.isResolved();
	},
	
	isRejected: function () {
		return this._current.isRejected();
	},
	
	_notifyFailure: function () {
		var args = arguments;
		YArray.each(this._fail, function (callback) { callback.apply(this, args); }, this);
		return this;
	}
	
};

	/**
	 * @method done
	 * @description Adds callbacks to the success list
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */

	/**
	 * @method fail
	 * @description Adds callbacks to the failure list
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	
	/**
	 * @method always
	 * @description Adds callbacks to both the failure and the success lists
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	
	/**
	 * @method resolve
	 * @description Resolves the <strong>current</strong> promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */

	/**
	 * @method reject
	 * @description Rejects the <strong>current</strong> promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	/**
	 * @method _notify
	 * @description Notifies the success or failure callbacks
	 * @param {Boolean} success Whether to notify the success or failure callbacks
	 * @param {Array} args A list of arguments to pass to the callbacks
	 * @param {Object} thisp Context to apply to the callbacks
	 * @chainable
	 * @private
	 */
	
YArray.each(['done', 'fail', 'always', 'resolve', 'reject', '_notify'], function (method) {
	Deferred.prototype[method] = Promise.prototype[method];
});

Y.Deferred = Deferred;


function NodeDeferred(config) {
	NodeDeferred.superclass.constructor.apply(this, arguments);
	this.host = config.host;
}
Y.extend(NodeDeferred, Deferred, null, {
	NS: 'deferred',
	
	importMethod: function (method) {
		NodeDeferred.prototype[method] = function () {
			if (this.host[method]) {
				var args = SLICE.call(arguments),
					callback;
				if (Lang.isFunction(args[args.length - 1])) {
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

YArray.each(['hide', 'load', 'show', 'transition'], NodeDeferred.importMethod);

if (Y.Node) {
	Y.Node.Deferred = NodeDeferred;
}


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
	var deferred = new Y.Deferred();
	return deferred.defer(fn, context);
};

/**
 * @method when
 * @description Waits for a series of asynchronous calls to be completed
 * @param {Deferred|Array} deferred Any number of Deferred instances or arrays of instances
 * @return Promise
 */
Y.when = function () {
	var deferreds = YArray._spread(SLICE.call(arguments)),
		args = [],
		i = 0,
		resolved = 0,
		rejected = 0;
			
	return Y.defer(function (promise) {
		function notify() {
			if (rejected > 0) {
				promise.rejectWith(promise, args);
			} else {
				promise.resolveWith(promise, args);
			}
		}
			
		function done() {
			args.push(SLICE.call(arguments));
			resolved++;
			if (resolved + rejected == deferreds.length) {
				notify();
			}
		}
		
		function fail() {
			args.push(SLICE.call(arguments));
			rejected++;
			if (resolved + rejected == deferreds.length) {
				notify();
			}
		}

		while (i < deferreds.length) {
			deferreds[i].end(done, fail);
			i++;
		}		
	});
};

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



}, '@VERSION@' ,{optional:['io','node','node-load','transition','plugin'], requires:['array-extras']});
