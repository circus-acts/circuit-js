var Circuit = (function(Circus){

  'use strict'

  Circus = Circus || require('./circus');
  // private


  function sdiff(v1,v2,isJoin) {
    if (!isJoin || v2 === undefined) return v1 !== v2
    for(var i=0, k=Object.keys(v1); i< k.length; i++) {
      if (v1[k[i]]!==v2[k[i]]) return true
    }
    return false
  }

  function rest(o1, o2) {
    // accept object or function as donor - otherwise just replace
    if (typeof o2 !== 'object' && typeof o2 !== 'function')  return o2
    for(var p in o2) {
      if (o2.hasOwnProperty(p)) {
        o1[p]=o2[p]
      }
    }
    return o1
  }

  function toSignal(app,s) {
    if (!Circus.isSignal(s)) {
      var v = s, fn = typeof s === 'object' ? 'join' : 'map'
      if (typeof s !== 'function' && fn==='map') s = function() {return v}
      s = app.signal()[fn](s)
    }
    return s
  }

  function JoinPoint(app) {return function(sampleOnly, joinOnly, args) {

    var ctx = this.asSignal().pure(sampleOnly? false : sdiff), _error=''
    ctx.isJoin = joinOnly
    ctx.error = function() {
      var error = _error
      _error = ''
      return error
    }

    var signals = [].slice.call(args)
    if (typeof signals[0] === 'string') {
      ctx.name(signals.shift())
    }

    // flatten joining signals into channels
    // - accepts and blocks out nested signals into circuit
    var circuit={}, channels = [], cIdx=0
    while (signals.length) {
      var signal = signals.shift()
      if (!Circus.isSignal(signal)) {
        Object.keys(signal).forEach(function(k){
          var output = toSignal(app,signal[k]), input = output, passive = !output.id
          if (!passive) {
            output.name = output.name || k
            if (output.before) input = output.before()
            input.name = k

            // bind each joining signal to the context value
            output.bind(function(f,args) {
              var m = f.apply(output,args.concat(ctx.value()))
              if (m.nothing) {
                _error = _error || m.nothing
                // stop
                return undefined
              }
              return m.hasOwnProperty('just')? m.just : m
            })

            // for overlays
            input.output = output
          }
          else input().name = k
          circuit[k] = input
          channels.push(input)
        })
      }
      else {
        channels.push(signal)
        circuit[signal.name || cIdx++] = signal.id()
      }
    }

    var jv, keys=[]
    var step = ctx.step(!sampleOnly)
    function merge(i) {
      var key = keys[i] = channels[i].name || i
      return function(v) {
        if (joinOnly || sampleOnly) {
          jv = {} // dirty by default
          for (var c=0, l=channels.length; c<l; c++) {
            var s = channels[c]
            jv[keys[c]] = s.value()
          }
          jv[key] = v
        }
        else jv = v
        step(sampleOnly? ctx.value() : jv, sampleOnly)
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals or values into join point
      var channel = channels[i], passive = !channel.id
      if (passive) {
        channels[i] = channel()
        keys[i] = channels[i].name
      }
      else channel.finally(merge(i),true)

      //development
      channels[i].$jp = channels[i].$jp || []
      channels[i].$jp.push(ctx)
    }

    // hide the channel array but expose as circuit
    ctx.channels = circuit

    // sampled values are halted awaiting sampling
    return sampleOnly? ctx.map(function(){}) : ctx
  }}

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
            s.map(o,!i)
          }
          else if (o) recurse(o,c.channels[k])
        }
      })
      return ctx
    }
  }

  function value(ctx,op) {
    var _op = ctx[op]
    return function(v) {
      var args = [].slice.call(arguments)
      if (typeof v === 'object' && ctx.channels) {
        Object.keys(v).filter(function(k) {
          return ctx.channels[k]
        }).forEach(function(k) {
          ctx.channels[k][op](v[k])
        })
      }
      return _op.apply(ctx,args)
    }
  }

  function Circuit() {

    var app = new Circus()
    var joinPoint = new JoinPoint(app)

    // public

    // Join 1 or more input signals into 1 output signal
    // Input signal channels will be mapped onto output signal keys
    // - duplicate channels will be merged
    app.join = function() {
      return joinPoint.call(this,false,true,arguments)
    }

    // Merge 1 or more input signals into 1 output signal
    // The output signal value will be the latest input signal value
    app.merge = function() {
      return joinPoint.call(this,false,false,arguments)
    }

    // Sample input signal(s)
    app.sample = function() {
      return joinPoint.call(this,true,false,arguments)
    }

    app.maybe = function(j,n) {
      return function(v) {
        return j.apply(this,arguments)? {just: v} : {nothing: n || true}
      }
    }

    app.extend(function(ctx){
      return {
        join: app.join,
        merge: app.merge,
        sample: app.sample,
        value: value(ctx, 'value'),
        prime: value(ctx, 'prime'),
        overlay: overlay(ctx)
      }
    })

    return app
  }

  return rest(Circuit, Circus)

})(typeof Circus==='undefined'? undefined : Circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Circuit;
else if (typeof define == "function" && define.amd) define(function() {return Circuit});
