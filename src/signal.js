import Circus from './circus'

'use strict'

var _Signal = function(aId, sId, _name) {
  this.name = _name
  var _this = this
  this.id = function(){return _this}
  this.id.constructor = _Signal
  if (process.env.NODE_ENV==='development') {
    this.$id= aId + '.' + sId
  }
}

Circus.isSignal = function(s) {
  return s && s.constructor === _Signal
}

var AFTER = 'after'
var BEFORE = 'before'
var noop = function(v) {return v}
var diff = function(v1, v2) {return v1!==v2}

var appId = 0;

function SignalContext(_propagation) {

  var aId = ++appId
  var sId=0;

  // Generate a new signal
  function Signal(_name){

    _Signal.call(this, aId, ++sId, _name)

    // private
    var _this = this
    var _head, _state
    var _step = 0, _steps = [], _after, _active
    var _finallys = [], _pulse = Circus.UNDEFINED
    var _pure, _diff = diff

    // _runToState - next step
    function _runToState(v,ns) {
      var nv, fv, hv, fail = v instanceof Circus.fail
      _propagation.start(_this, v)
      if (fail) {
        nv = v
      }
      else if (!_pure || _diff(v,_head,_this.isJoin)) {
        hv = nv = v
        // steps in FIFO order
        for (var i = ns, il = _steps.length; i < il; i++) {
          nv = _bindEach(_steps[i], [v])
          fail = nv instanceof Circus.fail
          if (nv===undefined || fail) break;
          v = nv
        }
        _mutate(v,fail)
      }

      // finallys in FILO order - last value
      if (nv!==undefined) {
        for (var f = 0, fl = _finallys.length; f < fl; f++) {
          _finallys[f].call(_this, v, fail? nv : undefined)
        }
      }

      if (_pulse!==Circus.UNDEFINED) _mutate(_pulse)
      if (!fail) _head = hv

      _propagation.stop(_this, _state)
      return nv
    }

    function _mutate(v, fail) {
       _active = v===undefined || fail? undefined : true
      if (v ===Circus.UNDEFINED) v = undefined
      _state=v
    }

    function _bindEach(f,args) {
      return f.apply(_this, args)
    }

    function _return(f) {
      if (Circus.isSignal(f)) {
        return f.value
      }
      if (typeof f === 'object') {
        for(var p in f) if (f.hasOwnProperty(p)) {
          _this.channels = _this.channels || {}
          return _return(_this.channels[p] = _this.asSignal(f[p]))
        }
      }
      return f
    }

    function _functor(f) {
      var _f = _return(f)
      if (f!==_f && f.finally) f.finally(_next())
      if ( Circus.isAsync(_f) ) {
        var done = _next()
        return function async(v) {
          _propagation.start(_this,v)
          try {
            var args = [].slice.call(arguments).concat(done)
            return _f.apply(_this, args)
          }
          finally {
            _propagation.stop(_this,v)
          }
        }
      }
      return _f
    }

    // Allow values to be injected into the signal at arbitrary step points.
    // State propagation continues from this point
    function _next() {
      var next = (_after? _steps.length : _step) + 1
      return function(v){
        return _runToState(v,next)
      }
    }

    this.asSignal = function(v) {
      if (Circus.isSignal(v || this)) return v || this
      if (Signal.create) {
        var s = Signal.create()
        return (typeof v === 'function'? s.map(v) : s)
      }
    }

    // Set signal state directly bypassing propagation steps
    this.prime = function(v) {
      _mutate(v)
      return _this
    }

    // Pass a value into a signal and receive a value back.
    // This method produces state propagation throughout a connected circuit
    // Note that the value returned is not always the state value. A fail
    // will short the circuit and be returned immediately from this input.
    this.value = function(v) {
      if (arguments.length) return _runToState(v,0)
      return _state
    },

    this.step = _next

    // Return to inactive pristine (or v) state after propagation
    this.pulse = function(v){
      _pulse = v
      return _this
    }

    // Map the current signal value and propagate
    // The function will be called in signal context
    // can halt propagation by returning undefined - retain current state (finally(s) not invoked)
    // can cancel propagation by returning Circus.fail - revert to previous state (finally(s) invoked)
    // Note that to map state onto undefined the pseudo value Circus.UNDEFINED must be returned
    this.map = function(f) {
      var _b = f.state===BEFORE, _f = _functor(_b && f.value || f)
      _b? _steps.unshift(_f) : _steps.splice(_step,0,_f)
      _step++
      return _this
    }

    // create an I/O channel where 2 signals share state and flow in i -> o order
    // Optionally:
    // - take behaviour
    // todo: replace (ie wrap) public channel with before / after
    //       capture step in channel to support after.joins
    this.channel = function(io,take) {
      var split = Circus.extend({}, _this, {constructor: _Signal})
      var map = function(f) {
        var _b = f.state===BEFORE, _f = _functor(_b && f.value || f)
        _b? _steps.splice(_step,0,_f) : _steps.push(_f)
        return _this
      }
      _Signal.call(split, aId,++sId,_name)
      // return split as after / before, with step ownership resolved
      _after = !io || io===Circus.after
      if (_after? !!take : !take) _step=0
      if (_after) split.map = map; else _this.map = map
      return split
    }

    // convenient compose functor that maps from left to right
    this.flow = function(){
      var args = [].slice.call(arguments)
      for (var i=0; i<args.length; i++) {
        this.map(args[i])
      }
      return _this
    }

    // An active signal will propagate state
    // An inactive signal will prevent state propagation
    this.active = function(reset) {
      if (arguments.length) {
        if (!reset) {_reset.push(_active), _active = false }
        else        {_active = !_reset.length || _reset.pop() }
      }
      return !!_active
    }

    // Bind the signal to a new context
    this.bind = function(f) {
      var __b = _bindEach
      _bindEach = function(step,args) {
        var bs = function() {
          return __b(step, arguments)
        }
        return f.call(_this, bs, args)
      }
      return _this
    }

    // finally functions are executed in FILO order after all step functions regardless of state
    this.finally = function(f) {
      var fifo = f.state===BEFORE, _f = _return(fifo && f.value || f)
      if (Circus.isSignal(_f)) {
        var fs=_f
        _f = function(v) {
          fs.value(v)
        }
      }
      _finallys[fifo? 'unshift' : 'push'](_f)
      if (process.env.NODE_ENV==='development') {
        _this.$finallys = _finallys
      }
      return _this
    }

    this.pure = function(diff) {
      _pure = diff!==false
      if (typeof diff === 'function') _diff = diff
      return _this
    }

    // Tap the current signal state value
    // The function will be called in signal context
    this.tap = function(f) {
      return this.map(function(v){
        f.apply(_this,arguments)
        return v===undefined? Circus.UNDEFINED : v
      })
    }

    // Extend a signal with custom step functions either through an
    // object hash, or a context bound function that returns an object hash
    // Chainable step functions need to return the context.
    this.extend = function(ext) {
      ext = typeof ext==='function'? ext(this) : ext
      return Circus.extend(this,ext)
    }

    return _this
  }

  Signal.prototype = _Signal.prototype
  Signal.prototype.constructor = _Signal

  return Signal
}

// todo - consider wrapping async in HOF
var _fnArgs = /\((.+)\)\s*==>|function\s*.*?\(([^)]*)\)/
Circus.isAsync = function(f){
  var m = f.toString().match(_fnArgs)
  return m && (m[1]||m[2]).indexOf('next')>0
}

Circus.after = function(f) {
  return {state:AFTER, value:f}
}

Circus.before = function(f) {
  return {state:BEFORE, value:f}
}

export default SignalContext
