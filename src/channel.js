'use strict'

var sId = 0
var halt = {}

// Channel - the object created and returned by Constructor
function Channel() {
  var sid = ++sId
  var _this = this
  var _feeds = [], _fails = [], _ext = []
  var _step, _steps = []
  var _state = {$value: undefined}, _pulse = Channel.id

  this.id = function(){return _this}
  this.id.signal = true
  if (process.env.NODE_ENV==='development') {
    this.$state = _state
    _state.$id = sid
  }

  // propagate signal value + signal context
  function propagate(v, c1, c2) {
    var args = arguments.length
    for (var i = _step; i < _steps.length && v !== halt; i++) {
      var s =  _steps[i].signal, f = s || _steps[i]
      switch(args) {
        case 0: s && s(); break
        case 1: v = f(v); break
        case 2: v = f(v, c1); break
        case 3: v = f(v, c1, c2); break
        default: v = f.apply(null, [v].concat([].slice.call(arguments, 1)))
      }
    }

    if (v === halt) {
      return undefined
    }
    if (args) {
      _state.$value = v
    }
    for (var t = 0; t < _feeds.length; t++) {
      _feeds[t](_state.$value)
    }
    if (_pulse !== Channel.id) {
      _state.$value = _pulse
    }
    return _state.$value
  }

  // lift a function or signal into functor scope
  function lift(f) {
    _steps.push(f)
    return _this
  }

  // capture the next propagation step
  function nextStep(step) {
    step = step !== undefined? step : _steps.length + 1
    return function(v, c1, c2){
      _step = step
      switch (arguments.length) {
        case 1: return propagate(v)
        case 2: return propagate(v, c1)
        case 3: return propagate(v, c1, c2)
      }
      return propagate.apply(null, arguments)
    }
  }

  function short(message) {
    for (var t = 0; t < _fails.length; t++) {
      _fails[t](message || true)
    }
  }

  // Public API

  // channel .signal : (A) -> Channel A
  //
  // Signal a new value.
  //
  // Push a new signal value onto a channel. The signal will propagate.
  // eg : signal(123) -> Channel 123
  this.signal = nextStep(0)


  // channel .pulse : (A) -> A
  //
  // reset channel value after propagation
  this.pulse = function(v) {
    _pulse = v
    return this
  }


  // channel .asSignal : (A) -> Channel A
  //                    (A -> B) -> Channel B
  //
  // return a value, a function or a channel in signal context
  this.asSignal = function(t) {
    if ((t || this).signal) return t || this
    var s = this.channel()
    return (typeof t === 'function'? s.map(t) : s)
  }


  // Channel A .value : () -> A
  //
  // Return the current signal value.
  this.value = function() {
    return _state.$value
  }

  // channel .prime : A -> Channel A
  //
  // Set signal value directly, bypassing any propagation steps
  this.prime = function(v) {
    _state.$value = v
    return this
  }


  // channel .setState : A -> Channel A
  //
  // Set signal state directly, bypassing any propagation steps
  this.setState = function(s) {
    _state = s
    if (process.env.NODE_ENV==='development') {
      this.$state = _state
      _state.$id = sid
    }
    return this
  }


  // Channel A .map : (A -> B) -> Channel B
  //
  // Map over the current signal value
  this.map = lift


  // Channel A .fail : (F -> F(M)) -> Channel A
  //
  // Register a fail handler.
  // The handler will be called after failed propagation.
  // The value passed to the handler will be the fail value.
  this.fail = function(f) {
    _fails.push(f.signal || f)
    return this
  }


  // Channel A .feed : (F) -> Channel A -> F(A)
  //
  // Register a feed handler.
  // The handler will be called after successful propagation.
  // The value passed to the handler will be the state value.
  this.feed = function(f) {
    _feeds.push(f.signal || f)
    return this
  }


  // Channel A .filter : (A -> boolean) -> channel A | HALT
  //
  // Filter the channel value.
  // - return truthy to continue propagation
  // - return falsey to halt propagation
  this.filter = function(f) {
    return lift(function (v) {
      return f.apply(null, arguments)? v: halt
    })
  }

  // channel .reduce : ((A, B) -> A, A) -> Channel A
  //
  // Continuously reduce incoming signal values into an accumulated state value.
  this.reduce = function(f, accum) {
    return lift(function(v){
      var args = [accum].concat([].slice.call(arguments))
      accum = f.apply(null,args)
      return accum
    })
  }

  // channel A .tap : F(A) -> Channel A
  //
  // Tap the current signal value.
  // - tap ignores any value returned from the tap function.
  //
  // eg : tap(A => console.log(A)) -> Channel A
  this.tap = function(f) {
    return lift(function(v){
      f.apply(null, arguments)
      return v
    })
  }

  // channel A .getState : () -> {value: A}
  //
  // Return the current channel state which minimally includes the current signal value.
  //
  // Note that state also includes channel context values which may be freely
  // accessed and amended within the binding context of propagation. Like most
  // J/S contexts, these values should be sparingly used in channel extensions.
  // They play no part in core signal propagation.
  //
  // example with context:
  //  channel.signal(true)
  //  channel.getState() // -> {$value: true}
  this.getState = function() {
    return _state
  }

  // channel .bind : (A -> B)
  // bind a function to signal context with optional propagation
  this.bind = function(f, id) {
    id = id || _steps.length
    const ctx = _state[id] = _state[id] || {}
    ctx.id = id
    ctx.channel = _this
    ctx.next = nextStep()
    ctx.fail = short
    // bind f must return a channel or a channel functor
    var b = f(ctx)
    if (b) {
      var bf = b.signal || b
      lift(function(v, c1, c2) {
        switch (arguments.length) {
          case 1: bf(v); break
          case 2: bf(v, c1); break
          case 3: bf(v, c1, c2); break
          default: bf.apply(null, arguments)
        }
        return halt
      })
    }
    return _this
  }

  // channel.import : (Channel -> {A}) -> Channel
  //
  // import custom steps into channel context
  // Note: chainable steps must return channel
  var _ext = []
  this.import = function(e) {
    _ext.push(e)
    if (typeof e === 'function') e = e(_this)
    Object.keys(e).forEach(function(k){
      if (typeof e[k] ==='object') _this.import(e[k])
      else {
        _this[k] = e[k]
      }
    })
    return _this
  }

  // channel : () -> Channel
  //
  // Constructor function
  this.channel = function() {
    var s = new Channel()
    for (var i = 0; i < _ext.length; i++) {
      s.import(_ext[i])
    }
    return s
  }

}

// Channel.id: A -> A
// Identity function
Channel.id = function(v) {return v}

export default Channel
