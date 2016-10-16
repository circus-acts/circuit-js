(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Circus"] = factory();
	else
		root["Circus"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, !(function webpackMissingModule() { var e = new Error("Cannot find module \"./circuit\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__(1), __webpack_require__(4), __webpack_require__(7), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circuit'), require('./signal'), require('./match'), require('./utils'), require('./error'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circuit, global.signal, global.match, global.utils, global.error);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _circuit, _signal, _match, _utils, _error) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.utils = exports.test = exports.Error = exports.Match = exports.Signal = undefined;

	  var _circuit2 = _interopRequireDefault(_circuit);

	  var _signal2 = _interopRequireDefault(_signal);

	  var _match2 = _interopRequireDefault(_match);

	  var _utils2 = _interopRequireDefault(_utils);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  exports.Signal = _signal2.default;
	  exports.Match = _match2.default;
	  exports.Error = _error.Error;
	  exports.test = _error.test;
	  exports.utils = _utils2.default;
	  exports.default = _circuit2.default;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports);
	    global.signal = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var sId = 0;

	  // immediate context operators - available through propagation

	  // Halt propagation.
	  // - propagation is halted immediately.
	  // - state is not updated by default.
	  // - optionally return:
	  //    value : state is immediately set to value.
	  //    thunk : thunkor is immediately called with next() arg.
	  //    promise : propagation is tied to promise resolution.
	  //
	  // examples:
	  //  signal(A).map(v => this.halt(B)).map(v => v) // -> Signal B
	  //  signal(A).map(v => this.halt(next => setTimeout(() => next(B)))) -> Signal A...B
	  var halt = function (v, a) {
	    if (!(this instanceof halt)) return new halt(v, !!arguments.length);
	    if (typeof v === 'function') this.thunk = v;else if (typeof v === 'object' && typeof v.then === 'function') this.promise = v;else if (a || arguments.length === 1) this.value = v;
	  };

	  // Fail propagation
	  // - propagation is halted immediately.
	  // - state is not updated.
	  // - optionally return failure message
	  //    NB: failure is not a state - it must be captured to be processed
	  //
	  // example:
	  //  signal(A).map(v => this.fail('boo!')).fail(f => console.log(f.message)) // boo!
	  var fail = function (m) {
	    if (!(this instanceof fail)) return new fail(m);
	    this.message = m || true;
	  };
	  fail.prototype = Object.create(halt.prototype);

	  // internal signalling tunnel (used for cloning etc)
	  var _wrap = function (v) {
	    var _this = this;
	    Object.keys(v).forEach(function (k) {
	      _this[k] = v[k];
	    });
	  };

	  // Signal - the object created and returned by Constructor
	  function Signal(state) {
	    var sid = ++sId;
	    var _this = this;
	    var _feeds = [],
	        _fails = [];

	    this.id = function () {
	      return _this;
	    };
	    this.id.isSignal = true;
	    this.isSignal = true;

	    if (true) {
	      this.$id = sid + (this.$name || '');
	    }

	    var _bind,
	        _step,
	        _steps = state instanceof _wrap ? state.steps : [];
	    var _state = { value: undefined };
	    if (state && !(state instanceof _wrap)) Object.keys(state).forEach(function (k) {
	      _state[k] = state[k];
	    });

	    function _propagate(v) {
	      for (var i = _step; i < _steps.length && !(v instanceof halt); i++) {
	        v = _apply.apply(_state, [_steps[i], v].concat([].slice.call(arguments, 1)));
	      }
	      var tail = v instanceof fail ? _fails : [];
	      if (v instanceof halt) {
	        if (v.hasOwnProperty('value')) _state.value = v.value;
	      } else {
	        _state.value = v;
	        tail = _feeds;
	      }
	      for (var t = 0; t < tail.length; t++) {
	        tail[t](v);
	      }

	      return !(v instanceof halt);
	    }

	    // apply: run ordinary functions in functor context
	    function _apply(f, v) {
	      var args = [].slice.call(arguments, 1);
	      _state.halt = halt;
	      _state.fail = fail;
	      v = f.apply(_state, args);
	      if (v instanceof halt) {
	        // handle thunks and promises in lieu of generators..
	        if (v.thunk) {
	          v.thunk.call(_state, _nextStep(_step + 1));
	        }
	        if (v.promise) {
	          // promise chains end here
	          var next = _nextStep(_step + 1);
	          v.promise.then(next, function (m) {
	            next(new fail(m));
	          });
	        }
	      }
	      return v;
	    }

	    // lift a function or signal into functor context
	    function _lift(f) {
	      var fmap = f;
	      if (f.isSignal) {
	        f.feed(_nextStep());
	        fmap = function (v) {
	          f.input(v);
	          return this.halt();
	        };
	      }
	      _steps.push(fmap);
	      return _this;
	    }

	    // allow values to be injected into the signal at arbitrary step points.
	    // propagation continues from this point
	    function _nextStep(step) {
	      step = step !== undefined ? step : _steps.length + 1;
	      return function (v) {
	        _step = step;
	        _bind ? _bind.apply(_state, [_propagate].concat([].slice.call(arguments))) : _propagate.apply(_this, arguments);
	      };
	    }

	    // Public API

	    // signal().input : (A) -> undefined
	    //
	    // Signal a new value.
	    //
	    // Push a new value into a signal. The signal will propagate.
	    // eg : input(123) -> Signal 123
	    this.input = _nextStep(0);

	    // Signal(A).next : (A) -> undefined
	    //
	    // Signal a new value at the next step point
	    //
	    // Push a new value into a signal at the next point in the propagation chain.
	    // The signal will propagate onwards.
	    // eg : signal.map(v=>v.forEach(i=>this.next(i)).input([1,2,3]) -> Signal 1 : 2 : 3
	    this.next = _nextStep.bind(_this, undefined);

	    // signal(A).bind : ((N, A) -> N(B)) -> Signal B
	    //
	    // Bind and apply a middleware to a signal context.
	    //
	    // The middleware should call next to propagate the signal.
	    // The middleware should skip next to halt the signal.
	    // The middleware is free to modify value and / or context.
	    // eg : bind((next, value) => next(++value)).input(1) -> Signal 2
	    this.bind = function (mw) {
	      var next = _bind || _apply;
	      _bind = function (fn, v) {
	        var args = [function () {
	          return !!next.apply(_state, [fn].concat([].slice.call(arguments)));
	        }].concat([].slice.call(arguments, 1));
	        return !!mw.apply(_state, args);
	      };
	      return this;
	    };

	    // signal(A).asSignal : (A) -> Signal A
	    //                      (A -> B) -> Signal B
	    //
	    // return a value, a function or a signal in Signal context
	    this.asSignal = function (t) {
	      if ((t || this).isSignal) return t || this;
	      var s = this.signal();
	      return typeof t === 'function' ? s.map(t) : s;
	    };

	    // signal(A).value : () -> A
	    //
	    // Return state as the current signal value.
	    this.value = function () {
	      return _state.value;
	    };

	    // signal(A).clone : () -> Signal A'
	    //
	    // Clone a signal into a new context
	    this.clone = function () {
	      return new Signal(new _wrap({ steps: _steps }));
	    };

	    // signal().prime : (A) -> Signal A
	    //
	    // Set signal state directly, bypassing any propagation steps
	    this.prime = function (v) {
	      _state.value = v;
	      return this;
	    };

	    // signal(A).map : (A -> B) -> Signal B
	    //
	    // Map over the current signal value
	    // - can halt propagation by returning this.halt
	    // - can short propagation by returning this.fail
	    this.map = _lift;

	    // signal(A).fail : (F) -> Signal A
	    //
	    // Register a fail handler.
	    // The handler will be called after failed propagation.
	    // The value passed to the handler will be the fail value.
	    this.fail = function (f) {
	      _fails.push(f.input || f);
	      return this;
	    };

	    // signal(A).feed : (A) -> Signal A
	    //
	    // Register a feed handler.
	    // The handler will be called after successful propagation.
	    // The value passed to the handler will be the state value.
	    this.feed = function (f) {
	      _feeds.push(f.input || f);
	      return this;
	    };

	    // signal(A).filter : (A -> boolean) -> Signal A
	    //
	    // Filter the signal value.
	    // - return true to continue propagation
	    // - return false to halt propagation
	    this.filter = function (f) {
	      return this.map(function (v) {
	        return f.apply(this, arguments) ? v : this.halt();
	      });
	    };

	    // signal(A).reduce : ((A, A) -> B) -> Signal B
	    //                    ((A, B) -> C, B) -> Signal C
	    //
	    // Continuously fold incoming signal values into an accumulated outgoing value.
	    // - first value will be passed accumulator if not supplied.
	    this.fold = function (f, accum) {
	      return this.map(function (v) {
	        if (!accum) {
	          accum = v;
	        } else {
	          var args = [accum].concat([].slice.call(arguments));
	          accum = f.apply(null, args);
	        }
	        return accum;
	      });
	    };

	    // signal(A).tap : (A) -> Signal A
	    //
	    // Tap the current signal state value.
	    // - tap ignores any value returned from the tap function.
	    //
	    // eg : tap(A => console.log(A)) -> Signal A
	    this.tap = function (f) {
	      return this.map(function (v) {
	        f.apply(this, arguments);
	        return v;
	      });
	    };

	    // signal(A).getState : () -> {value: A}
	    //
	    // Return the current signal state which minimally includes the current signal value.
	    //
	    // Note that state also includes signal context values which may be freely
	    // accessed and amended within the binding context of propagation. Like most
	    // J/S contexts, these values should be sparingly used in signal extensions
	    // and play no part in core signal propagation.
	    //
	    // example with context:
	    //  signal.tap(v => this.type = typeof v).input(true)
	    //  signal.getState() // -> {value: true, type: 'boolean'}
	    this.getState = function (raw) {
	      return raw ? _state : JSON.parse(JSON.stringify(_state));
	    };

	    // signal().extend : ({A}) -> Signal
	    //                   (Signal -> {A}) -> Signal
	    //
	    // Extend a signal with custom steps.
	    // - arg can be: object hash, eg {step: function}
	    //               function that receives a Signal instance and returns an object hash
	    // - chainable steps must return this.
	    this.extend = function (e) {
	      ext.push(e);
	      e = typeof e === 'function' ? e(this) || {} : e;
	      Object.keys(e).forEach(function (k) {
	        _this[k] = function () {
	          _state[k] = _state[k] || { signal: _this };
	          return e[k].call(_state[k]);
	        };
	      });
	      return this;
	    };

	    var ext = [];
	    this.signal = function (v) {
	      var s = new Signal(v);
	      for (var i = 0; i < ext.length; i++) {
	        s.extend(ext[i]);
	      }
	      return s;
	    };
	  }

	  // Constructor : () -> Signal
	  //
	  // Construct a new base signal

	  Signal.id = function (v) {
	    return v;
	  };
	  exports.default = Signal;
	});

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'), require('./thunkor'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal, global.thunkor);
	    global.error = mod.exports;
	  }
	})(this, function (exports, _signal, _thunkor) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.Error = Error;
	  exports.test = test;

	  var _signal2 = _interopRequireDefault(_signal);

	  var _thunkor2 = _interopRequireDefault(_thunkor);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  function Error(signal) {
	    var _fail;
	    signal.fail(function (error) {
	      _fail = _fail || error.message;
	    });
	    return {
	      active: function (m) {
	        return signal.map(function (v) {
	          return Object.keys(signal.channels).filter(function (k) {
	            return !signal.channels[k].value();
	          }).length ? this.fail(m) : v;
	        });
	      },
	      error: function () {
	        if (_fail) {
	          var v = _fail;
	          _fail = false;
	          return v;
	        }
	        return '';
	      }
	    };
	  }

	  function test(f, m) {
	    return function (v) {
	      var fail = this.fail;
	      return (0, _thunkor2.default)(f.apply(null, arguments), function (j) {
	        return j ? j === true ? v : j : fail(m);
	      });
	    };
	  }
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal);
	    global.match = mod.exports;
	  }
	})(this, function (exports, _signal) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Match;

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  var objConstructor = {}.constructor;
	  var vMatch = {},
	      litKey = new Date().getTime();

	  // Pattern match a signal value to pass or block propagation
	  //
	  // optional arguments:
	  //  mask = comma delimited list of strings matching channel names
	  //
	  //    or object of channel matching key/values - supports wildcards
	  //      key = 'n'  - match on channel 'n'
	  //            '*n' - match on all remaining channels ending with 'n'
	  //            'n*' - match on all remaining channels starting with 'n'
	  //            '*'  - match on all remaining channels
	  //
	  //      value = true  - match if truthy
	  //              value - match if equal (===)
	  //              false - match if falsey
	  //              undefined - match any
	  //              matchFn - see below
	  //
	  //  matchFn = function that takes the current match state and a mask value and
	  //            returns either of:
	  //              truthy value - signal the value
	  //              falsey value - block the value
	  //
	  //  lBound = minimum number of matches required to signal (default all)
	  //  uBound = maximum number of matches required to signal (default all)
	  //
	  // match is the core function upon which all other higher order matchers are
	  // based. Use this function as the basis for custom match steps. Review dedicated
	  // matchers every, some, one and none for examples.
	  //
	  // The boolean functions and, or, xor and not are all high order functions that return
	  // the appropriate match function. They also provide a basic pattern matching facility
	  // by way of signalling:
	  //
	  //    .match(Match.and(6, signal().tap(v))) // signal 6
	  //
	  // By default:
	  //    - every channel is tested (use some for early signal result)
	  //    - the signal is blocked if all channels are blocked
	  //    - the match function is provided by Match.and
	  //
	  function match() {

	    var ctx = this.asSignal();
	    var args = [].slice.call(arguments);
	    var mask, fn, lBound, uBound;

	    args.forEach(function (a) {
	      var T = typeof a;
	      if (T === 'string') {
	        if (!mask) {
	          mask = {};
	        };mask[a] = vMatch;
	      } else if (T === 'function' && !fn) fn = a;else if (T === 'number' && lBound === undefined) lBound = a;else if (T === 'number' && lBound !== undefined) uBound = a;else if (T === 'object' && !a.length) mask = a;
	    });
	    fn = fn || Match.and;

	    function maskFn(mf) {
	      var lv;
	      return function (v) {
	        var r = mf.call(ctx, v, lv);
	        lv = v;
	        return r;
	      };
	    }

	    var wcMask, wcKeys, isObject;
	    function memo(keys, v, m, wv) {
	      keys.forEach(function (k) {
	        if (wcMask[k] === undefined) {
	          if (k === '*') {
	            memo(Object.keys(v), v, m, m[k]);
	          } else if (k[0] === '*') {
	            var wk = k.substr(1);
	            memo(Object.keys(v).filter(function (vk) {
	              return vk.indexOf(wk) > 0;
	            }), v, m, m[k]);
	          } else if (k[k.length - 1] === '*') {
	            var wk = k.substr(0, k.length - 1);
	            memo(Object.keys(v).filter(function (vk) {
	              return vk.indexOf(wk) === 0;
	            }), v, m, m[k]);
	          } else wcMask[k] = wv === undefined ? m === v ? vMatch : typeof m[k] === 'function' ? maskFn(m[k]) : m[k] : wv;
	        }
	      });
	      return keys.length;
	    }

	    function matcher(v) {
	      var m = mask || v;
	      if (!wcMask) {
	        isObject = m.constructor === objConstructor;
	        wcMask = {};
	        if (!isObject || !memo(Object.keys(m), v, m, undefined)) {
	          wcMask[litKey] = v;
	        }
	        wcKeys = Object.keys(wcMask);
	        if (lBound === undefined) lBound = 1;
	        if (lBound === -1) lBound = wcKeys.length;
	        if (uBound === undefined) uBound = wcKeys.length;
	        if (uBound === -1) uBound = wcKeys.length;
	      }

	      // b* = boolean...
	      // v* = value...
	      // m* = match...
	      var count = 0;
	      var some = lBound === 1 && uBound === 2;
	      for (var i = 0; i < wcKeys.length; i++) {
	        var k = wcKeys[i];
	        var hasK = typeof v === 'object' && v.hasOwnProperty(k);
	        var bv = hasK && wcMask[k] === undefined;
	        if (!bv) {
	          var vv = hasK ? v[k] : mask ? undefined : v;
	          var mv = wcMask[k] === vMatch ? vv : wcMask[k];
	          bv = typeof mv === 'function' ? mv.call(ctx, vv) : mv;
	          if (bv === mv) bv = fn.call(ctx, vv, mv);
	        }
	        count += bv ? 1 : 0;
	        // early exit for some
	        if (some && count) break;
	      }
	      return count >= lBound && count <= uBound ? v : this.halt();
	    }
	    return ctx.map(matcher);
	  }

	  // build a custom match
	  function base() {
	    return match.apply(this, arguments);
	  }

	  // signal every or block
	  function all(m) {
	    return match.call(this, m, Match.and, -1);
	  }

	  // signal some or block
	  function any(m) {
	    return match.call(this, m, Match.and, 1, 2);
	  }

	  // signal one or block
	  function one(m) {
	    return match.call(this, m, Match.and, 1, 1);
	  }

	  // signal none or block
	  function none(m) {
	    return match.call(this, m, Match.and, 0, 0);
	  }

	  // logical match functions operate on current and previous channel values,
	  // or current value and mask if provided: Match.and(mvalue)
	  // or switch on current value and mask: Match.and(mvalue, Signal)
	  ;(function (ops) {
	    Object.keys(ops).forEach(function (op) {
	      Match[op] = function (v, m) {
	        if (arguments.length === 1) m = v;
	        var f = m,
	            s = f && f.isSignal || typeof f === 'function';
	        if (s) m = arguments.length === 2 ? v : undefined;
	        if (arguments.length === 1 || s) {
	          return function (v, lv) {
	            v = Match[op](v, m === undefined ? lv : m);
	            return s && v ? this.asSignal(f).input(v) : v;
	          };
	        }
	        return ops[op](v, m);
	      };
	    });
	  })({
	    and: function (v, m) {
	      return v && (m === v || m === true) || !v && m === false ? v === undefined ? true : v : false;
	    },
	    or: function (v, m) {
	      return v || m;
	    },
	    xor: function (v, m) {
	      return v && m !== v ? v : !v && m;
	    },
	    not: function (v, m) {
	      return !v && m || !v;
	    }
	  });

	  function Match(app) {
	    app.extend({
	      match: base,
	      all: all,
	      any: any,
	      one: one,
	      none: none
	    });
	  }
	});

