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
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7), __webpack_require__(12), __webpack_require__(6), __webpack_require__(11), __webpack_require__(10), __webpack_require__(8), __webpack_require__(13), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(require('./circus-tests'), require('./signal-tests'), require('./circuit-tests'), require('./match-tests'), require('./join-tests'), require('./composables-tests'), require('./utils-tests'), require('./issues'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(global.circusTests, global.signalTests, global.circuitTests, global.matchTests, global.joinTests, global.composablesTests, global.utilsTests, global.issues);
	    global.index = mod.exports;
	  }
	})(this, function () {});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(14), __webpack_require__(3), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circuit'), require('./circus'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circuit, global.circus, global.utils);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _circuit, _circus, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.test = exports.Error = exports.Circuit = undefined;

	  var _circuit2 = _interopRequireDefault(_circuit);

	  var _circus2 = _interopRequireDefault(_circus);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  _circus2.default.Circuit = _circuit2.default;

	  exports.Circuit = _circuit2.default;
	  exports.Error = _utils.Error;
	  exports.test = _utils.test;
	  exports.default = _circus2.default;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	      ctx.finally(function (v) {
	        if (v instanceof _circus2.default.fail) {
	          _fail = _fail || v.value || true;
	        }
	      });

	      // important: this functor flatmaps a circuit's channels
	      // at the point that it is employed. Make this the last
	      // binding if all channels are expected.
	      var channels = api.flatmap(ctx);

	      return {
	        active: Error.active(ctx, channels),
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

	  Error.active = function (ctx, channels) {
	    return function (m) {
	      return ctx.map(function (v) {
	        for (var c of channels) {
	          if (!c.active()) return _circus2.default.fail(m || 'required');
	        }
	        return v;
	      });
	    };
	  };

	  function test(f, m) {
	    return function (v) {
	      var j = f.apply(this, arguments);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circus'), require('./utils'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circus, global.utils);
	    global.composables = mod.exports;
	  }
	})(this, function (exports, _circus, _utils) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Composables;

	  var _circus2 = _interopRequireDefault(_circus);

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

	      // Feed signal values into fanout signal(s)
	      // The input signal is terminated
	      feed: function () {
	        var feeds = [].slice.call(arguments);
	        return this.map(function (v) {
	          feeds.forEach(function (s) {
	            s.value(v);
	          });
	        });
	      },

	      filter: function (f) {
	        return this.map(function (v) {
	          return f(v) ? v : undefined;
	        });
	      },

	      flatten: function (f) {
	        return this.map(function (v, next) {
	          function flatten(v) {
	            if (_circus2.default.typeOf(v) === _circus2.default.type.ARRAY) {
	              v.forEach(flatten);
	            } else {
	              next(f ? f(v) : v);
	            }
	            return undefined;
	          }
	          return flatten(v);
	        });
	      },

	      maybe: function (f, n) {
	        return this.map(function (v) {
	          return f(v) ? { just: v } : { nothing: n || true };
	        });
	      },

	      // streamlined map
	      pluck: function () {
	        var args = [].slice.call(arguments),
	            a0 = args[0];
	        return this.map(function (v) {
	          return args.length === 1 && (v[a0] || _utils2.default.lens(v, a0)) || args.reduce(function (r, key) {
	            r[key] = _utils2.default.lens(v, key);
	            return r;
	          }, {});
	        });
	      },

	      // named (projected) pluck
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
	          return n-- > 0 ? _circus2.default.fail(v) : v;
	        });
	      },

	      // Take the first n values from the signal
	      // The signal will not propagate after n
	      take: function (n) {
	        return this.map(function (v) {
	          return n-- > 0 ? v : _circus2.default.fail(v);
	        });
	      },

	      // Batch values into sliding window of size w
	      window: function (w) {
	        var b = [],
	            fn = function (v) {
	          b.push(v);
	          if (--w < 0) {
	            b.shift();
	            return b;
	          }
	        };
	        return this.map(fn);
	      },

	      // Zip signal channel values into a true array.
	      zip: function (keys) {
	        keys = keys || [0, 1];
	        var kl = keys.length,
	            i = 0;
	        var fn = function (v) {
	          return ++i % kl === 0 ? keys.map(function (k) {
	            return v[k];
	          }) : undefined;
	        };
	        return this.map(fn);
	      }

	    });
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./circus'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.circus);
	    global.match = mod.exports;
	  }
	})(this, function (exports, _circus) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = Match;

	  var _circus2 = _interopRequireDefault(_circus);

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
	  //    .match(Circus.and(6, signal().tap(v))) // signal 6
	  //
	  // By default:
	  //    - every channel is tested (use some for early signal result)
	  //    - the signal is blocked if all channels are blocked
	  //    - the match function is provided by Circus.and
	  //
	  function match(f) {

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
	    fn = fn || _circus2.default.and;

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
	        isObject = _circus2.default.typeOf(m) === _circus2.default.type.OBJECT;
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
	      return count >= lBound && count <= uBound ? v === undefined ? _circus2.default.UNDEFINED : v : block;
	    }
	    return ctx.map(matcher);
	  }

	  // build a custom match
	  function base() {
	    return match.apply(this, arguments);
	  }

	  // signal every or block
	  function every(m) {
	    return match.call(this, m, _circus2.default.and, -1);
	  }

	  // signal some or block
	  function some(m) {
	    return match.call(this, m, _circus2.default.and, 1, 2);
	  }

	  // signal one or block
	  function one(m) {
	    return match.call(this, m, _circus2.default.and, 1, 1);
	  }

	  // signal none or block
	  function none(m) {
	    return match.call(this, m, _circus2.default.and, 0, 0);
	  }

	  // logical match functions operate on current and previous channel values,
	  // or current value and mask if provided: Circus.and(mvalue)
	  // or switch on current value and mask: Circus.and(mvalue, Signal)
	  ;(function (ops) {
	    Object.keys(ops).forEach(function (op) {
	      _circus2.default[op] = function (v, m) {
	        if (arguments.length === 1) m = v;
	        var f = m,
	            s = _circus2.default.isSignal(f) || typeof f === 'function';
	        if (s) m = arguments.length === 2 ? v : undefined;
	        if (arguments.length === 1 || s) {
	          return function (v, lv) {
	            v = _circus2.default[op](v, m === undefined ? lv : m);
	            return s && v ? this.asSignal(f).value(v) : v;
	          };
	        }
	        return ops[op](v, m);
	      };
	    });
	  })({
	    and: function (v, m) {
	      return v && (m === v || m === true) || !v && m === false ? v === undefined ? _circus2.default.UNDEFINED : v : false;
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
	      every: every,
	      some: some,
	      one: one,
	      none: none
	    });
	  }
	});

