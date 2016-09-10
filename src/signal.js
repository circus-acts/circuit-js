import Circus from './circus'

'use strict'

var sId = 0;
var _Signal = function(name) {
  var _this = this
  this.id = function(){return _this}
  this.id.constructor = _Signal
  if (process.env.NODE_ENV==='development') {
    var _name = this.name || typeof name === 'string' && name || ''
    this.$id = ++sId + _name
  }
}

Circus.isSignal = function(s) {
  return s && s.constructor === _Signal
}

Circus.id = function(v) {return v}
var idDiff = function(v1, v2) {return v1!==v2}

function SignalContext() {

  // Generate a new signal
  function Signal(_steps, _diff, _pulse){

    _Signal.call(this, _steps)

    // private
    var _this = this
    var _head, _state, _bind
    var _feeds = [], _fails = [], _finallys = []

    _steps = _steps && typeof _steps !== 'string' && _steps.map(_lift) || []
    _pulse = _pulse || Circus.UNDEFINED
    _diff = _diff === true? idDiff : _diff

    function _runToState(v, ctx) {
      var nv, hv = v, fail = v instanceof Circus.fail
      if (!_diff || _diff(v,_head)) {
        nv = hv
        for (var i = ctx.step; i < _steps.length; i++) {
          nv = _apply(_steps[i].f, v, ctx)
          fail = nv instanceof Circus.fail
          if (nv===undefined || fail) break;
          v = nv
        }
      }

      // TODO: maybe drop the undefined / async support in
      // favour of built in await semantics?
      if (nv !== undefined) {
        // tail value is either a fail or new state
        if (!fail) {
          _head = hv
          _state = nv === Circus.UNDEFINED? undefined : nv
        }
        var tail = fail? _fails : _feeds
        for (var t = 0; t < tail.length; t++) {
          tail[t].call(_this, nv)
        }
        // report the last good value in finally
        for (var f = 0; f < _finallys.length; f++) {
          _finallys[f].call(_this, v)
        }
        if (_pulse !== Circus.UNDEFINED) _state = _pulse
      }

      return _state
    }

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
        v.then(next, function(m) {next(new Circus.fail(m))})
        return undefined
      }
      return v
    }

//    _bind = _apply

    // lift a function or signal into functor form
    function _lift(f) {
      var fmap = f
      if (Circus.isSignal(f)) {
        var next = _nextStep()
        f.feed(function(v) {
          return next(v)
        })
        fmap = function(v) {f.input(v)}
      }
      return {f:fmap, c:f}
    }

    // Allow values to be injected into the signal at arbitrary step points.
    // State propagation continues from this point
    function _nextStep(step) {
      var ctx = {step: step !== undefined? step : _steps.length + 1}
      return function(v){
        return _bind? _bind(_runToState, v, ctx) : _runToState(v, ctx)
      }
    }

    this.step = _nextStep

    // clone : X -> Y
    //
    // clone a signal (with limitations)
    // - circuits cannot be cloned
    this.clone = function() {
      return new Signal(_steps.map(function(s){return s.f}), _diff, _pulse)
    }

    // bind : ( (A, B, C) -> A(D, C) ) -> Signal D
    //
    // Bind and apply a middleware to a signal context.
    // eg : bind((next, value, ctx) => next(++value)).input(1) -> Signal 2
    //
    // The middleware should return next to propagate the signal.
    // The middleware should return undefined to halt the signal.
    // The middleware can optionally return a thunk or a promise.
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

    // asSignal : A -> Signal A
    //            A -> B -> Signal B
    //            Signal A -> Signal A
    //
    this.asSignal = function(t) {
      if (Circus.isSignal(t || this)) return t || this
      var s = Signal.create && Signal.create() || new Signal()
      return (typeof t === 'function'? s.map(t) : s)
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
      _bind? _bind(_runToState, v, ctx) : _runToState(v,ctx)
      return this
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
    // - can short propagation by returning Circus.fail - revert to previous state (finally(s) invoked)
    // Note that to map state onto undefined the pseudo value Circus.UNDEFINED must be returned
    this.map = function(f) {
      _steps.push(_lift(f))
      return this
    }

    // pipe : (A -> B, B -> C) -> Signal C
    //        (A -> B, Signal C) -> Signal B ? C
    //        (A -> B -> B (C), C -> D) -> Signal D
    //
    // Convenient compose functor that maps from left to right.
    // eg : pipe(v => v + 'B', v ==> v + 'C').input('A') -> Signal 'ABC'
    //
    this.pipe = function(){
      var args = [].slice.call(arguments)
      for (var i=0; i<args.length; i++) {
        this.map(args[i])
      }
      return this
    }

    // register or invoke a fail handler
    this.fail = function(f) {
      if (typeof f === 'function') {
        _fails.push(f.input || f)
      }
      else {
        for (var i = 0; i < _fails.length; i++) {
          _fails[i].call(_this, f)
        }
      }
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
      _finallys.push(f.inout || f)
      return this
    }

    // pulse : (A) -> Signal A
    //
    // Return to pristine (or pv) state after propagation, feeds, fails and finallys
    this.pulse = function(pv){
      _pulse = pv
      return this
    }

    // diff (A) -> Signal
    //
    // Invoke an input diff function and don't propagate if equal
    this.diff = function(test) {
      _diff = test === undefined? idDiff : test
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

var Signal = new SignalContext({start:Circus.id, stop:Circus.id})
export default SignalContext
export { Signal }
