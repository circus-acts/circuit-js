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
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circuit'), require('./circus'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circuit, global.circus);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _circuit, _circus) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.test = exports.Circuit = undefined;

	  var _circuit2 = _interopRequireDefault(_circuit);

	  var _circus2 = _interopRequireDefault(_circus);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  _circus2.default.Circuit = _circuit2.default;
	  exports.Circuit = _circuit2.default;
	  exports.test = _circus.test;
	  exports.default = _circus2.default;
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
	    global.circus = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
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

	  function test(f, m) {
	    return function (v) {
	      var j = f.apply(this, arguments);
	      return j ? j === true ? v : j : api.fail(m);
	    };
	  }

	  var api = {
	    extend: function extend(proto, ext) {
	      var args = [].slice.call(arguments, 2);
	      if (ext) {
	        Object.keys(ext).forEach(function (k) {
	          proto[k] = ext[k];
	        });
	        args.unshift(proto);
	        proto = extend.apply(null, args);
	      }
	      return proto;
	    },

	    test: test,
	    typeOf: _typeOf,
	    type: _type
	  };

	  exports.test = test;
	  exports.default = api;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circus'), require('./events'), require('./signal'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circus, global.events, global.signal);
	    global.circuit = mod.exports;
	  }
	})(this, function (exports, _circus, _events, _signal) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _circus2 = _interopRequireDefault(_circus);

	  var _events2 = _interopRequireDefault(_events);

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  function sdiff(v1, v2, isJoin) {
	    if (!isJoin || v2 === undefined) return v1 !== v2;
	    for (var i = 0, k = Object.keys(v1); i < k.length; i++) {
	      if (v1[k[i]] !== v2[k[i]]) return true;
	    }
	    return false;
	  }

	  function toSignal(app, s) {
	    if (s === _circus2.default.UNDEFINED) s = function (v) {
	      return v;
	    };
	    if (!_circus2.default.isSignal(s)) {
	      var v = s,
	          fn = typeof s === 'object' ? 'join' : 'map';
	      if (typeof s !== 'function' && fn === 'map') s = function () {
	        return v;
	      };
	      s = app.signal()[fn](s);
	    }
	    return s;
	  }

	  // overlay circuit behaviour aligned on channel input / outputs
	  function overlay(ctx) {
	    return function recurse(g, c) {
	      c = c || ctx;
	      Object.keys(g).forEach(function (k) {
	        var oo = typeof g[k] !== 'function' && g[k].length ? g[k] : [null, g[k]];
	        for (var i = 0; i < 2; i++) {
	          var o = oo[i];
	          if (_circus2.default.isSignal(o) || typeof o === 'function') {
	            var s = c.channels[k] || c.channels[Object.keys(c.channels).find(function (ck) {
	              return c.channels[ck].output.name === k;
	            })].output;
	            s.map(i && o || _circus2.default.before(o));
	          } else if (o) recurse(o, c.channels[k]);
	        }
	      });
	      return this;
	    };
	  }

	  function prime(ctx) {
	    var _prime = ctx.prime.bind(ctx);
	    return function prime(v) {
	      var _this = this;
	      if (typeof v === 'object' && _this.channels) {
	        Object.keys(v).filter(function (k) {
	          return _this.channels[k];
	        }).forEach(function (k) {
	          _this.channels[k].prime(v[k]);
	        });
	      }
	      return _prime(v);
	    };
	  }

	  function Circuit() {

	    var extensions = [];
	    var _this = this;

	    var Signal = new _signal2.default(new _events2.default(this));

	    function joinPoint(sampleOnly, joinOnly, args) {
	      var ctx = this.asSignal().pure(sampleOnly ? false : sdiff);
	      ctx.isJoin = joinOnly;

	      var signals = [].slice.call(args);
	      if (typeof signals[0] === 'string') {
	        ctx.name(signals.shift());
	      }

	      // flatten joining signals into channels
	      // - accepts and blocks out nested signals into circuit
	      var circuit = ctx.channels || {},
	          channels = [],
	          cIdx = 0;
	      var keys = [];
	      while (signals.length) {
	        var signal = signals.shift();
	        if (!_circus2.default.isSignal(signal)) {
	          Object.keys(signal).forEach(function (k, i) {
	            var output = toSignal(_this, signal[k]),
	                input = output;
	            if (output.id) {
	              output.name = output.name || k;
	              input = output.channel(_circus2.default.before);
	              input.name = k;

	              // bind each joining signal to the context value
	              output.bind(function (f, args) {
	                return f.apply(output, args.concat(ctx.value()));
	              });

	              // for overlays
	              input.output = output;
	            } else {
	              input = { value: output().value };
	              keys[i] = k;
	            }
	            circuit[k] = input;
	            channels.push(input);
	          });
	        } else {
	          channels.push(signal);
	          circuit[signal.name || cIdx++] = signal;
	        }
	      }

	      var step = ctx.step();
	      function merge(i) {
	        var key = keys[i] = channels[i].name || i;
	        return function (v) {
	          var jv = {};
	          // matches and fails bubble up
	          if ((joinOnly || sampleOnly) && !(v instanceof _circus2.default.fail)) {
	            for (var c = 0, l = channels.length; c < l; c++) {
	              var s = channels[c];
	              jv[keys[c]] = s.value();
	            }
	          } else jv = v;
	          step(sampleOnly ? ctx.value() : jv);
	        };
	      }

	      for (var i = 0, l = channels.length; i < l; i++) {
	        // merge incoming signals or values into join point
	        var channel = channels[i];
	        if (channel.finally) {
	          channel.finally(merge(i));
	        }

	        if (true) {
	          channels[i].$jp = channels[i].$jp || [];
	          channels[i].$jp.push(ctx);
	        }
	      }

	      // hide the channel array but expose as circuit
	      ctx.channels = circuit;

	      return ctx.map(function (v) {
	        return sampleOnly ? undefined : v;
	      });
	    }

	    // public

	    this.signal = Signal.create = function (name) {
	      return extensions.reduce(function (s, ext) {
	        ext = typeof ext === 'function' ? ext(s) : ext;
	        return _circus2.default.extend(s, ext);
	      }, new Signal(name));
	    };

	    this.asSignal = function () {
	      return this.signal();
	    };

	    // Join 1 or more input signals into 1 output signal
	    // Input signal channels will be mapped onto output signal keys
	    // - duplicate channels will be merged
	    this.join = function () {
	      return joinPoint.call(this, false, true, arguments);
	    };

	    // Merge 1 or more input signals into 1 output signal
	    // The output signal value will be the latest input signal value
	    this.merge = function () {
	      return joinPoint.call(this, false, false, arguments);
	    };

	    // Sample input signal(s)
	    this.sample = function () {
	      return joinPoint.call(this, true, false, arguments);
	    };

	    this.extend = function (ext) {
	      extensions.push(ext);
	      if (typeof ext !== 'function') {
	        return _circus2.default.extend(this, ext);
	      }
	    };

	    this.extend({
	      join: _this.join,
	      merge: _this.merge,
	      sample: _this.sample
	    });

	    this.extend(function (ctx) {
	      return {
	        prime: prime(ctx),
	        overlay: overlay(ctx)
	      };
	    });

	    var args = [].slice.call(arguments).forEach(function (module) {
	      module(_this);
	    });
	  }

	  exports.default = Circuit;
	});

