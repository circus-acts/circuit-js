import Circus from './circus'
import Events from './events'
import SignalContext from './signal'
import {pure as _pure} from './utils'

'use strict'

function sdiff(v1,v2) {
  // keep open until first signal
  if (v1 === undefined || v2 === undefined) return true
  if (typeof v1 !== typeof v2) return true
  if (v1.length !== v2.length) return true
  for(var i=0, k=Object.keys(v1); i< k.length; i++) {
    if (v1[k[i]] !== v2[k[i]]) return true
  }
  return false
}

function toSignal(app,s) {
  if (s===Circus.UNDEFINED) s = function() {return Circus.UNDEFINED}
  if (!Circus.isSignal(s)) {
    var v = s, fmap = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fmap==='map') s = function() {return v}
    s = app.signal()[fmap](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel input / outputs
function overlay(ctx) {
  return function recurse (g, c) {
    c = c || ctx
    Object.keys(g).forEach(function(k) {
      var o = g[k]
      if (Circus.isSignal(o) || typeof o === 'function') {
        // use apply here
        c.channels[k].map(o)
      }
      else if (o) recurse(o,c.channels[k])

    })
    return this
  }
}

function prime(ctx) {
  var _prime = ctx.prime.bind(ctx)
  return function prime(v) {
    if (typeof v === 'object' && ctx.channels) {
      Object.keys(v).filter(function(k) {
        return ctx.channels[k]
      }).forEach(function(k) {
        ctx.channels[k].prime(v[k])
      })
    }
    return _prime(v)
  }
}

function pure(ctx) {
  return function(diff) {
    return ctx.bind(_pure(diff || sdiff))
  }
}

function Circuit() {

  var _this = this
  var Signal = new SignalContext(new Events(this))

  function joinPoint(sampleOnly, joinOnly, circuit) {
    var _jp = this.asSignal();
    var channels=_jp.channels || {}, signals = []
    Object.keys(circuit).forEach(function(k,i){
      var signal = toSignal(_this,circuit[k])
      if (signal.id) {
        signal.name = k
        // bind each joining signal to the context value
        signal.bind(function(next, v, ctx) {
          ctx[_jp.name || 'value'] = _jp.value()
          return next.call(this,v,ctx)
        })
      }
      // signal is an identity. Use this to feed the value into the jp
      else {
        signal = {name: k, value:signal().value}
      }
      signals.push(signal)

      // channels are simply aggregated as circuit inputs but care must be
      // taken not to overwrite channels with the same name. Duplicates are
      // lifted into the existing channel and cannot
      // directly feed the circuit themselves.
      if (!channels[k]) {
        channels[k] = signal
        if (signal.feed) {
          signal.feed(merge(signal.name)).fail(_jp.fail)
        }
      }
      else {
        channels[k].map(signal)
      }
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

  // public

  this.signal = Signal.create = function(name) {
    return extensions.reduce(function(s,ext){
      ext = typeof ext==='function'? ext(s) : ext
      return Circus.extend(s,ext)
    }, new Signal(name))
  }

  this.asSignal = function() {
    return this.signal()
  }

  // Join 1 or more input signals into 1 output signal
  // Input signal channels will be mapped onto output signal keys
  // - duplicate channels will be merged
  this.join = function(c) {
    return joinPoint.call(this,false,true,c)
  }

  // Merge 1 or more input signals into 1 output signal
  // The output signal value will be the latest input signal value
  this.merge = function(c) {
    return joinPoint.call(this,false,false,c)
  }

  // Sample input signal(s)
  this.sample = function(c) {
    return joinPoint.call(this,true,false,c)
  }

  var extensions = []
  this.extend = function(ext){
    extensions.push(ext)
    if (typeof ext!=='function') {
      return Circus.extend(this,ext)
    }
    return this
  }

  this.extend(function(ctx){
    return {
      join: _this.join,
      merge: _this.merge,
      sample: _this.sample,
      prime: prime(ctx),
      pure: pure(ctx),
      overlay: overlay(ctx)
    }
  })

  var args = [].slice.call(arguments).forEach(function(module) {
    module(_this)
  })

}

export default Circus.extend(Circuit,Circus)
