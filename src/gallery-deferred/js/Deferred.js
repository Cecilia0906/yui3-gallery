/*
 * Copyright (c) 2011, Juan Ignacio Dopazo. All rights reserved.
 * Code licensed under the BSD License
 * http://yuilibrary.com/gallery/show/deferred
 */
/**
 * @module gallery-deferred
 * @requires event-custom
 */
var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype,
	PUSH = AP.push;
	
/**
 * A deferred keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made.
 * 
 * This class is designed to augment others
 * @class Deferred
 * @constructor
 */
function Deferred(config) {
	this._config = config || {};
	this._done = [];
	this._fail = [];
	this._args = [];
	this.resolved = false;
	this.rejected = false;
}
Y.mix(Deferred.prototype, {
	/**
	 * @method then
	 * @description Adds callbacks to the list of callbacks tracked by the promise
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		if (doneCallbacks) {
			doneCallbacks = Deferred._flatten(doneCallbacks)
			if (this.resolved) {
				YArray.each(doneCallbacks, function (callback) {
					callback.apply(this, this._args);
				}, this);
			} else {
				PUSH.apply(this._done, doneCallbacks);
			}
		}
		if (failCallbacks) {
			failCallbacks = Deferred._flatten(failCallbacks)
			if (this.rejected) {
				YArray.each(failCallbacks, function (callback) {
					callback.apply(this, this._args);
				}, this);
			} else {
				PUSH.apply(this._fail, failCallbacks);
			}
		}
		return this;
	},
	
	/**
	 * @method done
	 * @description Listens to the 'success' event
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */
	done: function () {
		return this.then(YArray(arguments));
	},
	
	/**
	 * @method fail
	 * @description Listens to the 'failure' event
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	fail: function () {
		return this.then(null, YArray(arguments));
	},
	
	/**
	 * @method always
	 * @description Listens to the 'complete' event
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	always: function () {
		var args = YArray(arguments);
		return this.then(args, args);
	},
	
	/**
	 * @method resolve
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolve: function () {
		return this._notify(YArray(arguments));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		return this._notify(YArray(arguments));
	},
	
	_notify: function (args) {
		var callbacks = [];
		if (this.resolved) {
			callbacks = this._done;
		} else if (this.rejected){
			callbacks = this._fail;
		}
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
				AP.splice.apply(arr, [i, 1].concat(arr[i]));
			} else {
				i++;
			}
		}
		return arr;
	}
});

Y.Deferred = Deferred;