/***/ },
/* 3 */
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
	    global.events = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Events;
	  function Events(app) {

	    var events = [],
	        pCount = 0,
	        steadyCircuit = true,
	        noop = function () {};

	    app.stateChange = function (s, e) {
	      //filo event order
	      _events.unshift({
	        start: s || noop,
	        stop: e || noop
	      });
	    };

	    return {
	      // Circuits are active when they start propagation and steady when they stop
	      start: function (ctx, v) {
	        if (!pCount++ && steadyCircuit && events.length) {
	          for (var i = 0, el = events.length; i < el; i++) {
	            events[i].start(ctx, v);
	          }
	        }
	      },

	      // Circuit propagation is re-entrant. Any 'extra' circuit work performed in this
	      // state will simply prolong it until there are no more propagations.
	      stop: function (ctx, v) {
	        if (! --pCount && events.length) {
	          if (steadyCircuit) {
	            steadyCircuit = false;
	            for (var i = 0, el = events.length; i < el; i++) {
	              events[i].stop(ctx, v);
	            }
	          } else steadyCircuit = true;
	        }
	      }
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
	    factory(exports, require('./circus'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circus);
	    global.signal = mod.exports;
	  }
	})(this, function (exports, _circus) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _circus2 = _interopRequireDefault(_circus);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  var _Signal = function (aId, sId, _name) {
	    this.name = _name;
	    var _this = this;
	    this.id = function () {
	      return _this;
	    };
	    this.id.constructor = _Signal;
	    if (true) {
	      this.$id = aId + '.' + sId;
	    }
	  };
	  _Signal.prototype = {};

	  _circus2.default.isSignal = function (s) {
	    return s && s.constructor === _Signal;
	  };

	  var FSTATE = 'fs';
	  var AFTER = 'after';
	  var BEFORE = 'before';
	  var noop = function (v) {
	    return v;
	  };
	  var diff = function (v1, v2) {
	    return v1 !== v2;
	  };

	  var appId = 0;

	  function AppState(_event) {

	    var aId = ++appId;
	    var sId = 0;

	    // Generate a new signal
	    function Signal(_name) {

	      _Signal.call(this, aId, ++sId, _name);

	      // private
	      var _this = this;
	      var _head, _state;
	      var _step = 0,
	          _steps = [],
	          _finallys = [],
	          _pulse = _circus2.default.FALSE;
	      var _after, _fail;
	      var _pure,
	          _diff = diff;

	      // _runToState - next step
	      function _runToState(v, ns, _b) {
	        var nv;
	        _event.start(_this, v);
	        if (v instanceof _circus2.default.fail) {
	          _fail = nv = _fail || v;
	        } else if (!_pure || _diff(v, _head, _this.isJoin)) {
	          _head = _pure && v;
	          nv = v;
	          // steps in FIFO order
	          for (var i = ns, il = _steps.length; i < il; i++) {
	            nv = _b(_steps[i], [v]);
	            if (nv === undefined || nv instanceof _circus2.default.fail) break;
	            v = nv;
	          }
	          _mutate(v, nv);
	        }

	        // finallys in FILO order - last value
	        if (nv !== undefined) {
	          for (var f = 0, fl = _finallys.length; f < fl; f++) {
	            _finallys[f].call(_this, nv);
	          }
	        }

	        if (_pulse !== _circus2.default.FALSE) _mutate(_pulse);

	        _event.stop(_this, _state);
	        return nv;
	      }

	      function _mutate(v, nv) {
	        _fail = nv instanceof _circus2.default.fail && nv;
	        if (v && v.state === FSTATE) v = v.value;
	        _state = v;
	      }

	      function _bindEach(f, args) {
	        return f.apply(_this, args);
	      }

	      function _return(f) {
	        if (_circus2.default.isSignal(f)) {
	          f = f.value;
	        } else if (typeof f === 'object' && _this.channels) {
	          for (var p in f) if (f.hasOwnProperty(p)) {
	            var s = _this.asSignal(f[p]);
	            _this.channels[p] = s;
	            return _return(s);
	          }
	        }
	        return f;
	      }

	      function _functor(f) {
	        var _f = _return(f);
	        if (f !== _f && f.finally) f.finally(_next());
	        if (_circus2.default.isAsync(_f)) {
	          var done = _next();
	          return function async(v) {
	            _event.start(_this, v);
	            try {
	              var args = [].slice.call(arguments).concat(done);
	              return _f.apply(_this, args);
	            } finally {
	              _event.stop(_this, v);
	            }
	          };
	        }
	        return _f;
	      }

	      // Allow values to be injected into the signal at arbitrary step points.
	      // State propagation continues from this point
	      function _next() {
	        var next = (_after ? _steps.length : _step) + 1;
	        return function (v) {
	          _runToState(v, next, _bindEach);
	        };
	      }

	      this.asSignal = function (v) {
	        if (_circus2.default.isSignal(v || this)) return v || this;
	        var s = Signal.create();
	        return typeof v === 'function' ? s.map(v) : s;
	      };

	      // Set signal state directly bypassing propagation steps
	      this.prime = function (v) {
	        _mutate(v, v);
	        return _this;
	      };

	      // Set or read the signal state value
	      // This method produces state propagation throughout a connected circuit
	      this.value = function (v) {
	        if (arguments.length) {
	          return _runToState(v, 0, _bindEach);
	        }
	        return _state;
	      }, this.step = _next;

	      // Return to inactive pristine (or v) state after propagation
	      this.pulse = function (v) {
	        _pulse = v;
	        return _this;
	      };

	      // Map the current signal value and propagate
	      // The function will be called in signal context
	      // can halt propagation by returning undefined - retain current state (finally(s) not invoked)
	      // can cancel propagation by returning Circus.fail - revert to previous state (finally(s) invoked)
	      // Note that to map state onto undefined the pseudo value Circus.UNDEFINED must be returned
	      this.map = function (f) {
	        var _b = f.state === BEFORE,
	            _f = _functor(_b && f.value || f);
	        _b ? _steps.unshift(_f) : _steps.splice(_step, 0, _f);
	        _step++;
	        return _this;
	      };

	      // create an I/O channel where 2 signals share state and flow in i -> o order
	      // Optionally:
	      // - take behaviour
	      // todo: replace (ie wrap) public channel with before / after
	      //       capture step in channel to support after.joins
	      this.channel = function (io, take) {
	        var split = _circus2.default.extend({}, _this, { constructor: _Signal });
	        var map = function (f) {
	          var _b = f.state === BEFORE,
	              _f = _functor(_b && f.value || f);
	          _b ? _steps.splice(_step, 0, _f) : _steps.push(_f);
	          return _this;
	        };
	        _Signal.call(split, aId, ++sId, _name);
	        // return split as after / before, with step ownership resolved
	        _after = !io || io === _circus2.default.after;
	        if (_after ? !!take : !take) _step = 0;
	        if (_after) split.map = map;else _this.map = map;
	        return split;
	      };

	      // convenient compose functor that maps from left to right
	      this.flow = function () {
	        var args = [].slice.call(arguments);
	        for (var i = 0; i < args.length; i++) {
	          this.map(args[i]);
	        }
	        return _this;
	      };

	      // Bind the signal to a new context
	      this.bind = function (f) {
	        var __b = _bindEach;
	        _bindEach = function (step, args) {
	          var bs = function () {
	            return __b(step, arguments);
	          };
	          return f.call(_this, bs, args);
	        };
	        return _this;
	      };

	      // finally functions are executed in FILO order after all step functions regardless of state
	      this.finally = function (f) {
	        var fifo = f.state === BEFORE,
	            _f = _return(fifo && f.value || f);
	        if (_circus2.default.isSignal(_f)) {
	          var fs = _f;
	          _f = function (v) {
	            fs.value(v);
	          };
	        }
	        _finallys[fifo ? 'unshift' : 'push'](_f);
	        return _this;
	      };

	      this.pure = function (diff) {
	        _pure = diff !== false;
	        if (typeof diff === 'function') _diff = diff;
	        return _this;
	      };

	      this.error = function () {
	        if (_fail) {
	          var v = _fail.value;
	          _fail = false;
	          return v || true;
	        }
	        return '';
	      };

	      // Tap the current signal state value
	      // The function will be called in signal context
	      this.tap = function (f) {
	        return this.map(function (v) {
	          f.apply(_this, arguments);
	          return v === undefined ? _circus2.default.UNDEFINED : v;
	        });
	      };

	      return _this;
	    }

	    Signal.prototype = _Signal.prototype;
	    Signal.prototype.constructor = _Signal;

	    return Signal;
	  }

	  // shared
	  _circus2.default.TRUE = Object.freeze({ state: FSTATE, value: true });
	  _circus2.default.FALSE = Object.freeze({ state: FSTATE, value: false });
	  _circus2.default.NULL = Object.freeze({ state: FSTATE, value: null });
	  _circus2.default.UNDEFINED = Object.freeze({ state: FSTATE, value: undefined });
	  _circus2.default.ID = Object.freeze({ state: FSTATE, value: undefined });

	  _circus2.default.fail = function (v) {
	    if (!(this instanceof _circus2.default.fail)) return new _circus2.default.fail(v);this.value = v;
	  };

	  // todo - consider wrapping async in HOF
	  var _fnArgs = /function\s.*?\(([^)]*)\)/;
	  _circus2.default.isAsync = function (f) {
	    return f.length && f.toString().match(_fnArgs)[1].indexOf('next') > 0;
	  };

	  _circus2.default.after = function (f) {
	    return { state: AFTER, value: f };
	  };

	  _circus2.default.before = function (f) {
	    return { state: BEFORE, value: f };
	  };

	  exports.default = AppState;
	});

/***/ }
/******/ ])
});
;