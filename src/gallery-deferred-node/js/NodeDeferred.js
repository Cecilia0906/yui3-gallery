	
	function NodeDeferred(config) {
		NodeDeferred.superclass.constructor.apply(this, arguments);
		this.host = config.host;
	}
	Y.extend(NodeDeferred, Y.Promise, null, {
		NS: 'deferred',
		
		importMethod: function (method) {
			NodeDeferred.prototype[method] = function () {
				if (this.host.deferred === this) {
					this.resolve();
				}
				
				if (this.host[method]) {
					var args = Y.Array(arguments),
						callback;
						
					if (Y.Lang.isFunction(args[args.length - 1])) {
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
	
	Y.Array.each(['hide', 'load', 'show', 'transition'], NodeDeferred.importMethod);
	
	Y.Node.Deferred = NodeDeferred;
