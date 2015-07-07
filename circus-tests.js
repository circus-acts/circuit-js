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

if (!this.console) {
	var log = function(value) {document.write("<pre>" + value + "</pre>")}
	this.console = {log: log, error: log}
}

var testQueue = [], curTest, inclusiveTests
function xrunTests() {}
function runTests(name,tests) {
	var test = function(){
		this.setup = function(){}
		this.total = 0
		this.title = name
		this.failures = []
		this.tests = []
		var test = curTest = this
		tests(mock.window)
		this.tests.unshift(0)
		this.tests.unshift(testQueue.length)
		Array.prototype.splice.apply(testQueue,this.tests)
		testQueue.push(function(){
			if (!inclusiveTests || test.total > 0) {
				print(test, function(value) {this.console.log(value)})
			}
		})
	}
	new test()
	var len = testQueue.length
	setTimeout(function(){
		if (testQueue.length==len) wait()
	},100)
	//if (testQueue.length==1) wait()
}
var testRunning=0, waitCount=0
function wait(){
	if (!testRunning) {
		if (testQueue.length) {
			waitCount = 0
			var test = testQueue.shift()
			test.apply(test)
		}
		if (testQueue.length){
			setTimeout(wait)
		}
	}
}

function setup(fn){
	curTest.setup = fn
}

function xtest() {}
function itest(name,condition) {
	inclusiveTests=true
	test(name,condition,true)
}
function test(name,condition, inclusive) {
	var test = curTest
	curTest.tests.push(function() {
		
		if (inclusiveTests && !inclusive) return

		test.total++
		var duration = 0
		var start = 0

		if (typeof performance != "undefined" && performance.now) {
			start = performance.now()
		}

		var fn = condition.toString()
		var async = /function\s*\(\s*\)/m.test(fn) === false
		var result = runTest.call(test,name + '\n' + fn, condition, async)

		if (typeof performance != "undefined" && performance.now) {
			duration = performance.now() - start
		}

		if (typeof window != "undefined") {
			window.test_obj = {
				name: "" + test.total,
				result: result,
				duration: duration
			}

			if (!result) {
				window.global_test_results.tests.push(window.test_obj)
			}

			window.global_test_results.duration += duration
			if (result) {
				window.global_test_results.passed++
			} else {
				window.global_test_results.failed++
			}
		}	

	})
}

function runTest(name,condition, async) {

	testRunning++

	var test = this
	var result = true
	var duration = 0
	if (!async) {
		test.setup()
	}

	try {
		if (!condition(function(done){
			testQueue.unshift(runTest.bind(test,name,done))
			return true
		})) {
			throw new Error("failed")
		}
	}
	catch (e) {
		result = false
		console.error(e)
		console.log(name, e.stack)
		test.failures.push(name)
	}

	testRunning--
	return result
}

