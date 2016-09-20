import Signal from './signal'
import _Pure from './pure'

'use strict'

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

function toSignal(app,s) {
  if (!s || !s.isSignal) {
    var v = s, fmap = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fmap==='map') s = function() {return v}
    s = app.signal()[fmap](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel input / outputs
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
  return function prime(v, c) {
    s = c || s
    if (typeof v === 'object' && s.channels) {
      Object.keys(v).filter(function(k) {
        return s.channels[k]
      }).forEach(function(k) {
        s.channels[k].prime(v[k])
      })
    }
    return _prime(v)
  }
}

function joinPoint(sampleOnly, joinOnly, circuit) {
  var _jp = this.asSignal();
  var channels=_jp.channels || {}, signals = []
  Object.keys(circuit).forEach(function(k){
    var signal = toSignal(_jp,circuit[k])
    if (signal.id) {
      signal.name = k
      // bind each joining signal to the context value
      signal.bind(function(next, v, ctx) {
        ctx[_jp.name || 'value'] = _jp.value()
        return next.call(_jp,v,ctx)
      })
      // is channel syntax really that bad?
      if (process.env.NODE_ENV==='development') {
        if (_jp[k] && !_jp[k].isSignal) throw new Error('channel name cannot use signal verb - ' + k)
      }
      // channels are simply aggregated as circuit inputs but care must be
      // taken not to overwrite channels with the same name. Duplicates are
      // lifted into the existing channel and cannot directly feed the circuit.
      if (!channels[k]) {
        _jp[k] = signal
        channels[k] = signal
        signal.feed(merge(k)).fail(_jp.input)
      }
      else {
        channels[k].map(signal)
      }
    }
    // signal is an identity
    else {
      signal = {name: k, value:signal().value}
    }

    signals.push(signal)

  })

  var step = _jp.step()
  function merge(channel) {
    return function(v) {
      var jv = joinOnly && signals.reduce(function(jv, s) {
        jv[s.name] = s.value()
        return jv
      }, {}) || v
      step({key: channel, value: sampleOnly? sv : jv})
    }
  }

  // bind the channel key into ctx
  _jp.bind(function(next, v, ctx) {
    ctx.channel =  v && v.key || _jp.name
    return next(v && v.hasOwnProperty('value')? v.value : v, ctx)
  })

  // expose the channel in circuit form (can be flatmap'd later if required)
  _jp.channels = channels

  // halt sampled signals at this step
  var sv
  return _jp.filter(function(v){
    sv = v
    return !sampleOnly
  })
}

// Join 1 or more input signals into 1 output signal
// Input signals will be mapped onto output signal channels
// - duplicate channels will be merged
function join(c) {
  return joinPoint.call(this,false,true,c)
}

// Merge 1 or more input signals into 1 output signal
// The output signal value will be the latest input signal value
function merge(c) {
  return joinPoint.call(this,false,false,c)
}

// Sample input signal(s)
function sample(c) {
  return joinPoint.call(this,true,false,c)
}

function Circuit() {

  // a circuit is a signal with join points
  var _this = new Signal().extend(function(signal){
    return {
      join: join,
      merge: merge,
      sample: sample,
      prime: prime(signal),
      overlay: overlay(signal)
    }
  })

  // override to filter out this - Circuit().join returns a new circuit
  _this.asSignal = function(s) {
    return s && s.isSignal && s !== _this ? s : _this.signal(s)
  }

  var args = [].slice.call(arguments).forEach(function(module) {
    _this.extend(module)
  })

  return _this
}

var Pure = _Pure(diff)

export {Pure}
export default Circuit
