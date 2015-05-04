var signal = (function(circus){

'use strict';

circus = circus || require('circus');

var cid=0
var pulse = {}
var nullMutator = {}
var noop = function(){}

circus.alwaysDiff = false

function Channel(head,id){
  this.head = head
  this.id = id
}

function Signal(seed, chan, fchan){
  var id = this.id = ++cid
  var _l = 0
  var _i = 0
  var _f = []
  var _chan = chan instanceof Channel && chan || new Channel(this,id)
  var _depth = _chan.keep
  var _v = _depth? []: undefined
  var _fchan = fchan
  
  if (!fchan) _chan.tail = this

  function next() {
    var v=circus.UNDEFINED
    if (_i < _l) {
      v = _depth? _v[_i++]:_v
      if (v!==undefined) v = v.value
      for (var j = 0, fl = _f.length; j < fl; j += 1) {
        _f[j].call(null, v)
      }
    }
    return v!==circus.UNDEFINED
  }

  function getValue() {
    return (_depth? _v[_l]:_v) || {dirty:true,value:''}
  }

  function setValue(v,m,diff){
    var cv = getValue()
    var cvv = cv.value
    cv = m===v && diff(m,cvv) || {dirty:v===cvv && circus.FALSE || cvv, value:v}
    if (v!==circus.FALSE) {
      if (_depth) {
        if (_l === _depth) {_v.shift();_i--;_l--}
        _v.push(cv)
      } else {
        _v=cv
      }
      _l++
    }
  }

  if (seed!==undefined) {
    var _this = this
    setTimeout(function(){_this.value(seed)})
  }
  else seed = circus.UNDEFINED

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
    if (v!==undefined) {
      if (_chan.on || _chan.on===undefined){
        _chan.on = _chan.on || true
        setValue(v, m || nullMutator, circus.diff)
        if (next()) {
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
    return (
      _l ? getValue().value
         : _depth? []:undefined
    )
  }

  // Push values onto signal channel head
  this.head = function(v){
    if (v!==undefined) {
      _chan.head.value(v)
    }
    return _chan.head
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    var v = getValue()
    return v.dirty!==circus.FALSE || v.dirty===key
  }
  
  // Lift a function into a signal. 
  // The function will be called in global context
  // the function arguments will be the current signal value
  this.lift = function(f) {
    _f.push(f)
    return this
  }

  // Tap the current value of the signal.
  // Value is dependent on the channel position of the signal
  // Synonym for lift
  this.tap = this.lift
  
  // Add a new signal to the signal channel after the current signal position
  // Signal value will be propagated though all signals at this point
  this.signal = function(seed){
    return new Signal(seed, _chan, _fchan || this===_chan.finally || _chan.finally===true)
  }
  
  // Explicitly activate or deactivate a signal channel or
  // return the current active state
  //   notify registered handlers of state change
  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(on) {
    if (on!==undefined) {
      if (typeof on === 'function') {
        var s = this.signal()
        this.lift(function(v){
          if (on(v)) s.value(v)
        })
        return s
      }
      _chan.on = !!on
      var notify = _chan.on && _chan.onon || !_chan.on && _chan.onoff || noop
      notify(_chan.tail.value())
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
  // will be propagated after all other channel signals
  this.finally = function() {
    if (!_chan.finally) {
      _chan.finally = true
      _chan.finally = this.signal()
    }
    return _chan.finally
  }

  // Return the current signal history as an array 
  this.history = function(f) {
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
  [].slice.apply(arguments).forEach(function(fs){
    _this.lift(function(v){
      fs.head(v)
    })
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.alwaysDiff
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

// A steady state signal
Signal.prototype.always = function(v){
  return this.map(function(){
    return v
  })
}

Signal.prototype.reduce = function(f,accum) {
  var _this = this, s = this.signal()
  this.lift(function(){
    if (!accum) {
      accum = _this.value()
    }
    else {
      var args = [accum].concat([].slice.apply(arguments))
      accum = f.apply(null,args)
    }
    s.value(accum)
  })
  return s
}

// Remove undefined values from the signal
Signal.prototype.compact = function(){
  return this.map(function(v){
    return v || circus.FALSE
  })
}

// Take the first n values from the signal
// The signal will not propagate after n
Signal.prototype.take = function (n) {
  var _this = this
  return this.map(function (v) {
    return (n-- > 0)? v: circus.FALSE
  })
}

// Skip the first n values from the signal
// The signal will not propagate until n + 1
Signal.prototype.skip = function (n) {
  return this.map(function (v) {
    return (n-- > 0)? circus.FALSE : v
  })
}

function allActive (r,a) { return r && a.active() }

function merge() {
  var _this = this, s = this.signal()
  var args = [].slice.apply(arguments)
  var anyActive = args.shift()
  var sampleOnly = args.shift()
  var joinOnly = args.shift()
  var fn = args.pop()
  if (typeof fn !== 'function') {
    args.push(fn)
    fn = undefined
  }

  var isOn, keys = []
  function valueOf(i) {
    var key = keys[i] = joinOnly? args[i].name() || i : undefined
    return function(v) {
      var _on = anyActive || args.reduce(allActive,true)
      if (_on){
        var test = !fn || (!joinOnly && fn.call(null,v))
        var tv = test && (sampleOnly && _this.value() || v)
        if (joinOnly) {
          tv = s.value() || {}
          if (!isOn) {
            args.forEach(function(a,j){tv[keys[j]] = a.value()})
          }
          else {
            tv[key] = v
          }
          test = !fn || fn.call(null,tv)
        }
        if (test) s.value(tv)
      }
      isOn = _on
    }
  }
  for (var i=0,l = args.length; i<l; i++) {
    args[i].tap(valueOf(i))
  }
  return s
}

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when any of the input signals are active
Signal.prototype.join = function(){
  var args = [true,false,true,this].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Join 2 or more input signals to form 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when all input signals are active
Signal.prototype.joinAll = function() {
  var args = [false,false,true,this].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when any of the input signals are active
Signal.prototype.merge = function(){
  var args = [true,false,false,this].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when all input signals are active
Signal.prototype.mergeAll = function() {
  var args = [false,false,false,this].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Sample input signal(s) and optionally test for truthyness
// The output signal will be active when any of the input signals 
// are active [and truthy]
Signal.prototype.sample = function() {
  var args = [true,true,false].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Sample input signal(s) and optionally test for truthyness
// The output signal will be active when all of the input signals 
// are active [and truthy]
Signal.prototype.sampleAll = function() {
  var args = [false,true,false].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

return circus.signal = function(seed){return new Signal(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

