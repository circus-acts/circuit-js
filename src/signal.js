'use strict'

var sId = 0;

// immediate context operators - available through propagation

// Halt propagation.
// - propagation is halted immediately.
// - state is not updated by default.
// - optionally return:
//    value : state is immediately set to value.
//    thunk : thunkor is immediately called with next() arg.
//    promise : propagation is tied to promise resolution.
//
// examples:
//  signal(A).map(v => halt(B)).map(v => v) // -> Signal B
//  signal(A).map(v => halt(next => setTimeout(() => next(B)))) -> Signal A...B
var halt = function(v, a) {
  if (!(this instanceof halt)) return new halt(v, !!arguments.length)
  if (typeof v === 'function') this.thunk = v
  else if (typeof v === 'object' && typeof v.then === 'function') this.promise = v
  else if (a || arguments.length === 1) this.$value =  v
}

// Fail propagation
// - propagation is halted immediately.
// - state is not updated.
// - optionally return failure message
//    NB: failure is not a state - it must be captured to be processed
//
// example:
//  signal(A).map(v => fail('boo!')).fail(f => console.log(f.message)) // boo!
var fail = function(m) {
  if (!(this instanceof fail)) return new fail(m)
  this.message = m || true
}
fail.prototype = Object.create(halt.prototype)


// internal signalling tunnel (used for cloning etc)
var _wrap = function(v) {
  var _this = this
  Object.keys(v).forEach(function(k){ _this[k] = v[k]})
}