/***/ },
/* 6 */
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

			var app;

			setup(function () {
				app = new _src2.default.Circuit();
			});

			test('new circuit - is signal', function () {
				return _src2.default.isSignal(app.join());
			});

			test('new signal', function () {
				return _src2.default.isSignal(app.signal());
			});

			test('new signal - ctx', function () {
				var s = app.asSignal(app);
				return _src2.default.isSignal(s);
			});

			test('existing signal', function () {
				var s = app.signal();
				var n = s.asSignal();
				return n === s;
			});

			test('circuit - stop propagation', function () {
				var s1 = app.signal();
				var s2 = app.signal();
				var j = app.join(s1, s2).map(_src2.default.fail);
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return r[0] === 1 && r[1] === 2 && s1.value() === 1 && s2.value() === 2;
			});

			test('circuit - fail bubbling', function () {
				var s1 = app.signal().map(_src2.default.fail);
				var j1 = app.join(s1);
				var f,
				    j = app.join(j1).finally(function (v) {
					f = v;
				});
				s1.value(2);
				return f instanceof _src2.default.fail;
			});

			test('channel - input', function () {
				var a = app.signal();
				var c = app.join({ a: a });
				return _src2.default.isSignal(c.channels.a) && a !== c.channels.a;
			});

			test('channel - input -> output', function () {
				var a = app.signal().map(inc);
				var c = app.join({ a: a });
				c.channels.a.value(1);
				return a.value() === 2;
			});

			test('channel - input -> output names', function () {
				var output = app.signal('output');
				var c = app.join({ input: output });
				return c.channels.input.name === 'input' && c.channels.input.output.name === 'output';
			});

			test('channel - implied map', function () {
				var r,
				    a = app.join({
					a: inc
				}).channels.a.value(1);

				return a === 2;
			});

			test('associativity - input / output', function () {
				var s = [],
				    step = function (v) {
					return function () {
						s.push(v);
					};
				};
				var b = app.signal().tap(step(2));
				var j = app.join({
					a: b
				}).tap(step(3));
				var a = j.channels.a.tap(step(1));
				a.value(123);

				return s.toString() === '1,2,3';
			});

			test('associativity - deep join', function () {
				var steps = [];
				app.extend({ seq: function (s) {
						return this.tap(function () {
							steps.push(s);
						});
					} });
				var a = app.signal('a').seq(1);
				var b = app.signal('b');
				var j = app.join({
					a: a,
					c: app.join(a, b.join(a).seq(2)).seq(3)
				}).seq(4);
				a.value(123);

				return steps.toString() === '1,2,3,4';
			});

			test('channel value - literal (always)', function () {
				var r = app.join({
					a: 'a'
				});
				r.channels.a.value(123);
				return r.value().a === 'a';
			});

			test('channel value - passive', function () {
				var r,
				    s = app.signal().prime(2).map(inc);
				var c = app.join({
					a: inc,
					b: s.id
				}).tap(function (v) {
					r = v;
				});
				c.channels.a.value(1);
				return r.b === 2;
			});

			test('circuit value - prime', function () {
				var a = app.signal();
				var r = app.join({
					a: a
				});
				r.prime({ a: 123 });

				return a.value() === 123;
			});

			test('channel value - prime deep', function () {
				var a = app.signal();
				var r = app.join({
					b: {
						a: a
					}
				});
				r.prime({ b: { a: 123 } });

				return a.value() === 123;
			});

			test('circuit value - outer join state', function () {
				var a,
				    r = app.join({
					a: app.signal().map(function (v, jv) {
						a = jv;
						return v;
					})
				});
				r.value('abc');
				r.channels.a.value(123);

				return a === 'abc' && r.value().a === 123;
			});

			test('circuit value - outer merge state', function () {
				var a,
				    r = app.merge({
					a: app.signal().map(function (v, mv) {
						a = mv;
						return v;
					})
				});
				r.value('abc');
				r.channels.a.value(123);

				return a === 'abc' && r.value() === 123;
			});

			test('circuit - placeholder', function () {
				var c = app.join({ a: _src2.default.UNDEFINED });
				return c.channels.a.value(1) === 1;
			});

			test('circuit - overlay placeholder', function () {
				var o = { a: inc };
				var c = app.join({ a: _src2.default.UNDEFINED }).overlay(o);
				return c.channels.a.value(0) === 1;
			});

			test('circuit - overlay input (pre)', function () {
				var b = app.signal('b').map(dbl);
				var o = { a: inc };
				var c = app.join({ a: b }).overlay(o);
				return c.channels.a.value(0) === 2;
			});

			test('circuit - overlay input (signal)', function () {
				var b = app.signal('b').map(dbl);
				var o = { a: app.signal().map(inc) };
				var c = app.join({ a: b }).overlay(o);
				return c.channels.a.value(0) === 2;
			});

			test('circuit - overlay output (pre)', function () {
				var b = app.signal('b').map(dbl);
				var o = { b: [inc] };
				var c = app.join({ a: b }).overlay(o);
				return c.channels.a.value(0) === 2;
			});

			test('circuit - overlay output (post)', function () {
				var b = app.signal('b').map(dbl);
				var o = { b: inc };
				var c = app.join({ a: b }).overlay(o);
				return c.channels.a.value(0) === 1;
			});

			test('circuit - overlay input & output', function () {
				var b = app.signal('b');
				var o = { a: inc, b: dbl };
				var c = app.join({ a: b }).overlay(o);
				return c.channels.a.value(1) === 4;
			});

			test('circuit - overlay deep', function () {
				var b = app.signal('b');
				var o = { a: { a: { a: inc } } };
				var c = app.join({ a: { a: { a: b } } }).overlay(o);
				return c.channels.a.channels.a.channels.a.value(1) === 2;
			});

			test('circuit - overlay aggregate', function () {
				var a = app.signal('a');
				var b = app.signal('b');
				var o = { a: inc, b: inc };
				var c = app.join({ a: a }).sample({ b: b }).overlay(o);
				return c.channels.a.value(1) === 2 && c.channels.b.value(1) === 2;
			});

			test('circuit - overlay aggregate map fn', function () {
				var a = app.signal('a');
				var b = app.signal('b');
				var o = { a: inc };
				var c = app.join({ b: b }).map({ a: a }).overlay(o);
				return c.channels.a.value(0) === 1;
			});

			test('circuit - overlay aggregate finally fn', function () {
				var a = app.signal('a');
				var b = app.signal('b');
				var o = { a: inc };
				var c = app.merge({ b: b }).finally({ a: a }).overlay(o);
				c.value(0);
				return c.channels.a.value() === 1;
			});

			test('extend - app ctx', function () {
				var ctx = new _src2.default.Circuit();
				ctx.extend({ c: true });

				return ctx.signal().c && !app.signal().c;
			});

			test('extend - app ctx + signal ctx', function () {
				var r1,
				    r2,
				    ctx = new _src2.default.Circuit();
				ctx.extend(function (c1) {
					r1 = c1;return { b: true };
				});
				ctx.extend(function (c2) {
					r2 = c2;return { c: true };
				});
				var s = ctx.signal();
				return r1 === s && r2 === s;
			});
		});
	});

