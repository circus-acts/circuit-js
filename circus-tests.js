/*
	test.js - originally https://github.com/lhorie/mithril.js/blob/70b24895394b314da45e3a4d27ee24fa90a3fd2c/tests/test.js

	usage:

	runTests('suite name', function(){

		test('test name', function(){
			return 'test'.length === 4
		})

		test('test name with assert', function(){
			return assert('test'.length,0) // Assert failure 4 -> 0
		})

		test('test name with circus assert', function(){
			return assert({x:y:z:1}}},{x:y:z:2}}}, circus.deepEqual) // Assert failure {x:y:z:1}}} -> {x:y:z:2}}}
		})

		test('test name with custom assert', function(){
			return assert('test','x', function(v1,v2){return ~v1.indexOf(v2)}) // Assert test failure -> 'x'
		})

		test('async test name', function(done){
			setTimeout(function(){
				done(function() {
					return false
				}
			})
		})

		itest('include test', function(){ // include test
			return true
		})

		xtest('exclude test', function(){ // exclude test
			return true
		})
	})

	irunTests('include suite name'), function(){}) // include suite
	xrunTests('exclude suite name'), function(){}) // exclude suite
*/


//make "use strict" and nodejs happy
var window = this

//test reporting for saucelabs
if (typeof window != "undefined") {
	window.global_test_results = {
		tests: [],
		duration: 0,
		passed: 0,
		failed: 0
	};
}

var testQueue = [], curSuite, inclusiveTests

function xrunTests() {}

function irunTests(name,tests) {
	inclusiveTests = true
	startRun(name,tests,true)
}

function runTests(name,tests){
	startRun(name,tests,false)
}

function startRun(name,registerTests, inclusive) {
	new (function(){
		this.setup = function(){}
		this.total = 0
		this.inclusive = inclusive
		this.title = name
		this.failures = []
		this.tests = []
		var suite = curSuite = this
		registerTests(mock.window)
		this.tests.unshift(0)
		this.tests.unshift(testQueue.length)
		Array.prototype.splice.apply(testQueue,this.tests)
		testQueue.push(function(){
			if (!inclusiveTests || suite.total > 0) {
				print(suite, function(value) {this.console.log(value)})
			}
		})
	})()
	var len = testQueue.length
	setTimeout(function(){
		if (testQueue.length==len) wait()
	},100)
}
var testRunning=0,timeout=500,tid=0,rtest
function wait(){
	if (!testRunning) {
		if (testQueue.length) {
			var test = testQueue.shift()
			test.apply(test)
		}
		if (tid) clearTimeout(tid)
	}
	else {
		tid = setTimeout(function(){
			if (testRunning) {
				testRunning--
			}
			tid=0
		},timeout)
	}
	if (testQueue.length){
		setTimeout(wait)
	}
}

function setup(fn){
	curSuite.setup = fn
}

function xtest() {}
function itest(name,condition) {
	inclusiveTests=true
	startTest(curSuite,name,condition,true)
}

function test(name,condition) {
	startTest(curSuite,name,condition,false)
}

function startTest(suite, name, condition, inclusive) {
	var fn = condition.toString()
	name += '\n' + fn;

	inclusive = inclusive || suite.inclusive
	suite.tests.push(function() {
		if (inclusiveTests && !inclusive) return

		suite.total++

		var async = /\(\s*done\s*\)/.test(fn)
		runTest.call(suite, name, condition, async)

		return test
	})
}

function runTest(name, condition, async) {

	testRunning++

	var test = this
	test.setup()

	try {
		test.failures.push(name)
		var result = condition(function(result){
			if (typeof result === 'function') {
				testQueue.unshift(runTest.bind(test,name,result))
				test.failures.pop()
				return
			}
			if (testRunning) {
				testRunning--
				if (result) {
					test.failures.pop()
				}
			}
		})
		if (!result) {
			if (async) {
				testRunning++
			}
			return
		}
		test.failures.pop()
		if (result instanceof assert && result.fail) {
			test.failures.push(name + result.fail)
		}
	}
	catch (e) {
		console.error(e)
		console.log(name, e.stack)
	}

	testRunning--
}

function assert(v1,v2, comp){
	if (this instanceof assert) {
		this.fail = comp(v1,v2)? false : '\n\nAssert Failure '+JSON.stringify(v1)+' -> '+JSON.stringify(v2)
	}
	else return new assert(v1,v2, comp || function(v1,v2){return v1 === v2})
}

function print(test, print) {
	var failures = test.failures.length? "\nfailures: " + test.failures.length : ''
	try {
		for (var i = 0; i < test.failures.length; i++) {
			print(test.failures[i].toString())
			node = document.createElement('PRE')
			node.appendChild(document.createTextNode(test.failures[i].toString()))
			document.body.appendChild(node)
		}
		var node = document.createElement('DIV')
		node.appendChild(document.createTextNode(test.title + " tests: " + test.total + failures))
		document.body.appendChild(node)
	}
	catch (e) {}
	print(test.title + " tests: " + test.total + failures)

	if (test.failures.length > 0) {
		print(test.failures.length + " tests did not pass")
	}
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === item) return i
		}
		return -1
	}
}
if (!Array.prototype.map) {
	Array.prototype.map = function(callback) {
		var results = []
		for (var i = 0; i < this.length; i++) {
			results[i] = callback(this[i], i, this)
		}
		return results
	}
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function(callback) {
		var results = []
		for (var i = 0; i < this.length; i++) {
			if (callback(this[i], i, this)) results.push(this[i])
		}
		return results
	}
}
if (!Object.keys) {
	Object.keys = function() {
		var keys = []
		for (var i in this) keys.push(i)
		return keys
	}
}

