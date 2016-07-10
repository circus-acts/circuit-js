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
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circuit'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circuit, global.utils);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _circuit, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.test = exports.Error = undefined;

	  var _circuit2 = _interopRequireDefault(_circuit);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  exports.Error = _utils.Error;
	  exports.test = _utils.test;
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

	  function extend(proto, ext) {
	    var args = [].slice.call(arguments, 2);
	    if (ext) {
	      Object.keys(ext).forEach(function (k) {
	        proto[k] = ext[k];
	      });
	      args.unshift(proto);
	      proto = extend.apply(null, args);
	    }
	    return proto;
	  }

	  function fail(v) {
	    if (!(this instanceof fail)) return new fail(v);
	    this.value = v;
	  }

	  var api = {
	    ID: Object.freeze({ value: true }),
	    UNDEFINED: Object.freeze({ value: undefined }),
	    extend: extend,
	    fail: fail,
	    typeOf: _typeOf,
	    type: _type
	  };

	  exports.extend = extend;
	  exports.fail = fail;
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
	    if (s === _circus2.default.ID) s = function (v) {
	      return v;
	    };
	    if (s === _circus2.default.UNDEFINED) s = function () {
	      return _circus2.default.UNDEFINED;
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
	      if (typeof v === 'object' && ctx.channels) {
	        Object.keys(v).filter(function (k) {
	          return ctx.channels[k];
	        }).forEach(function (k) {
	          ctx.channels[k].prime(v[k]);
	        });
	      }
	      return _prime(v);
	    };
	  }

	  function Circuit() {

	    var _this = this;
	    var Signal = new _signal2.default(new _events2.default(this));

	    function joinPoint(sampleOnly, joinOnly, args) {
	      var ctx = this.asSignal().pure(sampleOnly ? false : joinOnly ? sdiff : true);
	      ctx.isJoin = joinOnly;

	      var signals = [].slice.call(args);
	      if (typeof signals[0] === 'string') {
	        ctx.name(signals.shift());
	      }

	      // flatten joining signals into channels
	      // - accepts and blocks out nested signals into circuit
	      var circuit = ctx.channels || {},
	          channels = [],
	          keys = [],
	          cIdx = 0;
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
	                args.push(ctx.value());
	                return f.apply(output, args);
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
	        return function (v, f) {
	          var jv = {};
	          // matches and fails bubble up
	          if (joinOnly && !f) {
	            for (var c = 0, l = channels.length; c < l; c++) {
	              var s = channels[c];
	              jv[keys[c]] = s.value();
	            }
	          } else {
	            jv = v === undefined ? _circus2.default.UNDEFINED : v;
	          }
	          step(f || (sampleOnly ? ctx.value() : jv));
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

	      // pass through for all joins but samples
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

	    // Latch output signal(s) to a boolean value or the boolean value
	    // of a latching input signal. The channel will remain at the latched
	    // state. Value latches are useful for disabling a circuit permanently
	    // or delaying
	    this.latch = function (l) {
	      var _this = this,
	          step = this.step(),
	          ls = _circus2.default.isSignal(l) && l.finally(function (v) {
	        lv = !!v;
	        if (lv) step(_this.value());
	      }),
	          lv = !ls && !!l;

	      if (lv) step(_this.value());
	      return this.map(function (v) {
	        return lv ? v : undefined;
	      });
	    };

	    var extensions = [];
	    this.extend = function (ext) {
	      extensions.push(ext);
	      if (typeof ext !== 'function') {
	        return _circus2.default.extend(this, ext);
	      }
	    };

	    this.extend(function (ctx) {
	      return {
	        join: _this.join,
	        merge: _this.merge,
	        sample: _this.sample,
	        latch: _this.latch,
	        prime: prime(ctx),
	        overlay: overlay(ctx)
	      };
	    });

	    var args = [].slice.call(arguments).forEach(function (module) {
	      module(_this);
	    });
	  }

	  exports.default = _circus2.default.extend(Circuit, _circus2.default);
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

	  _circus2.default.isSignal = function (s) {
	    return s && s.constructor === _Signal;
	  };

	  var AFTER = 'after';
	  var BEFORE = 'before';
	  var noop = function (v) {
	    return v;
	  };
	  var diff = function (v1, v2) {
	    return v1 !== v2;
	  };

	  var appId = 0;

	  function SignalContext(_propagation) {

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
	          _after,
	          _active;
	      var _finallys = [],
	          _pulse = _circus2.default.UNDEFINED;
	      var _pure,
	          _diff = diff;

	      // _runToState - next step
	      function _runToState(v, ns) {
	        var nv,
	            fv,
	            hv,
	            fail = v instanceof _circus2.default.fail;
	        _propagation.start(_this, v);
	        if (fail) {
	          nv = v;
	        } else if (!_pure || _diff(v, _head, _this.isJoin)) {
	          hv = nv = v;
	          // steps in FIFO order
	          for (var i = ns, il = _steps.length; i < il; i++) {
	            nv = _bindEach(_steps[i], [v]);
	            fail = nv instanceof _circus2.default.fail;
	            if (nv === undefined || fail) break;
	            v = nv;
	          }
	          _mutate(v, fail);
	        }

	        // finallys in FILO order - last value
	        if (nv !== undefined) {
	          for (var f = 0, fl = _finallys.length; f < fl; f++) {
	            _finallys[f].call(_this, v, fail ? nv : undefined);
	          }
	        }

	        if (_pulse !== _circus2.default.UNDEFINED) _mutate(_pulse);
	        if (!fail) _head = hv;

	        _propagation.stop(_this, _state);
	        return nv;
	      }

	      function _mutate(v, fail) {
	        _active = v === undefined || fail ? undefined : true;
	        if (v === _circus2.default.UNDEFINED) v = undefined;
	        _state = v;
	      }

	      function _bindEach(f, args) {
	        return f.apply(_this, args);
	      }

	      function _return(f) {
	        if (_circus2.default.isSignal(f)) {
	          return f.value;
	        }
	        if (typeof f === 'object') {
	          for (var p in f) if (f.hasOwnProperty(p)) {
	            _this.channels = _this.channels || {};
	            return _return(_this.channels[p] = _this.asSignal(f[p]));
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
	            _propagation.start(_this, v);
	            try {
	              var args = [].slice.call(arguments).concat(done);
	              return _f.apply(_this, args);
	            } finally {
	              _propagation.stop(_this, v);
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
	          return _runToState(v, next);
	        };
	      }

	      this.asSignal = function (v) {
	        if (_circus2.default.isSignal(v || this)) return v || this;
	        if (Signal.create) {
	          var s = Signal.create();
	          return typeof v === 'function' ? s.map(v) : s;
	        }
	      };

	      // Set signal state directly bypassing propagation steps
	      this.prime = function (v) {
	        _mutate(v);
	        return _this;
	      };

	      // Pass a value into a signal and receive a value back.
	      // This method produces state propagation throughout a connected circuit
	      // Note that the value returned is not always the state value. A fail
	      // will short the circuit and be returned immediately from this input.
	      this.value = function (v) {
	        if (arguments.length) return _runToState(v, 0);
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

	      // An active signal will propagate state
	      // An inactive signal will prevent state propagation
	      this.active = function (reset) {
	        if (arguments.length) {
	          if (!reset) {
	            _reset.push(_active), _active = false;
	          } else {
	            _active = !_reset.length || _reset.pop();
	          }
	        }
	        return !!_active;
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
	        if (true) {
	          _this.$finallys = _finallys;
	        }
	        return _this;
	      };

	      this.pure = function (diff) {
	        _pure = diff !== false;
	        if (typeof diff === 'function') _diff = diff;
	        return _this;
	      };

	      // Tap the current signal state value
	      // The function will be called in signal context
	      this.tap = function (f) {
	        return this.map(function (v) {
	          f.apply(_this, arguments);
	          return v === undefined ? _circus2.default.UNDEFINED : v;
	        });
	      };

	      // Extend a signal with custom step functions either through an
	      // object hash, or a context bound function that returns an object hash
	      // Chainable step functions need to return the context.
	      this.extend = function (ext) {
	        ext = typeof ext === 'function' ? ext(this) : ext;
	        return _circus2.default.extend(this, ext);
	      };

	      return _this;
	    }

	    Signal.prototype = _Signal.prototype;
	    Signal.prototype.constructor = _Signal;

	    return Signal;
	  }

	  // todo - consider wrapping async in HOF
	  var _fnArgs = /\((.+)\)\s*==>|function\s*.*?\(([^)]*)\)/;
	  _circus2.default.isAsync = function (f) {
	    var m = f.toString().match(_fnArgs);
	    return m && (m[1] || m[2]).indexOf('next') > 0;
	  };

	  _circus2.default.after = function (f) {
	    return { state: AFTER, value: f };
	  };

	  _circus2.default.before = function (f) {
	    return { state: BEFORE, value: f };
	  };

	  exports.default = SignalContext;
	});

/***/ },
/* 5 */
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
	    global.utils = mod.exports;
	  }
	})(this, function (exports, _circus) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.Error = Error;
	  exports.test = test;

	  var _circus2 = _interopRequireDefault(_circus);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  function diff(v1, v2, recurse) {
	    var T = _circus2.default.type(v1);
	    if (~_circus2.default.type.LITERAL.indexOf(T) || T === _circus2.default.type.FUNCTION || v1 === undefined || v2 === undefined || _circus2.default.isSignal(v1)) {
	      return v1 !== v2;
	    } else {
	      if (T === _circus2.default.type.ARRAY) {
	        return v1.length !== v2.length || v1.some(function (v, i) {
	          return recurse ? diff(v, v2[i], recurse) : v !== v2[i];
	        });
	      } else if (T === _circus2.default.type.OBJECT) {
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
	      return data.hasOwnProperty(idxKey) ? data[idxKey][idx] : _circus2.default.UNDEFINED;
	    }
	    return data && data.hasOwnProperty(key) ? data[key] : _circus2.default.UNDEFINED;
	  }

	  function lens(data, name, ns, def) {
	    if (arguments.length < 4) {
	      def = null;
	    }
	    var path = ((ns ? ns + '.' : '') + name).split('.');
	    var v = path.reduce(pathToData, data);

	    if (data && v === _circus2.default.UNDEFINED && _circus2.default.typeOf(data) === _circus2.default.type.OBJECT && data.constructor === {}.constructor) {
	      v = Object.keys(data).reduce(function (a, k) {
	        return a !== _circus2.default.UNDEFINED && a || lens(data[k], name, '', def);
	      }, _circus2.default.UNDEFINED);
	    }
	    return v !== _circus2.default.UNDEFINED ? v : def;
	  }

	  function traverse(s, fn, acc, tv) {
	    var c = s.channels || _circus2.default.isSignal(s) && { s: s } || s,
	        seed = acc != _circus2.default.UNDEFINED,
	        fmap = [];
	    fn = fn || function id(s) {
	      return s;
	    };
	    function stamp(c, fn, sv) {
	      var obj = {};
	      Object.keys(c).forEach(function (ck) {
	        var t = c[ck];
	        var n = _circus2.default.isSignal(t) && t.name || ck;
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

	  function Error(ctx) {
	    if (!this instanceof Error) return new Error(ctx);
	    ctx.extend(function (ctx) {
	      var _fail;
	      ctx.finally(function (v, f) {
	        if (f) {
	          _fail = _fail || f.value || true;
	        }
	      });

	      // important: this functor flatmaps a circuit's channels
	      // at the point that it is employed. Make this the last
	      // binding if all channels are required.
	      var channels = api.flatmap(ctx);

	      return {
	        active: function (m) {
	          return ctx.map(function (v) {
	            for (var c = 0; c < channels.length; c++) {
	              if (!channels[c].active()) return _circus2.default.fail(m || 'required');
	            }
	            return v;
	          });
	        },
	        error: function (v) {
	          if (_fail) {
	            var v = _fail;
	            _fail = false;
	            return v || true;
	          }
	          return '';
	        }
	      };
	    });
	  }

	  function test(f, m) {
	    return _circus2.default.isAsync(f) ? function (v, next) {
	      return f.call(this, v, function (j) {
	        return next(j ? j === true ? v : j : _circus2.default.fail(m));
	      });
	    } : function (v) {
	      var j = f.call(this, v);
	      return j ? j === true ? v : j : _circus2.default.fail(m);
	    };
	  }

	  const api = {

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

	    // lens
	    // re,turn a value from a nested structure
	    // useful for plucking values and signals from models and signal groups respectively
	    lens: lens,

	    reduce: function (s, fn, seed, tv) {
	      return traverse(s, fn, seed, tv)[1];
	    },

	    map: function (s, fn, tv) {
	      return traverse(s, fn, _circus2.default.UNDEFINED, tv)[0];
	    },

	    flatmap: function (s, fn, tv) {
	      return traverse(s, fn, _circus2.default.UNDEFINED, tv)[2];
	    },

	    tap: function (s, fn, tv) {
	      traverse(s, fn, _circus2.default.UNDEFINED, tv);
	    },

	    test: test
	  };

	  exports.default = api;
	});

/***/ }
/******/ ])
});
;