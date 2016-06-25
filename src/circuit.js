import Circus from './circus'
import Events from './events'
import AppState from './signal'

'use strict'

function sdiff(v1,v2,isJoin) {
  if (!isJoin || v2 === undefined) return v1 !== v2
  for(var i=0, k=Object.keys(v1); i< k.length; i++) {
    if (v1[k[i]]!==v2[k[i]]) return true
  }
  return false
}

function toSignal(app,s) {
  if (s===Circus.UNDEFINED) s = function(v) {return v}
  if (!Circus.isSignal(s)) {
    var v = s, fn = typeof s === 'object' ? 'join' : 'map'
    if (typeof s !== 'function' && fn==='map') s = function() {return v}
    s = app.signal()[fn](s)
  }
  return s
}

// overlay circuit behaviour aligned on channel input / outputs
function overlay(ctx) {
  return function recurse(g,c) {
    c = c || ctx
    Object.keys(g).forEach(function(k) {
      var oo = typeof g[k] !=='function' && g[k].length? g[k] : [null,g[k]]
      for (var i=0; i<2; i++) {
        var o = oo[i]
        if (Circus.isSignal(o) || typeof o === 'function') {
          var s = c.channels[k] || c.channels[Object.keys(c.channels).find(function(ck){return c.channels[ck].output.name===k})].output
          s.map(i && o || Circus.before(o))
        }
        else if (o) recurse(o,c.channels[k])
      }
    })
    return this
  }
}

function prime(ctx) {
  var _prime = ctx.prime.bind(ctx)
  return function prime(v) {
    var _this = this
    if (typeof v === 'object' && _this.channels) {
      Object.keys(v).filter(function(k) {
        return _this.channels[k]
      }).forEach(function(k) {
        _this.channels[k].prime(v[k])
      })
    }
    return _prime(v)
  }
}

function Circuit() {

  var extensions = []
  var _this = this

  var Signal = new AppState(new Events(this))

  function joinPoint(sampleOnly, joinOnly, args) {
    var ctx = this.asSignal().pure(sampleOnly? false : sdiff)
    ctx.isJoin = joinOnly

    var signals = [].slice.call(args)
    if (typeof signals[0] === 'string') {
      ctx.name(signals.shift())
    }

    // flatten joining signals into channels
    // - accepts and blocks out nested signals into circuit
    var circuit=ctx.channels || {}, channels = [], cIdx=0
    var keys=[]
    while (signals.length) {
      var signal = signals.shift()
      if (!Circus.isSignal(signal)) {
        Object.keys(signal).forEach(function(k,i){
          var output = toSignal(_this,signal[k]), input = output
          if (output.id) {
            output.name = output.name || k
            input = output.channel(Circus.before)
            input.name = k

            // bind each joining signal to the context value
            output.bind(function(f,args) {
              return f.apply(output,args.concat(ctx.value()))
            })

            // for overlays
            input.output = output
          }
          else {
            input = {value:output().value}
            keys[i] = k
          }
          circuit[k] = input
          channels.push(input)
        })
      }
      else {
        channels.push(signal)
        circuit[signal.name || cIdx++] = signal
      }
    }

    var step = ctx.step()
    function merge(i) {
      var key = keys[i] = channels[i].name || i
      return function(v) {
        var jv = {}
        // matches and fails bubble up
        if ((joinOnly || sampleOnly) && !(v instanceof Circus.fail)) {
          for (var c=0, l=channels.length; c<l; c++) {
            var s = channels[c]
            jv[keys[c]] = s.value()
          }
        }
        else jv = v
        step(sampleOnly? ctx.value() : jv)
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals or values into join point
      var channel = channels[i]
      if (channel.finally) {
        channel.finally(merge(i))
      }

      if (process.env.NODE_ENV==='development') {
        channels[i].$jp = channels[i].$jp || []
        channels[i].$jp.push(ctx)
      }
    }

    // hide the channel array but expose as circuit
    ctx.channels = circuit

    return ctx.map(function(v){return sampleOnly? undefined : v})
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
  this.join = function() {
    return joinPoint.call(this,false,true,arguments)
  }

  // Merge 1 or more input signals into 1 output signal
  // The output signal value will be the latest input signal value
  this.merge = function() {
    return joinPoint.call(this,false,false,arguments)
  }

  // Sample input signal(s)
  this.sample = function() {
    return joinPoint.call(this,true,false,arguments)
  }

  this.extend = function(ext){
    extensions.push(ext)
    if (typeof ext!=='function') {
      return Circus.extend(this,ext)
    }
  }

  this.extend({
      join: _this.join,
      merge: _this.merge,
      sample: _this.sample
  })

  this.extend(function(ctx){
    return {
      prime: prime(ctx),
      overlay: overlay(ctx)
    }
  })

  var args = [].slice.call(arguments).forEach(function(module) {
    module(_this)
  })

}

export default Circuit