var mock = {}
mock.window = (function() {
	var window = {}
	window.document = {}
	window.document.childNodes = []
	window.document.createElement = function(tag) {
		return {
			style: {},
			childNodes: [],
			nodeType: 1,
			nodeName: tag.toUpperCase(),
			appendChild: window.document.appendChild,
			removeChild: window.document.removeChild,
			replaceChild: window.document.replaceChild,
			insertBefore: function(node, reference) {
				node.parentNode = this
				var referenceIndex = this.childNodes.indexOf(reference)
				var index = this.childNodes.indexOf(node)
				if (index > -1) this.childNodes.splice(index, 1)
				if (referenceIndex < 0) this.childNodes.push(node)
				else this.childNodes.splice(referenceIndex, 0, node)
			},
			insertAdjacentHTML: function(position, html) {
				//todo: accept markup
				if (position == "beforebegin") {
					this.parentNode.insertBefore(window.document.createTextNode(html), this)
				}
				else if (position == "beforeend") {
					this.appendChild(window.document.createTextNode(html))
				}
			},
			setAttribute: function(name, value) {
				this[name] = value.toString()
			},
			setAttributeNS: function(namespace, name, value) {
				this.namespaceURI = namespace
				this[name] = value.toString()
			},
			getAttribute: function(name, value) {
				return this[name]
			},
			addEventListener: function () {},
			removeEventListener: function () {}
		}
	}
	window.document.createElementNS = function(namespace, tag) {
		var element = window.document.createElement(tag)
		element.namespaceURI = namespace
		return element
	}
	window.document.createTextNode = function(text) {
		return {nodeValue: text.toString()}
	}
	window.document.documentElement = window.document.createElement("html")
	window.document.replaceChild = function(newChild, oldChild) {
		var index = this.childNodes.indexOf(oldChild)
		if (index > -1) this.childNodes.splice(index, 1, newChild)
		else this.childNodes.push(newChild)
		newChild.parentNode = this
		oldChild.parentNode = null
	}
	window.document.appendChild = function(child) {
		var index = this.childNodes.indexOf(child)
		if (index > -1) this.childNodes.splice(index, 1)
		this.childNodes.push(child)
		child.parentNode = this
	}
	window.document.removeChild = function(child) {
		var index = this.childNodes.indexOf(child)
		this.childNodes.splice(index, 1)
		child.parentNode = null
	}
	//getElementsByTagName is only used by JSONP tests, it's not required by Mithril
	window.document.getElementsByTagName = function(name){
		name = name.toLowerCase();
		var out = [];

		var traverse = function(node){
			if(node.childNodes && node.childNodes.length > 0){
				node.childNodes.map(function(curr){
					if(curr.nodeName.toLowerCase() === name)
						out.push(curr);
					traverse(curr);
				});
			}
		};

		traverse(window.document);
		return out;
	}
	window.scrollTo = function() {}
	window.cancelAnimationFrame = function() {}
	window.requestAnimationFrame = function(callback) {
		window.requestAnimationFrame.$callback = callback
		return window.requestAnimationFrame.$id++
	}
	window.requestAnimationFrame.$id = 1
	window.requestAnimationFrame.$resolve = function() {
		if (window.requestAnimationFrame.$callback) {
			var callback = window.requestAnimationFrame.$callback
			window.requestAnimationFrame.$callback = null
			callback()
		}
	}
	window.XMLHttpRequest = (function() {
		var request = function() {
			this.$headers = {}
			this.setRequestHeader = function(key, value) {
				this.$headers[key] = value
			}
			this.open = function(method, url) {
				this.method = method
				this.url = url
			}
			this.send = function() {
				this.responseText = JSON.stringify(this)
				this.readyState = 4
				this.status = 200
				request.$instances.push(this)
			}
		}
		request.$instances = []
		return request
	}())
	window.location = {search: "", pathname: "", hash: ""},
	window.history = {}
	window.history.pushState = function(data, title, url) {
		window.location.pathname = window.location.search = window.location.hash = url
	},
	window.history.replaceState = function(data, title, url) {
		window.location.pathname = window.location.search = window.location.hash = url
	}
	return window
}())
var circus = (function(){

  'use strict';

  function circus(){

  }

  var type = {}.toString, ARRAY='A',OBJECT='O',LITERAL = 'SNBDR'

  // expose to mutation api for override
  function shallowCopy(n,o) {
    if (typeof n==='object') {
      if (n.length) return n.slice()
      var c={}
      Object.keys(n).forEach(function(k){
        if (o && o[k]!==undefined) c[k] = o[k]
        else c[k] = n[k]
      })
      return c
    }
    return n
  }

  function shallowMerge(v1, v2) {
    if (v1 === undefined) return shallowCopy(v2)
    return shallowCopy(v1,v2)
  }

  function shallowDiff(v1,v2, d) {
    var t = type.call(v1)[8]
    if (~LITERAL.indexOf(t) || v1 === undefined || v2 === undefined) {
      return v1!==v2
    }
    else {
        if (t === ARRAY) {
          return  v1.length !== v2.length || v1.some(function(v,i) {
            return d? shallowDiff(v,v2[i]) : v !== v2[i]
          })
        } else if (t === OBJECT) {
          var mk = Object.keys(v1), vk = Object.keys(v2)
          return mk.length != vk.length || typeof v2 !== 'object' || mk.some(function(k,i){
            return d? shallowDiff(v1[k],v2[k],d) : v1[k] !== v2[k] || mk[i] !== vk[i]
          })
        }
    }
    return false
  }

  function deepDiff(v1,v2){
    return shallowDiff(v1,v2,true)
  }

  function equal(v1,v2){
    return !shallowDiff(v1,v2)
  }

  function deepEqual(v1,v2){
    return !shallowDiff(v1,v2,true)
  }

  function pathToData(data, key){
    var i = key.indexOf('[')
    if (i > 0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return data[idxKey][idx]
    }
    return data && (data.hasOwnProperty('channels')?  data.channels[key] : data[key])
  }

  // lens
  // return a value from a nested structure
  // useful for plucking values and signals from models and signal groups respectively
  function lens(data,name,ns,def){
    if (arguments.length<4) {
      def=null
    }
    var path = ((ns? ns + '.' :'') + name).split('.')
    var v = path.reduce(pathToData,data)

    return v!==undefined? v : def
  }

  function reduce(s, fn, seed) {
    return traverse(s, fn, seed)[1]
  }

  function map(s, fn) {
    return traverse(s, fn)[0]
  }

  function tap(s, fn) {
    traverse(s, fn)
  }

  function traverse(s, fn, acc) {
    var c = s.channels, seed = arguments.length===3
    function stamp(c, fn){
      var obj = {}
      c.forEach (function(t){
        var n = t.name
        if (t.channels && t.channels !== s.channels) {
          var a = stamp(t.channels,fn, acc)
          obj[n] = a[0]
          acc = a[1]
        }
        else {
          acc = obj[n] = fn.apply(null, seed? [acc,t]:[t])
        }
      })
      return [obj,acc]
    }
    return stamp(c,fn)
  }

  var api = {
    id: function(v) {return v},
    noop:function(){},
    copy: shallowCopy,
    merge: shallowMerge,
    diff: shallowDiff,
    deepDiff: deepDiff,
    equal: equal,
    deepEqual: deepEqual,
    lens: lens,
    map: map,
    reduce: reduce,
    tap: tap,
    typeOf: function(t) {
      t = type.call(t)[8]
      return ~LITERAL.indexOf(t) && LITERAL || t
    }
  }
  api.typeOf.ARRAY = ARRAY
  api.typeOf.OBJECT = OBJECT
  api.typeOf.LITERAL = LITERAL

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});
var signal = (function(circus){

'use strict';

//todo: $ise public props

circus = circus || require('circus');

circus.TRUE =  Object.freeze({state:true})
circus.FALSE =  Object.freeze({state:false})
circus.UNDEFINED = Object.freeze({state:undefined})
var NULLSTATE = Object.freeze({dirty:circus.FALSE,value:undefined})
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

var cid=0

function Signal(seed){

  // private
  var _head, _state = NULLSTATE, _value
  var _active
  var _fifo = [], _filo = [], _inFinally=0, _step = 0
  var _seed = circus.UNDEFINED
  var _depth = 1
  var _diff = function(v,s) { return v!==s }

  // runToState - all steps on new value
  //              next step on join value
  function runToState(ctx,v,ns) {
    if (_active || _active===undefined){
      for (var j = ns, nl = _fifo.length; j < nl; j += 1) {
        var nv = _fifo[j].call(ctx, v)
        if (nv===undefined) break
        if (nv===circus.FALSE) return;
        v = nv===circus.UNDEFINED? undefined : nv
      }

      mutate(v)

      // finally(s) in filo order
      for (var j = 0, nl = _filo.length; j < nl; j += 1) {
        _filo[j].call(ctx, v)
      }
    }
  }

  function mutate(v) {
    _active=true
    var dirty = _state.value===undefined? v : !_diff(v,_state.value) && circus.FALSE || v
    _state = {dirty:dirty, value:v}

    if (_depth>1) {
      if (_value.length===_depth) _value.shift();
      _value.push(_state)
    } else {
      _value=_state
    }
  }

  // properties

  this.id = ++cid
  this.name = ''
  this.namespace = ''

  this.head = function() {
    return _head
  }

  this.prime = function(v) {
    mutate(v)
    return this
  }

  // Set or read the signal value
  //
  this.value = function(v) {
    if (_seed !== circus.UNDEFINED) {
      var sv = _seed
      _seed = circus.UNDEFINED
      for (var i=0, l=sv.length; i<l; i++) {
        mutate(sv[i])
      }
    }
    if (arguments.length) {
      _head = v
      runToState(this,v,0)
    }
    return _state.value
  }

  // Allow values to be injected into the signal at
  // arbitrary step points > 0.
  this.step = function(s) {
    var ctx = this
    if (s===undefined) s = _step+1
    return function(v){
      runToState(ctx,v,s)
    }
  }

  // An active signal will propagate values
  // An inactive signal will prevent value propagation
  this.active = function(reset) {
    if (arguments.length) {
      if (this.parent) this.parent.active(reset)
      var pa = _active
      _active = reset===undefined? undefined : !!reset
      return pa
    }
    return !!_active
  }

  // Set the diff function for this signal
  this.diff = function(diff) {
    _diff = diff
    return this
  }

  // Map the current signal state onto a new state
  // The function will be called in signal context and
  // can prevent propagation by returning undefined
  this.map = function(f) {
    _fifo.push(f)
    _step = _fifo.length
    return this
  }

  // Lift a function onto a signal tail in FILO order
  // FILO functions are executed after all FIFO functions regardless of propagation status
  this.finally = function(f) {
    _filo.unshift(f)
    return this
  }

  // signal keep:
  //  n == undefined - keep all
  //  n == 1         - keep 1
  //  n == 0         - don't keep - always pristine
  this.keep = function(n) {
    _depth = arguments.length? n : MAXDEPTH
    if (_depth > 1 && _value===undefined) _value=[]
    return this
  }

  // Return the current signal history as an array
  this.history = function(f) {
    return !_depth? undefined : (_depth>1? _value:[_value]).map(function(v){return v.value})
  }

  // By default, a dirty signal is one whose value or object reference has changed.
  // This means that join points are always dirty unless a shallow or deep diff is used.
  this.dirty = function(key) {
    return _state.dirty!==circus.FALSE
  }

  // Tap the current signal state value
  // The function will be called in signal context
  this.tap = function(f) {
    return this.map(function(v){
      f.call(this,v)
      return v
    })
  }

  // circuitry...
  //  join points - map multiple input signals onto one output signal
  //  feeds - map one input signal onto multiple output signals (fanout)

  function joinPoint(ctx, sampleOnly, joinOnly, args) {

    // flatten joining signals into channels
    // - accepts and blocks out nested signals
    var signals = [].slice.call(args), channels = [], inclusive
    var ns = (ctx.namespace? ctx.namespace + '.' : '') + ctx.name
    while (signals.length) {
      var cblock = signals.shift()
      if (cblock === circus.id) {
        inclusive = ctx
        cblock = ctx
      }
      if (!(cblock instanceof Signal)) {
        Object.keys(cblock).forEach(function(k,i){
          var s = cblock[k]
          if (!(s instanceof Signal)) {
            s = new Signal([k,ns]).join(s)
          }
          s.parent = ctx
          s.name = s.name || k
          s.namespace = ns
          channels.push(s)
        })
      }
      else {
        channels.push(cblock)
      }
    }

    var jv={}, sv, keys=[]
    var step = ctx.step(inclusive||sampleOnly? _step+1 : _step)
    function merge(i,r) {
      var active, key = keys[i] = channels[i].name || i
      return function(v) {
        active=true
        if (joinOnly || sampleOnly) {
          var nv = {}
          for (var c=0, l=channels.length; c<l; c++) {
            var s = channels[c]
            active = active && s.active()
            nv[keys[c]] = jv[keys[c]]
          }
          jv = nv
          jv[key] = v
        }
        else {
          jv = v
        }

        if (active || inclusive===channels[i]) {
          step(sampleOnly? sv : jv)
        }

        return r
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals into join point
      var s = channels[i], r = s===inclusive? circus.FALSE : undefined
      s[r? 'map':'finally'](merge(i,r))
    }

    ctx.channels = channels

    return sampleOnly? ctx.map(function(){}).finally(function(v){sv=v}) : ctx
  }

  // Join 2 or more input signals into 1 output signal
  // Input signal values will be preserved as output channels
  // Duplicate channels will be merged
  // The output signal will be active when all of the input signals are active
  this.join = function(){
    return joinPoint(this,false,true,arguments)
  }

  // Merge 2 or more input signal values into 1 output signal
  // The output signal value will be the latest input signal value
  // The output signal will be active when any of the input signals are active
  this.merge = function(fn){
    return joinPoint(this,false,false,arguments)
  }

  // Sample input signal(s)
  // The output signal will be active when all of the input signals are active
  this.sample = function() {
    return joinPoint(this,true,false,arguments)
  }

  // Feed signal values into fanout signal(s)
  // The input signal is terminated
  this.feed = function() {
    var feeds = [].slice.call(arguments)
    return this.map(function(v){
      feeds.forEach(function(s){
        s.value(v)
      })
    })
  }

  // seed signal with any combination of:
  //  name - string
  //  state - array
  //  signal - fanout
  if (seed!==undefined && seed[0] !== undefined) {
    var ctx = this, ni=0, feeds=[];
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        if (!ni++) {
          ctx.name = arg
        }
        else ctx.namespace = arg
      }
      else if (arg instanceof Signal) {
        feeds.push(arg)
      }
      else _seed = arg
    })
    if (feeds.length) {
      this.feed.apply(this,feeds)
    }
  }

}