/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal);
	    global.thunkor = mod.exports;
	  }
	})(this, function (exports, _signal) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = thunkor;

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function thunkor(v, resolve) {
	    resolve = resolve || _signal2.default.id;
	    return typeof v === 'function' ? function (next) {
	      v(function (tv) {
	        next(resolve(tv));
	      });
	    } : resolve(v);
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal);
	    global.utils = mod.exports;
	  }
	})(this, function (exports, _signal) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  var UNDEFINED = {};

	  var _types = {}.toString,
	      ARRAY = 'A',
	      OBJECT = 'O',
	      FUNCTION = 'F',
	      LITERAL = 'SNBDR';
	  var _type = function (t) {
	    return _types.call(t)[8];
	  };
	  var _typeOf = function (t) {
	    t = _type(t);
	    return ~LITERAL.indexOf(t) && LITERAL || t;
	  };

	  _type.ARRAY = ARRAY;
	  _type.OBJECT = OBJECT;
	  _type.FUNCTION = FUNCTION;
	  _type.LITERAL = LITERAL;

	  function diff(v1, v2, recurse) {
	    var T = _type(v1);
	    if (~_type.LITERAL.indexOf(T) || T === _type.FUNCTION || v1 === undefined || v2 === undefined || v1.isSignal) {
	      return v1 !== v2;
	    } else {
	      if (T === _type.ARRAY) {
	        return v1.length !== v2.length || v1.some(function (v, i) {
	          return recurse ? diff(v, v2[i], recurse) : v !== v2[i];
	        });
	      } else if (T === _type.OBJECT) {
	        var mk = Object.keys(v1),
	            vk = Object.keys(v2);
	        return mk.length != vk.length || typeof v2 !== 'object' || mk.some(function (k, i) {
	          return recurse ? diff(v1[k], v2[k], recurse) : v1[k] !== v2[k] || mk[i] !== vk[i];
	        });
	      }
	    }
	    return false;
	  }

	  function pathToData(data, key) {
	    var i = key.indexOf('[');
	    if (i > 0) {
	      var idx = parseInt(key.substr(i + 1, key.length - 2), 10);
	      var idxKey = key.substr(0, i);
	      return data.hasOwnProperty(idxKey) ? data[idxKey][idx] : UNDEFINED;
	    }
	    return data && data.hasOwnProperty(key) ? data[key] : UNDEFINED;
	  }

	  // return a value from a nested structure
	  // useful for plucking values from models and signals from signal groups
	  function lens(data, name, ns, def) {
	    if (arguments.length < 4) {
	      def = null;
	    }
	    var path = ((ns ? ns + '.' : '') + name).split('.');
	    var v = path.reduce(pathToData, data);

	    if (data && v === UNDEFINED && _typeOf(data) === _type.OBJECT && data.constructor === {}.constructor) {
	      v = Object.keys(data).reduce(function (a, k) {
	        return a !== UNDEFINED && a || lens(data[k], name, '', def);
	      }, UNDEFINED);
	    }
	    return v !== UNDEFINED ? v : def;
	  }

	  function traverse(s, fn, acc, tv) {
	    var c = s.channels || s.isSignal && { s: s } || s,
	        seed = acc != UNDEFINED,
	        fmap = [];
	    fn = fn || function id(s) {
	      return s;
	    };
	    function stamp(c, fn, sv) {
	      var obj = {};
	      Object.keys(c).forEach(function (ck) {
	        var t = c[ck];
	        var n = t.isSignal && t.name || ck;
	        var v = (sv || {})[n];
	        if (t.channels && t.channels !== s.channels) {
	          var a = stamp(t.channels, fn, v);
	          obj[n] = a[0];
	          acc = a[1];
	        } else {
	          fmap.push(acc = obj[n] = fn.apply(null, seed ? [acc, t, v] : [t, v]));
	        }
	      });
	      return [obj, acc, fmap];
	    }
	    return stamp(c, fn, tv);
	  }

	  const api = {

	    lens: lens,
	    typeOf: _typeOf,
	    type: _type,

	    // force arity on diffs and traverses
	    diff: function (v1, v2) {
	      return diff(v1, v2);
	    },

	    deepDiff: function (v1, v2) {
	      return diff(v1, v2, true);
	    },

	    equal: function (v1, v2) {
	      return !diff(v1, v2);
	    },

	    deepEqual: function (v1, v2) {
	      return !diff(v1, v2, true);
	    },

	    reduce: function (s, fn, seed, tv) {
	      return traverse(s, fn, seed, tv)[1];
	    },

	    map: function (s, fn, tv) {
	      return traverse(s, fn, UNDEFINED, tv)[0];
	    },

	    flatmap: function (s, fn, tv) {
	      return traverse(s, fn, UNDEFINED, tv)[2];
	    },

	    tap: function (s, fn, tv) {
	      traverse(s, fn, UNDEFINED, tv);
	    }
	  };

	  exports.default = api;
	});

/***/ }
/******/ ])
});
;