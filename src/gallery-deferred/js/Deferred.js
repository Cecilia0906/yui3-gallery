/*
 * Copyright (c) 2011, Juan Ignacio Dopazo. All rights reserved.
 * Code licensed under the BSD License
 * http://yuilibrary.com/gallery/show/deferred
 */
var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype;
	
/**
 * A promise keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made. Use it as an extension or inherit from it
 * @class Deferred
 * @constructor
 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
 */
function Deferred(config) {
	this._config = config || {};
	
	var et = this._et = new Y.EventTarget();
	
	var eventConf = {
		emitFacade: false,
		fireOnce: true,
		preventable: false
	};
	et.publish('success', eventConf);
	et.publish('failure', eventConf);
	et.publish('complete', eventConf);
}
Y.mix(Deferred.prototype, {
	_on: function () {
		return this._et.on.apply(this._et, arguments);
	},
	_fire: function () {
		this._et.fire.apply(this._et, arguments);
		return this;
	},
	/**
	 * @method then
	 * @description Adds callbacks to the list of callbacks tracked by the promise
	 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
	 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
	 * @chainable
	 */
	then: function (doneCallbacks, failCallbacks) {
		var self = this;
		YArray.each(Deferred._flatten(doneCallbacks), function (callback) {
			self._on('success', callback);
		});
		YArray.each(Deferred._flatten(failCallbacks), function (callback) {
			self._on('failure', callback);
		});
		return this;
	},
	
	/**
	 * @method done
	 * @description Listens to the 'success' event
	 * @param {Function|Array} doneCallbacks Takes any number of functions or arrays of functions to run when the promise is resolved
	 * @chainable 
	 */
	done: function () {
		return this.then(Y.Array(arguments));
	},
	
	/**
	 * @method fail
	 * @description Listens to the 'failure' event
	 * @param {Function|Array} failCallbacks Takes any number of functions or arrays of functions to run when the promise is rejected
	 * @chainable 
	 */
	fail: function () {
		return this.then(null, Y.Array(arguments));
	},
	
	/**
	 * @method always
	 * @description Listens to the 'complete' event
	 * @param {Function|Array} callbacks Takes any number of functions or arrays of functions to run when the promise is rejected or resolved
	 * @chainable 
	 */
	always: function () {
		var self = this;
		YArray.each(Y.Array(arguments), function (callback) {
			self._on('complete', callback);
		});
		return this;
	},
	
	/**
	 * @method resolve
	 * @description Resolves the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the success callbacks
	 * @chainable
	 */
	resolve: function () {
		var args = Y.Array(arguments);
		this._fire.apply(this, ['success'].concat(args));
		return this._fire.apply(this, ['complete'].concat(args));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		var args = Y.Array(arguments);
		this._fire.apply(this, ['failure'].concat(args));
		return this._fire.apply(this, ['complete'].concat(args));
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
				Array.prototype.splice.apply(arr, [i, 1].concat(arr[i]));
			} else {
				i++;
			}
		}
		return arr;
	}
});

Y.Deferred = Deferred;