/***/ },
/* 7 */
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
	        global.circusTests = mod.exports;
	    }
	})(this, function (_src) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    var inc = function (v) {
	        return v + 1;
	    };

	    runTests('circus', function (mock) {

	        var app;
	        setup(function () {
	            app = new _src2.default.Circuit();
	        });

	        (0, _src.test)('fail', function () {
	            var f = _src2.default.fail();
	            return f instanceof _src2.default.fail;
	        });

	        (0, _src.test)('fail - value', function () {
	            var f = _src2.default.fail(1);
	            return f.value === 1;
	        });

	        (0, _src.test)('typeof - Array', function () {
	            return _src2.default.typeOf([]) === _src2.default.type.ARRAY;
	        });

	        (0, _src.test)('typeof - Object', function () {
	            return _src2.default.typeOf({}) === _src2.default.type.OBJECT;
	        });

	        (0, _src.test)('typeof - Date', function () {
	            return _src2.default.typeOf(new Date()) === _src2.default.type.LITERAL;
	        });

	        (0, _src.test)('typeof - String', function () {
	            return _src2.default.typeOf('') === _src2.default.type.LITERAL;
	        });

	        (0, _src.test)('typeof - Number', function () {
	            return _src2.default.typeOf(1) === _src2.default.type.LITERAL;
	        });

	        (0, _src.test)('typeof - Boolean', function () {
	            return _src2.default.typeOf(true) === _src2.default.type.LITERAL;
	        });

	        (0, _src.test)('typeof - Regex', function () {
	            return _src2.default.typeOf(/a/) === _src2.default.type.LITERAL;
	        });
	    });
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(4), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

	        var app = new _src2.default.Circuit(_composables2.default);

	        test('always', function () {
	            var s = app.signal();
	            var r = s.always(123);
	            s.value('xyz');
	            return r.value() === 123;
	        });

	        test('batch', function () {
	            var s = app.signal().batch(2).tap(function (v) {
	                r.push(v);
	            });
	            var r = [];
	            for (var i = 0; i < 4; i++) s.value(i);
	            return r.length === 2 && r[0].toString() === '0,1' && r[1].toString() === '2,3';
	        });

	        test('compose', function () {
	            var e,
	                s = app.signal().compose(inc, dbl, dbl).tap(function (v) {
	                e = v;
	            });
	            s.value(1);
	            return e === 5;
	        });

	        test('feed', function () {
	            var s1 = app.signal();
	            var s2 = app.signal().feed(s1).map(inc);
	            s2.value(2);
	            return s1.value() === 2 & s2.value() === 2;
	        });

	        test('feed - fanout', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var s3 = app.signal().feed(s1, s2);
	            s3.value(3);
	            return s1.value() === 3 && s2.value() === 3;
	        });

	        test('filter', function () {
	            var s = app.signal().filter(function (v) {
	                return v % 2;
	            }).keep();
	            for (var i = 0; i < 4; i++) s.value(i);
	            return s.toArray().toString() === '1,3';
	        });

	        test('flatten', function () {
	            var s = app.signal().flatten().keep();
	            s.value([1, 2]);
	            s.value([3, [4, 5]]);
	            s.value(6);
	            return s.toArray().toString() === '1,2,3,4,5,6';
	        });

	        test('flatten - flatmap', function () {
	            var s = app.signal().flatten(function (v) {
	                return v + 1;
	            }).keep();
	            s.value([1, 2]);
	            s.value(3);
	            return s.toArray().toString() === '2,3,4';
	        });

	        test('maybe', function () {
	            var value = app.signal().maybe(function (v) {
	                return true;
	            }, 'nothing').value(123);
	            return value.just === 123;
	        });

	        test('maybe - nothing', function () {
	            var value = app.signal().maybe(function (v) {
	                return false;
	            }, 'nothing').value(123);
	            return value.nothing === 'nothing';
	        });

	        test('pluck', function () {
	            var s = app.signal().pluck('a', 'b');
	            s.value({ a: 1, b: 2, c: 3 });
	            return Object.keys(s.value()).toString() === 'a,b' && s.value().a === 1 && s.value().b === 2;
	        });

	        test('pluck - deep', function () {
	            var s = app.signal().pluck('a.a1', 'b.b1[1]');
	            s.value({ a: { a1: 1 }, b: { b1: [2, 3] } });
	            return Object.keys(s.value()).toString() === 'a.a1,b.b1[1]' && s.value()['a.a1'] === 1 && s.value()['b.b1[1]'] === 3;
	        });

	        test('project', function () {
	            var s = app.signal().project({ a: 'a.a1', b: 'b.b1[1]' });
	            s.value({ a: { a1: 1 }, b: { b1: [2, 3] } });
	            return Object.keys(s.value()).toString() === 'a,b' && s.value().a === 1 && s.value().b === 3;
	        });

	        test('fold', function () {
	            var e = 'xyz';
	            var s = app.signal().fold(function (a, v) {
	                return a + v;
	            }).tap(function (v) {
	                e = v;
	            });
	            s.value(1);
	            s.value(2);
	            s.value(3);
	            return e === 6;
	        });

	        test('fold - accum', function () {
	            var e = 'xyz';
	            var s = app.signal().fold(function (a, v) {
	                return a + v;
	            }, 6).tap(function (v) {
	                e = v;
	            });
	            s.value(1);
	            s.value(2);
	            s.value(3);
	            return e === 12;
	        });

	        test('keep - depth', function () {
	            var s = app.signal().keep(2);
	            s.value(1);
	            s.value(2);
	            s.value(3);
	            var v = s.toArray();
	            return v.toString() === '2,3';
	        });

	        test('keep - history', function () {
	            var s = app.signal().keep(2);
	            s.value(1);
	            s.value(2);
	            s.value(3);
	            var v = s.toArray();
	            return v.length === 2 && v[0] === 2;
	        });

	        test('history - keep', function () {
	            var s = app.signal().keep();
	            s.value(1);
	            s.value(2);
	            s.value(3);
	            return s.toArray()[0] === 1 && s.toArray().length === 3;
	        });

	        test('skip', function () {
	            var r,
	                s = app.signal().skip(2).map(inc).tap(function (v) {
	                r = r || v;
	            });
	            for (var i = 0; i < 5; i++) s.value(i);
	            return r === 3;
	        });

	        test('take', function () {
	            var r,
	                s = app.signal().take(2).map(inc).tap(function (v) {
	                r = v;
	            });
	            for (var i = 0; i < 5; i++) s.value(i);
	            return r === 2;
	        });

	        test('window', function () {
	            var s = app.signal().window(2);
	            for (var i = 0; i < 4; i++) s.value(i);
	            return s.value().toString() === '2,3';
	        });

	        test('zip - arrays', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            app.join(s1, s2, true).zip().tap(function (v) {
	                r.push(v);
	            });
	            var a = [1, 2, 3],
	                b = [4, 5, 6],
	                r = [];
	            a.map(function (x, i) {
	                s1.value(x);
	                s2.value(b[i]);
	            });
	            return r.length === 3 && _utils2.default.deepEqual(r, [[1, 4], [2, 5], [3, 6]]);
	        });
	    });
	});

