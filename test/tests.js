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
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(16), __webpack_require__(9), __webpack_require__(14), __webpack_require__(12), __webpack_require__(18), __webpack_require__(15), __webpack_require__(11), __webpack_require__(17), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(require('./signal-tests'), require('./circuit-tests'), require('./join-tests'), require('./error-tests'), require('./utils-tests'), require('./match-tests'), require('./composables-tests'), require('./spikes/validation'), require('./issues'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(global.signalTests, global.circuitTests, global.joinTests, global.errorTests, global.utilsTests, global.matchTests, global.composablesTests, global.validation, global.issues);
	    global.index = mod.exports;
	  }
	})(this, function () {});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(5), __webpack_require__(8), __webpack_require__(7), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circuit'), require('./signal'), require('./match'), require('./error'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circuit, global.signal, global.match, global.error);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _circuit, _signal, _match, _error) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.test = exports.Error = exports.Match = exports.Signal = undefined;

	  var _circuit2 = _interopRequireDefault(_circuit);

	  var _signal2 = _interopRequireDefault(_signal);

	  var _match2 = _interopRequireDefault(_match);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  exports.Signal = _signal2.default;
	  exports.Match = _match2.default;
	  exports.Error = _error.Error;
	  exports.test = _error.test;
	  exports.default = _circuit2.default;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	  exports.thunkOr = thunkOr;
	  exports.pure = pure;

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

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
	      return data.hasOwnProperty(idxKey) ? data[idxKey][idx] : _signal2.default.UNDEFINED;
	    }
	    return data && data.hasOwnProperty(key) ? data[key] : _signal2.default.UNDEFINED;
	  }

	  // return a value from a nested structure
	  // useful for plucking values from models and signals from signal groups
	  function lens(data, name, ns, def) {
	    if (arguments.length < 4) {
	      def = null;
	    }
	    var path = ((ns ? ns + '.' : '') + name).split('.');
	    var v = path.reduce(pathToData, data);

	    if (data && v === _signal2.default.UNDEFINED && _typeOf(data) === _type.OBJECT && data.constructor === {}.constructor) {
	      v = Object.keys(data).reduce(function (a, k) {
	        return a !== _signal2.default.UNDEFINED && a || lens(data[k], name, '', def);
	      }, _signal2.default.UNDEFINED);
	    }
	    return v !== _signal2.default.UNDEFINED ? v : def;
	  }

	  function traverse(s, fn, acc, tv) {
	    var c = s.channels || s.isSignal && { s: s } || s,
	        seed = acc != _signal2.default.UNDEFINED,
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

	    lens: lens,

	    reduce: function (s, fn, seed, tv) {
	      return traverse(s, fn, seed, tv)[1];
	    },

	    map: function (s, fn, tv) {
	      return traverse(s, fn, _signal2.default.UNDEFINED, tv)[0];
	    },

	    flatmap: function (s, fn, tv) {
	      return traverse(s, fn, _signal2.default.UNDEFINED, tv)[2];
	    },

	    tap: function (s, fn, tv) {
	      traverse(s, fn, _signal2.default.UNDEFINED, tv);
	    },
	    typeOf: _typeOf,
	    type: _type
	  };

	  exports.default = api;
	  function thunkOr(v, resolve) {
	    resolve = resolve || _signal2.default.id;
	    return typeof v === 'function' ? function (next) {
	      v(function (tv) {
	        next(resolve(tv));
	      });
	    } : resolve(v);
	  }

	  var hv;
	  function pure(diff) {
	    diff = diff || function (v1, v2) {
	      return v1 !== v2;
	    };
	    return function (next, v, ctx) {
	      if (diff(hv, v)) {
	        var nv = next(v, ctx);
	        if (typeof v !== _signal2.default.fail) {
	          hv = v;
	        }
	        return v;
	      }
	    };
	  }
	});

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal, global.utils);
	    global.error = mod.exports;
	  }
	})(this, function (exports, _signal, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.Error = Error;
	  exports.test = test;

	  var _signal2 = _interopRequireDefault(_signal);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  function Error(ctx) {
	    ctx.extend(function (signal) {
	      var _fail;
	      signal.fail(function (error) {
	        _fail = _fail || error;
	      });
	      return {
	        active: function (m) {
	          return signal.map(function (v) {
	            return Object.keys(signal.channels).filter(function (k) {
	              return !signal.channels[k].value();
	            }).length ? _signal2.default.fail(m) : v;
	          });
	        },
	        error: function () {
	          if (_fail) {
	            var v = _fail;
	            _fail = false;
	            return v.error;
	          }
	          return '';
	        }
	      };
	    });
	  }

	  function test(f, m) {
	    return function (v) {
	      return (0, _utils.thunkOr)(f.apply(null, arguments), function (j) {
	        return j ? j === true ? v : j : _signal2.default.fail(m);
	      });
	    };
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal, global.utils);
	    global.circuit = mod.exports;
	  }
	})(this, function (exports, _signal, _utils) {
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

	  function sdiff(v1, v2) {
	    // keep open until first signal
	    if (v1 === undefined || v2 === undefined || typeof v1 !== typeof v2 || v1.length !== v2.length) return true;

	    for (var i = 0, k = Object.keys(v1); i < k.length; i++) {
	      if (v1[k[i]] !== v2[k[i]]) return true;
	    }
	    return false;
	  }

	  function toSignal(app, s) {
	    if (!s || !s.isSignal) {
	      var v = s,
	          fmap = typeof s === 'object' ? 'join' : 'map';
	      if (typeof s !== 'function' && fmap === 'map') s = function () {
	        return v;
	      };
	      s = app.signal()[fmap](s);
	    }
	    return s;
	  }

	  // overlay circuit behaviour aligned on channel input / outputs
	  function overlay(s) {
	    return function recurse(g, c) {
	      c = c || s;
	      Object.keys(g).forEach(function (k) {
	        var o = g[k];
	        if (o.isSignal || typeof o === 'function') {
	          // use apply here
	          c.channels[k].map(o);
	        } else if (o) recurse(o, c.channels[k]);
	      });
	      return s;
	    };
	  }

	  function prime(s) {
	    var _prime = s.prime.bind(s);
	    return function prime(v, c) {
	      s = c || s;
	      if (typeof v === 'object' && s.channels) {
	        Object.keys(v).filter(function (k) {
	          return s.channels[k];
	        }).forEach(function (k) {
	          s.channels[k].prime(v[k]);
	        });
	      }
	      return _prime(v);
	    };
	  }

	  function pure(s) {
	    return function (diff) {
	      return s.bind((0, _utils.pure)(diff || sdiff));
	    };
	  }

	  function joinPoint(sampleOnly, joinOnly, circuit) {
	    var _jp = this.asSignal();
	    var channels = _jp.channels || {},
	        signals = [];
	    Object.keys(circuit).forEach(function (k, i) {
	      var signal = toSignal(_jp, circuit[k]);
	      if (signal.id) {
	        signal.name = k;
	        // bind each joining signal to the context value
	        signal.bind(function (next, v, ctx) {
	          ctx[_jp.name || 'value'] = _jp.value();
	          return next.call(_jp, v, ctx);
	        });
	        // channels are simply aggregated as circuit inputs but care must be
	        // taken not to overwrite channels with the same name. Duplicates are
	        // lifted into the existing channel and cannot directly feed the circuit.
	        if (!channels[k]) {
	          channels[k] = signal;
	          signal.feed(merge(signal.name)).fail(_jp.input);
	        } else {
	          channels[k].map(signal);
	        }
	      }
	      // signal is an identity
	      else {
	          signal = { name: k, value: signal().value };
	        }
	      signals.push(signal);
	    });

	    var step = _jp.step();
	    function merge(channel) {
	      return function (v) {
	        var jv = joinOnly && signals.reduce(function (jv, s) {
	          jv[s.name] = s.value();
	          return jv;
	        }, {}) || v;
	        step({ key: channel, value: sampleOnly ? sv : jv });
	      };
	    }

	    // bind the channel key into ctx
	    _jp.bind(function (next, v, ctx) {
	      ctx.channel = v && v.key || _jp.name;
	      return next(v && v.hasOwnProperty('value') ? v.value : v, ctx);
	    });

	    // expose the channel in circuit form (can be flatmap'd later if required)
	    _jp.channels = channels;

	    // halt sampled signals at this step
	    var sv;
	    return _jp.filter(function (v) {
	      sv = v;
	      return !sampleOnly;
	    });
	  }

	  // Join 1 or more input signals into 1 output signal
	  // Input signals will be mapped onto output signal channels
	  // - duplicate channels will be merged
	  function join(c) {
	    return joinPoint.call(this, false, true, c);
	  }

	  // Merge 1 or more input signals into 1 output signal
	  // The output signal value will be the latest input signal value
	  function merge(c) {
	    return joinPoint.call(this, false, false, c);
	  }

	  // Sample input signal(s)
	  function sample(c) {
	    return joinPoint.call(this, true, false, c);
	  }

	  function Circuit() {

	    // a circuit is a signal with join points
	    var _this = new _signal2.default().extend(function (signal) {
	      return {
	        join: join,
	        merge: merge,
	        sample: sample,
	        prime: prime(signal),
	        pure: pure(signal),
	        overlay: overlay(signal)
	      };
	    });

	    // override to filter out this - Circuit().join returns a new circuit
	    _this.asSignal = function (s) {
	      return s && s.isSignal && s !== _this ? s : _this.signal(s);
	    };

	    var args = [].slice.call(arguments).forEach(function (module) {
	      module(_this);
	    });

	    return _this;
	  }

	  exports.default = Circuit;
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal, global.utils);
	    global.composables = mod.exports;
	  }
	})(this, function (exports, _signal, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Composables;

	  var _signal2 = _interopRequireDefault(_signal);

	  var _utils2 = _interopRequireDefault(_utils);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

	  var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1;

	  function Composables(app) {
	    app.extend({
	      // A steady state signal
	      always: function (v) {
	        return this.map(function () {
	          return v;
	        });
	      },

	      // Batch values into chunks of size w
	      batch: function (w) {
	        var b = [],
	            batch = function (v) {
	          b.push(v);
	          if (b.length === w) {
	            v = b, b = [];
	            return v;
	          }
	        };
	        return this.map(batch);
	      },

	      compose: function () {
	        var args = [].slice.call(arguments);
	        for (var i = args.length - 1; i >= 0; i--) {
	          this.map(args[i]);
	        }
	        return this;
	      },

	      debounce: function (t) {
	        var dbid;
	        return this.map(function (v, next) {
	          if (!dbid) {
	            dbid = setTimeout(function () {
	              dbid = false;
	              next(v);
	            }, t || 0);
	          }
	        });
	      },

	      flatten: function (f) {
	        return this.map(function (v) {
	          return function (next) {
	            function flatten(v) {
	              if (_utils2.default.typeOf(v) === _utils2.default.type.ARRAY) {
	                v.forEach(flatten);
	              } else {
	                next(f ? f(v) : v);
	              }
	              return undefined;
	            }
	            return flatten(v);
	          };
	        });
	      },

	      maybe: function (f) {
	        return this.map(function (v) {
	          return f(v) ? { just: v } : { nothing: true };
	        });
	      },

	      // pipe : (A -> B, B -> C) -> Signal C
	      //        (A -> B, Signal C) -> Signal B ? C
	      //        (A -> B -> B (C), C -> D) -> Signal D
	      //
	      // Convenient compose functor that maps from left to right.
	      // eg : pipe(v => v + 'B', v ==> v + 'C').input('A') -> Signal 'ABC'
	      //
	      pipe: function () {
	        var args = [].slice.call(arguments);
	        for (var i = 0; i < args.length; i++) {
	          this.map(args[i]);
	        }
	        return this;
	      },

	      // map object key values
	      pluck: function () {
	        var args = [].slice.call(arguments),
	            a0 = args[0];
	        return this.map(function (v) {
	          return args.length === 1 && (v[a0] || _utils2.default.lens(v, a0)) || args.map(function (key) {
	            return _utils2.default.lens(v, key);
	          });
	        });
	      },

	      // named (projected) map
	      project: function () {
	        var args = [].slice.call(arguments);
	        return this.map(function (v) {
	          var r = {};
	          return args.reduce(function (r, arg) {
	            Object.keys(arg).forEach(function (key) {
	              r[key] = _utils2.default.lens(v, arg[key]);
	            });
	            return r;
	          }, {});
	        });
	      },

	      // continuously fold incoming signal values into
	      // an accumulated outgoing value
	      fold: function (f, accum) {
	        return this.map(function (v) {
	          if (!accum) {
	            accum = v;
	          } else {
	            var args = [accum].concat([].slice.call(arguments));
	            accum = f.apply(null, args);
	          }
	          return accum;
	        });
	      },

	      // signal keep:
	      //  h == 0 or undefined - keep all
	      //  h >= 1         - keep n
	      keep: function (h) {
	        var accum = [];
	        var keep = h || MAXDEPTH;
	        this.toArray = function () {
	          return accum;
	        };
	        return this.map(function (v) {
	          if (accum.length === keep) accum.shift();
	          accum.push(v);
	          return v;
	        });
	      },

	      // Skip the first n values from the signal
	      // The signal will not propagate until n + 1
	      skip: function (n) {
	        return this.map(function (v) {
	          return n-- > 0 ? _signal2.default.fail(v) : v;
	        });
	      },

	      // Take the first n values from the signal
	      // The signal will not propagate after n
	      take: function (n) {
	        return this.map(function (v) {
	          return n-- > 0 ? v : _signal2.default.fail(v);
	        });
	      },

	      // Batch values into sliding window of size w
	      window: function (w) {
	        var b = [],
	            window = function (v) {
	          b.push(v);
	          if (--w < 0) {
	            b.shift();
	            return b;
	          }
	        };
	        return this.map(window);
	      },

	      // Zip signal channel values into a true array.
	      zip: function (keys) {
	        var i = 0;
	        var zip = function (v) {
	          keys = keys || Object.keys(v);
	          var kl = keys.length;
	          return ++i % kl === 0 ? keys.map(function (k) {
	            return v[k];
	          }) : undefined;
	        };
	        return this.map(zip);
	      }

	    });
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./signal'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.signal, global.utils);
	    global.match = mod.exports;
	  }
	})(this, function (exports, _signal, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Match;

	  var _signal2 = _interopRequireDefault(_signal);

	  var _utils2 = _interopRequireDefault(_utils);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  'use strict';

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
	        isObject = _utils2.default.typeOf(m) === _utils2.default.type.OBJECT;
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
	      var count = 0,
	          block = undefined;
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
	      return count >= lBound && count <= uBound ? v === undefined ? _signal2.default.UNDEFINED : v : block;
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
	      return v && (m === v || m === true) || !v && m === false ? v === undefined ? _signal2.default.UNDEFINED : v : false;
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
/* 8 */
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

	  function _Signal(_steps) {
	    var _this = this;
	    this.id = function () {
	      return _this;
	    };
	    this.id.isSignal = true;

	    if (true) {
	      this.$id = ++sId + (this.$name || '');
	    }

	    // private
	    var _state, _bind;
	    var _feeds = [],
	        _fails = [],
	        _finallys = [];
	    var _pulse = Signal.UNDEFINED;

	    _steps = typeof _steps !== 'string' && _steps || [];

	    function _propagate(v, ctx) {
	      var nv = v,
	          fail = v instanceof Signal.fail;
	      for (var i = ctx.step; i < _steps.length && !fail; i++) {
	        nv = _apply(_steps[i], v, ctx);
	        fail = nv instanceof Signal.fail;
	        if (nv === undefined || fail) break;
	        v = nv;
	      }

	      if (nv !== undefined) {
	        // tail value is either a fail or new state
	        if (!fail) {
	          _state = nv === Signal.UNDEFINED ? undefined : nv;
	        }
	        var tail = fail ? _fails : _feeds;
	        for (var t = 0; t < tail.length; t++) {
	          tail[t].call(_this, nv);
	        }
	        // report the last good value in finally
	        for (var f = 0; f < _finallys.length; f++) {
	          _finallys[f].call(_this, v);
	        }
	        if (_pulse !== Signal.UNDEFINED) _state = _pulse;
	      }
	    }

	    // apply: Allow running arbitrary functions inside the functor
	    function _apply(f, v, ctx) {
	      v = f.call(_this, v, ctx);
	      // handle thunks and promises..
	      if (typeof v === 'function') {
	        v(_nextStep(ctx.step + 1));
	        return undefined;
	      }
	      if (typeof v === 'object' && typeof v.then === 'function') {
	        // promise chains end here
	        var next = _nextStep(ctx.step + 1);
	        v.then(next, function (m) {
	          next(new Signal.fail(m));
	        });
	        return undefined;
	      }
	      return v;
	    }

	    // lift a function or signal into functor form
	    function _lift(f) {
	      var fmap = f;
	      if (f.isSignal) {
	        var next = _nextStep();
	        f.feed(function (v) {
	          next(v);
	        });
	        fmap = f.input;
	      }
	      return fmap;
	    }

	    // Allow values to be injected into the signal at arbitrary step points.
	    // State propagation continues from this point
	    function _nextStep(step) {
	      var ctx = { step: step !== undefined ? step : _steps.length + 1 };
	      return function (v) {
	        return _bind ? _bind(_propagate, v, ctx) : _propagate(v, ctx);
	      };
	    }

	    this.step = _nextStep;

	    // bind : ( (A, B, C) -> A(D, C) ) -> Signal D
	    //
	    // Bind and apply a middleware to a signal context.
	    // eg : bind((next, value, ctx) => next(++value)).input(1) -> Signal 2
	    //
	    // The middleware should call next to propagate the signal.
	    // The middleware should skip next to halt the signal.
	    // The middleware is free to modify value and / or context.
	    this.bind = function (mw) {
	      var next = _bind || _apply;
	      _bind = function (f, v, ctx) {
	        return mw(function (v) {
	          return next(f, v, ctx);
	        }, v, ctx);
	      };
	      return this;
	    };

	    this.isSignal = true;

	    // signal : A -> Signal A
	    //            A -> B -> Signal B
	    //            Signal A -> Signal A
	    //
	    this.asSignal = function (t) {
	      if ((t || this).isSignal) return t || this;
	      // todo: pass t into constructor?
	      var s = this.signal();
	      return typeof t === 'function' ? s.map(t) : s;
	    };

	    // clone : X -> Y
	    //
	    // clone a signal
	    this.clone = function () {
	      return new Signal(_steps);
	    };

	    // prime : (A) -> Signal A
	    //
	    // Set signal state directly, bypassing steps
	    this.prime = function (v) {
	      _state = v;
	      return this;
	    };

	    // value : () -> A
	    //
	    // Return state as the current signal value.
	    this.value = function () {
	      return _state;
	    };

	    // input : (A) -> Signal A
	    //
	    // Signal a new value.
	    // eg : input(123) -> Signal 123
	    //
	    // This method produces state propagation throughout a connected circuit.
	    this.input = function (v) {
	      var ctx = { step: 0 };
	      _bind ? _bind(_propagate, v, ctx) : _propagate(v, ctx);
	    };

	    // map : () -> Signal
	    //       (A) -> Signal A
	    //       (A -> B) -> Signal B
	    //       (A -> B -> B (C)) -> Signal C
	    //       (A -> B -> B.resolve (C)) -> Signal C
	    //       (A -> B -> B.reject (C)) -> Signal
	    //       (Signal A) -> Signal A
	    //       (A -> B) -> Signal B
	    //       (Signal A) -> Signal A
	    //
	    // Map over the current signal value and propagate
	    // - can await propagation by returning a thunk or promise
	    // - can halt propagation by returning undefined - retain current state (finally(s) not invoked)
	    // - can short propagation by returning Signal.fail - revert to previous state (finally(s) invoked)
	    // Note that to map state onto undefined the pseudo value Signal.UNDEFINED must be returned
	    this.map = function (f) {
	      _steps.push(_lift(f));
	      return this;
	    };

	    // register or invoke a fail handler
	    this.fail = function (f) {
	      _fails.push(f.input || f);
	      return this;
	    };

	    // feed : (A -> B) -> Signal
	    //
	    // Register a feed handler.
	    // The handler will be called after successful propagation.
	    // The value passed to the handler will be the state value.
	    this.feed = function (f) {
	      _feeds.push(f.input || f);
	      return this;
	    };

	    // finally : (A -> B) -> Signal
	    //
	    // Register a finally handler.
	    // The handler will be called after propagation, feeds and fails.
	    // The value passed to the handler will be the last good step value.
	    this.finally = function (f) {
	      _finallys.push(f.inout || f);
	      return this;
	    };

	    // pulse : (A) -> Signal A
	    //
	    // Return to pristine (or pv) state after propagation, feeds, fails and finallys
	    this.pulse = function (pv) {
	      _pulse = pv;
	      return this;
	    };

	    this.filter = function (f) {
	      return this.map(function (v) {
	        return f(v) ? v : undefined;
	      });
	    };

	    // tap : (A -> B) -> Signal A
	    //
	    // Tap the current signal state value.
	    // eg : tap(A => console.log(A)) -> Signal A
	    //
	    // - tap ignores any value returned from the tap function.
	    this.tap = function (f) {
	      return this.map(function (v) {
	        f.apply(_this, arguments);
	        return v === undefined ? Signal.UNDEFINED : v;
	      });
	    };
	  }

	  function extend(proto, ext) {
	    Object.keys(ext).forEach(function (k) {
	      proto[k] = ext[k];
	    });
	  }

	  function Signal(steps) {
	    var s = new _Signal(steps);

	    s.signal = function () {
	      var s = new Signal();
	      for (var i = 0; i < _ext.length; i++) {
	        s.extend(_ext[i]);
	      }
	      return s;
	    };

	    // Extend a signal with custom functions.
	    // Chainable functions must return this.
	    var _ext = [];
	    s.extend = function (ext) {
	      _ext.push(ext);
	      extend(this, typeof ext === 'function' ? ext(this) || {} : ext);
	      return this;
	    };

	    return s;
	  }

	  Signal.id = function (v) {
	    return v;
	  };
	  Signal.UNDEFINED = Object.freeze({ value: undefined }), Signal.fail = function fail(v) {
	    if (!(this instanceof fail)) return new fail(v);
	    this.error = v || true;
	  };

	  exports.default = Signal;
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== "undefined") {
			factory(require('../src'));
		} else {
			var mod = {
				exports: {}
			};
			factory(global.src);
			global.circuitTests = mod.exports;
		}
	})(this, function (_src) {
		'use strict';

		var _src2 = _interopRequireDefault(_src);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		runTests('circuit', function (mock) {

			var inc = function (v) {
				return v + 1;
			};
			var dbl = function (v) {
				return v + v;
			};
			var sqr = function (v) {
				return v * v;
			};
			var seq = function (s) {
				return function (steps) {
					return [].concat(steps, s);
				};
			};
			var app;

			setup(function () {
				app = new _src2.default();
			});

			test('as signal - from app', function () {
				var s = app.asSignal(app);
				return s.isSignal;
			});

			test('circuit - propagation', function () {
				var s1 = app.signal();
				var s2 = app.signal();
				var j = app.join({ s1, s2 });
				s1.input(1);
				s2.input(2);
				var r = j.value();
				return r.s1 === 1 && r.s2 === 2;
			});

			test('circuit - fail bubbling', function () {
				var s1 = app.signal().map(_src.Signal.fail);
				var j1 = app.join({ s1 });
				var r,
				    j = app.join({ j1 });
				j.fail(function (f) {
					r = f;
				});
				s1.input(2);
				return r instanceof _src.Signal.fail;
			});

			test('channel - implied map', function () {
				var s = app.merge({
					a: inc
				});
				s.channels.a.input(1);

				return s.value() === 2;
			});

			test('channel - identity', function () {
				var s = app.merge({
					a: _src.Signal.id
				});
				s.channels.a.input(1);

				return s.value() === 1;
			});

			test('channel - passive', function () {
				var a = app.signal();
				var b = app.signal().prime(2);
				var s = app.join({
					a: a,
					b: b.id
				});

				a.input(1);
				var r1 = s.value().b === 2;

				b.input(1);
				var r2 = s.value().b === 2;

				return r1 && r2;
			});

			test('channel - value (always) map', function () {
				var s = app.merge({
					a: 123
				});
				s.channels.a.input(1);

				return s.value() === 123;
			});

			test('channel - value (always undefined) map', function () {
				var s = app.merge({
					a: undefined
				});
				s.channels.a.input(1);

				return s.value() === undefined;
			});

			test('channel value - literal (always)', function () {
				var r = app.join({
					a: 'a'
				});
				r.channels.a.input(123);
				return r.value().a === 'a';
			});

			test('propagation order', function () {
				var a = app.signal().map(seq(1));
				var b = app.signal().map(seq(2));
				var c = app.signal().map(seq(3));
				var s1 = app.signal().map(a).map(b).map(c);
				var s2 = app.merge({
					c: app.signal().merge({
						b: app.signal().merge({ a }).map(b)
					}).map(c)
				});
				s1.input([]);
				s2.channels.c.channels.b.channels.a.input([]);

				return s1.value().toString() === s2.value().toString();
			});

			test('prime', function () {
				var a = app.signal();
				var r = app.join({
					a: a
				}).prime({ a: 123 });

				return a.value() === 123;
			});

			test('prime - deep', function () {
				var a = app.signal();
				var r = app.join({
					b: {
						a: a
					}
				}).prime({ b: { a: 123 } });

				return a.value() === 123;
			});

			test('context - join', function () {
				var a,
				    r = app.join({
					a: app.signal().map(function (v, j) {
						a = j.value;
						return v;
					})
				});
				r.input('join value');
				r.channels.a.input(123);

				return a === 'join value' && r.value().a === 123;
			});

			test('context - merge', function () {
				var a,
				    r = app.merge({
					a: app.signal().map(function (v, m) {
						a = m.value;
						return v;
					})
				});
				r.input('abc');
				r.channels.a.input(123);

				return a === 'abc' && r.value() === 123;
			});

			test('overlay - placeholder', function () {
				var o = { a: inc };
				var c = app.join({ a: _src.Signal.id }).overlay(o);
				c.channels.a.input(1);
				return c.channels.a.value() === 2;
			});

			test('overlay', function () {
				var b = app.signal().map(dbl);
				var o = { a: inc };
				var c = app.join({ a: b }).overlay(o);
				c.channels.a.input(1);
				return c.channels.a.value() === 3;
			});
			test('overlay - sample', function () {
				var a = app.signal();
				var b = app.signal();
				var o = { a: inc, b: inc };
				var c = app.join({ a: a }).sample({ b: b }).overlay(o);
				c.channels.a.input(1);
				c.channels.b.input(1);
				return c.channels.a.value() === 2 && c.channels.b.value() === 2;
			});

			test('overlay - signal', function () {
				var b = app.signal().map(dbl);
				var o = { a: app.signal().map(inc) };
				var c = app.join({ a: b }).overlay(o);
				c.channels.a.input(1);
				return c.channels.a.value() === 3;
			});

			test('overlay - deep', function () {
				var b = app.signal();
				var o = { a: { a: { a: inc } } };
				var c = app.join({ a: { a: { a: b } } }).overlay(o);
				c.channels.a.channels.a.channels.a.input(1);
				return c.channels.a.channels.a.channels.a.value() === 2;
			});

			test('extend - app ctx', function () {
				var app1 = new _src2.default().extend({ c: true });
				var app2 = new _src2.default();

				return app1.signal().c && !app2.signal().c;
			});

			test('extend - app ctx + signal ctx', function () {
				var r1,
				    r2,
				    ctx = new _src2.default();
				ctx.extend(function (c1) {
					r1 = c1;return { b: true };
				});
				ctx.extend(function (c2) {
					r2 = c2;return { c: true };
				});
				var s = ctx.signal();
				return r1 === s && r2 === s;
			});

			test('impure', function () {
				var r = 0,
				    s = app.merge({ a: _src.Signal.id }).tap(function () {
					r++;
				});
				s.channels.a.input(1);
				s.channels.a.input(1);
				return r === 2;
			});

			test('pure', function () {
				var r = 0,
				    s = app.merge({ a: _src.Signal.id }).pure().tap(function () {
					r++;
				});
				s.channels.a.input(1);
				s.channels.a.input(1);
				return r === 1;
			});
		});
	});

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(6), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/composables'), require('../src/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.composables, global.utils);
	        global.composablesTests = mod.exports;
	    }
	})(this, function (_src, _composables, _utils) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var _composables2 = _interopRequireDefault(_composables);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    runTests('composables', function (mock) {

	        function inc(v) {
	            return v + 1;
	        }
	        function dbl(v) {
	            return v + v;
	        }

	        var app = new _src2.default(_composables2.default);

	        test('always', function () {
	            var s = app.signal();
	            var r = s.always(123);
	            s.input('xyz');
	            return r.value() === 123;
	        });

	        test('batch', function () {
	            var s = app.signal().batch(2).tap(function (v) {
	                r.push(v);
	            });
	            var r = [];
	            for (var i = 0; i < 4; i++) s.input(i);
	            return _utils2.default.deepEqual(r, [[0, 1], [2, 3]]);
	        });

	        test('compose', function () {
	            var e,
	                s = app.signal().compose(inc, dbl, dbl).tap(function (v) {
	                e = v;
	            });
	            s.input(1);
	            return e === 5;
	        });

	        test('pipe', function () {
	            var e,
	                s = app.signal().pipe(inc, dbl, dbl).tap(function (v) {
	                e = v;
	            });
	            s.input(1);
	            return e === 8;
	        });

	        test('pipe - signals', function () {
	            var s1 = app.signal().map(inc);
	            var s2 = app.signal().map(inc);
	            var p = app.signal().pipe(s1, s2);
	            p.input(1);
	            return p.value() === 3;
	        });

	        test('flatten', function () {
	            var s = app.signal().flatten().keep();
	            s.input([1, 2]);
	            s.input([3, [4, 5]]);
	            s.input(6);
	            return _utils2.default.deepEqual(s.toArray(), [1, 2, 3, 4, 5, 6]);
	        });

	        test('flatten - flatmap', function () {
	            var s = app.signal().flatten(function (v) {
	                return v + 1;
	            }).keep();
	            s.input([1, 2]);
	            s.input(3);
	            return _utils2.default.deepEqual(s.toArray(), [2, 3, 4]);
	        });

	        test('pluck - 1 key', function () {
	            var s = app.signal().pluck('b');
	            s.input({ a: 1, b: 2, c: 3 });
	            return s.value() === 2;
	        });

	        test('pluck - more than one key', function () {
	            var s = app.signal().pluck('a', 'b');
	            s.input({ a: 1, b: 2, c: 3 });
	            return _utils2.default.deepEqual(s.value(), [1, 2]);
	        });

	        test('pluck - deep', function () {
	            var s = app.signal().pluck('a.a1', 'b.b1[1]');
	            s.input({ a: { a1: 1 }, b: { b1: [2, 3] } });
	            return _utils2.default.deepEqual(s.value(), [1, 3]);
	        });

	        test('project', function () {
	            var s = app.signal().project({ a: 'a.a1', b: 'b.b1[1]' });
	            s.input({ a: { a1: 1 }, b: { b1: [2, 3] } });
	            return _utils2.default.deepEqual(s.value(), { a: 1, b: 3 });
	        });

	        test('fold', function () {
	            var e = 'xyz';
	            var s = app.signal().fold(function (a, v) {
	                return a + v;
	            }).tap(function (v) {
	                e = v;
	            });
	            s.input(1);
	            s.input(2);
	            s.input(3);
	            return e === 6;
	        });

	        test('fold - accum', function () {
	            var e = 'xyz';
	            var s = app.signal().fold(function (a, v) {
	                return a + v;
	            }, 6).tap(function (v) {
	                e = v;
	            });
	            s.input(1);
	            s.input(2);
	            s.input(3);
	            return e === 12;
	        });

	        test('keep - depth', function () {
	            var s = app.signal().keep(2);
	            s.input(1);
	            s.input(2);
	            s.input(3);
	            var v = s.toArray();
	            return _utils2.default.deepEqual(v, [2, 3]);
	        });

	        test('history - keep', function () {
	            var s = app.signal().keep();
	            s.input(1);
	            s.input(2);
	            s.input(3);
	            return _utils2.default.deepEqual(s.toArray(), [1, 2, 3]);
	        });

	        test('skip', function () {
	            var r,
	                s = app.signal().skip(2).map(inc).tap(function (v) {
	                r = r || v;
	            });
	            for (var i = 0; i < 5; i++) s.input(i);
	            return r === 3;
	        });

	        test('take', function () {
	            var r,
	                s = app.signal().take(2).map(inc).tap(function (v) {
	                r = v;
	            });
	            for (var i = 0; i < 5; i++) s.input(i);
	            return r === 2;
	        });

	        test('window', function () {
	            var s = app.signal().window(2);
	            for (var i = 0; i < 4; i++) s.input(i);
	            return _utils2.default.deepEqual(s.value(), [2, 3]);
	        });

	        test('zip - arrays', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).zip().tap(function (v) {
	                r.push(v);
	            });
	            var a = [1, 2, 3],
	                b = [4, 5, 6],
	                r = [];
	            a.map(function (_, i) {
	                s1.input(a[i]);
	                s2.input(b[i]);
	            });
	            return _utils2.default.deepEqual(r, [[1, 4], [2, 5], [3, 6]]);
	        });
	    });
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/error'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.error);
	        global.errorTests = mod.exports;
	    }
	})(this, function (_src, _error) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var error = _interopRequireWildcard(_error);

	    function _interopRequireWildcard(obj) {
	        if (obj && obj.__esModule) {
	            return obj;
	        } else {
	            var newObj = {};

	            if (obj != null) {
	                for (var key in obj) {
	                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	                }
	            }

	            newObj.default = obj;
	            return newObj;
	        }
	    }

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    var inc = function (v) {
	        return v + 1;
	    };

	    runTests('error', function (mock) {

	        var app;
	        setup(function () {
	            app = new _src2.default(error.Error);
	        });

	        test('test - true', function () {
	            var m = error.test(function (v) {
	                return true;
	            })(1);
	            return m === 1;
	        });

	        test('test - value', function () {
	            var m = error.test(function (v) {
	                return v + 1;
	            })(1);
	            return m === 2;
	        });

	        test('test - fail', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            })(0);
	            return m instanceof _src.Signal.fail;
	        });

	        test('test - fail with reason', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            }, 'xyz')(0);
	            return m.error === 'xyz';
	        });

	        test('error - circuit valid', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            }, 'error!');
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.input(1);
	            return s.error() === '' && s.value() === 2;
	        });

	        test('error - circuit error', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            });
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.input(0);
	            return s.error() === true;
	        });

	        test('error - circuit error msg', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            }, 'error!');
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.input(0);
	            return s.error() === 'error!';
	        });

	        test('error - first error only', function () {
	            var m1 = error.test(function (v) {
	                return !!v;
	            }, 1);
	            var m2 = error.test(function (v) {
	                return !!v;
	            }, 2);
	            var s = app.merge({ m1: m1, m2: m2 }).map(inc);
	            s.channels.m1.input(0);
	            s.channels.m2.input(0);
	            return s.error() === 1 && s.value() === undefined;
	        });

	        test('error - circuit error clear', function () {
	            var m = error.test(function (v) {
	                return !!v;
	            });
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.input(0);
	            return s.error() === true && s.error() === '';
	        });
	    });
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.utils);
	        global.issues = mod.exports;
	    }
	})(this, function (_src, _utils) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    runTests('issues', function () {
	        // test('xxx', function(done){
	        //     setTimeout(done.bind(null,true),5000)
	        // })
	    });
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5), __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== "undefined") {
			factory(require('../src/circuit'), require('../src/signal'), require('../src/utils'));
		} else {
			var mod = {
				exports: {}
			};
			factory(global.circuit, global.signal, global.utils);
			global.joinTests = mod.exports;
		}
	})(this, function (_circuit, _signal, _utils) {
		'use strict';

		var _circuit2 = _interopRequireDefault(_circuit);

		var _signal2 = _interopRequireDefault(_signal);

		var _utils2 = _interopRequireDefault(_utils);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		runTests('join', function (mock) {

			var inc = function (v) {
				return v + 1;
			};
			var dbl = function (v) {
				return v + v;
			};
			var mul3 = function (v) {
				return v * 3;
			};

			var app = new _circuit2.default();
			var signal = app.signal.bind(app);

			test('join', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({ s1, s2 });
				s1.input(1);
				s2.input(2);
				var r = j.value();
				return r.s1 === 1 && r.s2 === 2;
			});

			test('join - channels', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: s2
				});
				s1.input(1);
				s2.input(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: 2 });
			});

			test('join - nested channels', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: app.join({
						k3: s2
					})
				});
				s1.input(1);
				s2.input(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: { k3: 2 } });
			});

			test('join - pure object hash', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: {
						k3: s2
					}
				});
				s1.input(1);
				s2.input(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: { k3: 2 } });
			});

			test('join - auto name spacing', function () {
				var j = {
					a: {
						b: {
							c: signal()
						}
					}
				};
				var s = app.join(j);
				return j.a.b.c.name === 'c';
			});

			test('merge', function () {
				var s1 = signal();
				var s2 = signal();
				var m = app.merge({ s1, s2 });
				s1.input(1);
				var r1 = m.value();
				s2.input(2);
				var r2 = m.value();
				return r1 === 1 && r2 === 2;
			});

			test('sample - block', function () {
				var s1 = signal();
				var s2 = signal().sample({ s1 });
				s2.input(1);
				return s2.value() === undefined;
			});

			test('sample - pass', function () {
				var s1 = signal();
				var s2 = signal().sample({ s1 }).map(inc);
				s2.input(1);
				s1.input(true);
				return s2.value() === 2;
			});

			test('sample - successive', function () {
				var s1 = signal();
				var s2 = signal().sample({ s1 }).map(inc);
				s2.input(1);
				var r1 = s2.value();
				s1.input(true);
				var r2 = s2.value();
				s2.input(2);
				var r3 = s2.value();
				s1.input(true);
				var r4 = s2.value();
				return r1 === undefined && r2 === 2 && r3 === 2 && r4 === 3;
			});
		});
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(8), __webpack_require__(7), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/signal'), require('../src/match'), require('../src/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.signal, global.match, global.utils);
	        global.matchTests = mod.exports;
	    }
	})(this, function (_src, _signal, _match, _utils) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var _signal2 = _interopRequireDefault(_signal);

	    var _match2 = _interopRequireDefault(_match);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    runTests('match', function (mock) {

	        var inc = function (v) {
	            return v + 1;
	        };
	        var app = new _src2.default(_match2.default);

	        test('match - pass truthy literal', function () {
	            var r,
	                v = 1;
	            app.match().tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === v;
	        });

	        test('match - block falsey literal', function () {
	            var r,
	                v = 0;
	            app.match().tap(function (v) {
	                r = v;
	            }).input(v);
	            return r !== v;
	        });

	        test('match - pass truthy object', function () {
	            var r,
	                v = { a: 1, b: 2 };
	            app.match().tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass object with some', function () {
	            var r,
	                v = { a: false, b: 2 };
	            app.match().tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block object with every', function () {
	            var r,
	                v = { a: false, b: 2 };
	            app.match(-1, -1).tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === undefined;
	        });

	        test('match - pass mask', function () {
	            var r,
	                v = { c1: undefined, c2: 2 };
	            var s = app.match({ c1: false, c2: true }).tap(function (v) {
	                r = v;
	            });
	            s.input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block mask', function () {
	            var r,
	                v = { c1: undefined, c2: 2 };
	            app.match({ c1: 1, c2: 1 }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === undefined;
	        });

	        test('match - pass channel mask', function () {
	            var r,
	                v = { c1: 1, c2: 3 };
	            app.match({ c1: 1 }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass default mask', function () {
	            var r,
	                v = { c1: 1, c2: 3 };
	            app.match({ c1: undefined }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass mask + fn', function () {
	            var r,
	                v = { c1: 1, c2: 0, c3: 3 };
	            app.match({ c1: 0 }, function (v, m) {
	                return v === m + 1;
	            }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - fn mask', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            app.match({ ca1: function (v, m) {
	                    return v === 1;
	                } }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - fn (boolean) mask', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            var s = app.match({ ca1: function (v, m) {
	                    return r = m;
	                } });
	            s.input(v);
	            s.input(v);
	            return r === 1;
	        });

	        test('match - fn mask + fn', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            app.match({ ca1: function (v) {
	                    return v === 1 && 2;
	                } }, function (v, m) {
	                return m === 2;
	            }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return assert(r, v, _utils2.default.equal);
	        });

	        test('match - pass wildcard', function () {
	            var r,
	                v = { c1: 1, c2: 2, c3: 3 };
	            app.match({ '*': true }).tap(function (v) {
	                r = v;
	            }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass leading wildcard', function () {
	            var r,
	                v = { a1: 1, b2: 0, c1: 3 };
	            app.match({ '*1': true }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block leading wildcard', function () {
	            var r,
	                v = { c11: 1, c21: 0 };
	            app.match({ '*1': true }, -1, -1).tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === undefined;
	        });

	        test('match - trailing wildcard', function () {
	            var r,
	                v = { ca1: 1, cb2: false, ca3: 3 };
	            app.match({ 'ca*': true }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - mixed wildcard', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 3 };
	            app.match({ '*1': 1, '*': true }).tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass list', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 3 };
	            app.match('ca1', 'cc3').tap(function (v) {
	                r = v;
	            }).input(v);
	            return assert(r, v, _utils2.default.equal);
	        });

	        test('match - block list', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            app.match('ca1', 'cc3', -1, -1).tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === undefined;
	        });

	        test('all - take all truthy', function () {
	            var r,
	                v = { c1: 1, c2: 2 };
	            app.all().tap(function (v) {
	                r = v;
	            }).input(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('all - block some falsey', function () {
	            var r,
	                v = { c1: 1, c2: 0 };
	            app.all().tap(function (v) {
	                r = v;
	            }).input(v);
	            return r === undefined;
	        });

	        test('all - mask', function () {
	            var r,
	                mask = {
	                s1: true
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s1.input(1);
	            return _utils2.default.equal(r, { s1: 1, s2: undefined });
	        });

	        test('all - negative mask', function () {
	            var r,
	                mask = {
	                s2: false
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s1.input(1);
	            return _utils2.default.equal(r, { s1: 1, s2: undefined });
	        });

	        test('all - blocked mask', function () {
	            var r,
	                mask = {
	                s1: true,
	                s2: true
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s1.input(1);
	            s2.input(0);
	            return _utils2.default.equal(r, undefined);
	        });

	        test('all - value mask', function () {
	            var r,
	                mask = {
	                s1: 1
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s2.input(1);
	            s1.input(1);
	            return _utils2.default.equal(r, { s1: 1, s2: 1 });
	        });

	        test('all - blocked value mask', function () {
	            var r,
	                mask = {
	                s1: 1,
	                s2: 2
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s2.input(1);
	            s1.input(1);
	            return _utils2.default.equal(r, undefined);
	        });

	        test('all - undefined value mask', function () {
	            var r,
	                mask = {
	                s1: 1,
	                s2: undefined
	            };
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).all(mask).tap(function (v) {
	                r = v;
	            });
	            s2.input(1);
	            s1.input(1);
	            return _utils2.default.equal(r, { s1: 1, s2: 1 });
	        });

	        test('any - signal values', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var jp = app.join({ s1, s2 }).any();
	            s1.input(1);
	            s2.input(1);
	            return _utils2.default.equal(jp.value(), { s1: 1, s2: 1 });
	        });

	        test('any - any signal values', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var jp = app.join({ s1, s2 }).any();
	            s2.input(1);
	            return _utils2.default.equal(jp.value(), { s1: undefined, s2: 1 });
	        });

	        test('any - block on no values', function () {
	            var r,
	                s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).any().tap(function (v) {
	                r = v;
	            });
	            s1.input(0);
	            s2.input(0);
	            return r === undefined;
	        });

	        test('one - pass on only one', function () {
	            var r,
	                s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).one().tap(function (v) {
	                r = v;
	            }).input({ s1: 0, s2: 2 });
	            return _utils2.default.equal(r, { s1: 0, s2: 2 });
	        });

	        test('one - block on more than one', function () {
	            var r,
	                s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).one().tap(function (v) {
	                r = v;
	            }).input({ s1: 1, s2: 2 });
	            return r === undefined;
	        });

	        test('none - block on any value', function () {
	            var r,
	                s1 = app.signal();
	            var s2 = app.signal();
	            app.join({ s1, s2 }).none().tap(function (v) {
	                r = v;
	            }).input({ s1: 1 });
	            return r === undefined;
	        });

	        // boolean masks - mutate to boolean result

	        test('or - restore dropped value', function () {
	            var r,
	                s1 = app.any({ a: _match2.default.or(function (v) {
	                    r = v;
	                }) });
	            s1.input({ a: 1 });
	            s1.input({ a: 0 });
	            return r === 1;
	        });

	        test('or - default to mask value', function () {
	            var r,
	                mask = {
	                a: _match2.default.or(2, function (v) {
	                    r = v;
	                })
	            };
	            app.any(mask).input({ a: 0 });
	            return r === 2;
	        });

	        test('xor - pass new value', function () {
	            var p = 0,
	                s = app.any({ a: _match2.default.xor }).tap(function () {
	                p++;
	            });
	            s.input({ a: 1 });
	            s.input({ a: 2 });
	            return p == 2;
	        });

	        test('xor - block same value', function () {
	            var p = 0,
	                s = app.any({ a: _match2.default.xor }).tap(function () {
	                p++;
	            });
	            s.input({ a: 1 });
	            s.input({ a: 1 });
	            return p === 1;
	        });

	        test('not - pass on falsey', function () {
	            var r,
	                p,
	                s = app.any({ a: _match2.default.not }).tap(function (v) {
	                p = v;
	            });
	            s.input({ a: 0 });
	            return _utils2.default.equal(p, { a: 0 });
	        });

	        test('not - block on truthy', function () {
	            var p,
	                s = app.any({ a: _match2.default.not }).tap(function (v) {
	                p = v;
	            });
	            s.input({ a: 1 });
	            return p === undefined;
	        });

	        // switch:: fn(channel value -> signal)

	        test('switch - match channel', function () {
	            var sig = app.signal().map(inc);
	            var a = app.any({ a: _match2.default.and(1, sig) });
	            a.input({ a: 1 });
	            return sig.value() === 2;
	        });

	        test('switch - block channel', function () {
	            var sig = app.signal().map(inc);
	            var a = app.any({ a: _match2.default.and(1, sig) });
	            a.input({ a: 0 });
	            return sig.value() === undefined;
	        });

	        // joinpoint - all

	        test('join - all active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var r,
	                j = app.join({ s1, s2 }).all().tap(function () {
	                r = true;
	            });
	            app.join({ s1, s2 }).all();
	            s1.input(1);
	            s2.input(2);
	            return r;
	        });

	        test('join - not all active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var r,
	                j = app.join({ s1, s2 }).all().tap(function () {
	                r = true;
	            });
	            app.join({ s1, s2 }).all();
	            s1.input(1);
	            return r === undefined;
	        });

	        test('join - already active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            s2.input(2);
	            var r,
	                j = app.join({ s1, s2 }).all().tap(function () {
	                r = true;
	            });
	            s1.input(1);
	            return r;
	        });

	        test('sample - all', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var s3 = app.signal();
	            var allSigs = app.signal().join({ s2, s3 }).all();
	            var s = s1.sample({ allSigs }).map(inc);
	            s1.input(1);
	            var r1 = s.value(); // blocked
	            s2.input(2);
	            var r2 = s.value(); // blocked
	            s3.input(3);
	            var r3 = s.value();
	            return r1 === undefined && r2 === undefined && r3 === 2;
	        });
	    });
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== "undefined") {
			factory(require('../src'), require('../src/signal'));
		} else {
			var mod = {
				exports: {}
			};
			factory(global.src, global.signal);
			global.signalTests = mod.exports;
		}
	})(this, function (_src, _signal) {
		'use strict';

		var _src2 = _interopRequireDefault(_src);

		var _signal2 = _interopRequireDefault(_signal);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		var inc = function (v) {
			return v + 1;
		};
		var dbl = function (v) {
			return v + v;
		};
		var mul3 = function (v) {
			return v * 3;
		};
		var noop = function () {};
		var seq = function (s) {
			return function (steps) {
				return [].concat(steps, s);
			};
		};

		var Promise = function (cb) {
			var thenR,
			    thenF,
			    resolve = function (v) {
				thenR(v);
			},
			    reject = function (v) {
				thenF(v);
			};
			cb(resolve, reject);
			return {
				then: function (r, f) {
					thenR = r, thenF = f;
				}
			};
		};

		runTests('signal', function (mock) {

			var signal;
			setup(function () {
				signal = new _signal2.default();
			});

			test('new signal', function () {
				return signal.isSignal;
			});

			test('new signal - from signal', function () {
				return signal.signal().isSignal;
			});

			test('as signal', function () {
				var s = signal.asSignal();
				return s.isSignal;
			});

			test('as signal - from this', function () {
				var s1 = signal;
				var s2 = s1.asSignal(s1);
				return s1 === s2;
			});

			test('as signal - from map', function () {
				var s = signal.asSignal(inc);
				s.input(1);
				return s.value() === 2;
			});

			test('clone', function () {
				var c = signal.map(inc).clone();
				c.input(1);
				return c.value() === 2;
			});

			test('input ', function () {
				var s = signal;
				s.input(2);
				return s.value() === 2;
			});

			test('input - undefined', function () {
				var s = signal;
				s.input(undefined);
				return s.value() === undefined;
			});

			test('input - impure', function () {
				var r = 0,
				    s = signal.tap(function () {
					r++;
				});
				s.input(1);
				s.input(1);
				return r === 2;
			});

			test('set input ', function () {
				var s = signal;
				s.input(1);
				s.input(2);
				s.input(3);
				return s.value() === 3;
			});

			test('input - natural bind', function () {
				var bv = signal.input;
				bv(2);
				return signal.value() === 2;
			});

			test('tap', function () {
				var e = 'xyz';
				var s = signal.tap(function (v) {
					e = v;
				});
				s.input(123);
				return e === 123;
			});

			test('tap / tap', function () {
				var e = 0,
				    e1,
				    e2;
				var t1 = function (v) {
					e1 = v;
				};
				var t2 = function (v) {
					e2 = v;
				};
				var s = signal.map(inc).tap(t1).map(inc).tap(t2);
				s.input(e);
				return e1 === 1 && e2 === 2;
			});

			test('map', function () {
				var s = signal.map(dbl);
				s.input(1);
				return s.value() === 2;
			});

			test('map - undefined halts propagation', function () {
				var s = signal.map(function (v) {
					return undefined;
				}).map(inc);
				s.input(1);
				return s.value() === undefined;
			});

			test('map - Signal.UNDEFINED continues propagation', function () {
				var r = 1;
				var s = signal.map(function (v) {
					return _signal2.default.UNDEFINED;
				}).map(function (v) {
					return 'abc';
				});
				s.input(1);
				return s.value() === 'abc';
			});

			test('map - Signal.fail aborts propagation', function () {
				var s = signal.map(function (v) {
					return _signal2.default.fail();
				}).map(inc);
				s.input(1);
				return s.value() === undefined;
			});

			test('map - signal', function () {
				var b = new _signal2.default().map(inc);
				signal.map(b).input(1);
				return signal.value() === 2;
			});

			test('map - signal flow', function () {
				var a = new _signal2.default().map(inc);
				var b = new _signal2.default().map(dbl);
				signal.map(a).map(b).map(mul3).input(1);
				return signal.value() === 12;
			});

			test('map - async', function (done) {
				function async(v) {
					return function (next) {
						setTimeout(function () {
							next(v + 1);
						});
					};
				}
				signal.map(async).tap(function (v) {
					done(v === 2);
				}).input(1);
			});

			test('map - async fail', function (done) {
				function async(v) {
					return function (next) {
						setTimeout(function () {
							next(_signal2.default.fail());
						});
					};
				}
				signal.map(async).fail(function (f) {
					done(true);
				}).input(1);
			});

			test('map - promise', function (done) {
				function async(v) {
					return new Promise(function (resolve) {
						setTimeout(function () {
							resolve(v + 1);
						});
					});
				}
				var s = signal.map(async).tap(function (v) {
					done(v === 2);
				});
				s.input(1);
			});

			test('map - promise reject', function (done) {
				function async(v) {
					return new Promise(function (_, reject) {
						setTimeout(function () {
							reject('error');
						});
					});
				}
				var s = signal.map(async).fail(function (f) {
					done(true);
				});
				s.input(1);
			});

			test('feed', function () {
				var s1 = signal.map(inc);
				var s2 = signal.signal().feed(s1);
				s2.input(2);
				return s1.value() === 3;
			});

			test('filter', function () {
				var r = 0,
				    s = signal.filter(function (v) {
					return v % 2;
				}).tap(function () {
					r++;
				});
				for (var i = 0; i < 4; i++) s.input(i);
				return r === 2;
			});

			test('bind', function () {
				var s = signal.map(inc).map(dbl);
				s.bind(function (next, v) {
					return next(v + 1);
				}).input(0);
				return s.value() === 4;
			});

			test('bind - composed', function () {
				var b = function (next, v) {
					return next(v + 1);
				};
				var e = signal.map(inc).bind(b).bind(b);
				e.input(0);
				return e.value() === 3;
			});

			test('prime', function () {
				var s = signal.map(inc).prime(1);
				return s.value() === 1;
			});

			test('finally', function () {
				var r,
				    s = signal.finally(function (v) {
					r = v;
				});
				s.input(1);
				return r === 1;
			});

			test('finally - fifo', function () {
				var r = [],
				    s = signal;
				s.finally(function (v) {
					r.push(1);
				});
				s.finally(function (v) {
					r.push(2);
				});
				s.input(1);
				return r[0] === 1 && r[1] === 2;
			});

			test('finally - halted propagation', function () {
				var r,
				    s = signal.map(inc).map(function () {
					return undefined;
				}).finally(function (v) {
					r = v;
				});
				s.input(1);
				return r === undefined && s.value() === undefined;
			});

			test('finally - aborted propagation', function () {
				var r1,
				    r2,
				    s = signal.map(function () {
					return _signal2.default.fail();
				}).map(inc).finally(function (v) {
					r1 = v;
				});
				s.input(1);
				return r1 === 1;
			});

			test('fail', function () {
				var r = [],
				    s = signal;
				s.finally(function (v) {
					r.push(2);
				});
				s.fail(function (v) {
					r.push(1);
				});
				s.input(_signal2.default.fail());
				return r[0] === 1 && r[1] === 2;
			});

			test('fail - fifo', function () {
				var r = [],
				    s = signal;
				s.fail(function (v) {
					r.push(2);
				});
				s.fail(function (v) {
					r.push(1);
				});
				s.input(_signal2.default.fail());
				return r[0] === 2 && r[1] === 1;
			});

			test('propagation order', function () {
				var a = new _signal2.default('a').map(seq(1));
				var b = new _signal2.default('b').map(seq(2));
				var c = new _signal2.default('c').map(seq(3));

				var s1 = new _signal2.default().map(a).map(b).map(c);
				s1.input([]);

				var s2 = new _signal2.default().map(a.clone().map(b.clone().map(c.clone())));
				s2.input([]);

				return s1.value().toString() === s2.value().toString();
			});

			test('extend', function () {
				var r,
				    ext = function () {
					return this.map(function (v) {
						r = v;
					});
				};
				signal.extend({ ext: ext }).ext().input(1);
				return r === 1;
			});

			test('extend - inheritance', function () {
				var r,
				    ext = function () {
					return this.map(function (v) {
						r = v;
					});
				};
				signal.extend({ ext: ext });
				signal.signal().signal().ext().input(1);
				return r === 1;
			});

			test('extend - isolated inheritance', function () {
				var r,
				    ext = function () {
					return this.map(function (v) {
						r = v;
					});
				};
				var s1 = signal.signal().extend({ ext: ext });
				var s2 = signal.signal();
				s1.ext().input(1);
				return s2.ext === undefined && r === 1;
			});

			test('extend - override', function () {
				var r,
				    ext = function (_this) {
					var _prime = _this.prime.bind(_this);
					return {
						prime: function (v) {
							return _prime(v + 1);
						}
					};
				};
				return signal.extend(ext).prime(1).value() === 2;
			});

			test('extend - deep inherit override', function () {
				var ext1 = function (_this) {
					var _prime = _this.prime.bind(_this);
					return {
						prime: function (v) {
							return _prime(v + 1);
						}
					};
				};
				var ext2 = function (_this) {
					var _prime = _this.prime.bind(_this);
					return {
						prime: function (v) {
							return _prime(v + 2);
						}
					};
				};
				return signal.extend(ext1).signal().extend(ext2).signal().prime(1).value() === 4;
			});
		});
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../../src'), require('../../src/utils'), require('../../src/error'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.utils, global.error);
	        global.validation = mod.exports;
	    }
	})(this, function (_src, _utils, _error) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var _utils2 = _interopRequireDefault(_utils);

	    var error = _interopRequireWildcard(_error);

	    function _interopRequireWildcard(obj) {
	        if (obj && obj.__esModule) {
	            return obj;
	        } else {
	            var newObj = {};

	            if (obj != null) {
	                for (var key in obj) {
	                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	                }
	            }

	            newObj.default = obj;
	            return newObj;
	        }
	    }

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    runTests('validation', function () {

	        const _ = _src.Signal.id;

	        // some validation
	        const required = v => !!v;
	        const email = v => /\S+@\S+\.\S+/i.test(v);

	        let circuit, channels;

	        setup(function () {

	            // export a circuit
	            circuit = new _src2.default().join({
	                email: error.test(email, `please enter a valid email`),
	                password: error.test(required, `please enter your password`)
	            }).extend(error.Error).sample({ login: _ }).active('required!');

	            channels = circuit.channels;
	        });

	        test('email - error', function () {
	            channels.email.input('x');
	            return circuit.error() === `please enter a valid email`;
	        });

	        test('password - valid', function () {
	            channels.password.input('x');
	            return circuit.error() === ``;
	        });

	        test('login - required', function () {
	            channels.login.input(true);
	            return circuit.error() === `required!`;
	        });

	        test('circuit - primed', function () {
	            circuit.prime({ email: 'hi@home.com', password: 'ok' });
	            channels.login.input(true);
	            return circuit.error() === ``;
	        });

	        test('circuit - happy path', function () {
	            channels.email.input('hi@home.com');
	            channels.password.input('ok');
	            channels.login.input(true);
	            return circuit.error() === ``;
	        });

	        test('circuit - error', function () {
	            circuit.prime({ password: 'ok' });
	            channels.email.input('badformat');
	            channels.login.input(true);
	            return circuit.error() === `please enter a valid email`;
	        });
	    });
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.utils);
	        global.utilsTests = mod.exports;
	    }
	})(this, function (_src, _utils) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    var inc = function (v) {
	        return v + 1;
	    };

	    runTests('utils', function (mock) {

	        var app, channels, sigBlock, valBlock;
	        setup(function () {

	            app = new _src2.default();

	            sigBlock = {
	                i1: app.signal(),
	                i2: app.signal(),
	                i3: {
	                    i4: app.signal(),
	                    i5: app.signal()
	                }
	            };

	            valBlock = {
	                i1: 1,
	                i2: new Date(),
	                i3: {
	                    i4: 1,
	                    i5: 2
	                }
	            };

	            channels = app.join(sigBlock);
	        });

	        test('lens', function () {
	            return _utils2.default.lens(sigBlock, 'i1');
	        });

	        test('lens - namespace', function () {
	            return _utils2.default.lens(sigBlock, 'i4', 'i3');
	        });

	        test('lens - traverse', function () {
	            return _utils2.default.lens(sigBlock, 'i5');
	        });

	        test('map', function () {
	            function id(s) {
	                return s.name;
	            }
	            return _utils2.default.deepEqual(_utils2.default.map(channels, id), {
	                i1: 'i1',
	                i2: 'i2',
	                i3: {
	                    i4: 'i4',
	                    i5: 'i5'
	                }
	            });
	        });

	        test('map - copy', function () {
	            return _utils2.default.deepEqual(_utils2.default.map(valBlock), valBlock);
	        });

	        test('map - prime', function () {
	            function prime(s, v) {
	                return v;
	            }
	            return _utils2.default.deepEqual(_utils2.default.map(channels, prime, valBlock), valBlock);
	        });

	        test('reduce', function () {
	            function error(err, s) {
	                return err || s.name === 'i4';
	            }
	            return _utils2.default.reduce(channels, error) === true;
	        });

	        test('input - pure', function () {
	            var r = 0,
	                s = app.signal().bind((0, _utils.pure)()).tap(function () {
	                r++;
	            });
	            s.input(1);
	            s.input(1);
	            return r === 1;
	        });

	        test('input - pure after fail', function () {
	            var fail = function (v) {
	                return v === 1 ? v : _src.Signal.fail();
	            };
	            var r = 0,
	                s = app.signal().bind((0, _utils.pure)()).map(fail).tap(function () {
	                r++;
	            });
	            s.input(1);
	            s.input(2);
	            s.input(1);
	            return r === 1;
	        });

	        test('fail', function () {
	            var f = _src.Signal.fail();
	            return f instanceof _src.Signal.fail;
	        });

	        test('fail - value', function () {
	            var f = _src.Signal.fail(1);
	            return f.error === 1;
	        });

	        test('typeof - Array', function () {
	            return _utils2.default.typeOf([]) === _utils2.default.type.ARRAY;
	        });

	        test('typeof - Object', function () {
	            return _utils2.default.typeOf({}) === _utils2.default.type.OBJECT;
	        });

	        test('typeof - Date', function () {
	            return _utils2.default.typeOf(new Date()) === _utils2.default.type.LITERAL;
	        });

	        test('typeof - String', function () {
	            return _utils2.default.typeOf('') === _utils2.default.type.LITERAL;
	        });

	        test('typeof - Number', function () {
	            return _utils2.default.typeOf(1) === _utils2.default.type.LITERAL;
	        });

	        test('typeof - Boolean', function () {
	            return _utils2.default.typeOf(true) === _utils2.default.type.LITERAL;
	        });

	        test('typeof - Regex', function () {
	            return _utils2.default.typeOf(/a/) === _utils2.default.type.LITERAL;
	        });
	    });
	});

/***/ }
/******/ ])
});
;