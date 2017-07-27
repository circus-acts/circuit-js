import Channel from './channel'
import Pure from './pure'

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
  if (!s || !s.signal) {
    var v = s, fmap = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fmap==='map') s = function() {return v}
    s = app.channel()[fmap](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel inputs
function overlay(s) {
  return function overlay (g) {
    Object.keys(g).forEach(function(k) {
      var o = g[k]
      if (o.signal || typeof o === 'function') {
        s.channels[k].map(o)
      }
      else if (o) s.channels[k].overlay(o)

    })
    return s
  }
}

function primeInput(cct) {
  var _input = cct.signal
  cct.signal = function(v) {
    cct.prime(v)
    return _input(v)
  }
  return cct
}

function prime(c) {
  var _prime = c.prime.bind(c)
  return function prime(s) {
    if (s !== undefined && s.constructor === objConstructor && c.channels) {
      Object.keys(s).forEach(function(k) {
        if (c.channels[k]) {
          c.channels[k].prime(s[k])
        }
      })
    }
    return _prime(s)
  }
}

function setState(c) {
  var _setState = c.setState.bind(c)
  return function setState(s) {
    if (s !== undefined && s.constructor === objConstructor && c.channels) {
      Object.keys(s).forEach(function(k) {
        if (c.channels[k]) {
          c.channels[k].setState(s[k])
        }
      })
    }
    return _setState(s)
  }
}

function getState(s) {
  var _getState = s.getState.bind(s)
  return function getState(raw) {
    var state = _getState(raw)
    if (state.join && !raw) state.$value = Object.keys(s.channels).reduce(function(v, k) {
      v[k] = s.channels[k].getState()
      return v
    }, {})
    return state
  }
}

function joinPoint(sampleOnly, joinOnly, circuit) {
  return function (ctx) {
    var _jp = ctx.channel
    ctx.step = (ctx.step || 0) + 1
    var signals=_jp.signals || {}, channels = _jp.channels || {}, joinPoints = []
    Object.keys(circuit).forEach(function(k){
      var channel = toSignal(_jp, circuit[k])
      if (channel.id) {
        channel.name = k
        channel.step = ctx.step
        // expose joins and sample channels directly, but reduce folded channels into circuit
        var signal = sampleOnly || joinOnly? channel.signal : function(v, c1, c2) {
          switch (arguments.length) {
            case 1: return channel.signal(_jp.value(), v)
            case 2: return channel.signal(_jp.value(), v, c1)
            case 3: return channel.signal(_jp.value(), v, c1, c2)
          }
          return channel.signal.apply(null, [_jp.value()].concat([].slice.call(arguments)))
        }
        // channels are simply aggregated on the circuit but care must
        // be taken not to overwrite existing channels with the same name.
        // So, duplicate signals are lifted, upstream, into the existing channel.
        if (!channels[k]) {
          channels[k] = channel.feed(fold(k)).fail(ctx.fail)
          signals[k] = _jp.signal[k] = signal
          Object.keys(channel.signal).forEach(function(k) {
            if (typeof channel.signal[k] === 'function') signal[k] = channel.signal[k]
          })
        }
        else {
          channels[k].map(signal)
        }
      }
      // channel is just a signal identity and is only useful as a passive channel.
      else if (joinOnly) {
        channel = {name: k, value: channel().value}
      }
      joinPoints.push(channel)
    })

    function fold(signal) {
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
        ctx.next(sampleOnly? ctx.sv || _jp.value() : jv, signal)
      }
    }

    _jp.signals = signals
    _jp.channels = channels

    // filter out sampled signals at this step
    return function(v) {
      if (sampleOnly) ctx.sv = v
      else ctx.next(v)
    }
  }
}

// Circuit API

// signal().fold : ({A}) -> Channel A
//
// fold 1 or more input signals into 1 output signal
// The output signal value will be the latest input signal value
//
// example:
//    fold({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> 20
//
//    signalA.input(10)
//    signalB.input(20)
//
function fold(circuit) {
  return this.bind(joinPoint(false, false, circuit))
}


// circuit().join : ({A}) -> Channel {A}
//
// Join 1 or more input signals into 1 output signal
// - input signal values will be mapped onto output signal channels
// - duplicate channels will be folded
//
// example:
//    join({
//      A: signalA
//      B: signalB
//    }).tap(log) // -> {A: 10, B, 20}
//
//    signalA.signal(10)
//    signalB.signal(20)
//
function join(circuit) {
  return this.bind(joinPoint(false, true, circuit))
}


// circuit(A).sample : ({Channel B}) -> Channel {A}
//
// Hold signal propagation until sample input signal(s) raised
//
// example:
//    circuit = new Circuit().sample({
//      A: channelA
//      B: channelB
//    }).tap(log) // -> undefined, true, true
//
//    circuit.signal(true)
//    channelA.signal(true)
//    channelB.signal(true)
//
function sample(circuit) {
  return this.bind(joinPoint(true, false, circuit))
}

// Construct a new circuit builder
function Circuit(cct) {

  // a circuit is a channel with join points
  var circuit = new Channel().import(function(sig){
    return {
      circuit: join,
      join: join,
      fold: fold,
      sample: sample,
      pure: Pure(diff),
      overlay: overlay(sig),
      prime: prime(sig),
      setState: setState(sig),
      getState: getState(sig)
    }
  })

  return {
    circuit: function(cct) {return primeInput(circuit.channel().join(cct))},
    join: function(cct) {return circuit.channel().join(cct)},
    fold: function(cct) {return circuit.channel().fold(cct)},
    sample: function(cct) {return circuit.channel().sample(cct)},
    channel: circuit.channel,
    import: circuit.import,
    bind: circuit.bind
  }
}

export default Circuit
