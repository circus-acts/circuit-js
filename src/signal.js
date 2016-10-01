'use strict'

var sId = 0;

var _halt = function(v,a) {
  if (!(this instanceof _halt)) return new _halt(v, !!arguments.length)
  if (typeof v === 'function') this.thunk = v
  else if (typeof v === 'object' && typeof v.then === 'function') this.promise = v
  else if (a || arguments.length === 1) this.value =  v
}
var _fail = function(m) {
  if (!(this instanceof _fail)) return new _fail(m)
  this.message = m || true
}
_fail.prototype = Object.create(_halt.prototype)
var _wrap = function(v) {
  if (!(this instanceof _wrap)) return new _wrap(v)
  this.value = v
}

var immediate = Object.freeze({
  halt: _halt,
  fail: _fail
})

function Signal(value) {
  var sid = ++sId
  var _this = this
  var _feeds = [], _fails = []

  this.id = function(){return _this}
  this.id.isSignal = true
  this.isSignal = true

  if (process.env.NODE_ENV==='development') {
    this.$id = sid + (this.$name || '')
  }

  var _id = sid, _state = {ctx: {}, value: value}, _bind, _steps = []
  if (value instanceof _wrap) {
    _steps = value.value.steps || []
  }

  function _propagate(v) {
    for (var i = _state.ctx.step; i < _steps.length && !(v instanceof _halt); i++) {
      v = _apply.apply(immediate, [_steps[i], v].concat([].slice.call(arguments, 1)))
    }
    var tail = v instanceof _fail? _fails : []
    if (v instanceof _halt) {
      if (v.hasOwnProperty('value')) _state.value = v.value
    } else {
      _state.value = v
      tail = _feeds
    }
    for (var t = 0; t < tail.length; t++) {
      tail[t](v)
    }
    return !(v instanceof _halt)
  }

  // apply: run ordinary functions inside the functor
  function _apply(f, v) {
    var args = [].slice.call(arguments, 1)
    v = f.apply(immediate, args)
    if (v instanceof _halt) {
      _state.halted = true
      _state.failed = !!v.message

      // handle thunks and promises in lieu of generators..
      if (v.thunk) {
        v.thunk(_nextStep(_state.ctx.step+1))
      }
      if (v.promise) {
        // promise chains end here
        var next = _nextStep(_state.ctx.step+1)
        v.promise.then(next, function(m) {next(new _fail(m))})
      }
    }
    return v
  }

  // lift a function or signal into functor form
  function _lift(f) {
    var fmap = f
    if (f.isSignal) {
      var next = _nextStep()
      f.feed(next)
      fmap = function(v) {
        f.input(v)
        return this.halt()
      }
    }
    return fmap
  }

  // Allow values to be injected into the signal at arbitrary step points.
  // State propagation continues from this point
  function _nextStep(step) {
    step = step !== undefined? step : _steps.length + 1
    return function(v){
       var args = [_propagate].concat([].slice.call(arguments))
      _state.ctx.step = step
      _bind? _bind.apply(_state.ctx, args) : _propagate.apply(_this,arguments)
    }
  }

  this.next = _nextStep

  // bind : ( (A, B) -> A(C) ) -> Signal C
  //
  // Bind and apply a middleware to a signal context.
  // eg : bind((next, value) => next(++value)).input(1) -> Signal 2
  //
  // The middleware should call next to propagate the signal.
  // The middleware should skip next to halt the signal.
  // The middleware is free to modify value and / or context.
  this.bind = function(mw) {
    var next = _bind || _apply
    _bind = function(fn, v) {
      var args = [function() {
        return !!next.apply(_state, [fn].concat([].slice.call(arguments)))
      }].concat([].slice.call(arguments, 1))
      return !!mw.apply(_state, args)
    }
    return this
  }

  // asSignal : A -> Signal A
  //            A -> B -> Signal B
  //            Signal A -> Signal A
  //
  this.asSignal = function(t) {
    if ((t || this).isSignal) return t || this
    var s = this.signal()
    return (typeof t === 'function'? s.map(t) : s)
  }

  // clone :: Signal A -> Signal B
  //
  // Clone a signal, its bindings and its steps
  this.clone = function() {
    return new Signal(_wrap({steps: _steps}))
  }

  // value :: () -> A
  //
  // Return state as the current signal value.
  this.value = function() {
    return _state.value
  }

  // prime :: (A) -> Signal A
  //
  // Set signal state directly, bypassing steps
  this.prime = function(v) {
    _state.value = v
    return this
  }

  // input :: (A) -> Signal A
  //
  // Signal a new value.
  // eg : input(123) -> Signal 123
  //
  // This method produces state propagation throughout a connected circuit.
  this.input = _nextStep(0)

  // map :: () -> Signal
  //        (A -> B) -> Signal B
  //        (A -> B -> C) -> Signal C
  //        (Signal A) -> Signal A
  //
  // Map over the current signal value and propagate
  // - can await propagation by returning a thunk or promise
  // - can halt propagation by returning this.halt - retain current state
  // - can short propagation by returning this.fail - revert to previous state (fails(s) invoked)
  this.map = function(f) {
    _steps.push(_lift(f))
    return this
  }

  // register or invoke a fail handler
  this.fail = function(f) {
    _fails.push(f.input || f)
    return this
  }

  // feed :: Signal x (A -> B) -> Signal x
  //
  // Register a feed handler.
  // The handler will be called after successful propagation.
  // The value passed to the handler will be the state value.
  this.feed = function(f) {
    _feeds.push(f.input || f)
    return this
  }

  this.filter = function(f) {
    return this.map(function (v) {
      return f.apply(this, arguments)? v: this.halt()
    })
  }

  // tap :: Signal x (A -> B) -> Signal x
  //
  // Tap the current signal state value.
  // eg : tap(A => console.log(A)) -> Signal A
  //
  // - tap ignores any value returned from the tap function.
  this.tap = function(f) {
    return this.map(function(v){
      f.apply(this,arguments)
      return v
    })
  }
}

function extend(proto, ext) {
  Object.keys(ext).forEach(function(k){
    proto[k] = ext[k]
  })
}

function Constructor(value) {
  var s = new Signal(value)
  s.signal = function() {
    var s = Constructor()
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
    extend(this,typeof ext==='function'? ext(this) || {} : ext)
    return this
  }

  return s
}

Constructor.id = function(v) {return v}
export default Constructor