/***/ },
/* 9 */
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

	    runTests('React login', function () {

	        const _ = _src2.default.UNDEFINED;

	        // some validation
	        const required = v => !!v;
	        const email = v => /\S+@\S+\.\S+/i.test(v);

	        let circuit, channels;

	        setup(function () {

	            // export a circuit
	            circuit = new _src.Circuit().join({
	                email: _utils2.default.test(email, `please enter a valid email`),
	                password: _utils2.default.test(required, `please enter your password`)
	            }).extend(_utils.Error).sample({ login: _ }).active('required!').map({ tryLogin: _ }).finally({ view: _ });

	            channels = circuit.channels;
	        });

	        test('email - error', function () {
	            channels.email.value('x');
	            return circuit.error() === `please enter a valid email`;
	        });

	        test('password - valid', function () {
	            channels.password.value('x');
	            return circuit.error() === ``;
	        });

	        test('login - required', function () {
	            channels.login.value(true);
	            return circuit.error() === `required!`;
	        });

	        test('circuit - primed', function () {
	            circuit.prime({ email: 'hi@home.com', password: 'ok' });
	            channels.login.value(true);
	            return circuit.error() === ``;
	        });

	        test('circuit - happy path', function () {
	            channels.email.value('hi@home.com');
	            channels.password.value('ok');
	            channels.login.value(true);
	            return circuit.error() === ``;
	        });

	        test('circuit - error', function () {
	            circuit.prime({ password: 'ok' });
	            channels.email.value('badformat');
	            channels.login.value(true);
	            return circuit.error() === `please enter a valid email`;
	        });
	    });
	});