// Signal - the object created and returned by Constructor
function Signal(state) {
  var sid = ++sId
  var _this = this
  var _feeds = [], _fails = []

  this.id = function(){return _this}
  this.id.isSignal = true
  this.isSignal = true

  if (process.env.NODE_ENV==='development') {
    this.$id = sid
  }

  var _mw, _step, _steps = state instanceof _wrap? state.steps : []
  var _state = {$value: undefined}, _pulse = Signal.id
  if (state && !(state instanceof _wrap)) Object.keys(state).forEach(function(k) {_state[k] = state[k]})

  if (process.env.NODE_ENV==='development') {
    this.$state = _state
    _state.$id = sid
  }

  function propagate(v) {
    var args = [].slice.call(arguments, 1)
    for (var i = _step; i < _steps.length && !(v instanceof halt); i++) {
      v = _steps[i].apply(null, [v].concat(args))
    }

    if (v instanceof halt) {
      // handle thunks and promises in lieu of generators..
      if (v.thunk) {
        return v.thunk.call(null, nextStep(i))
      }
      else if (v.promise) {
        var next = nextStep(i)
        return v.promise.then(next, function(m) {next(new fail(m))})
      }
      else {
        if (v instanceof fail) {
          for (var t = 0; t < _fails.length; t++) {
            _fails[t](v)
          }
        }
        else if (v.hasOwnProperty('$value')) _state.$value = v.$value
      }
    } else {
      _state.$value = v
      for (var t = 0; t < _feeds.length; t++) {
        _feeds[t](v)
      }
      if (_pulse !== Signal.id) {
        _state.$value = _pulse
      }
    }

    return v
  }

  // lift a function or signal into functor context
  function lift(f) {
    var fmap = f
    if (f.isSignal) {
      f.feed(nextStep())
      fmap = function() {
        f.input.apply(null, arguments)
        return halt()
      }
    }
    _steps.push(fmap)
    return _this
  }

  // allow values to be injected into the signal at arbitrary step points.
  // propagation continues from this point
  function nextStep(step) {
    step = step !== undefined? step : _steps.length + 1
    return function(v){
      _step = step
      return _mw && _step < _steps.length
        ? _mw.apply(null, arguments)
        : propagate.apply(null, arguments)
    }
  }

  // Public API

  // signal().input : (A) -> A
  //
  // Signal a new value.
  //
  // Push a new value into a signal. The signal will propagate.
  // eg : input(123) -> Signal 123
  this.input = nextStep(0)


  // Signal(A).next : (A) -> A
  //
  // Signal a new value at the next step point
  //
  // Push a new value into a signal at the next point in the propagation chain.
  // The signal will propagate onwards.
  // eg : signal.map(v=>v.forEach(i=>this.next(i)).input([1,2,3]) -> Signal 1 : 2 : 3
  this.next = nextStep.bind(_this, undefined)

  // Signal().pulse : (A) -> A
  //
  // reset signal value after propagation
  this.pulse = function(v) {
    _pulse = v
    return this
  }

  // signal(A).bind : ((N, A) -> N(B)) -> Signal B
  //
  // apply a middleware to a signal propagation.
  //
  // The middleware should call next to propagate the signal.
  // The middleware should skip next to halt the signal.
  // The middleware is free to modify value and  / or arity
  // eg : applyMW((next, value) => next(++value)).input(1) -> Signal 2
  this.applyMW = function(mw) {
    var next = _mw || propagate
    _mw = function() {
      var args = [function() {
        return next.apply(null, arguments)
      }].concat([].slice.call(arguments))
      return mw.apply(null, args)
    }
    return this
  }


  // signal(A).asSignal : (A) -> Signal A
  //                      (A -> B) -> Signal B
  //
  // return a value, a function or a signal in Signal context
  this.asSignal = function(t) {
    if ((t || this).isSignal) return t || this
    var s = this.signal()
    return (typeof t === 'function'? s.map(t) : s)
  }


  // signal(A).value : () -> A
  //
  // Return state as the current signal value.
  this.value = function() {
    return _state.$value
  }


  // signal(A).clone : () -> Signal A'
  //
  // Clone a signal into a new context
  this.clone = function() {
    return new Signal(new _wrap({steps: _steps}))
  }


  // signal().prime : (A) -> Signal A
  //                  ({$value: A}) -> Signal A
  //
  // Set signal value or state directly, bypassing any propagation steps
  this.prime = function(v) {
    if (v !== undefined && v.hasOwnProperty('$value')) {
      _state = v
      if (process.env.NODE_ENV==='development') {
        this.$state = _state
        _state.$id = sid
      }
    }
    else _state.$value = v
    return this
  }


  // signal(A).map : (A -> B) -> Signal B
  //
  // Map over the current signal value
  // - can halt propagation by returning Signal.halt
  // - can short propagation by returning Signal.fail
  this.map = lift


  // signal(A).fail : (F) -> Signal A
  //
  // Register a fail handler.
  // The handler will be called after failed propagation.
  // The value passed to the handler will be the fail value.
  this.fail = function(f) {
    _fails.push(f.input || f)
    return this
  }


  // signal(A).feed : (A) -> Signal A
  //
  // Register a feed handler.
  // The handler will be called after successful propagation.
  // The value passed to the handler will be the state value.
  this.feed = function(f) {
    _feeds.push(f.input || f)
    return this
  }


  // signal(A).filter : (A -> boolean) -> Signal A
  //
  // Filter the signal value.
  // - return truthy to continue propagation
  // - return falsey to halt propagation
  this.filter = function(f) {
    return this.map(function (v) {
      return f.apply(null, arguments)? v: halt()
    })
  }

  // signal(A).fold : ((A, A) -> B) -> Signal B
  //                  ((A, B) -> C, B) -> Signal C
  //
  // Continuously fold incoming signal values into an accumulated outgoing value.
  // - accumulator will be first signal value if not supplied.
  this.fold = function(f,accum) {
    return this.map(function(v){
      if (!accum) {
        accum = v
      }
      else {
        var args = [accum].concat([].slice.call(arguments))
        accum = f.apply(null,args)
      }
      return accum
    })
  }

  // signal(A).tap : (A) -> Signal A
  //
  // Tap the current signal state value.
  // - tap ignores any value returned from the tap function.
  //
  // eg : tap(A => console.log(A)) -> Signal A
  this.tap = function(f) {
    return this.map(function(v){
      f.apply(null, arguments)
      return v
    })
  }

  // signal(A).getState : () -> {value: A}
  //
  // Return the current signal state which minimally includes the current signal value.
  //
  // Note that state also includes signal context values which may be freely
  // accessed and amended within the binding context of propagation. Like most
  // J/S contexts, these values should be sparingly used in signal extensions.
  // They play no part in core signal propagation.
  //
  // example with context:
  //  signal.input(true)
  //  signal.getState() // -> {$value: true}
  this.getState = function(raw) {
    return _state
  }


  // signal().bind : (Signal -> {A}) -> Signal
  //
  // bind a signal context to a custom step (or steps)
  // Note: chainable steps must return this.signal
  var ext = []
  this.bind = function(e) {
    ext.push(e)
    if (typeof e === 'function') e = e(_this)
    Object.keys(e).forEach(function(k){
      if (typeof e[k] ==='object') _this.bind(e[k])
      else {
        _this[k] = function() {
          var ctx = _state[k] || {}
          ctx.signal = _this
          var next = e[k].apply(ctx, arguments)
          if (Object.keys(ctx).length > 1) {
            delete ctx.signal
            _state[k] = ctx
          }
          return next
        }
      }
    })
    return this
  }

  // Constructor function
  this.signal = function(v) {
    var s = new Signal(v)
    for (var i = 0; i < ext.length; i++) {
      s.bind(ext[i])
    }
    return s
  }

}

Signal.id = function(v) {return v}
export {halt, fail}
export default Signal