function print(test, print) {
	try {
		var node = document.createElement('DIV')
		var failures = test.failures.length? "\nfailures: " + test.failures.length : ''
		node.appendChild(document.createTextNode(test.title + " tests: " + test.total + failures))
		document.body.appendChild(node)
		for (var i = 0; i < test.failures.length; i++) {
			print(test.failures[i].toString())
			node = document.createElement('PRE')
			node.appendChild(document.createTextNode(test.failures[i].toString()))
			document.body.appendChild(node)
		}
	}
	catch (e) {}
	print(test.title + " tests: " + test.total + failures)

	if (test.failures.length > 0) {
		throw new Error(test.failures.length + " tests did not pass")
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

  /*
  *  Circus MVI is implemented through the independent signals m, v and i 
  *  that feed into each other to form a circular channel folded over itself.
  *  The resulting ring circuit responds to discrete signal value changes 
  *  over time.
  */
  function circus(){

  }

  var type = {}.toString, ARRAY='A',OBJECT='O',LITERAL = 'SNBDR'

  // expose to mutation api for override
  function shallowCopy(n) {
    if (typeof n==='object') {
      if (n.length) return n.slice()
      var c={}
      Object.keys(n).forEach(function(k){
        c[k] = n[k]
      })
      return c
    }
    return n
  }

  /*
  * a value is dirty if any of its properties are dirty, or for key diff
  * ..dirty if that key value is dirty regardless of other changed props
  */
  function shallowDiff(m,v,d) {
    var dirty = circus.FALSE,mv=d? m : m.value, t = type.call(mv)[8]
    if (~LITERAL.indexOf(t) || mv === undefined || v === undefined) {
      dirty = mv!==v;
    }
    else {
      if (m.key !== undefined) {
        dirty = v[m.key] !== mv[m.key] && m.key || circus.FALSE
      }
      else {
        if (t === ARRAY) {
          for (var i=0, l=mv.length; i<l; i++) {
            if (d && shallowDiff(mv[i],v[i],d).dirty || mv[i] !== v[i]) {
              dirty=i
              break
            }
          }
        } else if (t === OBJECT) {
          var mk = Object.keys(mv), vk = Object.keys(v) 
          dirty = mk.length != vk.length || typeof v !== 'object' || mk.reduce(function(a,k){
            return a!==circus.FALSE || (d && shallowDiff(mv[k],v[k],d).dirty) || (mv[k] !== v[k] && k) || a
          },circus.FALSE)
        }
      }
    }
    return {dirty:dirty,value:mv}
  }

  function equal(m,v){
    return shallowDiff({value:m},v).dirty === circus.FALSE
  }

  function deepEqual(m,v){
    return shallowDiff(m,v,true).dirty === circus.FALSE
  }

  function pathToData(data, key){
    var i = key.indexOf('[')
    if (i > 0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return data[idxKey][idx]
    }
    return data[key]
  }

  function lens(data,path){
    path = path.split('.')
    return path.reduce(pathToData,data)
  }

  /*
  * Fold a new circus act that feeds directed MVI signals 
  */
  function fold(m,v,i) {

    // Model and intent are simple feeds but view feeds into 
    // intent through explicit bindings in the render function.
    // Put simply: views only feed through user intentions
    return {
      model: m.finally(function() {return this.feed(v)}),
      view: v,
      intent: i.finally(function() {return this.feed(m)})
    }
  }

  var api = {
    copy: shallowCopy,
    diff: shallowDiff,
    equal: equal,
    deepEqual: deepEqual,
    lens: lens,
    fold: fold,
    id: function(v) {return v}
  }

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});
var signal = (function(circus){

'use strict';

circus = circus || require('circus');

var cid=0
var nullMutator = {}
var noop = function(){}
var type = {}.toString

circus.alwaysDiff = false
circus.FALSE =  Object.freeze({'false':true})
circus.UNDEFINED = Object.freeze({'undefined':true})
circus.MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

function Signal(seed){

  var _name
  var _key
  var _on
  var _state
  var _pulse
  var _filo = [], _finally
  var _seed = circus.UNDEFINED
  var _keep = 1
  var _head = new SignalStep(), _step = _head, _tail
  this.id = cid

  function seedValue() {
    if (_seed !== circus.UNDEFINED) {
      var seed = _seed
      _seed = circus.UNDEFINED
      seed.forEach(function(v) {_head.value(v)})
    }    
  }

  this.next = function() {
    return _step.next || new SignalStep()
  }
  
  this.step = function() {
    return _step
  }

  this.value = function(v) {
    seedValue()
    if (arguments.length) {
      _head.value(v)
      return this
    }
    return (_finally || _tail).value()
  }

  this.depth = _head.depth

  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(reset) {
    if (reset!==undefined) {
      _on=!!reset
      return this
    }
    return !!_on
  }

  // Lift a function into a signal. 
  // The function will be called in current step context
  // the function arguments will be the current step value
  this.lift = function(f) {
    _step.lift(f)
    return this
  }

  // Tap the current value of the signal.
  // Value is dependent on the current step
  // - Synonym for lift
  this.tap = this.lift

  // signal depth - overrides step depth
  //  n == undefined - keep all
  this.keep = function(n) {
    _keep = arguments.length? n : circus.MAXDEPTH
    _head.depth(_keep)
    return this
  }

  // Return the current signal history as an array 
  this.history = function() {
    seedValue()
    return (_finally || _tail).history()
  }

  this.name = function(n){
    if (n!==undefined) {
      _name = n
      return this
    }
    return _name
  }

  // Pulse signal with latest value
  // Signal will be inactive after propagation 
  this.pulse = function() {
    _pulse = true
    return this
  }

  // Functions lifted onto the signal via finally will be propagated 
  // after all other signal steps - in FILO order
  this.finally = function(f) {
    var fs = new Signal()
    fs.keep(_keep)
    var s = f.call(fs)
    if (s) {
      _finally = _finally || s
      _filo.unshift(s)
    }
    return this
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    var dirty = _state ? _state.dirty : true
    return dirty!==circus.FALSE || dirty===key
  }

  // Map a step onto a new step on the same signal
  // the mapping function receives the current step value and
  // an opt-in mutator object. The mapping function should return a new 
  // value or the mutator object containing the value.
  // The map function has three return states:
  //  undefined (no return) - do not map value
  //  circus.FALSE - do not map value and stop propagation
  //  value - map and propagate value (use circus.UNDEFINED to map undefined value)
  this.map = function(f) {
    var _this = this, s = this.next()
    var m = /\(.+,.+,.+\)\s*[{=]/.test(f.toString())
    return this.lift(function(v,k){
      var args = [v,k]
      if (m || circus.alwaysDiff) {
        m={value:Signal.prototype.copy(v),dirty:_this.dirty()}
        if (circus.alwaysDiff) args = [m,k]; else args.push(m)
      }
      var nv = f.apply(this,args)
      if (nv !== circus.FALSE) {
        if (nv === undefined) nv = v
        s.value(nv,k,m)
      }
    })
  }

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal
  if (seed!==undefined && seed[0] !== undefined) {
    var _this = this;
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        _name = arg
      }
      else if (arg instanceof Signal) {
        _this.feed(arg)
      }
      else _seed = arg
    })
  }

  function SignalStep(){
    var id = this.id = ++cid
    var _l = 0
    var _n = []
    var _depth = _keep
    var _v = _depth>1? []: undefined

    if (_step) _step.next = this
    else _step = this
    _tail = this

    function next(_this,v) {
      for (var j = 0, nl = _n.length; j < nl; j += 1) {
        _n[j].call(_this, v,_key)
      }
    }

    function getValue() {
      return (_depth>1? _v[_v.l]:_v) || {dirty:true,value:undefined}
    }

    function setValue(v,m,diff){
      var cv = getValue().value
      _state = m===v && diff(m,cv) || {dirty:v===cv && circus.FALSE || cv, value:v}
      if (_depth>1) {
        if (_l === _depth) {_v.shift();_l--}
        _v.push(_state)
      } else {
        _v=_state
      }
      _v.l = _l++
    }

    // Set the value of a signal. The new value will propagate through the signal channel
    // If the signal depth is 0 the new value will be dirty
    // If the number of values == the depth the first value is dropped.
    this.value = function (v,c,m) {
      seedValue() 
      if (arguments.length) {
        if (_on || _on===undefined){
          _key = c
          _on = true
          if (v === circus.UNDEFINED) v = undefined
          if (_depth) setValue(v, m || nullMutator, circus.diff); else _l++ && (_v = {dirty:true,value:v})
          next(this,v)
          if (_tail === this && _finally) {
            _filo.reduce(function(a,f) {
              f.value(a)
              return f.value()
            },v)
          }
          if (_pulse) {
            _on = undefined
            setValue(undefined, nullMutator, circus.diff)
          }
        }
        return this
      }
      return (
        _l ? getValue().value
           : _depth>1? []:undefined
      )
    }

    // A dirty signal is one whose value or object reference has changed, or,
    // if it's a mutated array or object, where one of its members has changed
    this.dirty = function(key) {
      var v = getValue()
      return v.dirty!==circus.FALSE || v.dirty===key
    }
    
    // signal depth == channel keep or:
    //  n == undefined - keep all
    //  n < 2          - keep 1 
    this.depth = function(n) {
      _depth = arguments.length? n : circus.MAXDEPTH
      if (_depth > 1 && _v===undefined) _v=[]
      return this
    }

    this.history = function(f) {
      return _l
        ? (_depth>1? _v:[_v]).map(function(v){return v.value})
        : []
    }

    // Lift a function into a signal. 
    // The function will be called in signal step context
    // the function arguments will be the current signal value
    this.lift = function(f) {
      if (f) _n.push(f)
      _step = _step.next || _step
    }

  }
   
}