/***/ },
/* 10 */
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
			global.joinTests = mod.exports;
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

			var app = new _src2.default.Circuit();
			var signal = app.signal.bind(app);

			test('join', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join(s1, s2);
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return typeof r === 'object' && r[0] === 1 && r[1] === 2;
			});

			test('join - compose', function () {
				var s1 = signal();
				var s2 = signal();
				var r,
				    j = app.join(s1, s2).tap(function (v) {
					r = v;
				});
				s1.value(1);
				s2.value(2);
				return typeof r === 'object' && r[0] === 1 && r[1] === 2;
			});

			test('join - named key', function () {
				var s1 = signal('k1');
				var s2 = signal('k2');
				var j = app.join(s1, s2);
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: 2 });
			});

			test('join - channel block', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: s2
				});
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: 2 });
			});

			test('join - merge channel blocks', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1
				}, {
					k2: s2
				});
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: 2 });
			});

			test('join - aggregate signal block', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: app.join({
						k3: s2
					})
				});
				s1.value(1);
				s2.value(2);
				var r = j.value();
				return _utils2.default.deepEqual(r, { k1: 1, k2: { k3: 2 } });
			});

			test('join - object into aggregate signal block', function () {
				var s1 = signal();
				var s2 = signal();
				var j = app.join({
					k1: s1,
					k2: {
						k3: s2
					}
				});
				s1.value(1);
				s2.value(2);
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
				var m = app.merge(s1, s2);
				s1.value(1);
				var r1 = m.value();
				s2.value(2);
				var r2 = m.value();
				return r1 === 1 && r2 === 2;
			});

			test('sample', function () {
				var s1 = signal();
				var s2 = signal();
				var s3 = signal();
				var s = s1.sample(s2, s3).map(inc);
				s1.value(1);
				var r1 = s.value();
				s2.value(2);
				var r2 = s.value();
				s3.value(3);
				var r3 = s.value();
				return r1 === 1 && r2 === 2 && r3 === 3;
			});
		});
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(5), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('../src'), require('../src/match'), require('../src/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.src, global.match, global.utils);
	        global.matchTests = mod.exports;
	    }
	})(this, function (_src, _match, _utils) {
	    'use strict';

	    var _src2 = _interopRequireDefault(_src);

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
	        var app = new _src.Circuit(_match2.default);

	        test('match - pass truthy literal', function () {
	            var r,
	                v = 1;
	            app.match().tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === v;
	        });

	        test('match - block falsey literal', function () {
	            var r,
	                v = 0;
	            app.match().tap(function (v) {
	                r = v;
	            }).value(v);
	            return r !== v;
	        });

	        test('match - pass truthy object', function () {
	            var r,
	                v = { a: 1, b: 2 };
	            app.match().tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass object with some', function () {
	            var r,
	                v = { a: false, b: 2 };
	            app.match().tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block object with every', function () {
	            var r,
	                v = { a: false, b: 2 };
	            app.match(-1, -1).tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === undefined;
	        });

	        test('match - pass mask', function () {
	            var r,
	                v = { c1: undefined, c2: 2 };
	            var s = app.match({ c1: false, c2: true }).tap(function (v) {
	                r = v;
	            });
	            s.value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block mask', function () {
	            var r,
	                v = { c1: undefined, c2: 2 };
	            app.match({ c1: 1, c2: 1 }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === undefined;
	        });

	        test('match - pass channel mask', function () {
	            var r,
	                v = { c1: 1, c2: 3 };
	            app.match({ c1: 1 }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass default mask', function () {
	            var r,
	                v = { c1: 1, c2: 3 };
	            app.match({ c1: undefined }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass mask + fn', function () {
	            var r,
	                v = { c1: 1, c2: 0, c3: 3 };
	            app.match({ c1: 0 }, function (v, m) {
	                return v === m + 1;
	            }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - fn mask', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            app.match({ ca1: function (v, m) {
	                    return v === 1;
	                } }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - fn (boolean) mask', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            var s = app.match({ ca1: function (v, m) {
	                    return r = m;
	                } });
	            s.value(v);
	            s.value(v);
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
	            }).value(v);
	            return assert(r, v, _utils2.default.equal);
	        });

	        test('match - pass wildcard', function () {
	            var r,
	                v = { c1: 1, c2: 2, c3: 3 };
	            app.match({ '*': true }).tap(function (v) {
	                r = v;
	            }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass leading wildcard', function () {
	            var r,
	                v = { a1: 1, b2: 0, c1: 3 };
	            app.match({ '*1': true }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - block leading wildcard', function () {
	            var r,
	                v = { c11: 1, c21: 0 };
	            app.match({ '*1': true }, -1, -1).tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === undefined;
	        });

	        test('match - trailing wildcard', function () {
	            var r,
	                v = { ca1: 1, cb2: false, ca3: 3 };
	            app.match({ 'ca*': true }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - mixed wildcard', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 3 };
	            app.match({ '*1': 1, '*': true }).tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('match - pass list', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 3 };
	            app.match('ca1', 'cc3').tap(function (v) {
	                r = v;
	            }).value(v);
	            return assert(r, v, _utils2.default.equal);
	        });

	        test('match - block list', function () {
	            var r,
	                v = { ca1: 1, cb2: 2, cc3: 0 };
	            app.match('ca1', 'cc3', -1, -1).tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === undefined;
	        });

	        test('every - take all truthy', function () {
	            var r,
	                v = { c1: 1, c2: 2 };
	            app.every().tap(function (v) {
	                r = v;
	            }).value(v);
	            return _utils2.default.equal(r, v);
	        });

	        test('every - block some falsey', function () {
	            var r,
	                v = { c1: 1, c2: 0 };
	            app.every().tap(function (v) {
	                r = v;
	            }).value(v);
	            return r === undefined;
	        });

	        test('every - mask', function () {
	            var r,
	                mask = {
	                s1: true
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s1.value(1);
	            return _utils2.default.equal(r, { s1: 1, s2: undefined });
	        });

	        test('every - negative mask', function () {
	            var r,
	                mask = {
	                s2: false
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s1.value(1);
	            return _utils2.default.equal(r, { s1: 1, s2: undefined });
	        });

	        test('every - blocked mask', function () {
	            var r,
	                mask = {
	                s1: true,
	                s2: true
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s1.value(1);
	            s2.value(0);
	            return _utils2.default.equal(r, undefined);
	        });

	        test('every - value mask', function () {
	            var r,
	                mask = {
	                s1: 1
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s2.value(1);
	            s1.value(1);
	            return _utils2.default.equal(r, { s1: 1, s2: 1 });
	        });

	        test('every - blocked value mask', function () {
	            var r,
	                mask = {
	                s1: 1,
	                s2: 2
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s2.value(1);
	            s1.value(1);
	            return _utils2.default.equal(r, undefined);
	        });

	        test('every - undefined value mask', function () {
	            var r,
	                mask = {
	                s1: 1,
	                s2: undefined
	            };
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).every(mask).tap(function (v) {
	                r = v;
	            });
	            s2.value(1);
	            s1.value(1);
	            return _utils2.default.equal(r, { s1: 1, s2: 1 });
	        });

	        test('some - signal values', function () {
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            var jp = app.join(s1, s2).some();
	            s1.value(1);
	            s2.value(1);
	            return _utils2.default.equal(jp.value(), { s1: 1, s2: 1 });
	        });

	        test('some - some signal values', function () {
	            var s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            var jp = app.join(s1, s2).some();
	            s2.value(1);
	            return _utils2.default.equal(jp.value(), { s1: undefined, s2: 1 });
	        });

	        test('some - block on no values', function () {
	            var r,
	                s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).some().tap(function (v) {
	                r = v;
	            });
	            s1.value(0);
	            s2.value(0);
	            return r === undefined;
	        });

	        test('one - pass on only one', function () {
	            var r,
	                s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).one().tap(function (v) {
	                r = v;
	            }).value({ s1: 0, s2: 2 });
	            return _utils2.default.equal(r, { s1: 0, s2: 2 });
	        });

	        test('one - block on more than one', function () {
	            var r,
	                s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).one().tap(function (v) {
	                r = v;
	            }).value({ s1: 1, s2: 2 });
	            return r === undefined;
	        });

	        test('none - block on any value', function () {
	            var r,
	                s1 = app.signal('s1');
	            var s2 = app.signal('s2');
	            app.join(s1, s2).none().tap(function (v) {
	                r = v;
	            }).value({ s1: 1 });
	            return r === undefined;
	        });

	        // boolean masks - mutate to boolean result

	        test('or - restore dropped value', function () {
	            var r,
	                s1 = app.some({ a: _src2.default.or(function (v) {
	                    r = v;
	                }) });
	            s1.value({ a: 1 });
	            s1.value({ a: 0 });
	            return r === 1;
	        });

	        test('or - default to mask value', function () {
	            var r,
	                mask = {
	                a: _src2.default.or(2, function (v) {
	                    r = v;
	                })
	            };
	            app.some(mask).value({ a: 0 });
	            return r === 2;
	        });

	        test('xor - pass new value', function () {
	            var p = 0,
	                s = app.some({ a: _src2.default.xor }).tap(function () {
	                p++;
	            });
	            s.value({ a: 1 });
	            s.value({ a: 2 });
	            return p == 2;
	        });

	        test('xor - block same value', function () {
	            var p = 0,
	                s = app.some({ a: _src2.default.xor }).tap(function () {
	                p++;
	            });
	            s.value({ a: 1 });
	            s.value({ a: 1 });
	            return p === 1;
	        });

	        test('not - pass on falsey', function () {
	            var r,
	                p,
	                s = app.some({ a: _src2.default.not }).tap(function () {
	                p = true;
	            });
	            r = s.value({ a: 0 });
	            return p && _utils2.default.equal(r, { a: 0 });
	        });

	        test('not - block on truthy', function () {
	            var p,
	                s = app.some({ a: _src2.default.not }).tap(function () {
	                p = true;
	            });
	            s.value({ a: 1 });
	            return p !== true && _utils2.default.equal(s.value(), { a: 1 });
	        });

	        // switch:: fn(channel value -> signal)

	        test('switch - match channel', function () {
	            var sig = app.signal().map(inc);
	            var a = app.some({ a: _src2.default.and(1, sig) });
	            a.value({ a: 1 });
	            return sig.value() === 2;
	        });

	        test('switch - block channel', function () {
	            var sig = app.signal().map(inc);
	            var a = app.some({ a: _src2.default.and(1, sig) });
	            a.value({ a: 0 });
	            return sig.value() === undefined;
	        });

	        // joinpoint - all

	        test('join - all active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var r,
	                j = app.join(s1, s2).every().tap(function () {
	                r = true;
	            });
	            app.join(s1, s2).every();
	            s1.value(1);
	            s2.value(2);
	            return r;
	        });

	        test('join - not all active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var r,
	                j = app.join(s1, s2).every().tap(function () {
	                r = true;
	            });
	            app.join(s1, s2).every();
	            s1.value(1);
	            return r === undefined;
	        });

	        test('join - already active', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            s2.value(2);
	            var r,
	                j = app.join(s1, s2).every().tap(function () {
	                r = true;
	            });
	            s1.value(1);
	            return r;
	        });

	        test('sample - all', function () {
	            var s1 = app.signal();
	            var s2 = app.signal();
	            var s3 = app.signal();
	            var allSigs = app.signal().join(s2, s3).every();
	            var s = s1.sample(allSigs).map(inc);
	            s1.value(1);
	            var r1 = s.value(); // blocked
	            s2.value(2);
	            var r2 = s.value(); // blocked
	            s3.value(3);
	            var r3 = s.value();
	            return r1 === 1 && r2 === 1 && r3 === 2;
	        });
	    });
	});

