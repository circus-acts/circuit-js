var signal = (function(circus){

'use strict';

//todo: $ise public props

circus = circus || require('circus');

circus.TRUE =  Object.freeze({state:true})
circus.FALSE =  Object.freeze({state:false})
circus.NULL = Object.freeze({state:null})
circus.UNDEFINED = Object.freeze({state:undefined})
var NULLSTATE = Object.freeze({dirty:circus.FALSE,value:undefined})
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

var cid=0

// generate an new signal with optional seed semantics
function Signal(seed){

  // private

  var _head, _state = NULLSTATE, _value
  var _active, _step = 0
  var _befores = [], _steps = [], _afters = []
  var _seed = circus.UNDEFINED
  var _depth = 1
  var _diff = circus.diff || function(v,s) { return v!==s }

  // _runToState - all steps on new value
  //              next step on join value
  function _runToState(ctx,v,ns) {
    // before(s) in filo order
    for (var j = 0, nl = _befores.length; j < nl; j += 1) {
      _befores[j].call(ctx, v)
    }

    if (_active || _active===undefined){
      var nv = v
      // steps in fifo order
      for (var j = ns, nl = _steps.length; j < nl; j += 1) {
        nv = _steps[j].call(ctx, v)
        if (nv===undefined) break // stop here but mutate
        if (nv===circus.FALSE) break; // don't mutate state
        v = nv.hasOwnProperty('state')? nv.state : nv
      }

      if (nv!==circus.FALSE) _mutate(v)

      // after(s) in filo order
      for (var j = 0, nl = _afters.length; j < nl; j += 1) {
        _afters[j].call(ctx, v)
      }
    }
  }

  function _mutate(v) {
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

  // public

  this.id = ++cid
  this.name = '' // empty name produces array like channels: {0:c1,1:c2...}
  this.namespace = ''

  // returns the last value submitted to the signal
  this.head = function() {
    // undeniably useful for detailed signal state control
    return _head
  }

  // set signal state directly bypassing run steps.
  // This method should only be used to establish primary state
  this.prime = function(v) {
    _mutate(v)
    return this
  }

  // Set or read the signal state value
  // This method produces state propagation throughout a connected circuit
  this.value = function(v) {
    if (_seed !== circus.UNDEFINED) {
      var sv = _seed
      _seed = circus.UNDEFINED
      for (var i=0, l=sv.length; i<l; i++) {
        _mutate(sv[i])
      }
    }
    if (arguments.length) {
      _head = v
      _runToState(this,v,0)
    }
    return _state.value
  }

  // Allow values to be injected into the signal at
  // arbitrary step points.
  this.step = function(sp) {
    var ctx = this
    if (sp===undefined) sp = _step+1
    if (sp===circus.FALSE) sp = _step
    return function(v){
      _runToState(ctx,v,sp)
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

  // Establish the diff function used when this signal mutates state
  this.diff = function(diff) {
    _diff = diff
    return this
  }

  // Map the current signal state onto a new state
  // The function will be called in signal context and
  // can prevent propagation by returning:
  //   undefined - retain current state
  //   circus.FALSE - revert to previous state
  // Note that to map state onto undefined or null,
  // the pseudo values circus.UNDEFINED or circus.NULL should be returned
  this.map = function(f) {
    _steps.push(f)
    _step = _steps.length
    return this
  }

  // Lift a function onto a signal head to be executed in FILO order
  // before functions are executed before any step functions
  this.before = function(f) {
    _befores.unshift(f)
    return this
  }

  // Lift a function onto a signal tail to be executed in FILO order
  // after functions are executed after all step functions regardless of propagation status
  this.after = function(f) {
    _afters.unshift(f)
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
      return v===undefined? circus.UNDEFINED : v
    })
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

  // seed signal with optional name followed by any combination of:
  //  state - array
  //  signal - fanout
  if (seed!==undefined && seed[0] !== undefined) {
    var ctx = this, ss=0, feeds=[], args=[].slice.call(seed);
    while (typeof args[0] === 'string') {
      ctx[++ss==1? 'name' : 'namespace'] = args.shift()
    }
    args.forEach(function(arg){
      if (arg instanceof Signal) {
        feeds.push(arg)
      }
      else _seed = arg
    })
    if (feeds.length) {
      this.feed.apply(this,feeds)
    }
  }

}

// Extend a signal with custom step functions either through an
// object graph, or a context bound function that returns an object graph
// Chainable step functions must return the context.
Signal.prototype.extend = function(fn) {
  var ctx=this, ext = typeof fn==='function'? fn(this) : fn
  Object.keys(ext).forEach(function(k){
    ctx[k] = ext[k]
  })
  return this
}

circus.signal = function(seed){return new Signal(arguments)}

// Extend the signal prototype with custom step functions.
// Chainable step functions must return the context.
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

