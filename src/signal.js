// Feed in or create a new circus with at least the
// properties expressed in this module. Either way, the
// output will be a circus name-space with signalling utility.
var circus = (function(circus){

'use strict';

//todo: $ise public props

function extend(ctx,ext,_super) {
  Object.keys(ext).forEach(function(k){
    var kext = _super && typeof ext[k] === 'function'? ext[k](ctx[k]) : ext[k]
    ctx[k] = kext
  })
}

// name-space + signalling utility

var fstate = 'fs'
circus.TRUE =  Object.freeze({state:fstate, value:true})
circus.FALSE =  Object.freeze({state:fstate, value:false})
circus.NULL = Object.freeze({state:fstate, value:null})
circus.UNDEFINED = Object.freeze({state:fstate, value:undefined})

var NULLSTATE = {dirty:false,value:undefined}
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

var cid=0

circus.signal = function(seed){return new Signal(arguments)}
circus.prototype.signal = circus.signal

// Extend the signal prototype with custom step functions.
// Chainable step functions must return the context.
circus.signal.extendBy = function(ext,_super) {
  extend(Signal.prototype,ext,_super)
}

circus.isSignal = function(s) {
  return s instanceof Signal
}

circus.extend = function(ext, signal, _super){
  extend(circus.prototype,ext,_super)
  if (signal) {
    extend(Signal.prototype,ext,_super)
  }
}

// move to circus instance?
// Circuits are unstable by default. This means that a value
// may be introduced at any point in the circuit at any time
// and the circuit will become active until all of the signals
// have reached a new steady state. When this happens the
// circuit is guaranteed to be stable and a useful event is fired.
var activeCircuit=0, activeCtx, stableCircuit
function stateStart(ctx, v){
  if (!activeCircuit++ && circus.stateStart && !stableCircuit) {
    circus.stateStart.call(activeCtx = {}, ctx, v)
  }
}

function stateEnd(ctx,v){
  // circuits are not re-entrant. Any 'extra' circuit work
  // performed in the stable state will simply prolong
  // this state until eventually there are no more state changes.
  if (!(--activeCircuit) && circus.stateEnd) {
    if (!stableCircuit) {
      stableCircuit = true
      circus.stateEnd.call(activeCtx, ctx, v)
    }
    else stableCircuit = false
  }
}

// Generate a new (optionally named) signal
function Signal(args){

  // private
  var _ctx = this
  var _state = NULLSTATE, _history, _active
  var _step = 0, _pulse = circus.FALSE
  var _steps = [], _finallys = []
  var _depth = 1
  var _diff = circus.diff || function(v,s) { return v!==s }

  // _runToState - all steps on new value
  //              next step on join value
  function _runToState(v,ns) {
    stateStart(_ctx, v)
    if (_active!==false) {
      // steps in fifo order
      var nv=v
      for (var i = ns, il = _step; i < il && _active !== false; i++) {
        nv = _steps[i].call(_ctx, v)
        if (nv===undefined || nv===circus.FALSE) break;
        v = nv.state===fstate? nv.value : nv
      }

      _mutate(v,nv)

      // afters(s) in filo order
      if (_active) {
        for (var a = _step, al = _steps.length; a < al; a++) {
          _steps[a].call(_ctx, v)
        }
      }
    }

    // finally(s) in filo order
    if (nv!==undefined) {
      for (var f = 0, fl = _finallys.length; f < fl; f++) {
        _finallys[f].call(_ctx, v)
      }
    }

    if (_pulse!==circus.FALSE) _mutate(_pulse)

    stateEnd(_ctx, v)
  }

  function _mutate(v,nv) {
    _active = nv===undefined || nv===circus.FALSE? undefined : true
    if (v && v.state===fstate) v = v.value
    if (nv!==circus.FALSE) {
      var dirty = _depth? _state===NULLSTATE? true : _diff(v,_state.value) : false
      _state = {dirty:dirty, value:v}

      if (_depth>1) {
        if (_history.length===_depth) _history.shift();
        _history.push(_state)
      } else {
        _history=_state
      }
    }
  }

  // public

  this.id = ++cid
  // empty name produces array like channels: {0:c1,1:c2...}
  this.name = args && args[0] || ''
  this.namespace = args && args[1] || ''

  // Set signal state directly bypassing propagation steps
  this.prime = function(v) {
    _mutate(v,v)
    return this
  }

  // Set or read the signal state value
  // This method produces state propagation throughout a connected circuit
  this.value = function(v) {
    if (arguments.length) {
      _runToState(v,0)
    }
    return _state.value
  }

  // Allow values to be injected into the signal at arbitrary step points.
  // State propagation continues from this point
  this.step = function(sp) {
    var ns = sp? _step : _step+1
    return function(v){
      _runToState(v,ns)
    }
  }

  // An active signal will propagate state
  // An inactive signal will prevent state propagation
  var _reset = []
  this.active = function(reset) {
    if (arguments.length) {
      if (!reset) {_reset.push(_active), _active = false }
      else        {_active = _reset.pop() }
    }
    return _active
  }

  // By default, a dirty signal is one whose identity reference has changed.
  // Note that join points are always dirty unless a shallow or deep diff is used.
  this.dirty = function() {
    return _state.dirty
  }

  // Return to inactive pristine state after propagation
  this.pulse = function(v){
    _pulse = v
    return this
  }

  // Establish the diff function used when this signal mutates state
  this.diff = function(diff) {
    _diff = diff
    return this
  }

  // Map the current signal state onto a new state and propagate
  // The function will be called in signal context
  // can halt propagation by returning undefined - retain current state (finally(s) not invoked)
  // can cancel propagation by returning circus.FALSE - revert to previous state (finally(s) invoked)
  // Note that to map state onto undefined the pseudo value circus.UNDEFINED should be returned
  this.map = function(f) {
    var ctx = this, step = this.step(), mf=f
    if ( /^f\S+\s*\([^\)]+,[^\)]+\)/.test(f.toString()) ) {
      mf = function async(v) {
        stateStart(ctx,v)
        return f(v, function(v){
          step(v)
          stateEnd(ctx,v)
        })
      }
    }
    _steps.splice(_step++,0,mf)
    return this
  }

  // after functions are executed after all step functions and signal is active
  this.after = function(f) {
    _steps.splice(_step,0,f)
    return this
  }

  // finally functions are executed in FILO order after all step and after functions regardless of state
  this.finally = function(f) {
    _finallys.unshift(f)
    return this
  }

  // signal keep:
  //  n == undefined - keep all
  //  n == 1         - keep 1
  //  n == 0         - don't keep - always pristine
  this.keep = function(n) {
    _depth = arguments.length? n : MAXDEPTH
    if (_depth > 1 && _history===undefined) _history=[]
    return this
  }

  // Return the current signal history as an array
  this.history = function(f) {
    return !_depth? undefined : (_depth>1? _history:[_history]).map(function(v){return v.value})
  }

}

// helper functions

// Tap the current signal state value
// The function will be called in signal context
Signal.prototype.tap = function(f) {
  return this.map(function(v){
    f.call(this,v)
    return v===undefined? circus.UNDEFINED : v
  })
}

// Feed signal values into fanout signal(s)
// The input signal is terminated
Signal.prototype.feed = function() {
  var feeds = [].slice.call(arguments)
  return this.map(function(v){
    feeds.forEach(function(s){
      s.value(v)
    })
  })
}

// Extend a signal with custom step functions either through an
// object graph, or a context bound function that returns an object graph
// Chainable step functions must return the context.
Signal.prototype.extend = function(ext,_super) {
  ext = typeof ext==='function'? ext(this) : ext
  extend(this,ext,_super)
  return this
}

return circus

})(function(){})

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});

