'use strict'

var sId = 0;

function _Signal(_steps) {
  var _this = this
  this.id = function(){return _this}
  this.id.isSignal = true

  if (process.env.NODE_ENV==='development') {
    this.$id = ++sId + (this.$name || '')
  }

  // private
  var _state, _bind
  var _feeds = [], _fails = [], _finallys = []
  var _pulse = Signal.UNDEFINED

  _steps = typeof _steps !== 'string' && _steps || []

  function _propagate(v, ctx) {
    var nv = v, fail = v instanceof Signal.fail
    for (var i = ctx.step; i < _steps.length && !fail; i++) {
      nv = _apply(_steps[i], v, ctx)
      fail = nv instanceof Signal.fail
      if (nv===undefined || fail) break;
      v = nv
    }

    if (nv !== undefined) {
      // tail value is either a fail or new state
      if (!fail) {
        _state = nv === Signal.UNDEFINED? undefined : nv
      }
      var tail = fail? _fails : _feeds
      for (var t = 0; t < tail.length; t++) {
        tail[t].call(_this, nv)
      }
      // report the last good value in finally
      for (var f = 0; f < _finallys.length; f++) {
        _finallys[f].call(_this, v)
      }
      if (_pulse !== Signal.UNDEFINED) _state = _pulse
    }
    return nv
  }

  // apply: Allow running arbitrary functions inside the functor
  function _apply(f, v, ctx) {
    v = f.call(_this, v, ctx)
    // handle thunks and promises..
    if (typeof v === 'function') {
      v(_nextStep(ctx.step+1))
      return undefined
    }
    if (typeof v === 'object' && typeof v.then === 'function') {
      // promise chains end here
      var next = _nextStep(ctx.step+1)
      v.then(next, function(m) {next(new Signal.fail(m))})
      return undefined
    }
    return v
  }

  // lift a function or signal into functor form
  function _lift(f) {
    var fmap = f
    if (f.isSignal) {
      var next = _nextStep()
      f.feed(function(v) {
        next(v)
      })
      fmap = f.input
    }
    return fmap
  }

  // Allow values to be injected into the signal at arbitrary step points.
  // State propagation continues from this point
  function _nextStep(step) {
    var ctx = {step: step !== undefined? step : _steps.length + 1}
    return function(v){
      return _bind? _bind(_propagate, v, ctx) : _propagate(v, ctx)
    }
  }

  this.step = _nextStep

  // bind : ( (A, B, C) -> A(D, C) ) -> Signal D
  //
  // Bind and apply a middleware to a signal context.
  // eg : bind((next, value, ctx) => next(++value)).input(1) -> Signal 2
  //
  // The middleware should call next to propagate the signal.
  // The middleware should skip next to halt the signal.
  // The middleware is free to modify value and / or context.
  this.bind = function(mw) {
    var next = _bind || _apply
    _bind = function(f, v, ctx) {
      return mw(function(v) {
        return next(f, v, ctx)
      }, v, ctx)
    }
    return this
  }

  this.isSignal = true

  // signal : A -> Signal A
  //            A -> B -> Signal B
  //            Signal A -> Signal A
  //
  this.asSignal = function(t) {
    if ((t || this).isSignal) return t || this
    // todo: pass t into constructor?
    var s = this.signal()
    return (typeof t === 'function'? s.map(t) : s)
  }

  // clone : X -> Y
  //
  // clone a signal
  this.clone = function() {
    return new Signal(_steps)
  }

  // prime : (A) -> Signal A
  //
  // Set signal state directly, bypassing steps
  this.prime = function(v) {
    _state = v
    return this
  }

  // value : () -> A
  //
  // Return state as the current signal value.
  this.value = function() {
    return _state
  }

  // input : (A) -> Signal A
  //
  // Signal a new value.
  // eg : input(123) -> Signal 123
  //
  // This method produces state propagation throughout a connected circuit.
  this.input = function(v) {
    var ctx = {step: 0}
    _bind? _bind(_propagate, v, ctx) : _propagate(v,ctx)
  }

  // map : () -> Signal
  //       (A) -> Signal A
  //       (A -> B) -> Signal B
  //       (A -> B -> B (C)) -> Signal C
  //       (A -> B -> B.resolve (C)) -> Signal C
  //       (A -> B -> B.reject (C)) -> Signal
  //       (Signal A) -> Signal A
  //       (A -> B) -> Signal B
  //       (Signal A) -> Signal A
  //
  // Map over the current signal value and propagate
  // - can await propagation by returning a thunk or promise
  // - can halt propagation by returning undefined - retain current state (finally(s) not invoked)
  // - can short propagation by returning Signal.fail - revert to previous state (finally(s) invoked)
  // Note that to map state onto undefined the pseudo value Signal.UNDEFINED must be returned
  this.map = function(f) {
    _steps.push(_lift(f))
    return this
  }

  // register or invoke a fail handler
  this.fail = function(f) {
    _fails.push(f.input || f)
    return this
  }

  // feed : (A -> B) -> Signal
  //
  // Register a feed handler.
  // The handler will be called after successful propagation.
  // The value passed to the handler will be the state value.
  this.feed = function(f) {
    _feeds.push(f.input || f)
    return this
  }

  // finally : (A -> B) -> Signal
  //
  // Register a finally handler.
  // The handler will be called after propagation, feeds and fails.
  // The value passed to the handler will be the last good step value.
  this.finally = function(f) {
    _finallys.push(f.input || f)
    return this
  }

  // pulse : (A) -> Signal A
  //
  // Return to pristine (or pv) state after propagation, feeds, fails and finallys
  this.pulse = function(pv){
    _pulse = pv
    return this
  }

  this.filter = function(f) {
    return this.map(function (v) {
      return f(v)? v: undefined
    })
  }

  // tap : (A -> B) -> Signal A
  //
  // Tap the current signal state value.
  // eg : tap(A => console.log(A)) -> Signal A
  //
  // - tap ignores any value returned from the tap function.
  this.tap = function(f) {
    return this.map(function(v){
      f.apply(_this,arguments)
      return v===undefined? Signal.UNDEFINED : v
    })
  }
}

function extend(proto, ext) {
  Object.keys(ext).forEach(function(k){
    proto[k] = ext[k]
  })
}

function Signal(steps) {
  var s = new _Signal(steps)

  s.signal = function() {
    var s = new Signal()
    for (var i = 0; i < _ext.length; i++) {
      s.extend(_ext[i])
    }
    return s
  }

  // Extend a signal with custom functions.
  // Chainable functions must return this.
  var _ext = []
  s.extend = function(ext) {
    _ext.push(ext)
    extend(this,typeof ext==='function'? ext(this) || {}: ext)
    return this
  }

  return s
}

Signal.id = function(v) {return v}
Signal.UNDEFINED = Object.freeze({value:undefined}),
Signal.fail = function fail(v) {
  if (!(this instanceof fail)) return new fail(v);
  this.error = v || true
}

export default Signal
