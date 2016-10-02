import Signal from './signal'
import _Pure from './pure'

'use strict'

var objConstructor = {}.constructor

function diff(v1,v2) {
  // keep open until first signal
  if (v1 === undefined || v2 === undefined ||
      typeof v1 !== typeof v2 ||
      v1.length !== v2.length) return true

  for(var i=0, k=Object.keys(v1); i< k.length; i++) {
    if (v1[k[i]] !== v2[k[i]]) return true
  }
  return false
}

function toSignal(app, s, state) {
  if (!s || !s.isSignal) {
    var v = s, fmap = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fmap==='map') s = function() {return v}
    s = app.signal(state)[fmap](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel inputs
function overlay(s) {
  return function recurse (g, c) {
    c = c || s
    Object.keys(g).forEach(function(k) {
      var o = g[k]
      if (o.isSignal || typeof o === 'function') {
        // use apply here
        c.channels[k].map(o)
      }
      else if (o) recurse(o,c.channels[k])

    })
    return s
  }
}

function prime(s) {
  var _prime = s.prime.bind(s)
  return function prime(v) {
    if (v.constructor === objConstructor && s.channels) {
      Object.keys(v).forEach(function(k) {
        s.channels[k] && s.channels[k].prime(v[k])
      })
    }
    return _prime(v)
  }
}

function getState(s) {
  var _getState = s.getState.bind(s)
  return function getState(raw) {
    var state = _getState(raw)
    if ((state.jp || {}).join) state.value = Object.keys(s.channels).reduce(function(v, k) {
      v[k] = s.channels[k].getState(raw)
      return v
    }, {})
    return state
  }
}

function joinPoint(sampleOnly, joinOnly, circuit) {
  var _jp = this.asSignal(), _state = _jp.getState(true)
  _state.jp = {join: joinOnly};
  var channels=_jp.channels || {}, signals = []
  Object.keys(circuit).forEach(function(k){
    var signal = toSignal(_jp, circuit[k], _state.value? _state.value[k] : undefined)
    if (signal.id) {
      signal.name = k
      // bind each joining signal to the context value
      signal.bind(function(next, v) {
        return next(v, _jp.value())
      })
      // channels are simply aggregated as circuit inputs but care must
      // be taken not to overwrite existing channels with the same name.
      // So, duplicates are lifted, upstream, into the existing channel.
      if (!channels[k]) {
        // is channel syntax really that bad?
        if (process.env.NODE_ENV==='development') {
          if (_jp[k] && !_jp[k].isSignal) throw new Error('channel name would overwrite signal verb - ' + k)
        }
        _jp[k] = channels[k] = signal
        signal.feed(merge(k)).fail(_jp.input)
      }
      else {
        channels[k].map(signal)
      }
    }
    // signal is an identity and cannot actually signal. It's only
    // useful for joins where its current state will be included as
    // a passive channel.
    else if (joinOnly) {
      signal = {name: k, value:signal().value}
    }
    signals.push(signal)
  })

  var next = _jp.next()
  function merge(channel) {
    return function(v) {
      var jv = joinOnly && signals.reduce(function(jv, s) {
        jv[s.name] = s.value()
        return jv
      }, {}) || v
      next(sampleOnly? _state.jp.sv || _jp.value() : jv, channel)
    }
  }

  _jp.channels = channels

  // halt sampled signals at this step
  return _jp.filter(function(v){
    _state.jp.sv = sampleOnly && v
    return !sampleOnly
  })
}

// Circuit API

// signal().merge : ({A}) -> Signal A
//
// Merge 1 or more input signals into 1 output signal
// The output signal value will be the latest input signal value
//
// example:
//    merge({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> 20
//
//    signalA.input(10)
//    signalB.input(20)
//
function merge(c) {
  return joinPoint.call(this,false,false,c)
}


// circuit().join : ({A}) -> Signal {A}
//
// Join 1 or more input signals into 1 output signal
// - input signal channels will be mapped onto output signal values
// - duplicate channels will be merged
//
// example:
//    join({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> {A: 10, B, 20}
//
//    signalA.input(10)
//    signalB.input(20)
//
function join(c) {
  return joinPoint.call(this,false,true,c)
}


// circuit(A).sample : ({B}) -> Signal {A}
//
// Halt signal propagation until sample input signal(s) raised
//
// example:
//    circuit = new Circuit().sample({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> {A: 10, B, 20}
//
//    circuit.input(10)   // -> undefined
//    signalA.input(true) // -> 10
//    signalB.input(true) // -> 10
//
function sample(c) {
  return joinPoint.call(this,true,false,c)
}

// Constructor : () -> Signal
//
// Construct a new base circuit
function Constructor() {

  // a circuit is a signal with join points
  var circuit = new Signal().extend(function(signal){
    return {
      join: join,
      merge: merge,
      sample: sample,
      prime: prime(signal),
      overlay: overlay(signal),
      getState: getState(signal)
    }
  })

  // override to filter out 'this' - joinpoints return a new instance
  circuit.asSignal = function(s) {
    return s && s.isSignal && s !== circuit ? s : circuit.signal(s)
  }

  var args = [].slice.call(arguments).forEach(function(module) {
    circuit.extend(module)
  })

  return circuit
}

var Pure = _Pure(diff)

export {Pure}
export default Constructor
