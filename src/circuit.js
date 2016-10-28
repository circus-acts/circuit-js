import Signal from './signal'
import pure from './pure'

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
  return function overlay (s, c, g) {
    Object.keys(g).forEach(function(k) {
      var o = g[k]
      if (o.isSignal || typeof o === 'function') {
        s.channels[k].map(o)
      }
      else if (o) overlay(s.channels[k], c, o)

    })
    return s
  }
}

function prime(s) {
  var _prime = s.prime.bind(s)
  return function prime(s, c, v) {
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
  return function getState() {
    var state = _getState()
    if (state.join) state.$value = Object.keys(s.channels).reduce(function(v, k) {
      v[k] = s.channels[k].getState()
      return v
    }, {})
    return state
  }
}

function joinPoint(_jp, ctx, sampleOnly, joinOnly, circuit) {
  var channels=_jp.channels || {}, signals = []
  ctx.join = joinOnly;

  Object.keys(circuit).forEach(function(k){
    var signal = toSignal(_jp, circuit[k], ctx.value? ctx.value[k] : undefined)
    if (signal.id) {
      signal.name = k
      // map merged values onto a reducer
      if (!sampleOnly && ! joinOnly) {
        signal.applyMW(function(next, v1, v2) {
          return arguments.length > 3
            ? next.apply(null, [_jp.value()].concat([].slice.call(arguments, 1)))
            : next(_jp.value(), v1, v2)
        })
      }
      // channels are simply aggregated as circuit inputs but care must
      // be taken not to overwrite existing channels with the same name.
      // So, duplicates are lifted, upstream, into the existing channel.
      if (!channels[k]) {
        // is channel syntax really that bad?
        if (process.env.NODE_ENV==='development') {
          if (_jp[k]) throw new Error('channel name would overwrite signal verb ' + k)
        }
        _jp[k] = signal
        channels[k] = signal.feed(merge(k)).fail(_jp.input)
      }
      else {
        channels[k].map(signal)
      }
    }
    // signal is just a signal identity and is only useful as a passive channel.
    else if (joinOnly) {
      signal = {name: k, value: signal().value}
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
      // need to take the value when no primary state available. Worth warning about..
      // todo: re-evaluate after priming has been fixed to state
      if (process.env.NODE_ENV==='development') {
        if (sampleOnly && !ctx.hasOwnProperty('sv')) {
          console.warn('jp value substituted for primary state')
        }
      }
      next(sampleOnly? ctx.sv || _jp.value() : jv, channel)
    }
  }

  _jp.channels = channels

  // halt sampled signals at this step
  return _jp.filter(function(v){
    if (sampleOnly) ctx.sv = v
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
function merge(s, c, circuit) {
  return joinPoint(s,c,false,false,circuit)
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
function join(s, c, circuit) {
  return joinPoint(s,c,false,true,circuit)
}


// circuit(A).sample : ({Signal B}) -> Signal {A}
//
// Halt signal propagation until sample input signal(s) raised
//
// example:
//    circuit = new Circuit().sample({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> {A: 10, B, 20}
//
//    circuit.input(10)   // -> circuit undefined
//    signalA.input(true) // -> circuit 10
//    signalB.input(true) // -> circuit 10
//
function sample(s, c, circuit) {
  return joinPoint(s,c,true,false,circuit)
}

// Circuit : () -> Signal
//
// Construct a new circuit
function Circuit() {

  // a circuit is a signal with join points
  var circuit = new Signal().bind(function(signal){
    return {
      join: join,
      merge: merge,
      sample: sample,
      pure: pure(diff),
      prime: prime(signal),
      overlay: overlay(signal),
      getState: getState(signal)
    }
  })

  circuit.jp = {
    join: function(cct) {return circuit.signal().join(cct)},
    merge: function(cct) {return circuit.signal().merge(cct)},
    sample: function(cct) {return circuit.signal().sample(cct)}
  }

  return circuit
}

export default Circuit