// Feed signal values into fanout signal channel(s)
Signal.prototype.feed = function() {
  var _this = this, p = popTail(arguments), args = p.signals,fn = p.tail
  args.forEach(function(fs){
    _this.lift(function(v){
      if (!fn || fn(v)) fs.value(v)
    })
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.diff
Signal.prototype.copy = circus.copy

function join(_this, sampleOnly, joinOnly, args) {
  var sn = _this.next(), soStep = _this.step()
  var tkey = _this.name() || 0, keys = [tkey]
  var joinFn = args.tail
  var signals = args.signals

  var jpName = signals.shift()
  if (typeof jpName !== 'string') {
    signals.unshift(jpName)
    jpName=false
  }

  if (signals.length) {
    var sblock = signals.pop()
    if (!(sblock instanceof Signal)) {
      Object.keys(sblock).forEach(function(k){
        var s = sblock[k] === circus.id? _this:sblock[k] 
        s.name(k)
        signals.push(s)        
      })
    }
    else {
      signals.push(sblock)
      sblock = false
    }
  }

  if (!sampleOnly && !sblock) signals.unshift(_this)

  var jp = _this.jp || {}, isJoin = _this.jp && joinOnly
  if (jpName) {
    keys[0] = joinOnly? signals[0].name() || 0 : undefined
    jp[jpName] = {join:function(j,fn) {
      var l = signals.length
      signals.push(j)
      j.lift(valueOf(l,fn))
    }}
  }
  _this.jp = jp

  function valueOf(i,fn, so) {
    var key = keys[i] = signals[i].name() || i
    fn = fn || joinFn
    if (!so) signals[i] = signals[i].step()
    return function(v) {
      var nv, ov = signals[0].value()
      if (signals.reduce(anyDirty,false)) {
        if (isJoin) nv = Signal.prototype.copy(ov); else {
          nv={}
          if (!sblock) nv[tkey]=ov
        }
        signals.forEach(function(a,j){if (j || !isJoin) nv[keys[j]] = a.value()})
      }
      else {
        nv = sn.value()
        nv[key] = v
      }
      var test = !fn || fn.call(_this,nv,key)
      if (test) {
        if (joinOnly) {
          v = nv
          if (typeof test === 'object') {
            v = test
            if (test instanceof Test) {
              v = test.value
              if (test.mask) {
                v = {}, test = test.value
                Object.keys(test).forEach(function(k){
                  if (test[k]) v[k] = nv[k]
                })
              }
            }
          }
        }
        sn.value(sampleOnly? soStep.value() : v,key)
      }
    }
  }

  if (sampleOnly) _this.lift(valueOf(0,undefined,true))
  for (var i=0, l = signals.length; i<l; i++) {
    // lift values of incoming signals
    signals[i].lift(valueOf(i))
  }

  return _this.lift()
}

function joinAt(_this, args, mapFn) {
  var p = popTail(args), args = p.signals,fn = p.tail
  args.forEach(function(jp){jp.join(_this,fn)})
  return _this.map(function(v){
    return mapFn(fn,v)?  v : circus.FALSE
  })
}

function popTail(args, def, type) {
  var tail
  args = [].slice.call(args)
  if (args.length) {
    var tail = args.pop()
    if (typeof tail !== (type || 'function') || tail instanceof Signal) {
      args.push(tail)
      tail = def
    }
  }
  return {signals:args,tail:tail}
}

function anyDirty (a,s) {return a || s.dirty()}
function Test(prop,value) {
  this[prop] = true
  this.value = value
}
function extend(o1, o2) {
  Object.keys(o2).forEach(function(k){
    o1[k] = o2[k]
  })
  return o1
}

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true. Default - join all
Signal.prototype.join = function(){
  return join(this,false,true,popTail(arguments,_anyActive))
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true. Default - merge any
Signal.prototype.merge = function(fn){
  return join(this,false,false,popTail(arguments,_anyActive))
}

// Sample input signal(s). The output signal will be active when any of the 
// input signals are active or the optional guard function returns true.  
// Default - signal any
Signal.prototype.sample = function() {
  return join(this,true,false,popTail(arguments,_anyActive))
}

// Split a signal into two or more channels. The signal value will be propagated
// in all channels (default or true) or none at all (false)
Signal.prototype.split = function() {
  return joinAt(this,arguments,function(fn,v){
    return !fn || fn(v)
  })
}

// Switch a signal into one or more different channels. The signal value will 
// either be propagated in the new channels (default or true) or the existing
// channel (false)
Signal.prototype.switch = function() {
  return joinAt(this,arguments,function(fn,v){
    return fn && !fn(v)
  })
}

circus.signal = function(seed){return new Signal(arguments)}

circus.signal.allActive = function(v) {
  return Object.keys(v).reduce(function(a,k){return a && v[k]!==undefined},true)
}

circus.signal.anyActive = function(v) {
  return Object.keys(v).reduce(function(a,k){return a || v[k]!==undefined},false)
}

circus.signal.mask = function(obj) {
  return new Test('mask',obj)
}

circus.signal.pick = function(v) {
  return new Test('pick',v)
}

circus.signal.extendBy = function(obj) {
  extend(Signal.prototype,obj)
}

var _allActive = circus.signal.allActive
var _anyActive = circus.signal.anyActive

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});


var curcusModel = (function(circus){

  'use strict';

  circus = circus || require('circus')

  var type = {}.toString
  var idx,idxKey

  function pathToState(data, key){
    var i, d0=data[0],d1=data[1]
    if (d0 === undefined || d1 === undefined) {
      return [true,undefined]
    }
    if ((i = key.indexOf('['))>0){
      idx=parseInt(key.substr(i+1,key.length-2),10)
      idxKey = key.substr(0,i)
      return [d0[idxKey][idx], d1[idxKey][idx]]
    }
    return [d0[key],d1[key]]
  }

  function mutated(state, value, path) {
    if (path[0]!=='.') path = '.' + path
    path = ('root'+path).split('.')
    var pathData = path.reduce(pathToState,[{root:state},{root:value}])
    var typeOfD = type.call(pathData[0]), typeofV = type.call(pathData[1])
    if ( typeOfD === typeofV && (typeOfD === '[object Object]' || typeOfD === '[object Array]')) {
      return JSON.stringify(pathData[0]) !== JSON.stringify(pathData[1])
    }
    return pathData[0]!==pathData[1]
  }
  
  function Model(seed) {
  
    var state = {}

    var model = circus.signal(seed)
    
    var _value = model.value.bind(model)
    model.value = function() {
      state = circus.copy(_value())
      return _value.apply(this,arguments)
    }

    var _dirty = model.dirty.bind(model)
    model.dirty = function(binding) {
      return binding===undefined? _dirty() : mutated(state, _value(), binding)
    }

    return model
    
  }

  circus.model = function(seed) {return new Model(seed)}

  return circus.model

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = curcusModel;
else if (typeof define == "function" && define.amd) define(function() {return curcusModel});


var circusView = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function View(seed){
  
    var view = circus.signal(seed)
    
    return view
    
  }
  
  circus.domEvent = function (elem,eventNameOn, eventNameOff) {
	  var s =  circus.signal()
	  elem.addEventListener(eventNameOn, function(e){s.active(true).value(e)});
	  if (eventNameOff) elem.addEventListener(eventNameOff, s.active.bind(s,false));
	  return s
	}

  return circus.view = function(seed) {return new View(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusView;
else if (typeof define == "function" && define.amd) define(function() {return circusView});


var circusIntent = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function Intent(seed){
  
    var err = {},
        error = circus.signal()

    var intent = circus.signal(seed).finally(function(){
      return this.join({
        model:circus.id,
        error:error
      },circus.signal.anyActive)
    })

    intent.signal = function(seed){
      var signal = circus.signal(seed)
      signal.error = intent.error
      return signal
    }

    intent.error = function(fn) {
      var n = this.name() || 'model', push = function(v,msg) {
        var m = msg || fn(v)
        if (!err[n] || !m) {
          err[n] = m
          error.value(err)
        }
      }
      if (typeof fn === 'function') {
        this.lift(push)
      }
      else push(null,fn)
      return this
    }

    return intent
  }
  
  return circus.intent = function(seed) {return new Intent(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusIntent;
else if (typeof define == "function" && define.amd) define(function() {return circusIntent});


runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('named signal',function() {
		return circus.signal('sig1').name() === 'sig1'
	})

	test('unnamed signal', function() {
		return circus.signal().name() === undefined
	})

	test('name - change',function() {
		return circus.signal('sig1').name('sig2').name() === 'sig2'
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

	test('value ',function() {
		return circus.signal([1]).value(2).value() === 2
	})

	test('value - undefined',function() {
		return circus.signal([1]).value(undefined).value() === undefined
	})

	test('value - UNDEFINED',function() {
		return circus.signal([1]).value(circus.UNDEFINED).value() === undefined
	})

	test('seed - hot',function() {
		var s = circus.signal([1,2,3])
		return s.value()===3
	})

	test('seed - cold',function() {
		var s = circus.signal([1,2,3]).keep()
		var c1 = circus.signal(s.history()).value()
		s.value(4)
		var c2 = circus.signal(s.history()).value()
		return c1===3 && c2===4
	})

	test('dirty - primitive', function() {
		return circus.signal().map(function(v){return v}).value(123).dirty()
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
		var s = circus.signal().map(function(v){return v})
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

	test('not dirty - referenced array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return v})
		s.value(a)
		a[0]='abc'
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v,i,m){ 
			m.value[0] = ++a[0]
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated array key', function() {
		var a = [123,456]
		var s = circus.signal().map(function(v,i,m){ 
			m.value[0] = ++a[0]
			m.key = 1
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v){return {}})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v,i,m){
			v.x=123
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,i,m){
			m.value.x = b++
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same mutated object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v,i,m){
			m.value.x=123
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,i,m){
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same mutated object key',function() {
		var a = {x:'yz'},b=0
		var s = circus.signal().map(function(v,i,m){
			m.value.x=123
			m.value.y=b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('test dirty key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,i,m){
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty('x')
	})

	test('test not dirty key',function() {
		var a = {x:123}
		var s = circus.signal().map(function(v,i,m){
			m.value.x = 123
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty('x')
	})

	test('always diff',function() {
		circus.alwaysDiff = true
		var a = {}, b=0
		var s = circus.signal().map(function(m){
			m.value.x = b++
			return m
		})
		s.value(a)
		s.value(a)
		circus.alwaysDiff = false
		return s.dirty()
	})

	test('custom mutator',function() {
		var save = circus.mutator
		circus.mutator = function(m) {return {dirty:false,value:m.value}}
		var a = {x:123}
		var s = circus.signal().map(function(v,i,m){
			m.value.x++
			return m
		})
		s.value(a)
		s.value(a)
		circus.mutator = save
		return !s.dirty()
	})

	test('set value ',function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('lift',function() {
		var e = 'xyz'
		var s = circus.signal().lift(function(v){
			e=v
		})
		s.value(123)
		return e === 123
	})

	test('tap / lift', function() {
		var e = 0,e1,e2
		var t1 = function(v) {
			e1=v
		}
		var t2 = function(v) {
			e2=v
		}
		var s = circus.signal().map(inc).lift(t1).map(inc).tap(t2)
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

	test('map - undefined',function() {
		return circus.signal([1]).map(function(v){return undefined}).map(inc).value() === 2
	})

	test('map - UNDEFINED',function() {
		return isNaN(circus.signal([1]).map(function(v){return circus.UNDEFINED}).map(inc).value())
	})

	test('map - FALSE stops propagation',function() {
		var e = 'xyz'
		var s = circus.signal()
		.map(function(v){
			return circus.FALSE
		}).tap(function(v){
			e = v			
		})
		s.value(123)
		return e === 'xyz'
	})

	test('active - state', function() {
		var s = circus.signal()
		s.value(1)
		return s.active()
	})

	test('active - off', function() {
		var s = circus.signal()
		s.value(1)
		s.active(false)
		s.value(2)
		return s.value() === 1
	})

	test('pulse',function() {
		var r = 0
		var s1 = circus.signal().pulse()
		var s2 = circus.signal().sample(s1).tap(function(){
			r++
		})
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return r === 1 && s1.active() === false
	})

	test('depth', function() {
		var s = circus.signal().depth(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.toString() === '2,3'
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
		return s.value()===1 && s.dirty()
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
		var r, s = circus.signal().map(inc).tap(function(v){r=v}).value(1)
		return r === 2
	})

	test('finally', function() {
		var r, s = circus.signal()
		s.map(inc)
		s.finally(function(){return this.map(dbl).tap(function(v){r=v})})
		s.value(1)
		return r === 4
	})

	test('finally - delayed seed', function() {
		var r = circus.signal([1]).finally(function(){return this.map(inc)}).value()
		return r === 2
	})

	test('finally - not active', function() {
		var r = circus.signal([1]).active(false).finally(function(){return this.map(inc)}).value()
		return r === undefined
	})

	test('finally - lift order', function() {
		var r1,r2, s = circus.signal()
		s.map(inc)
		s.finally(function(){return this.map(dbl).tap(function(v){
			r1=v
		})})
		s.finally(function(){return this.tap(function(v){
			r2=v
		})})
		s.value(1)
		return r1 === 4 && r2 === 2 && s.value() === 4
	})

	test('feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1)
		s2.value(2)
		return s1.value() === 2
	})

	test('feed - active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1,function(v){return v})
		s2.value(2)
		return s1.value() === 2
	})

	test('feed - blocked', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1,function(v){return !v})
		s2.value(2)
		return s1.value() === undefined
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
		return s.name() === 's' && s1.value() === 1 && s2.value() === 1
	})

	test('feed - fanout', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal().feed(s1,s2)
		s3.value(3)
		return s1.value() === 3 && s2.value() === 3
	})

	test('join all', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2, circus.signal.allActive)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join all - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2,  circus.signal.allActive)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r === undefined
	})

	test('join all - dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		return j.dirty()
	})

	test('join all - clean', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		s1.value(1)
		s2.value(2)
		return !j.dirty()
	})

	test('join all - some dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		s1.value(3)
		s2.value(2)
		return j.dirty()
	})

	test('named key join', function() {
		var s1 = circus.signal('k1')
		var s2 = circus.signal('k2')
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('exclusive aggregate join', function() {
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

	test('inclusive aggregate join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join({
			k1:circus.id,
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('inclusive object join - finally', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.finally(function() { return this.join({
				k1:circus.id,
				k2:s2
			}, circus.signal.anyActive)
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	test('join any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2, circus.signal.anyActive)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === undefined && r[1] === 2
	})

	test('join any - not active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2, circus.signal.anyActive)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === undefined
	})

	test('join any truthy', function() {
		var s1 = circus.signal()
		var s2 = circus.signal('s2')
		var m = s1.join(s2,function(v){
			return v && v.s2 == 2
		})
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === undefined && r2.s2 === 2
	})


	test('merge all', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.merge(s2, circus.signal.allActive)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === undefined && r2 === 2
	})

	test('merge all - not all active',function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var m = s1.merge(s2, circus.signal.allActive)
		s1.value(1)
		s2.value(2)
		var r = m.value()
		return r === undefined
	})

	test('merge any truthy',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.merge(s2,function(v){
			return v > 2
		})
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === undefined && r2 === undefined
	})

	test('merge any',function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var s3 = circus.signal()
		var m = s1.merge(s2,s3)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		s3.value(3)
		var r3 = m.value()
		return r1 === 1 && r2 === 1 && r3 === 3
	})

	test('sample - test',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sample(s2,function(v){
			return v[0] === 2
		})
		s1.value(1)
		var r1 = s.value()
		s2.value(2)
		var r2 = s.value()
		return r1 === undefined && r2 === 1
	})

	test('sample - object',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample({s2:s2,s3:s3},function(v){
			return v.s2 === 2 && v.s3 === 3
		})
		s1.value(1)
		s2.value(2)
		var r1 = s.value()
		s3.value(3)
		var r2 = s.value()
		return r1 === undefined && r2 === 1
	})

	test('sample all',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3, circus.signal.allActive)
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		s3.value(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined && r4 === 1
	})

	test('sample any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3)
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		s3.value(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1 && r4 === 1
	})

	test('sample - truthy', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3,function(v){
			return v[0] === 2 && v[1] === 3
		})
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		s3.value(3)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1
	})

	test('sample - falsey',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sample(s2,function(v2){return v2 === 'x'})
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined
	})

	test('join point', function() {
		function inc(v) {
			v.s++
			if (v.s1) v.s1++
			if (v.s2) v.s2++
			return v
		}
		var s = circus.signal('s').join('jp1').map(inc).join('jp2', circus.signal.allActive).map(inc).value(1)
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		s.jp.jp1.join(s1)
		s.jp.jp2.join(s2)
		s1.value(1)
		var r1 = s.value()
		s2.value(1)
		var r2 = s.value()
		return r1.s === 3 && r1.s1 === undefined && r2.s === 3 && r2.s1 === 3 && r2.s2 === 2
	})

	test('split', function() {
		var s1 = circus.signal().merge('jp').value(1)
		var s2 = circus.signal().split(s1.jp.jp).map(inc).value(2)
		return s1.value() === 2 && s2.value() === 3
	})

	test('split - multiple', function() {
		var r=[],inc=function(v){
			v=v+1;
			r.push(v);
			return v
		}
		var s1 = circus.signal().merge('jp1').map(inc).merge('jp2').map(inc)
		var s2 = circus.signal().split(s1.jp.jp1, s1.jp.jp2).value(1)
		return s1.value() === 2 && r.toString() === '2,3,2'
	})

	test('split - true', function() {
		var s1 = circus.signal().merge('jp')
		var s2 = circus.signal().split(s1.jp.jp, function(){return true}).map(inc).value(2)
		return s1.value() === 2 && s2.value() === 3
	})

	test('split - false', function() {
		var s1 = circus.signal().merge('jp')
		var s2 = circus.signal().split(s1.jp.jp, function(){return false}).map(inc).value(2)
		return s1.value() === undefined && s2.value() === undefined
	})

	test('split - fanout', function() {
		var s1 = circus.signal().merge('jp1')
		var s2 = circus.signal().merge('jp2')
		var s3 = circus.signal().split(s1.jp.jp1, s2.jp.jp2).map(inc).value(3)
		return s1.value() === 3 && s2.value() === 3 && s3.value() === 4
	})

	test('switch', function() {
		var s1 = circus.signal().merge('jp').map(inc)
		var s2 = circus.signal().switch(s1.jp.jp).map(inc).value(1)
		return s1.value() === 2 && s2.value() === undefined
	})

	test('switch - true', function() {
		var s1 = circus.signal().merge('jp').map(inc)
		var s2 = circus.signal().switch(s1.jp.jp, function(){return true}).map(inc).value(1)
		return s1.value() === 2 && s2.value() === undefined
	})

	test('switch - false', function() {
		var s1 = circus.signal().merge('jp').map(inc)
		var s2 = circus.signal().switch(s1.jp.jp, function(){return false}).map(inc).value(1)
		return s1.value() === undefined && s2.value() === 2
	})

	test('join - map', function() {
		function map(v) {
			return {
				s1:v.s1+1,
				s2:v.s2+1
			}
		}
		var s1 = circus.signal('s1').value(1)
		var s2 = circus.signal('s2').join(s1,map).value(2)
		return s2.value().s1 === 2 && s2.value().s2 === 3
	})

	test('join - mask', function() {
		function mask(v) {
			return circus.signal.mask({
				s1:true,
				s2:false
			})
		}
		var s1 = circus.signal('s1').value(1)
		var s2 = circus.signal('s2').join(s1,mask).value(2)
		return s2.value().s1 === 1 && s2.value().s2 === undefined
	})

	test('join - logical mask', function() {
		function mask(v) {
			return circus.signal.mask({
				s1:v.s1 === 1,
				s2:v.s2 === 3
			})
		}
		var s1 = circus.signal('s1').value(1)
		var s2 = circus.signal('s2').join(s1,mask).value(2)
		return s2.value().s1 === 1 && s2.value().s2 === undefined
	})


})

runTests('model', function() {

    var model, state

    setup(function(){
        model = circus.model()
        newstate = function(){
            return {
                a:123,
                b:[1,2,3],
                c:{
                    a:123,
                    b:[1,2,3],
                    c:{
                        a:123,
                        b:[1,2,3],
                        c:{}
                    }
                }
            }
        }
        state = newstate()
    })  

    test('initially dirty', function(){
        return model.dirty()
    })

    test('dirty', function(){
        model.value(state)
        return model.dirty()
    })

    test('dirty - ref', function(){
        model.value(state)
             .value(newstate())
        return model.dirty()
    })

    test('clean - ref', function(){
        model.value(state)
             .value(state)
        return !model.dirty()
    })
    
    test('clean - same ref', function(){
        model.value(state)
        state.a=456
        model.value(state)
        return !model.dirty()
    })
    
    test('dirty path', function(){
        model.value(state)
        return model.dirty('a') &&
                model.dirty('b') && 
                model.dirty('b[0]') && 
                model.dirty('c') && 
                    model.dirty('c.a') && 
                    model.dirty('c.b') && 
                    model.dirty('c.b[0]') && 
                    model.dirty('c.c') && 
                        model.dirty('c.c.a') && 
                        model.dirty('c.c.b') && 
                        model.dirty('c.c.b[0]') && 
                        model.dirty('c.c.c')
    })

    test('clean path', function(){
        model.value(state)
             .value(newstate())
        return !model.dirty('a') &&
                !model.dirty('b') && 
                !model.dirty('b[0]') && 
                !model.dirty('c') && 
                    !model.dirty('c.a') && 
                    !model.dirty('c.b') && 
                    !model.dirty('c.b[0]') && 
                    !model.dirty('c.c') && 
                        !model.dirty('c.c.a') && 
                        !model.dirty('c.c.b') && 
                        !model.dirty('c.c.b[0]') && 
                        !model.dirty('c.c.c')
    })

    test('dirty a', function(){
        model.value(state)
        state = newstate()
        state.a=456
        model.value(state)
        return model.dirty('.a')
    })

    test('dirty b', function(){
        model.value(state)
        state = newstate()
        state.b[0]=456
        model.value(state)
        return model.dirty('b')
    })

    test('clean b - ref', function(){
        model.value(state)
        state = newstate()
        state.b = [1,2,3]
        model.value(state)
        return !model.dirty('b')
    })

    
})

runTests('view', function(mock) {
	
})

runTests('intent', function(mock) {

    var intent,intentions,nested

    setup(function(){
        intent = circus.intent()
        nested = {
            i4:intent.signal(),
            i5:intent.signal([5])
        }
        intentions = {
            i1:intent.signal(),
            i2:intent.signal(),
            i3:intent.signal().join(nested)
        }
        intent.join(intentions)
    })

    test('error', function(){
        intent = circus.intent().error(function(v){return true}).value(1)
        return circus.deepEqual(intent.value(),{model:1,error:{model:true}})
    })

    test('error - valid', function(){
        intent = circus.intent().error(function(v){return false}).value(1)
        return circus.deepEqual(intent.value(),{model:1,error:{model:false}})
    })

    test('error then valid', function(){
        intent = circus.intent().error(function(v){
            return v!==2}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(intent.value(),{model:2,error:{model:false}})
    })

    test('valid then error', function(){
        intent = circus.intent().error(function(v){
            return v!==1}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(intent.value(),{model:2,error:{model:true}})
    })

    test('error - message', function(){
        intent = circus.intent().error(function(v){return 'err'}).value(1)
        return circus.equal(intent.value().error,{model:'err'})
    })

    test('error chain - 1st error', function(){
        intent = circus.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return circus.equal(intent.value().error,{model:'e1'})
    })

    test('error chain - 2nd error', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return 'e2'}).value(1)
        return intent.value().error.model === 'e2'
    })

    test('error chain - skip 2nd error', function(){
        intent = circus.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return intent.value().error.model === 'e1'
    })

    test('error chain - valid', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return false}).value(1)
        return intent.value().error.model === false
    })

    test('error - immediate', function(){
        intent = circus.intent().error('err').value(1)
        return circus.deepEqual(intent.value(),{model:1,error:{model:'err'}})
    })

    test('aggregate - seed', function(){
        return nested.i5.value() === 5
    })

    test('aggregate', function(){
        intentions.i1.error(function(v){return true}).value(1)
        nested.i4.error(function(v){return true}).value(4)
        return circus.deepEqual(intent.value(),{model:{
                                                    i1:1,
                                                    i2: undefined,
                                                    i3: {
                                                        i4: 4,
                                                        i5: 5
                                                    }
                                                },error:{
                                                    i1:true,
                                                    i4:true
                                                }})
    })



})

runTests('circus', function(mock) {

	var app, Signal

	function add1(v) { return v+1 }
	function add2(v) { return v+2 }
	function sub3(v) { return v-3 }

	var isDirty
    function render(model) {
    	if (isDirty) {
    		isDirty = false;
	        app.intent.value(model)
	        return model
    	}
        return circus.FALSE
    }

	setup(function(){
		isDirty = true;
		app = circus.fold(
			circus.model().keep(),
			circus.view().map(render),
			circus.intent()
		)
		
		Signal = circus.signal().__proto__
	})	

	test('app',function(){
		return app.model.__proto__ === Signal &&
				app.view.__proto__ === Signal &&
				app.intent.__proto__ === Signal;
	})

	test('model state change', function(){
		app.model.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().model === 'x'
	})

	test('view state change', function(){
		app.view.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().model === 'x'
	})

	test('intent state change', function(){
		app.intent.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().model === 'x'
	})

	test('composition', function(){
		app.model.map(add1)
		app.view.map(add2)
		app.intent.map(sub3)
		app.model.value(1)
		return 	app.model.history().toString() === '2,0'
				app.model.value() === 0 && 
			   	app.view.value() === 4 && 
			   	app.intent.value().model === -1
	})

})
