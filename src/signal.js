var Circus = (function(){

'use strict';

var fstate = 'fs', cid = 0, extensions={}
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

function _Signal() {}
function extend() {
  var args = [].slice.call(arguments), ctx = args.shift(), ext = args.shift();
  if (ext) {
    Object.keys(ext).forEach(function(k){
      ctx[k] = ext[k]
    })
    args.unshift(ctx)
    ctx = extend.apply(null,args)
  }
  return ctx
}

function Circus() {
  // public
  this.stateChange = function(s,e) {
    _events.unshift({start:s,end:e||function(){}})
  }

  this.id = function() {
    return new Signal().map(function(v){return v})
  }

  this.signal = function() {
    return ctxExtentions.reduce(function(s,ext){
      return s.extend(ext)
    },new Signal(arguments))
  }

  this.asSignal = function() {
    return this.signal()
  }

  this.extend = function(ext){
    if (typeof ext==='function') ctxExtentions.push(ext)
    else extend(_proto,ext)
  }

  // propagate value changes using registered diff
  this.pure = function(v){
    _pure = arguments.length? !!v : true
    return this;
  }

  // private
  var _events = [], ctxExtentions = [], _proto, _pure=true

  // Circuits are unstable by default. This means that a value
  // may be introduced at any point in the circuit at any time
  // and the circuit will become active until all of the signals
  // have reached a new steady state. When this happens the
  // circuit is guaranteed to be stable until the next value.
  var activeCircuit=0, stableCircuit=true
  function stateStart(ctx, v){
    if (!activeCircuit++ && stableCircuit && _events.length) {
      for (var i=0,el=_events.length; i < el; i++) {
        _events[i].start(ctx,v)
      }
    }
  }

  function stateEnd(ctx,v){
    // Circuit states are not re-entrant. Any 'extra' circuit work
    // performed in the stable state will simply prolong
    // this state until eventually there are no more value
    // updates.
    if (!(--activeCircuit) && _events.length) {
      if (stableCircuit) {
        stableCircuit = false
        for (var i=0,el=_events.length; i < el; i++) {
          _events[i].end(ctx,v)
        }
      }
      else stableCircuit = true
    }
  }

  // Generate a new (optionally named) signal
  function Signal(args){

    // private
    var _ctx = this, _id = ++cid
    var _head, _state, _active, _pulse = Circus.FALSE
    var _step = 0, _steps = [], _finallys = []
    var _history, _keep = 1, _impure=false
    var _diff = function(v,s) { return v!==s }

    // _runToState - all steps on new value
    //              next step on join value
    function _runToState(v,ns,impure) {
      stateStart(_ctx, v)
      var hv = v, dontDiff = impure || _impure || !_pure
      if (_active!==false && (dontDiff || _diff(v,_head))) {
        // steps in fifo order
        var nv = v
        for (var i = ns, il = _step; i < il && _active!==false; i++) {
          nv = _ctx.functor? _ctx.functor(_steps[i], v) : _steps[i].call(_ctx, v)
          if (nv===undefined || nv===Circus.FALSE) break;
          v = nv.state===fstate? nv.value : nv
        }
        _mutate(v,nv)
      }
      _head = hv;
      // finally(s) in filo order
      if (nv!==undefined) {
        for (var f = 0, fl = _finallys.length; f < fl; f++) {
          _finallys[f].call(_ctx, v)
        }
      }

      if (_pulse!==Circus.FALSE) _mutate(_pulse)

      stateEnd(_ctx, v)
    }

    function _mutate(v,nv) {
      _active = nv===undefined || nv===Circus.FALSE? undefined : true
      if (v && v.state===fstate) v = v.value
      if (nv!==Circus.FALSE && _keep) {
        if (_keep>1) {
          if (_history.length===_keep) _history.shift()
          _history.push(v)
        } else {
          _history=v
        }
        _state=v
      }
    }

    // public

    //this.id = _id
    // empty name produces array like channels: {0:c1,1:c2...}
    this.name = args && args[0] || ''

    this.asSignal = function() {return this}

    // Set signal state directly bypassing propagation steps
    this.prime = function(v) {
      _mutate(v,v)
      return this
    }

    // Set or read the signal state value
    // This method produces state propagation throughout a connected circuit
    this.value = function(v,impure) {
      if (arguments.length) {
        _runToState(v,0,impure)
      }
      return _state
    }

    // Allow values to be injected into the signal at arbitrary step points.
    // State propagation continues from this point
    this.step = function(sp) {
      var ns = sp? _step : _step+1
      return function(v,impure){
        _runToState(v,ns,impure)
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
      return !!_active
    }

    // Return to inactive pristine (or v) state after propagation
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
    // can cancel propagation by returning Circus.FALSE - revert to previous state (finally(s) invoked)
    // Note that to map state onto undefined the pseudo value Circus.UNDEFINED should be returned
    this.map = function(f,async) {
      var ctx = this, step = this.step(), mf=f
      if ( async ) {
        mf = function async(v) {
          stateStart(ctx,v)
          try {
            var args = [].slice.call(arguments).concat(step)
            return f.apply(ctx, args)
          }
          finally {
            stateEnd(ctx,v)
          }
        }
      }
      _steps.splice(_step++,0,mf)
      return this
    }

    // finally functions are executed in FILO order after all step and after functions regardless of state
    this.finally = function(f) {
      if (Circus.isSignal(f)) {
        var fs=f
        f = function(v) {
          fs.value(v)
        }
      }
      _finallys.unshift(f)
      return this
    }

    this.pure = function(p) {
      _impure = !p
      return this
    }

    // signal keep:
    //  n == undefined - keep all
    //  n == 0         - don't keep - always pristine
    //  n >= 1         - keep n
    this.keep = function(n) {
      _keep = arguments.length? n : MAXDEPTH
      if (_keep > 1 && _history===undefined) _history=[]
      return this
    }

    // Return the current signal history as an array
    this.history = function() {
      return !_keep? undefined : _keep>1? _history:[_history]
    }

    // Tap the current signal state value
    // The function will be called in signal context
    this.tap = function(f) {
      return this.map(function(v){
        f.call(this,v)
        return v===undefined? Circus.UNDEFINED : v
      })
    },

    // After functions are executed in FILO order after all step functions and signal is active
    this.after = function(f) {
      return this.finally(function(v){ if (this.active()) f(v) })
    },

    // Feed signal values into fanout signal(s)
    // The input signal is terminated
    this.feed = function() {
      var feeds = [].slice.call(arguments)
      return this.map(function(v){
        feeds.forEach(function(s){
          s.value(v)
        })
      })
    },

    // Extend a signal with custom step functions either through an
    // object graph, or a context bound function that returns an object graph
    // Chainable step functions need to return the context.
    this.extend = function(ext) {
      ext = typeof ext==='function'? ext(this) : ext
      return extend(this,ext)
    }

    return this
  }

  // constructor
  _proto = extend({}, extensions)
  _proto.constructor = _Signal
  Signal.prototype = _proto
}

// static
Circus.TRUE =  Object.freeze({state:fstate, value:true})
Circus.FALSE =  Object.freeze({state:fstate, value:false})
Circus.NULL = Object.freeze({state:fstate, value:null})
Circus.UNDEFINED = Object.freeze({state:fstate, value:undefined})
Circus.ID = Object.freeze({state:fstate, value:undefined})

Circus.isSignal = function(s) {
  return s && s.constructor === _Signal
}

Circus.extend = function(ext) {
  extend(extensions,ext)
}

return Circus

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Circus;
else if (typeof define == "function" && define.amd) define(function() {return Circus});
