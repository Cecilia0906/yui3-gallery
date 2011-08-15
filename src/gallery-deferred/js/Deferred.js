var Lang = Y.Lang,
	YArray = Y.Array,
	AP = Array.prototype;
	
/**
 * A promise keeps two lists of callbacks, one for the success scenario and another for the failure case.
 * It runs these callbacks once a call to resolve() or reject() is made
 * @class Deferred
 * @constructor
 * @param {Function|Array} doneCallbacks A function or array of functions to run when the promise is resolved
 * @param {Function|Array} failCallbacks A function or array of functions to run when the promise is rejected
 */
function Deferred(config) {
	Deferred.superclass.constructor.apply(this, arguments);
	
	this._config = config || {};
	
	var eventConf = {
		emitFacade: false,
		fireOnce: true,
		preventable: false
	};
	this.publish('success', eventConf);
	this.publish('failure', eventConf);
	this.publish('complete', eventConf);
}
Y.extend(Deferred, Y.EventTarget, {
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
			self.on('success', callback);
		});
		YArray.each(Deferred._flatten(failCallbacks), function (callback) {
			self.on('failure', callback);
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
			self.on('complete', callback);
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
		return this.fire.apply(this, ['success'].concat(Y.Array(arguments)));
	},
	
	/**
	 * @method reject
	 * @description Rejects the promise and notifies all callbacks
	 * @param {Object} o Any number of arguments that will be passed to the failure callbacks
	 * @chainable
	 */
	reject: function () {
		return this.fire.apply(this, ['failure'].concat(Y.Array(arguments)));
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
	
}, {
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
		return YArray.reduce(YArray(arr), function (a, b) {
			return YArray(a).concat(YArray(b));
		});
	}
});

Y.Deferred = Deferred;