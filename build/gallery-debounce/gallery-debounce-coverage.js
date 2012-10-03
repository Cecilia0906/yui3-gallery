if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "C:\\Workspace\\yui3-gallery\\src\\gallery-debounce\\build_tmp\\gallery-debounce.js",
    code: []
};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"].code=["YUI.add('gallery-debounce', function(Y) {","","	/**","	Debouncing is a similar strategy throttling (see yui-throttle)","","	Y.debounce delays the execution of a function by a certain number","	of milliseconds, starting over every time the function is called.","	That way it allows you to listen only once to events happening","	repeated times over a time span.","","	For example, you can debounce a callback to a keypress event","	so that you know when the user stopped typing:","	```","	Y.one('input').on('click', Y.debounce(500, function () {","		alert('The user stopped typing');","	}));","	```","","	@module yui","	@submodule gallery-debounce","	**/","","	/**","	Debounces a function call so that it's only executed once after a certain","	time lapse after the last time it was called","","	@method debounce","	@for YUI","	@param ms {Number} The number of milliseconds to debounce the function call.","	Passing a -1 will disable the debounce","	@param fn {Function} The function to delay","	@return {Function} Returns a wrapped function that calls fn","	**/","	Y.debounce = function (ms, debouncedFn) {","		var timeout;","","		return function () {","			var self = this,","				args = arguments;","","			if (ms === -1) {","				debouncedFn.apply(self, args);","				return;","			}","","			if (timeout) {","				clearTimeout(timeout);","			}","","			timeout = setTimeout(function () {","				debouncedFn.apply(self, args);","			}, ms);","		};","	};","","","","}, '@VERSION@' );"];
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"].lines = {"1":0,"34":0,"35":0,"37":0,"38":0,"41":0,"42":0,"43":0,"46":0,"47":0,"50":0,"51":0};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"].functions = {"(anonymous 3):50":0,"(anonymous 2):37":0,"debounce:34":0,"(anonymous 1):1":0};
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"].coveredLines = 12;
_yuitest_coverage["C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js"].coveredFunctions = 4;
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 1);
YUI.add('gallery-debounce', function(Y) {

	/**
	Debouncing is a similar strategy throttling (see yui-throttle)

	Y.debounce delays the execution of a function by a certain number
	of milliseconds, starting over every time the function is called.
	That way it allows you to listen only once to events happening
	repeated times over a time span.

	For example, you can debounce a callback to a keypress event
	so that you know when the user stopped typing:
	```
	Y.one('input').on('click', Y.debounce(500, function () {
		alert('The user stopped typing');
	}));
	```

	@module yui
	@submodule gallery-debounce
	**/

	/**
	Debounces a function call so that it's only executed once after a certain
	time lapse after the last time it was called

	@method debounce
	@for YUI
	@param ms {Number} The number of milliseconds to debounce the function call.
	Passing a -1 will disable the debounce
	@param fn {Function} The function to delay
	@return {Function} Returns a wrapped function that calls fn
	**/
	_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", "(anonymous 1)", 1);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 34);
Y.debounce = function (ms, debouncedFn) {
		_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", "debounce", 34);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 35);
var timeout;

		_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 37);
return function () {
			_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", "(anonymous 2)", 37);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 38);
var self = this,
				args = arguments;

			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 41);
if (ms === -1) {
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 42);
debouncedFn.apply(self, args);
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 43);
return;
			}

			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 46);
if (timeout) {
				_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 47);
clearTimeout(timeout);
			}

			_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 50);
timeout = setTimeout(function () {
				_yuitest_coverfunc("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", "(anonymous 3)", 50);
_yuitest_coverline("C:\Workspace\yui3-gallery\src\gallery-debounce\build_tmp\gallery-debounce.js", 51);
debouncedFn.apply(self, args);
			}, ms);
		};
	};



}, '@VERSION@' );
