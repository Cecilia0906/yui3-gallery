
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