Signal.prototype.extend = function(fn) {
  var ctx=this, ext = typeof fn==='function'? fn(this) : fn
  Object.keys(ext).forEach(function(k){
    ctx[k] = ext[k]
  })
  return this
}

circus.signal = function(seed){return new Signal(arguments)}

circus.signal.extendBy = function(ext) {
  Object.keys(ext).forEach(function(k){
    Signal.prototype[k] = ext[k]
  })
}

circus.isSignal = function(s) {
  return s instanceof Signal
}

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});


var circusLogic = (function(circus){

  'use strict';

  circus = circus || require('circus')

  circus.signal.extendBy({
    // Apply a matcher function with optional mask to signal or block channel values.
    // By default, the signal is blocked if any channels are blocked
    // Output is taken from masked channels [default all]
    //
    // arguments:
    //  mask = object of channel matching key/values - supports wildcards
    //    key = 'n'  - match on channel 'n'
    //          '*n' - match on all remaining channels ending with 'n'
    //          'n*' - match on all remaining channels starting with 'n'
    //          '*'  - match on all remaining channels
    //
    //    value = true  - match if truthy
    //            value - match if equal (===)
    //            false - match if falsey
    //            undefined - match any
    //
    //    default: undefined
    //
    //  fn = function that takes a channel value and a mask value and returns either of:
    //    truthy value - signal the value
    //    falsey value - block the value
    //
    //    default: return !mask? c!==undefined : c===m || c && m===true || !c && m===false
    //
    //  all = the signal is blocked if all channels are blocked
    //  not = take all channels not in mask
    //
    // match is the core logic function upon which all other (dedicated) logic functions
    // are based. Use this function as the basis for custom logic steps. Review Dedicated
    // logic steps for details.
    //
    match: function(args, fn, all, not){
      if (typeof args === 'function') {
        all = fn
        fn = args
        args = false
      }
      if (!args || !args.hasOwnProperty('length')) {
        args = [args]
      }
      var wcMask, mask = args[0], vMatch={}, iMatch={}, dateKey = new Date().getTime()
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=vMatch
          return m
        },{})
      }

      function memo(keys,v,m,wv,inv) {
        keys.forEach(function(k){
          if (wcMask[k] === undefined){
            if (k==='*') {
              memo(Object.keys(v), v, m, m[k])
            }
            else if (k[0]==='*') {
              var wk = k.substr(1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), v, m, m[k])
            }
            else if (k[k.length-1]==='*') {
              var wk = k.substr(0,k.length-1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)===0}), v, m, m[k])
            }
            else wcMask[k] = wv === undefined? m===v? vMatch : m[k] : wv
          }
        })
        if (inv && typeof v === 'object') {
          Object.keys(v).forEach(function(k){
            if (!wcMask.hasOwnProperty(k)) {
              wcMask[k] = iMatch
            }
          })
        }
        return keys.length
      }

      fn = fn || function(v,m) {
        return !mask? v!==undefined : v===m || v && m===true || !v && m===false
      }

      function match(v) {
        var m = mask || v
        if (!wcMask) {
          wcMask = {}
          if (circus.typeOf(m)!==circus.typeOf.OBJECT || !memo(Object.keys(m),v, m,undefined,not)) {
            wcMask[dateKey] = v
          }
        }

        var passThru = all, obj = {}
        Object.keys(wcMask).forEach(function(k){
          var mk = v && v.hasOwnProperty(k)? k:undefined
          var vv = mk? v[k] : v
          var take = wcMask[k]===undefined
          var im = not && wcMask[k]===iMatch
          var mv = (wcMask[k]===vMatch || im)? vv : wcMask[k]
          var e = take || fn(vv,mv,mk)
          if (e && !not || im) {
            obj[k] = (e===true || im)? vv : e === circus.UNDEFINED? undefined : e
          }
          passThru = all? passThru && (e || im) : passThru || e
        })
        return passThru? obj.hasOwnProperty(dateKey)? obj[dateKey] : Object.keys(obj).length? obj : circus.UNDEFINED : undefined
      }
      return this.map(match)
    },

    // default: signal all or block
    and: function(){
      function and(v,m) {
        return v && m === v || v && m===true || !v && m===false
      }
      return this.match(arguments, and, true)
    },

    // default: dropped value - mask on state
    or: function(){
      var ctx = this, store = !arguments.length
      function or(v, m, k) {
        if (store) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v || m
      }
      return this.match(arguments, or)
    },

    // default: detect change - mask on state
    xor: function(){
      var ctx = this, store = !arguments.length
      function xor(v,m,k) {
        if (store) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v && m!==v || !v && m
      }
      return this.match(arguments, xor)
    },

    // default: exclude truthy values
    not: function(){
      function not(v,m) {
        return m && v !== m || !v
      }
      return this.match(arguments, not,true,true)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusComposables;
else if (typeof define == "function" && define.amd) define(function() {return circusComposables});


var circusComposables = (function(circus){

  'use strict';

  circus = circus || require('circus')

  circus.signal.extendBy({
    // A steady state signal
    always: function(v){
      return this.map(function(){
        return v
      })
    },

    // Batch values into chunks of size w
    batch: function(w) {
      var b = [], batch = function(v){
        b.push(v)
        if (b.length === w) {
          v = b, b = []
          return v
        }
      }
      return this.map(batch)
    },

    // Remove undefined values from the signal
    compact: function(){
      return this.map(function(v){
        return v || circus.FALSE
      })
    },

    flatten: function(f) {
      var s = this.step()
      function flatten(v) {
        if (circus.typeOf(v) === circus.typeOf.ARRAY) {
          v.forEach(flatten)
        }
        else {
          s(f? f(v) : v)
        }
        return circus.FALSE
      }
      return this.map(flatten)
    },

    maybe: function(f,n) {
      return this.map(function(v){
        return f(v)? {just:v} : {nothing:n || true}
      })
    },

    // streamlined map
    pluck: function() {
      var args = [].slice.call(arguments), a0 = args[0]
      return this.map(function(v) {
        return args.length===1 && (v[a0] || circus.lens(v,a0)) || args.reduce(function(r,key){
          r[key] = circus.lens(v,key)
          return r
        },{})
      })
    },

    // named (projected) pluck
    project: function() {
      var args = [].slice.call(arguments)
      return this.map(function(v) {
        var r = {}
        return args.reduce(function(r,arg){
          Object.keys(arg).forEach(function(key){
            r[key] = circus.lens(v,arg[key])
          })
          return r
        },{})
      })
    },

    // continuously reduce incoming signal values into
    // an accumulated outgoing value
    reduce: function(f,accum) {
      return this.map(function(v){
        if (!accum) {
          accum = v
        }
        else {
          var args = [accum].concat([].slice.call(arguments))
          accum = f.apply(null,args)
        }
        return accum
      })
    },

    // Skip the first n values from the signal
    // The signal will not propagate until n + 1
    skip: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? circus.FALSE : v
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? v: circus.FALSE
      })
    },

    // Batch values into sliding window of size w
    window: function(w) {
      var b = [], fn = function(v){
        b.push(v)
        if (--w < 0) {
          b.shift()
          return b
        }
      }
      return this.map(fn)
    },

    // Zip signal channel values into a true array.
    zip: function(keys) {
      keys = keys || [0,1]
      var kl = keys.length, i=-1
      var fn = function(v) {
        return ++i % kl === 0 ? keys.map(function(k){
          return v[k]
        }) : circus.FALSE
      }
      return this.map(fn)
    },

    // filters

    filter: function(f) {
      return this.map(function (v) {
        return f(v)? v: circus.FALSE
      })
    },

    // Apply a matcher function with optional mask to signal or block channel values.
    // By default, the signal is blocked if any channels are blocked
    // Output is taken from masked channels [default all]
    //
    // arguments:
    //  mask = object of channel matching key/values - supports wildcards
    //    key = 'n'  - match on channel 'n'
    //          '*n' - match on all remaining channels ending with 'n'
    //          'n*' - match on all remaining channels starting with 'n'
    //          '*'  - match on all remaining channels
    //
    //    value = true  - match if truthy
    //            value - match if equal (===)
    //            false - match if falsey
    //            undefined - match any
    //
    //    default: undefined
    //
    //  fn = function that takes a channel value and a mask value and returns either of:
    //    truthy value - signal the value
    //    falsey value - block the value
    //
    //    default: return !mask? c!==undefined : c===m || c && m===true || !c && m===false
    //
    //  all = the signal is blocked if all channels are blocked
    //  not = take all channels not in mask
    //
    match: function(args, fn, all, not){
      if (typeof args === 'function') {
        all = fn
        fn = args
        args = false
      }
      if (!args || !args.hasOwnProperty('length')) {
        args = [args]
      }
      var wcMask, mask = args[0], vMatch={}, iMatch={}, dateKey = new Date().getTime()
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=vMatch
          return m
        },{})
      }

      function memo(keys,v,m,wv,inv) {
        keys.forEach(function(k){
          if (wcMask[k] === undefined){
            if (k==='*') {
              memo(Object.keys(v), v, m, m[k])
            }
            else if (k[0]==='*') {
              var wk = k.substr(1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), v, m, m[k])
            }
            else if (k[k.length-1]==='*') {
              var wk = k.substr(0,k.length-1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)===0}), v, m, m[k])
            }
            else wcMask[k] = wv === undefined? m===v? vMatch : m[k] : wv
          }
        })
        if (inv && typeof v === 'object') {
          Object.keys(v).forEach(function(k){
            if (!wcMask.hasOwnProperty(k)) {
              wcMask[k] = iMatch
            }
          })
        }
        return keys.length
      }

      fn = fn || function(v,m) {
        return !mask? v!==undefined : v===m || v && m===true || !v && m===false
      }

      function match(v) {
        var m = mask || v
        if (!wcMask) {
          wcMask = {}
          if (circus.typeOf(m)!==circus.typeOf.OBJECT || !memo(Object.keys(m),v, m,undefined,not)) {
            wcMask[dateKey] = v
          }
        }

        var passThru = all, obj = {}
        Object.keys(wcMask).forEach(function(k){
          var mk = v && v.hasOwnProperty(k)? k:undefined
          var vv = mk? v[k] : v
          var take = wcMask[k]===undefined
          var im = not && wcMask[k]===iMatch
          var mv = (wcMask[k]===vMatch || im)? vv : wcMask[k]
          var e = take || fn(vv,mv,mk)
          if (e && !not || im) {
            obj[k] = (e===true || im)? vv : e === circus.UNDEFINED? undefined : e
          }
          passThru = all? passThru && (e || im) : passThru || e
        })
        return passThru? obj.hasOwnProperty(dateKey)? obj[dateKey] : Object.keys(obj).length? obj : circus.UNDEFINED : undefined
      }
      return this.map(match)
    },

    // default: signal all or block
    and: function(){
      function and(v,m) {
        return v && m === v || v && m===true || !v && m===false
      }
      return this.match(arguments, and, true)
    },

    // default: dropped value - mask on state
    or: function(){
      var ctx = this, store = !arguments.length
      function or(v, m, k) {
        if (store) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v || m
      }
      return this.match(arguments, or)
    },

    // default: detect change - mask on state
    xor: function(){
      var ctx = this, store = !arguments.length
      function xor(v,m,k) {
        if (store) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v && m!==v || !v && m
      }
      return this.match(arguments, xor)
    },

    // default: exclude truthy values
    not: function(){
      function not(v,m) {
        return m && v !== m || !v
      }
      return this.match(arguments, not,true,true)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusComposables;
else if (typeof define == "function" && define.amd) define(function() {return circusComposables});


var circusMVI = (function(circus){

  /*
  *  Circus MVI is implemented through the independent signals m, v and i
  *  that each feed one into the next in a circular m -> v -> i direction.
  */

  'use strict';

  circus = circus || require('circus')

  var typeOf = circus.typeOf

  function pathToState(data, key){
    var i, d0=data[0],d1=data[1]
    if (d0 === undefined || d1 === undefined) {
      return [true,undefined]
    }
    if ((i = key.indexOf('['))>0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return [d0[idxKey][idx], d1[idxKey][idx]]
    }
    return [d0[key],d1[key]]
  }

  function mutated(state, value, path) {
    if (path[0]!=='.') path = '.' + path
    path = ('root'+path).split('.')
    var pathData = path.reduce(pathToState,[{root:state},{root:value}])
    var typeOfD = typeOf(pathData[0]), typeofV = typeOf(pathData[1])
    if ( typeOfD === typeofV && (typeOfD === typeOf.OBJECT || typeOfD === typeOf.ARRAY)) {
      return JSON.stringify(pathData[0]) !== JSON.stringify(pathData[1])
    }
    return pathData[0]!==pathData[1]
  }


  function MVI() {
    var mvi = this, error = circus.signal()

    mvi.signal = function(){
      return circus.signal.apply(null,arguments).extend({
        error: pushError()
      })
    }

    /*
    Fold the app into a new circus act that feeds directed MVI signals
      Model and intent are simple notifications that fire whenever
      their value changes, but view feeds into intent through explicit
      bindings in the render function. Put simply: views only feed
      through user intentions
    */
    var model = mvi.model = new Model(),
        view = mvi.view = new View(),
        intent = mvi.intent = new Intent()

    function reset(graph){
      circus.tap(graph,function(s){s.error(circus.UNDEFINED)})
    }

    function pushError() {
      var msg = ''
      return function(fn) {
        function push(v) {
          msg = v===circus.UNDEFINED? '' : msg || fn(v) || ''
        }
        if (arguments.length){
          if (typeof fn === 'function') {
            this.tap(function(v){push(v)})
          }
          else {
            msg = fn
          }
          return this
        }
        return msg
      }
    }

    function pushValues(s) {
      // block model feeds during traverse
      var ma = model.active(false), err = ''
      circus.tap(s,visit)
      model.active(ma)
      error.value(err)

      function visit(s) {
        s.value(s.head())
        err =  err || s.error() || ''
      }
    }

    return mvi

    function Model(seed) {

      var state = seed || {}

      return mvi.signal('data').extend(function(ctx){
        return {
          dirty: function(path) {
            return path===undefined? ctx.dirty() : mutated(state, ctx.value(), path)
          }
        }
      })
      .prime(state)
      .join({error:error}, circus.id)
      .map(function(v){
        state = v
        // on error, stop propagation at this state
        // bypassing all user modelling. Go straight to view
        return v.error? undefined : v
      })
      .finally(function(v){
        view.value(v)
      })

    }

    function View(seed){

      return mvi.signal(seed).extend({
        click: function(signal,value) {
          return signal.pulse().value.bind(signal,value||true)
        }
      })

    }

    function Intent(seed){

      return mvi.signal(seed).extend({
        cta: function(s) {
          s = s || intent
          if (!circus.isSignal(s)) {
            s = circus.signal()
            s.join.apply(s,arguments)
          }

          return circus.signal().tap(function(v){
            if (v) {
              pushValues(s)
              this.active(undefined)
            }
          })
        }
      })
      .tap(function(){
        reset(this)
      })
      .finally(function(v) {
        model.value(v)
      })

    }
  }

  return circus.mvi = function() {return new MVI()}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusMVI;
else if (typeof define == "function" && define.amd) define(function() {return circusMVI});


runTests('circus', function(mock) {

    var graph = circus.signal().join({
        i1:circus.signal(),
        i2:circus.signal(),
        i3: {
            i4:circus.signal(),
            i5:circus.signal([5])
        }
	});

    test('map', function(){
        function id(s){return s.name}
        return circus.deepEqual(circus.map(graph, id),{
                                                    i1:'i1',
                                                    i2: 'i2',
                                                    i3: {
                                                        i4: 'i4',
                                                        i5: 'i5'
                                                    }
                                                })
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return circus.reduce(graph, error) === true
    })

    test('typeof - Array', function(){
        return circus.typeOf([]) === circus.typeOf.ARRAY
    })

    test('typeof - Object', function(){
        return circus.typeOf({}) === circus.typeOf.OBJECT
    })

    test('typeof - Date', function(){
        return circus.typeOf(new Date()) === circus.typeOf.LITERAL
    })

    test('typeof - String', function(){
        return circus.typeOf('') === circus.typeOf.LITERAL
    })

    test('typeof - Number', function(){
        return circus.typeOf(1) === circus.typeOf.LITERAL
    })

    test('typeof - Boolean', function(){
        return circus.typeOf(true) === circus.typeOf.LITERAL
    })

    test('typeof - Regex', function(){
        return circus.typeOf(/a/) === circus.typeOf.LITERAL
    })

})

runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('named signal',function() {
		return circus.signal('sig1').name === 'sig1'
	})

	test('named && namespaced signal',function() {
		var s = circus.signal('sig1', 'ns1')
		return s.name==='sig1' && s.namespace === 'ns1'
	})

	test('namespaced signal',function() {
		var s = circus.signal('', 'ns1')
		return s.name==='' && s.namespace === 'ns1'
	})

	test('unnamed signal', function() {
		return circus.signal().name === ''
	})

	test('seed - primitive', function() {
		var s = circus.signal([123])
		return s.value() === 123
	})

	test('seed - array',function() {
		var s = circus.signal([[123]])
		return s.value()[0] === 123
	})

	test('seed - object',function() {
		var a = {x:123}
		var s = circus.signal([a])
		return s.value().x === 123
	})

	test('seed - undefined',function() {
		var s = circus.signal()
		return s.value()===undefined
	})

	test('seed - hot',function() {
		var s = circus.signal([1,2,3])
		return s.value()===3
	})

	test('seed - cold',function() {
		var s = circus.signal([1,2,3]).keep()
		s.value(4)
		var c1 = circus.signal(s.history()).value()
		s.value(5)
		var c2 = circus.signal(s.history()).value()
		return c1===4 && c2===5
	})

	test('value ',function() {
		return circus.signal().value(2) === 2
	})

	test('value - undefined',function() {
		return circus.signal().value(undefined) === undefined
	})

	test('dirty - initial', function() {
		var s = circus.signal()
		return !s.dirty()
	})

	test('dirty - primitive', function() {
		var s = circus.signal().map(function(v){return v})
		s.value(123)
		return s.dirty()
	})

	test('not dirty - same primitive', function() {
		var a = 123
		var s = circus.signal().map(function(v){return v})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return [].concat(v)})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){
			v[0]++
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().diff(circus.diff).map(function(v){
			return [++v[0]]
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().diff(circus.diff).map(function(v){
			return [v[0]]
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new object',function() {
		var a = {x:0}
		var s = circus.signal().map(function(v){return {}})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same object',function() {
		var a = {x:0}
		var s = circus.signal().map(function(v){
			v.x++
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {x:0}
		var s = circus.signal().diff(circus.diff).map(function(v){
			return {x:v.x++}
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated object',function() {
		var a = {x:0}
		var s = circus.signal().diff(circus.diff).map(function(v){
			return {x:v.x}
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('custom diff',function() {
		var diff = function() {return true}
		var a = {x:123}
		var s = circus.signal().diff(diff).map(function(v){
			return v
		})

		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('set value ',function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('tap',function() {
		var e = 'xyz'
		var s = circus.signal().tap(function(v){
			e=v
		})
		s.value(123)
		return e === 123
	})

	test('tap / tap', function() {
		var e = 0,e1,e2
		var t1 = function(v) {
			e1=v
		}
		var t2 = function(v) {
			e2=v
		}
		var s = circus.signal().map(inc).tap(t1).map(inc).tap(t2)
		s.value(e)
		return e1 === 1 && e2 === 2
	})

	test('map',function() {
		var e = 'xyz'
		var s = circus.signal()
		.map(function(v){
			return v * 2
		}).tap(function(v){
			e = v
		})
		s.value(123)
		return e === 246
	})

	test('map - undefined stops propagation',function() {
		return circus.signal().map(function(v){return undefined}).map(inc).value(1) === 1
	})

	test('map - circus.UNDEFINED continues propagation',function() {
		var r = 1
		return circus.signal().map(function(v){return circus.UNDEFINED}).map(function(v){}).value(1) === undefined
	})

	test('map - circus.FALSE aborts propagation',function() {
		return circus.signal().map(function(v){return circus.FALSE}).map(inc).value(1) === undefined
	})

	test('active - initial state', function() {
		var s = circus.signal()
		return s.active() === false
	})


	test('active - state', function() {
		var s = circus.signal()
		s.value(1)
		return s.active() === true
	})

	test('active - last state', function() {
		var s = circus.signal()
		var r1 = s.active(true)
		var r2 = s.active(false)
		return r1===undefined && r2===true
	})

	test('active - off', function() {
		var s = circus.signal()
		s.value(1)
		s.active(false)
		s.value(2)
		return s.value() === 1
	})

	test('keep - depth', function() {
		var s = circus.signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.toString() === '2,3'
	})

	test('keep - stateless', function() {
		var s = circus.signal().keep(0)
		s.value(1)
		s.value(1)
		return s.value()===1 && !s.dirty() && !s.history()
	})

	test('keep - clean', function() {
		var s = circus.signal().keep(1)
		s.value(1)
		s.value(1)
		return !s.dirty()
	})

	test('keep - history', function() {
		var s = circus.signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.length === 2 && v[0]===2
	})

	test('history - drop', function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 3 && s.history().length === 1
	})

	test('history - keep', function() {
		var s = circus.signal().keep()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 1 && s.history().length === 3
	})

	test('head', function() {
		var r, s = circus.signal().map(inc).tap(function(v){r=v})
		s.value(1)
		return r === 2 && s.head() === 1
	})

	test('prime', function() {
		s = circus.signal().map(inc)
		s.value(1)
		s.prime(1)
		return s.head() === 1 && s.value() === 1
	})

	test('finally', function() {
		var r,s = circus.signal().finally(function(){r=true})
		s.value(1)
		return r
	})

	test('finally - filo', function() {
		var r = [], s = circus.signal()
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1).map(inc)
		s2.value(2)
		return s1.value() === 2 & s2.value() === 2
	})

	test('feed - fanout', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal().feed(s1,s2)
		s3.value(3)
		return s1.value() === 3 && s2.value() === 3
	})

	test('signal of signals - inverted feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal(s1,s2)
		s.value(1)
		return s1.value() === 1 && s2.value() === 1
	})

	test('named signal of signals', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal('s',s1,s2)
		s.value(1)
		return s.name === 's' && s1.value() === 1 && s2.value() === 1
	})

	test('join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - inclusive', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(circus.id,s2)
		s2.value(2)
		s1.value(1) // s1 value must be channelled
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - compose', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var r,j = circus.signal().join(s1,s2).tap(function(v){r=v})
		s1.value(1)
		s2.value(2)
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - compose inclusive', function() {
		var s1 = circus.signal()
		var r, s2 = circus.signal().join(s1,circus.id).tap(function(v){r=v})
		s1.value(1)
		s2.value(2)
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s2.active(false)
		var j = circus.signal().join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r === undefined
	})

	test('join (shallow diff) - always dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join(s1,s2)
		s1.value(1)
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return j.dirty()
	})

	test('join - dirty', function() {
		function diff(v1,v2) {
			return v1[0]!==v2[0] || v1[1]!==v2[1]
		}
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().diff(diff).join(s1,s2)
		s1.value(1)
		s2.value(2)
		s1.value(1)
		s2.value(3)
		return j.dirty()
	})

	test('join - clean', function() {
		function diff(v1,v2) {
			return v1[0]!==v2[0] || v1[1]!==v2[1]
		}
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().diff(diff).join(s1,s2)
		s1.value(1)
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return !j.dirty()
	})

	test('join (inclusive) - clean', function() {
		function diff(v1,v2) {
			return v1[0]!==v2[0] || v1[1]!==v2[1]
		}
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.diff(diff).join(circus.id,s2)
		s1.value(1)
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return !j.dirty()
	})

	test('join - named key', function() {
		var s1 = circus.signal('k1')
		var s2 = circus.signal('k2')
		var j = circus.signal().join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - channel block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join({
			k1:s1,
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - channel block inclusive', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal('j').join({
			k1:s1,
			k2:s2
		},circus.id)
		j.value(3)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return assert(circus.deepEqual(r,{j:3,k1:1,k2:2}),true)
	})

	test('join - merge channel blocks', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join({
			k1:s1
		},
		{
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - aggregate signal block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join({
			k1:s1,
			k2:circus.signal().join({
				k3:s2
			})
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - object into aggregate signal block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join({
			k1:s1,
			k2:{
				k3:s2
			}
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - auto name spacing', function() {
		var j = {
			a: {
				b: {
					c: circus.signal()
				}
			}
		}
		var s = circus.signal().join(j)
		return j.a.b.c.namespace === 'a.b'
	})

	test('merge', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = circus.signal().merge(s1,s2)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === 1 && r2 === 2
	})

	test('merge - not all active',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s2.active(false)
		var m = circus.signal().merge(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = m.value()
		return r === 1
	})

	test('sample - all (default)', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3).map(inc)
		s1.value(1)
		var r1 = s.value() // blocked
		s2.value(2)
		var r2 = s.value() // blocked
		s3.value(3)
		var r3 = s.value()
		return r1 === 1 && r2 === 1 && r3 === 2
	})


	test('sample - any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(circus.signal().merge(s2,s3)).map(inc)
		s1.value(1)
		var r1 = s.value()
		s2.value(2)
		var r2 = s.value()
		s3.value(3)
		var r3 = s.value()
		return r1 === 1 && r2 === 2 && r3 === 3
	})
})

runTests('logic', function(mock) {

    test('match - take active', function() {
        var r, v = {c1:1,c2:0,c3:undefined}
        circus.signal().match().tap(function(v){r=v}).value(v)
        return circus.equal(r, {c1:1,c2:0})
    })

    test('match - block all inactive', function() {
        var r, v = {c1:undefined,c2:undefined}
        circus.signal().match().tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - mask', function() {
        var r, v = {c1:undefined,c2:2,c3:3}
        circus.signal().match({c1:false,c2:true}).tap(function(v){r=v}).value(v)
        return circus.equal(r, {c1:undefined,c2:2})
    })

    test('match - fn', function() {
        var v = {c1:1,c2:0,c3:3}
        var v1 = circus.signal().match(function(v){return v===0}).value(v)
        return circus.equal(v1, {c2:0})
    })

    test('match - fn + mask', function() {
        var v = {c1:1,c2:0,c3:3}
        var v1 = circus.signal().match({c1:0},function(v,m){return v===m+1}).value(v)
        return circus.equal(v1, {c1:1})
    })

    test('match - wildcard', function() {
        var v = {c1:1,c2:2,c3:3}
        var v1 = circus.signal().match({'*':true}).value(v)
        return circus.equal(v1, v)
    })

    test('match - leading wildcard', function() {
        var v = {c1:1,c2:2,c3:3}
        var v1 = circus.signal().match({'*1':true}).value(v)
        return circus.equal(v1, {c1:1})
    })

    test('match - trailing wildcard', function() {
        var v = {ca1:1,cb2:2,cc3:3}
        var v1 = circus.signal().match({'ca*':true}).value(v)
        return circus.equal(v1, {ca1:1})
    })

    test('match - mixed wildcard', function() {
        var v = {ca1:1,cb2:2,cc3:3}
        var v1 = circus.signal().match({'*1':false,'*':true}).value(v)
        return circus.equal(v1, {cb2:2,cc3:3})
    })

    test('match - progressive join', function() {
        var s1 = circus.signal('c1')
        var s2 = circus.signal('c2').join(s1,circus.id).and()
        s1.value(1)
        var v1 = circus.equal(s2.value(), undefined)
        s2.value(2)
        var v2 = circus.equal(s2.value(), {c1:1,c2:2})

        return v1 && v2
    })

    test('match - progressive wildcard join', function() {
        var s1 = circus.signal('c1')
        var s2 = circus.signal('c2').join(s1,circus.id).and({'*':true})
        s1.value(1)
        var v1 = circus.equal(s2.value(), undefined)
        s2.value(2)
        var v2 = circus.equal(s2.value(), {c1:1,c2:2})

        return v1 && v2
    })

    test('and - take all truthy', function() {
        var r, s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and().tap(function(v){r=v}).value(2)
        s1.value(1)
        return circus.equal(r, {s1:1,s2:2})
    })

    test('and - block on any falsey', function() {
        var r,s1 = circus.signal('s1')
        s1.value(1)
        circus.signal('s2').join(s1,circus.id).and().tap(function(v){r=v}).value(0)
        return circus.equal(r, undefined)
    })

    test('and - list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        circus.signal().and('ca1','cc3').tap(function(v){r=v}).value(v)
        return circus.equal(r, {ca1:1,cc3:3})
    })

    test('and - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(1)
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('and - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(0)
        s1.value(1)
        return circus.equal(r, {s2:0})
    })

    test('and - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(0)
        s1.value(1)
        return circus.equal(r, undefined)
    })

    test('and - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(1)
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('and - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(1)
        s1.value(1)
        return circus.equal(r, undefined)
    })

    test('and - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = circus.signal('s1')
        circus.signal('s2').join(s1,circus.id).and(mask).tap(function(v){r=v}).value(1)
        s1.value(1)
        return circus.equal(r, {s1:1,s2:1})
    })

    test('or - signal values', function() {
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2').join(s1,circus.id).or()
        s1.value(1)
        s2.value(1)
        return circus.equal(s2.value(), {s1:1,s2:1})
    })

    test('or - block on no values', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2').join(s1,circus.id).or().tap(function(v){r=v})
        s1.value(0)
        s2.value(0)
        return r === undefined
    })

    test('or - restore and signal dropped value', function() {
        var r,s1 = circus.signal('s1').or()
        s1.value(1)
        r = s1.value(0)
        return circus.equal(r, 1)
    })

    test('or - signal active (same as match()', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2').join(s1,circus.id).or().tap(function(v){r=v})
        s2.value(0)
        s1.value(1)
        return assert(r,{s1:1},circus.equal)
    })

    test('or - default to mask value', function() {
        var mask = {
            s1:2,
            '*':true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2').join(s1,circus.id).or(mask)
        s1.value(0)
        s2.value(2)
        return circus.equal(s2.value(), {s1:2,s2:2})
    })

    test('xor - signal change', function() {
        var r=0
        var s1 = circus.signal().xor().tap(function(v){r++})
        s1.value(1)
        s1.value(1)
        s1.value(2)
        return r===2
    })

    test('xor - take value', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal().xor(mask).tap(function(v){r=v})
        s1.value({s1:1})
        return circus.equal(r, {s1:1})
    })

    test('xor - take mask', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal('s1').xor(mask).tap(function(v){r=v})
        s1.value(0)
        return circus.equal(r, {s1:3})
    })

    test('xor - block on equal', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal().xor(mask).tap(function(v){r=v})
        s1.value({s1:3})
        return circus.equal(r, undefined)
    })

    test('not - signal on all falsey, take nothing (mask==all channels)', function() {
        var r=false
        var s = circus.signal().not().tap(function(v){r=true})
        s.value({s1:0,s2:0})
        return r === true && s.value() === undefined
    })

    test('not - block on any truthy', function() {
        var r=false
        var s = circus.signal().not().tap(function(v){r=true})
        s.value({s1:1,s2:0})
        return r === false
    })

    test('not - signal on falsey keys, take all but mask', function() {
        var r=false
        var s = circus.signal().not('s2').tap(function(v){r=true})
        s.value({s1:1,s2:0,s3:0})
        return r === true && circus.equal(s.value(), {s1:1, s3:0})
    })

    test('not - block on truthy keys', function() {
        var r=false
        var s = circus.signal().not('s2').tap(function(v){r=true})
        s.value({s1:1,s2:1,s3:0})
        return r === false
    })

})

runTests('composables', function(mock) {

    function inc(v) {return v+1}

    test('always',function() {
        var s = circus.signal()
        var r = s.always(123)
        s.value('xyz')
        return r.value() === 123
    })


    test('batch', function() {
        var s = circus.signal().batch(2).tap(function(v){
            r.push(v)
        })
        var r=[]
        for (var i=0; i<4; i++) s.value(i)
        return r.length === 2 &&
                r[0].toString() === '0,1' &&
                r[1].toString() === '2,3'
    })

    test('compact', function() {
        var s = circus.signal().keep().compact()
        s.value(1)
        s.value(undefined)
        s.value('')
        s.value(0)
        s.value(3)
        return s.history().toString() === '1,3'
    })

    test('filter', function(){
        var s = circus.signal().keep().filter(function(v){
            return v % 2
        })
        for (var i=0; i<4; i++) s.value(i)
        return s.history().toString() === '1,3'
    })

    test('flatten', function(){
        var s = circus.signal().keep().flatten()
        s.value([1,2])
        s.value([3,[4,5]])
        s.value(6)
        return s.history().toString() === '1,2,3,4,5,6'
    })

    test('flatten - flatmap', function(){
        var s = circus.signal().keep().flatten(function(v){
            return v+1
        })
        s.value([1,2])
        s.value(3)
        return s.history().toString() === '2,3,4'
    })

    test('maybe', function(){
        var value = circus.signal().maybe(function(v){
            return true
        },'nothing').value(123)
        return value.just === 123
    })

    test('maybe - nothing', function(){
        var value = circus.signal().maybe(function(v){
            return false
        },'nothing').value(123);
        return value.nothing === 'nothing'
    })

    test('pluck', function() {
        var s = circus.signal().pluck('a','b')
        s.value({a:1,b:2,c:3})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===2
    })

    test('pluck - deep', function() {
        var s = circus.signal().pluck('a.a1','b.b1[1]')
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a.a1,b.b1[1]' &&
                s.value()['a.a1']===1 &&
                s.value()['b.b1[1]']===3
    })

    test('project', function() {
        var s = circus.signal().project({a:'a.a1',b:'b.b1[1]'})
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===3
    })

    test('reduce', function() {
        var e = 'xyz'
        var s = circus.signal()
        .reduce(function(a,v){
            return a+v
        }).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(1)
        s.value(1)
        return e === 3
    })

    test('reduce - accum', function() {
        var e = 'xyz'
        var s = circus.signal()
        .reduce(function(a,v){
            return a+v
        },1).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(1)
        s.value(1)
        return e === 4
    })

    test('skip, take - keep', function() {
        var s = circus.signal().keep(2).skip(2).take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.history().toString() === '2,3'
    })

    test('take',function() {
        var s = circus.signal().take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.value() === 1
    })

    test('window', function() {
        var s = circus.signal().window(2)
        for (var i=0; i<4; i++) s.value(i)
        return s.value().toString() === '2,3'
    })

    test('zip - arrays', function() {
        var s1 = circus.signal()
        var s2 = circus.signal()
        circus.signal().join(s1,s2).zip().tap(function(v){r.push(v)})
        var a = [1,2,3],b = [4,5,6], r = []
        a.map(function(x,i){
            s1.value(x)
            s2.value(b[i])
        })
        return r.length === 3 && circus.deepEqual(r, [[1,4],[2,5],[3,6]])
    })

})

runTests('mvi', function(mock) {

    var app,state,model,view,intent,intentions,nested,errors

    function log(v) {
        errors = !!v.error
    }

    setup(function(){
        state = false
        app = circus.mvi()
        model = app.model.tap(function(v){state=v})
        view = app.view.tap(log)
        intent = app.intent
        nested = {
            i4:app.signal(),
            i5:app.signal([5])
        }
        intentions = {
            i1:app.signal(),
            i2:app.signal(),
            i3:nested
        }
        intent.join(intentions)
    })

    test('error - set / get', function(){
        intentions.i1.error(function(v){return v==1}).value(1)
        return intentions.i1.error() === true
    })

    test('error - message', function(){
        intentions.i1.error(function(v){return v==1 && 'msg'}).value(1)
        return intentions.i1.error() === 'msg'
    })

    test('error - not set', function(){
        intentions.i1.error(function(v){return v==2 && 'msg'}).value(1)
        return intentions.i1.error() === ''
    })

    test('error - first', function(){
        var i=0, msg=function(v){return ++i}
        intentions.i1.error(msg).error(msg).value(1)
        return intentions.i1.error() === 1
    })

    test('error - next', function(){
        var i=0, msg = function() {return ++i===2 && 2}
        intentions.i1.error(msg).error(msg).value(1)
        return intentions.i1.error() === 2
    })

    test('cta - validate all', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return false})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return state !== false && !errors
    })

    test('cta - validate some', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return true})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return state === false && errors
    })

    test('cta - validate all - errors to view', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return 'msg'})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return model.value().error === 'msg'
    })


})
