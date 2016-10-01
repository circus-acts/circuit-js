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
//  signal(A).map(v => this.halt(B)).map(v => v) // -> Signal B
//  signal(A).map(v => this.halt(next => setTimeout(() => next(B)))) -> Signal A...B
var halt = function(v,a) {
  if (!(this instanceof halt)) return new halt(v, !!arguments.length)
  if (typeof v === 'function') this.thunk = v
  else if (typeof v === 'object' && typeof v.then === 'function') this.promise = v
  else if (a || arguments.length === 1) this.value =  v
}

// Fail propagation
// - propagation is halted immediately.
// - state is not updated.
// - optionally return failure message
//    NB: failure is not a state and must be captured to be processed
//
// example:
//  signal(A).fail(f => console.log(f.message)).map(v => this.fail('bad!')) // bad!
var fail = function(m) {
  if (!(this instanceof fail)) return new fail(m)
  this.message = m || true
}
fail.prototype = Object.create(halt.prototype)


// internal signalling tunnel (used for cloning etc)
var _wrap = function(v) {
  if (!(this instanceof _wrap)) return new _wrap(v)
  this.value = v
}

var immediate = Object.freeze({
  halt: halt,
  fail: fail
})

// Signal - the object created and returned by Constructor
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

  var _id = sid, _state = {ctx: {}, value: value}, _bind, _step, _steps = []
  if (value instanceof _wrap) {
    _steps = value.value.steps || []
  }

  function _propagate(v) {
    for (var i = _step; i < _steps.length && !(v instanceof halt); i++) {
      v = _apply.apply(immediate, [_steps[i], v].concat([].slice.call(arguments, 1)))
    }
    var tail = v instanceof fail? _fails : []
    if (v instanceof halt) {
      if (v.hasOwnProperty('value')) _state.value = v.value
    } else {
      _state.value = v
      tail = _feeds
    }
    for (var t = 0; t < tail.length; t++) {
      tail[t](v)
    }

    return !(v instanceof halt)
  }

  // apply: run ordinary functions in functor context
  function _apply(f, v) {
    var args = [].slice.call(arguments, 1)
    v = f.apply(immediate, args)
    if (v instanceof halt) {
      // handle thunks and promises in lieu of generators..
      if (v.thunk) {
        v.thunk(_nextStep(_step+1))
      }
      if (v.promise) {
        // promise chains end here
        var next = _nextStep(_step+1)
        v.promise.then(next, function(m) {next(new fail(m))})
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

  // allow values to be injected into the signal at arbitrary step points.
  // propagation continues from this point
  function _nextStep(step) {
    step = step !== undefined? step : _steps.length + 1
    return function(v){
       var args = [_propagate].concat([].slice.call(arguments))
      _step = step
      _bind? _bind.apply(_state.ctx, args) : _propagate.apply(_this,arguments)
    }
  }


  // Public API

  // signal().input : (A) -> undefined
  //
  // Signal a new value.
  //
  // Push a new value into a signal. The signal will propagate.
  // eg : input(123) -> Signal 123
  this.input = _nextStep(0)


  // Signal(A).next : (A) -> undefined
  //
  // Signal a new value at the next step point
  //
  // Push a new value into a signal at the next point in the propagation chain.
  // The signal will propagate onwards.
  // eg : signal.map(v=>v.forEach(i=>this.next(i)).input([1,2,3]) -> Signal 1 : 2 : 3
  this.next = _nextStep.bind(_this, undefined)


  // signal(A).bind : ((N, A) -> N(B)) -> Signal B
  //
  // Bind and apply a middleware to a signal context.
  //
  // The middleware should call next to propagate the signal.
  // The middleware should skip next to halt the signal.
  // The middleware is free to modify value and / or context.
  // eg : bind((next, value) => next(++value)).input(1) -> Signal 2
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
    return _state.value
  }


  // signal(A).clone : () -> Signal A'
  //
  // Clone a signal into a new context
  this.clone = function() {
    return new Signal(_wrap({steps: _steps}))
  }


  // signal().prime : (A) -> Signal A
  //
  // Set signal state directly, bypassing any propagation steps
  this.prime = function(v) {
    _state.value = v
    return this
  }


  // signal(A).map : (A -> B) -> Signal B
  //
  // Map over the current signal value
  // - can halt propagation by returning this.halt
  // - can short propagation by returning this.fail
  this.map = function(f) {
    _steps.push(_lift(f))
    return this
  }


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
  // - return true to continue propagation
  // - return false to halt propagation
  this.filter = function(f) {
    return this.map(function (v) {
      return f.apply(this, arguments)? v: this.halt()
    })
  }

  // signal(A).reduce : ((A, A) -> B) -> Signal B
  //                    ((A, B) -> C, B) -> Signal C
  //
  // Continuously fold incoming signal values into an accumulated outgoing value.
  // - first value will be passed accumulator if not supplied.
  this.reduce = function(f,accum) {
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


// Constructor : () -> Signal
//
// Construct a new base signal
function Constructor(value) {
  var ext = [], s = new Signal(value)

  s.signal = function() {
    var s = Constructor()
    for (var i = 0; i < ext.length; i++) {
      s.extend(ext[i])
    }
    return s
  }


  // signal().extend : ({A}) -> Signal
  //                    (Signal -> {A}) -> Signal
  //
  // Extend a signal with custom steps.
  // - arg can be: object hash, eg {step: function}
  //               function that receives a Signal instance and returns an object hash
  // - chainable steps must return this.
  s.extend = function(e) {
    ext.push(e)
    extend(this, typeof e==='function'? e(this) || {} : e)
    return this
  }

  return s
}

Constructor.id = function(v) {return v}
export default Constructor
