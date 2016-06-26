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
_Signal.prototype = {}

Circus.isSignal = function(s) {
  return s && s.constructor === _Signal
}

var FSTATE = 'fs'
var AFTER = 'after'
var BEFORE = 'before'
var noop = function(v) {return v}
var diff = function(v1, v2) {return v1!==v2}

var appId = 0;

function AppState(_event) {

  var aId = ++appId
  var sId=0;

  // Generate a new signal
  function Signal(_name){

    _Signal.call(this, aId, ++sId, _name)

    // private
    var _this = this
    var _head, _state
    var _step = 0, _steps = [], _finallys = [], _pulse = Circus.FALSE
    var  _after, _fail
    var _pure, _diff = diff

    // _runToState - next step
    function _runToState(v,ns,_b) {
      var nv
      _event.start(_this, v)
      if (v instanceof Circus.fail) {
        _fail = nv = _fail || v
      }
      else if (!_pure || _diff(v,_head,_this.isJoin)) {
        _head = _pure && v
        nv = v
        // steps in FIFO order
        for (var i = ns, il = _steps.length; i < il; i++) {
          nv = _b(_steps[i], [v])
          if (nv===undefined || nv instanceof Circus.fail) break;
          v = nv
        }
        _mutate(v,nv)
      }

      // finallys in FILO order - last value
      if (nv!==undefined) {
        for (var f = 0, fl = _finallys.length; f < fl; f++) {
          _finallys[f].call(_this, nv)
        }
      }

      if (_pulse!==Circus.FALSE) _mutate(_pulse)

      _event.stop(_this, _state)
      return nv
    }

    function _mutate(v,nv) {
      _fail = nv instanceof Circus.fail && nv
      if (v && v.state===FSTATE) v = v.value
      _state=v
    }

    function _bindEach(f,args) {
      return f.apply(_this, args)
    }

    function _return(f) {
      if (Circus.isSignal(f)) {
        f = f.value
      }
      else if (typeof f === 'object' && _this.channels) {
        for(var p in f) if (f.hasOwnProperty(p)) {
          var s = _this.asSignal(f[p])
          _this.channels[p]=s
          return _return(s)
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
          _event.start(_this,v)
          try {
            var args = [].slice.call(arguments).concat(done)
            return _f.apply(_this, args)
          }
          finally {
            _event.stop(_this,v)
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
        _runToState(v,next,_bindEach)
      }
    }

    this.asSignal = function(v) {
      if (Circus.isSignal(v || this)) return v || this
      var s = Signal.create()
      return (typeof v === 'function'? s.map(v) : s)
    }

    // Set signal state directly bypassing propagation steps
    this.prime = function(v) {
      _mutate(v,v)
      return _this
    }

    // Set or read the signal state value
    // This method produces state propagation throughout a connected circuit
    this.value = function(v) {
      if (arguments.length) { return _runToState(v,0,_bindEach) }
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
      return _this
    }

    this.pure = function(diff) {
      _pure = diff!==false
      if (typeof diff === 'function') _diff = diff
      return _this
    }

    this.error = function() {
      if (_fail) {
        var v = _fail.value
        _fail = false
        return v || true
      }
      return ''
    }

    // Tap the current signal state value
    // The function will be called in signal context
    this.tap = function(f) {
      return this.map(function(v){
        f.apply(_this,arguments)
        return v===undefined? Circus.UNDEFINED : v
      })
    }

    return _this
  }

  Signal.prototype = _Signal.prototype
  Signal.prototype.constructor = _Signal

  return Signal
}

// shared
Circus.TRUE =  Object.freeze({state:FSTATE, value:true})
Circus.FALSE =  Object.freeze({state:FSTATE, value:false})
Circus.NULL = Object.freeze({state:FSTATE, value:null})
Circus.UNDEFINED = Object.freeze({state:FSTATE, value:undefined})
Circus.ID = Object.freeze({state:FSTATE, value:undefined})

Circus.fail = function(v) {if (!(this instanceof Circus.fail)) return new Circus.fail(v); this.value=v}

// todo - consider wrapping async in HOF
var _fnArgs = /function\s.*?\(([^)]*)\)/
Circus.isAsync = function(f){
  return f.length && f.toString().match(_fnArgs)[1].indexOf('next')>0
}

Circus.after = function(f) {
  return {state:AFTER, value:f}
}

Circus.before = function(f) {
  return {state:BEFORE, value:f}
}

export default AppState
