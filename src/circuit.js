import Signal, {halt, state} from './signal'
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

function toSignal(app, s) {
  if (!s || !s.isSignal) {
    var v = s, fmap = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fmap==='map') s = function() {return v}
    s = app.signal()[fmap](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel inputs
function overlay(s) {
  return function overlay (g) {
    Object.keys(g).forEach(function(k) {
      var o = g[k]
      if (o.isSignal || typeof o === 'function') {
        s.signals[k].map(o)
      }
      else if (o) s.signals[k].overlay(o)

    })
    return s
  }
}

function primeInput(cct) {
  var _input = cct.input
  cct.input = function(v) {
    if (!(v instanceof halt)) cct.prime(v)
    return _input(v)
  }
  return cct
}

function prime(s) {
  var _prime = s.prime.bind(s)
  return function prime(v) {
    var pv = v instanceof state? v.state : v
    if (pv !== undefined && pv.constructor === objConstructor && s.signals) {
      Object.keys(pv).forEach(function(k) {
        if (s.signals[k]) {
          var cv = v instanceof state? state(pv[k]) : pv[k]
          s.signals[k].prime(cv)
        }
      })
    }
    return _prime(v)
  }
}

function getState(s) {
  var _getState = s.getState.bind(s)
  return function getState(raw) {
    var state = _getState(raw)
    if (state.join && !raw) state.$value = Object.keys(s.signals).reduce(function(v, k) {
      v[k] = s.signals[k].getState()
      return v
    }, {})
    return state
  }
}

function joinPoint(ctx, sampleOnly, joinOnly, circuit) {
  var _jp = ctx.signal
  ctx.step = (ctx.step || 0) + 1
  var channels=_jp.channels || {}, signals = _jp.signals || {}, joinPoints = [], _fail = _jp.input
  Object.keys(circuit).forEach(function(k){
    var signal = toSignal(_jp, circuit[k])
    if (signal.id) {
      signal.name = k
      signal.step = ctx.step
      // map merged values onto a reducer
      if (!sampleOnly && ! joinOnly) {
        signal.applyMW(function(next, v1, v2, v3) {
          switch (arguments.length) {
            case 2: return next(_jp.value(), v1)
            case 3: return next(_jp.value(), v1, v2)
            case 4: return next(_jp.value(), v1, v2, v3)
          }
          return next.apply(null, [_jp.value()].concat([].slice.call(arguments, 1)))
        })
      }
      // channels are simply aggregated as circuit inputs but care must
      // be taken not to overwrite existing channels with the same name.
      // So, duplicates are lifted, upstream, into the existing channel.
      if (!channels[k]) {
        channels[k] = _jp.input[k] = signal.input
        signals[k] = signal.feed(merge(k)).fail(_fail)
      }
      else {
        signals[k].map(signal)
      }
    }
    // signal is just a signal identity and is only useful as a passive channel.
    else if (joinOnly) {
      signal = {name: k, value: signal().value}
    }
    joinPoints.push(signal)
  })

  var next = _jp.next()
  function merge(channel) {
    return function(v) {
      var jv = joinOnly && joinPoints.reduce(function(jv, s) {
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
  _jp.signals = signals

  // filter out sampled signals at this step
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
function merge(circuit) {
  return joinPoint(this, false, false, circuit)
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
function join(circuit) {
  return joinPoint(this, false, true, circuit)
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
function sample(circuit) {
  return joinPoint(this, true, false, circuit)
}

// Construct a new circuit builder
function Circuit() {

  // a circuit is a signal with join points
  var circuit = new Signal().bindAll(function(sig){
    return {
      circuit: join,
      join: join,
      merge: merge,
      sample: sample,
      pure: pure(diff),
      prime: prime(sig),
      overlay: overlay(sig),
      getState: getState(sig)
    }
  })

  return {
    circuit: function(cct) {return primeInput(circuit.signal().join(cct))},
    join: function(cct) {return circuit.signal().join(cct)},
    merge: function(cct) {return circuit.signal().merge(cct)},
    sample: function(cct) {return circuit.signal().sample(cct)},
    signal: circuit.signal,
    bind: circuit.bind,
    bindAll: circuit.bindAll
  }
}

export default Circuit
