var signal = (function(circus){

'use strict';

circus = circus || require('circus');

var cid=0
var pulse = {}
var nullMutator = {}
var noop = function(){}
var type = {}.toString

circus.alwaysDiff = false

function Channel(head,id){
  this.id = id
  this.head = head
  this.seed = circus.FALSE
}

function Signal(seed, chan, fchan){
  var id = this.id = ++cid
  var _l = 0
  var _f = []
  var _chan = chan instanceof Channel && chan || new Channel(this,id)
  var _depth = _chan.keep
  var _v = _depth? []: undefined
  var _fchan = fchan
  
  if (!_fchan) _chan.tail = this
  _chan.ftail = this

  function next() {
    var v = _depth? _v[_v.l]:_v
    if (v!==undefined) v = v.value
    for (var j = 0, fl = _f.length; j < fl; j += 1) {
      _f[j].call(null, v)
    }
  }

  function getValue(v) {
    return (_depth? v[v.l]:v) || {dirty:true,value:undefined}
  }

  function setValue(v,m,diff){
    var cv = getValue(_v)
    var cvv = cv.value
    v===circus.UNDEFINED && (v=undefined)
    cv = m===v && diff(m,cvv) || {dirty:v===cvv && circus.FALSE || cvv, value:v}
    if (_depth) {
      if (_l === _depth) {_v.shift();_l--}
      _v.push(cv)
    } else {
      _v=cv
    }
    _v.l = _l++
    _chan.state = _v
  }

  if (seed!==undefined) {
    if (type.call(seed) !== '[object Array]') seed = [seed]
    //assume all
    if (seed[0] instanceof Signal) {
      var _this = this
      seed.forEach(function(s) {s.feed(_this)})
    }
    else _chan.seed = seed
  }

  function _seed() {
    if (_chan.seed !== circus.FALSE) {
      var _this = this, seed = _chan.seed
      _chan.seed = circus.FALSE
      seed.forEach(function(v) {_chan.head.value(v)})
    }    
  }

  this.name = function(n){
    if (n!==undefined) {
      _chan.name = n
      return this
    }
    return _chan.name
  }

  // Set the value of a signal. The new value will propagate through the signal channel
  // If the signal depth is undefined the new value replaces the existing one.
  // If the number of values == the depth the first value is dropped.
  this.value = function (v,m) {
    if (arguments.length) {
      if (_chan.on || _chan.on===undefined){
        _chan.on = _chan.on || true
        if (v !== circus.FALSE) {
          setValue(v, m || nullMutator, circus.diff)
          next()
          if (_chan.tail === this && _chan.finally && _chan.finally !== this) {
            _chan.finally.value(v)
          }
          if (_chan.on === pulse) {
            _chan.on = undefined
          }
        }
      }
      return this
    }
    _seed() 
    return (
      _l ? getValue(_v).value
         : _depth? []:undefined
    )
  }

  // The final state of the signal channel
  this.state = function() {
    _seed()
    return getValue(_chan.state).value
  }

  // Push values onto signal channel head
  this.head = function(v){
    if (arguments.length) {
      _seed()
      _chan.head.value(v)
    }
    return _chan.head
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    var v = getValue(_v)
    return v.dirty!==circus.FALSE || v.dirty===key
  }
  
  // Lift a function into a signal. 
  // The function will be called in global context
  // the function arguments will be the current signal value
  this.lift = function(f) {
    _f[this===_chan.finally? 'unshift':'push'](f)
    return this
  }

  // Tap the current value of the signal.
  // Value is dependent on the channel position of the signal
  // Synonym for lift
  this.tap = this.lift
  
  // Add a new signal to the signal channel after the current signal position
  // Signal value will be propagated though all signals at this point
  this.signal = function(){
    return new Signal(undefined, _chan, _fchan || this===_chan.finally || _chan.finally===true)
  }
  
  // Explicitly activate or deactivate a signal channel or
  // return the current active state
  //   notify registered handlers of state change
  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(on) {
    if (arguments.length) {
      if (typeof on === 'function') {
        var s = this.signal()
        this.lift(function(v){
          if (on(v)) s.value(v)
        })
        return s
      }
      _chan.on = !!on
      var notify = _chan.on && _chan.onon || !_chan.on && _chan.onoff || noop
      notify(_chan.ftail.value())
      return this
    }
    return !!_chan.on
  }
  
  // Register channel activation event handler
  // The handler will receive the current channel value
  this.on = function(f) {
    _chan.onon = f
    return this
  }
  
  // Register channel deactivation event handler
  // The handler will receive the current channel value
  this.off = function(f) {
    _chan.onoff = f
    return this
  }
  
  // channel depth - overrides signal depth
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.keep = function(n) {
    _chan.keep = n < 2? undefined : (n || -1)
    _depth = _chan.keep
    if (_v===undefined) _v=[]
    return this
  }

  // signal depth == channel keep or:
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.depth = function(n) {
    _depth = _chan.keep && n !== _chan.keep? _chan.keep : n < 2? undefined : (n || -1)
    if (_v===undefined) _v=[]
    return this
  }

  // Pulse signal channel with latest value
  // Channel will be off after propagation 
  this.pulse = function() {
    return this.lift(function(){
      _chan.on = pulse
    })
  }

  // Functions lifted onto the channel after finally
  // will be propagated after all other channel signals in FILO order
  this.finally = function() {
    if (!_chan.finally) {
      _chan.finally = true
      _chan.finally = this.signal()
      if (_chan.seed === circus.FALSE && this.active()) {
        _chan.finally.value(_chan.tail.value())
      }
    }
    return _chan.finally
  }

  // Return the current channel history as an array 
  this.history = function(f) {
    _seed()
    if (this!==_chan.ftail) {
      return _chan.ftail.history(f)
    }
    var _this = this
    if (typeof f === 'function') {
      return this.lift(function(){
        f(_this.history())
      })
    }
    return _l
      ? (_depth? _v:[_v]).map(function(v){return v.value})
      : []
  }
}

// Feed signal values into fanout signal channel(s)
Signal.prototype.feed = function() {
  var _this = this;
  [].slice.call(arguments).forEach(function(fs){
    _this.lift(function(v){
      fs.head(v)
    })
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.diff
Signal.prototype.copy = circus.copy

// Map a signal onto a new signal on the same channel
// the mapping function receives the current signal value and
// an opt-in mutator object. The mapping function should return a new 
// value or the mutator object containing the value.
Signal.prototype.map = function(f) {
  var _this = this, s = this.signal()
  var m = /\(.+,.+\)\s*[{=]/.test(f.toString())
  this.lift(function(v){
    var args = [v]
    if (m || circus.alwaysDiff) {
      m={value:_this.copy(v),dirty:_this.dirty()}
      args.push(m)
      if (circus.alwaysDiff) args = [m]
    }
    s.value(f.apply(null,args),m)
  })
  return s
}

Signal.prototype.reduce = function(f,accum) {
  var _this = this, s = this.signal()
  this.lift(function(){
    if (!accum) {
      accum = _this.value()
    }
    else {
      var args = [accum].concat([].slice.call(arguments))
      accum = f.apply(null,args)
    }
    s.value(accum)
  })
  return s
}

function allActive (a,s) { return a && s.active()}
function anyDirty (a,s) {return a || s.dirty()}

function join() {
  var _this = this, s = this.signal()
  var args = [].slice.call(arguments)
  var anyActive = args.shift()
  var sampleOnly = args.shift()
  var joinOnly = args.shift()
  var keys = []

  var jp = args.pop()
  if (typeof jp === 'string') {
    keys[0] = joinOnly? args[0].name() || 0 : undefined
    this.head()[jp] = {join:function(j,fn) {
      var l = args.length
      args.push(j)
      return args[l].lift(valueOf(l,fn))
    }}
    return this
  }
  else args.push(jp)

  var mfn = args.pop()
  if (typeof mfn !== 'function') {
    args.push(mfn)
    mfn = undefined
  }
  var sblock = args.pop()
  if (!(sblock instanceof Signal)) {
    args.length=0
    Object.keys(sblock).forEach(function(k){
      var s = sblock[k] === circus.id? _this:sblock[k] 
      args.push(s.name(k))
    }) 
  }
  else args.push(sblock)
  function valueOf(i,fn) {
    var key = keys[i] = joinOnly? args[i].name() || i : undefined
    fn = fn || mfn
    return function(v) {
      var active = anyActive || args.reduce(allActive,true)
      if (active){
        var test = !fn || (!joinOnly && fn.call(null,v))
        var tv = test && (sampleOnly && _this.value() || v)
        if (joinOnly) {
          if (args.reduce(anyDirty,false)) {
            tv = {}
            args.forEach(function(a,j){tv[keys[j]] = a.value()})
          }
          else {
            tv = s.value() || {}
            tv[key] = v
          }
          test = !fn || fn.call(null,tv)
        }
        if (test) s.value(tv)
      }
    }
  }

  // lift current value of target signal 
  var i = args[0]? 1:0 
  if (i) args[0].lift(valueOf(0)); else args.shift()
  for (var l = args.length; i<l; i++) {
    // lift final values of incoming signals
    args[i].finally().lift(valueOf(i))
  }
  return s
}

function split(_this,args,mapFn) {
  args = [].slice.call(args)
  var fn = args.length>1 && args.pop()
  if (fn && typeof fn !== 'function') {
    args.push(fn)
    fn = undefined
  }
  args.forEach(function(jp){jp.join(_this,fn)})
  return _this.map(function(v){
    return mapFn(fn,v)?  v : circus.FALSE
  })
}

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when any of the input signals are active
Signal.prototype.join = function(){
  var args = [true,false,true,this].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Join 2 or more input signals to form 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when all input signals are active
Signal.prototype.joinAll = function() {
  var args = [false,false,true,this].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when any of the input signals are active
Signal.prototype.merge = function(){
  var args = [true,false,false,this].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when all input signals are active
Signal.prototype.mergeAll = function() {
  var args = [false,false,false,this].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Sample input signal(s) and optionally test for truthyness
// The output signal will be active when any of the input signals 
// are active [and truthy]
Signal.prototype.sample = function() {
  var args = [true,true,false,false].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Sample input signal(s) and optionally test for truthyness
// The output signal will be active when all of the input signals 
// are active [and truthy]
Signal.prototype.sampleAll = function() {
  var args = [false,true,false,false].concat([].slice.call(arguments));
  return join.apply(this,args)
}

// Split a signal into two or more channels and optionally test for truthyness.
// The signal value will be propagated in all channels (default or true) or none
// at all (false)
Signal.prototype.and = function() {
  return split(this,arguments,function(fn,v){
    return !fn || fn(v)
  })
}

// Switch a signal into one or more different channels and optionally test 
// for truthyness. The signal value will either be propagated in the new
// channels (default or true) or the existing one (false)
Signal.prototype.or = function(jp,fn) {
  return split(this,arguments,function(fn,v){
    return fn && !fn(v)
  })
}

circus.signal = function(seed){return new Signal(seed)}

circus.signal.extendBy = function(obj) {
  Object.keys(obj).forEach(function(k){
    Signal.prototype[k] = obj[k]
  })
}

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

