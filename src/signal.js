var signal = (function(circus){

'use strict';

circus = circus || (require && require('circus')) || {};

// FALSE can be used to stop signal propagation
if (!circus.FALSE) circus.FALSE = Object.freeze({})

// UNDEFINED can be used to update a value to undefined
if (!circus.UNDEFINED) circus.UNDEFINED = Object.freeze({})

var cid=0
var pulse = {}
var noop = function(){}

function Channel(head,id){
  this.head = head
  this.id = id
  this.off = false
}

function Signal(seed,c){
  var id = this.id = ++cid
  var _v = []
  var _l = 0
  var _i = 0
  var _f = []
  var _chan = c instanceof Channel && c || new Channel(this,id)
  var _depth = _chan.keep
  var _dirty
  var _next
  
  _chan.tail = this

  function next() {
    if (_i < _l) {
      var item = _depth? _v[_i++]:_v
      for (var j = 0, fl = _f.length; j < fl; j += 1) {
        _f[j].apply(null, [item])
      }
      if (_chan.tail === this && _chan.finally && _chan.finally !== this) {
        _chan.finally.value(_v)
      }
      if (_chan.on === pulse) {
        _chan.on = undefined
      }
    }
  }

  function scopy(o){
    var r={}
    Object.keys(o).forEach(function(k){
      r[k] = o[k]
    })
    return r
  }

  function value(v,k){
    var cv = _depth? _v[_l]:_v
    _dirty = k? v!==cv[k] : v!==cv
    if (v!==circus.FALSE) {
      // shallow copy value into signal
      var nv = v.length? v.slice(0): v === circus.UNDEFINED? undefined : typeof v === 'object'? scopy(v) : v, 
          tv = nv
      if (k!==undefined) {
        tv = scopy(cv)
        tv[k] = nv
      }
      if (_depth) {
        if (_l === _depth) {_v.shift();_i--;_l--}
        _v.push(tv)
      } else {
        _v=tv
      }
      _l++
    }
  }
  if (seed!==undefined) {
    _depth = seed.length
    _chan.seed = true
    value(seed)
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
  this.value = function (v,k) {
    if (v!==undefined) {
      if (_chan.on || _chan.on===undefined){
        _chan.on = _chan.on || true
        value(v,k)
        next.call(this)
      }
      return this
    } 
    return (
      _l ? _depth? _v[_l-1]:_v
         : _depth? []:undefined
    )
  }
  
  // Lift a function into a signal. 
  // The function will be called in global context
  // the function arguments will be the current signal value
  this.lift = function(f) {
    _f.push(f)
    return this
  }

  // Tap the current value of the signal
  // Value is dependent on the channel position of the signal
  // Synonym for lift
  this.tap = this.lift
  
  // Add a new signal to the signal channel after the current signal position
  // Signal value will be propagated though all signals at this point
  this.signal = function(seed){
    return new Signal(seed,_chan)
  }
  
  // Explicitly activate or deactivate a signal channel or
  // return the current active state
  //   notify registered handlers of state change
  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(on) {
    if (on!==undefined) {
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
    return this
  }

  // signal depth == channel keep or:
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.depth = function(n) {
    _depth = _chan.keep && n !== _chan.keep? _chan.keep : n < 2? undefined : (n || -1)
    return this
  }

  // Pulse signal channel with latest value
  // Channel will be off after propogation 
  this.pulse = function() {
    return this.lift(function(){
      _chan.on = pulse
    })
  }

  this.head = function() {
    return _chan.head
  }
  
  // Floating tail. Signals and functions lifted onto the tail
  // will be propogated after all other channel signals
  this.tail = function() {
    var tail = _chan.tail, f = _chan.finally || this.signal()
    _chan.tail = tail
    return _chan.finally = f
  }

  // Return the current signal history as an array 
  this.toArray = function(f) {
    var _this = this
    if (typeof f === 'function') {
      return this.lift(function(){
        f(_this.toArray())
      })
    }
    return _l
      ? _depth? _v:[_v]
      : []
  }
}

// Push values onto signal channel
Signal.prototype.push = function(v,k){
  this.head().value(v,k)
  return this
}

// Feed signal values into new signal channel(s)
Signal.prototype.feed = function() {
  var _this = this;
  [].slice.apply(arguments).forEach(function(s){
      _this.lift(function(v){
        s.push(v)
      })
  })
  return this
}

// Map a signal onto a new signal on the same channel
Signal.prototype.map = function(f) {
  var s = this.signal()
  this.lift(function(){
    s.value(f.apply(null,arguments))
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
  var _this = this,v,s = this.signal()
  this.lift(function(){
    if (!accum) {
      accum = _this.value()
      s.value(accum)
    }
    else {
      var args = [accum].concat([].slice.apply(arguments))
      accum = f.apply(null,args)
      s.value(accum)
    }
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
  var f = args.pop()
  if (typeof f !== 'function') {
    args.push(f)
    f = undefined
  }

  var isOn, n = []
  function valueOf(i) {
    var ni = n[i] = joinOnly? args[i].name() || i : undefined
    return function(v) {
      var _on = anyActive || args.reduce(allActive,true)
      if (_on){
        var t = !f || (!joinOnly && f.call(null,v))
        var tv = t && (sampleOnly && _this.value() || v)
        if (joinOnly) {
          tv = s.value() || {}
          if (!isOn) {
            args.forEach(function(a,j){tv[n[j]] = a.value()})
          }
          else {
            tv[ni] = v
          }
          t =  !f || f.call(null,tv)
        }
        if (t) s.value(tv)
      }
      isOn = _on
    }
  }
  for (var i=0,l = args.length; i<l; i++) {
    args[i].tap(valueOf(i))
  }
  return s
}

// Join 2 or more input signals into 1 output signal group
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when any of the input signals are active
Signal.prototype.join = function(){
  var args = [true,false,true,this].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Join 2 or more input signals to form 1 output signal group
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

// Sample input signal(s) and optionally test for truthyness but 
// do not take the sample value(s)
// The output signal will be active when any of the input signals 
// are active [and truthy]
Signal.prototype.sample = function() {
  var args = [true,true,false].concat([].slice.apply(arguments));
  return merge.apply(this,args)
}

// Sample input signal(s) and optionally test for truthyness but 
// do not take the sample value(s)
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