/***/ },
/* 12 */
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
			global.signalTests = mod.exports;
		}
	})(this, function (_src) {
		'use strict';

		var _src2 = _interopRequireDefault(_src);

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

		runTests('signal', function (mock) {

			var app, signal;
			setup(function () {
				app = new _src2.default.Circuit(), signal = app.signal.bind(app);
			});

			test('named signal', function () {
				var r = signal('sig1');
				return r.name === 'sig1';
			});

			test('unnamed signal', function () {
				return signal().name === undefined;
			});

			test('value ', function () {
				return signal().value(2) === 2;
			});

			test('value - undefined', function () {
				return signal().value(undefined) === undefined;
			});

			test('value - pure', function () {
				var r = 0,
				    s = signal().pure().tap(function () {
					r++;
				});
				s.value(1);
				s.value(1);
				return r === 1;
			});

			test('value - impure', function () {
				var r = 0,
				    s = signal().tap(function () {
					r++;
				});
				s.value(1);
				s.value(1);
				return r === 2;
			});

			test('set value ', function () {
				var s = signal();
				s.value(1);
				s.value(2);
				s.value(3);
				return s.value() === 3;
			});

			test('value - bind', function () {
				var bv = signal().value;
				return bv(2) === 2;
			});

			test('tap', function () {
				var e = 'xyz';
				var s = signal().tap(function (v) {
					e = v;
				});
				s.value(123);
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
				var s = signal().map(inc).tap(t1).map(inc).tap(t2);
				s.value(e);
				return e1 === 1 && e2 === 2;
			});

			test('map', function () {
				return signal().map(dbl).value(1) === 2;
			});

			test('map - before', function () {
				return signal().map(dbl).map(_src2.default.before(inc)).value(1) === 4;
			});

			test('map - undefined halts propagation', function () {
				var s = signal().map(function (v) {
					return undefined;
				}).map(inc);
				s.value(1);
				return s.value() === 1;
			});

			test('map - Circus.UNDEFINED continues propagation', function () {
				var r = 1;
				return signal().map(function (v) {
					return _src2.default.UNDEFINED;
				}).map(function (v) {}).value(1) === undefined;
			});

			test('map - Circus.fail aborts propagation', function () {
				var s = signal().map(inc).map(function (v) {
					return _src2.default.fail();
				}).map(inc);
				s.value(1);
				return s.value() === 2;
			});

			test('map - signal', function () {
				var b = signal().map(inc);
				return signal().map(b).value(1) === 2 && b.value() === 2;
			});

			test('map - signal flow', function () {
				var b = signal().map(inc);
				return signal().map(dbl).map(b).map(mul3).value(1) === 9 && b.value() === 3;
			});

			test('map - signal flow inline merge', function () {
				var b = signal().map(inc);
				var s = signal().map(dbl).map(b).map(mul3);
				return b.value(1) === 2 && s.value() === 6;
			});

			test('map - async', function (done) {
				var r = 0;
				function async(v, next) {
					setTimeout(function () {
						next(v + 1);
					});
				}
				signal().map(async).tap(function (v) {
					done(v === 2);
				}).value(1);
			});

			test('map - async signal ', function (done) {
				var r = 0;
				var async = signal().map(function (v, next) {
					setTimeout(function () {
						next(v + 1);
					});
				});
				var s = signal().map(async).tap(function (v) {
					done(v === 2);
				});
				s.value(1);
			});

			test('flow', function () {
				var e,
				    s = app.signal().flow(inc, dbl, dbl).tap(function (v) {
					e = v;
				});
				s.value(0);
				return e === 4;
			});

			test('bind - pre', function () {
				var e,
				    s = app.signal().map(inc).tap(function (v) {
					e = v;
				});
				s.bind(function (f, args) {
					return f(args[0] + 1);
				}).value(0);
				return e === 3;
			});

			test('bind', function () {
				var s = app.signal().map(inc).map(dbl);
				var e = s.bind(function (f, args) {
					return f(args[0] + 1);
				}).value(0);
				return e === 6;
			});

			test('bind - no functors', function () {
				var e = app.signal().bind(function (f, args) {
					return f(args[0] + 1);
				}).value(0);
				return e === 0;
			});

			test('bind - includes taps', function () {
				var e,
				    s = app.signal().map(inc).map(dbl).tap(function (v) {
					e = v;
				});
				s.bind(function (f, args) {
					return f(args[0] + 1);
				}).value(0);
				return e === 7;
			});

			test('bind - composed', function () {
				var b = function (f, args) {
					return f(args[0] + 1);
				};
				var e = app.signal().map(inc).bind(b).bind(b).value(0);
				return e === 3;
			});

			test('prime', function () {
				return signal().map(inc).prime(1).value() === 1;
			});

			test('channel - halted propagation', function () {
				var r,
				    s = signal().map(function () {
					return _src2.default.FALSE;
				}).channel(function () {
					r = true;
				});
				s.value(1);
				return !r;
			});

			test('finally', function () {
				var r,
				    s = signal().finally(function (v) {
					r = v;
				});
				s.value(1);
				return r === 1;
			});

			test('finally - fifo', function () {
				var r = [],
				    s = signal();
				s.finally(function (v) {
					r.push(1);
				});
				s.finally(function (v) {
					r.push(2);
				});
				s.value(1);
				return r[0] === 1 && r[1] === 2;
			});

			test('finally - filo', function () {
				var r = [],
				    s = signal();
				s.finally(_src2.default.before(function (v) {
					r.push(1);
				}));
				s.finally(_src2.default.before(function (v) {
					r.push(2);
				}));
				s.value(1);
				return r[0] === 2 && r[1] === 1;
			});

			test('finally - halted propagation', function () {
				var r,
				    s = signal().map(inc).map(function () {
					return undefined;
				}).finally(function (v) {
					r = v;
				});
				s.value(1);
				return r === undefined && s.value() === 2;
			});

			test('finally - aborted propagation', function () {
				var r,
				    s = signal().map(inc).map(function () {
					return _src2.default.fail();
				}).map(inc).finally(function (v) {
					r = v;
				});
				s.value(1);
				return r instanceof _src2.default.fail;
			});

			test('channel', function () {
				var s = signal().map(inc);
				var a = s.channel().map(dbl);
				s.map(mul3).value(1);

				return s.value() === 12;
			});

			test('channel - after', function () {
				var s = signal().map(inc);
				var a = s.channel(_src2.default.after).map(dbl);
				s.map(mul3).value(1);

				return s.value() === 12;
			});

			test('channel - after, take steps', function () {
				var s = signal().map(inc);
				var a = s.channel(_src2.default.after, true).map(dbl);
				s.map(mul3).value(1);

				// in: 1 -> mul3 -> out: inc -> dbl
				return s.value() === 8;
			});

			test('channel -after, shared state', function () {
				var s = signal().map(inc);
				var a = s.channel().map(dbl);
				a.value(1);

				return s.value() === 4 && a.value() === 4;
			});

			test('channel - before', function () {
				var s = signal().map(inc);
				var b = s.channel(_src2.default.before).map(dbl);
				s.map(mul3).value(1);

				return s.value() === 9;
			});

			test('channel - before, take steps', function () {
				var s = signal().map(inc);
				var b = s.channel(_src2.default.before, true).map(dbl);
				s.map(mul3).value(1);

				return s.value() === 12;
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

	            app = new _src2.default.Circuit(_utils.Error);

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

	        test('test - true', function () {
	            var m = _utils2.default.test(function (v) {
	                return true;
	            })(1);
	            return m === 1;
	        });

	        test('test - value', function () {
	            var m = _utils2.default.test(function (v) {
	                return v + 1;
	            })(1);
	            return m === 2;
	        });

	        test('test - fail', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            })(0);
	            return m instanceof _src2.default.fail;
	        });

	        test('test - fail with reason', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            }, 'xyz')(0);
	            return m.value === 'xyz';
	        });

	        test('error - circuit valid', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            }, 'error!');
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.value(1);
	            return s.error() === '' && s.value() === 2;
	        });

	        test('error - circuit error', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            });
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.value(0);
	            return s.error() === true;
	        });

	        test('error - circuit error msg', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            }, 'error!');
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.value(0);
	            return s.error() === 'error!';
	        });

	        test('error - first error only', function () {
	            var m1 = _utils2.default.test(function (v) {
	                return !!v;
	            }, 1);
	            var m2 = _utils2.default.test(function (v) {
	                return !!v;
	            }, 2);
	            var s = app.merge({ m1: m1, m2: m2 }).map(inc);
	            s.channels.m1.value(0);
	            s.channels.m2.value(0);
	            return s.error() === 1 && s.value() === undefined;
	        });

	        test('error - circuit error clear', function () {
	            var m = _utils2.default.test(function (v) {
	                return !!v;
	            });
	            var s = app.merge({ m: m }).map(inc);
	            s.channels.m.value(0);
	            return s.error() === true && s.error() === '';
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
	    });
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(15), __webpack_require__(16)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	      ctx.isJoin = joinOnly || ctx.isJoin;

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
	          if (joinOnly && !(v instanceof _circus2.default.fail)) {
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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	          _after,
	          _active;
	      var _finallys = [],
	          _pulse = _circus2.default.UNDEFINED;
	      var _pure,
	          _diff = diff;

	      // _runToState - next step
	      function _runToState(v, ns, _b) {
	        var nv;
	        _event.start(_this, v);
	        if (v instanceof _circus2.default.fail) {
	          nv = v;
	        } else if (!_pure || _diff(v, _head, _this.isJoin)) {
	          _head = _pure && v;
	          nv = v;
	          // steps in FIFO order
	          for (var i = ns, il = _steps.length; i < il; i++) {
	            nv = _b(_steps[i], [v]);
	            if (nv === undefined || nv instanceof _circus2.default.fail) break;
	            v = nv;
	          }
	          _mutate(v);
	        }

	        // finallys in FILO order - last value
	        if (nv !== undefined) {
	          for (var f = 0, fl = _finallys.length; f < fl; f++) {
	            _finallys[f].call(_this, nv);
	          }
	        }

	        if (_pulse !== _circus2.default.UNDEFINED) _mutate(_pulse);

	        _event.stop(_this, _state);
	        return nv;
	      }

	      function _mutate(v) {
	        _active = v === undefined ? undefined : true;
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
	        if (typeof f === 'object' && _this.channels) {
	          for (var p in f) if (f.hasOwnProperty(p)) {
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
	        _mutate(v);
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