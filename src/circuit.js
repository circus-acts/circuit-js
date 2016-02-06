var Circuit = (function(Circus){

  'use strict'

  Circus = Circus || require('./circus');
  // private

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

  function functor(app,s) {
    if (!Circus.isSignal(s)) {
      var v = s, fn = typeof s === 'object' ? 'join' : 'map'
      if (typeof s !== 'function' && fn==='map') s = function() {return v}
      s = app.signal()[fn](s)
    }
    return s.pure(false)
  }

  function JoinPoint(app) {return function(sampleOnly, joinOnly, args) {

    var ctx = this.asSignal()
    var signals = [].slice.call(args), any=true;
    if (typeof signals[0] === 'string') {
      ctx.name = signals.shift()
    }

    // flatten joining signals into channels
    // - accepts and blocks out nested signals into circuit
    var circuit={}, channels = [], cIdx=0
    while (signals.length) {
      var cblock = signals.shift()
      if (!Circus.isSignal(cblock)) {
        if (typeof cblock === 'boolean') {
          any = !cblock
        }
        else Object.keys(cblock).forEach(function(k){
          var s = functor(app,cblock[k])
          s.name = s.name || k
          var marker = sampleOnly? s : app.signal(s.name).finally(s)
          marker.channels = s.channels; s.channnels = undefined
          marker.prime = s.prime
          circuit[k] = marker

          s.functor = function(f,v) {
            return f.call(s,v,ctx.value())
          }
          channels.push(s)
        })
      }
      else {
        channels.push(cblock)
        circuit[cblock.name || cIdx++] = cblock
      }
    }

    var jv, keys=[]
    var step = ctx.step(!sampleOnly)
    function merge(i) {
      var active, key = keys[i] = channels[i].name || i
      return function(v) {
        active=!any
        if (joinOnly || sampleOnly) {
          jv = {} // dirty by default
          for (var c=0, l=channels.length; c<l; c++) {
            var s = channels[c]
            jv[keys[c]] = s.value()
            active = any? active || s.active() : active && s.active()
          }
          jv[key] = v
        }
        else {
          active = channels[i].active()
          jv = v
        }

        if (active) {
          step(sampleOnly? ctx.value() : jv, sampleOnly)
        }
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals into join point - but after channel state change
      channels[i].after(merge(i))
    }

    // hide the channel array but expose as circuit
    ctx.channels = circuit

    // sampled values are halted awaiting sampling
    return sampleOnly? ctx.map(function(){}) : ctx
  }}

  function Circuit(seed) {

    var app = new Circus()
    var joinPoint = new JoinPoint(app)

    function value(ctx,op) {
      var _op = ctx[op]
      return function(v,impure) {
        var args = [].slice.call(arguments)
        if (v===Circus.ID && op==='value') {
          v=_op() || seed
          args.unshift()
          args.shift(v)
          seed = undefined
        }
        if (typeof v === 'object' && ctx.channels) {
          Object.keys(v).filter(function(k) {
            return ctx.channels[k]
          }).forEach(function(k) {
            ctx.channels[k][op](v[k],impure)
          })
        }
        return _op.apply(ctx,args)
      }
    }

    // Fold incoming signal values into circuit state.
    // - this is the only state input after seed.
    app.fold = function(f,a) {
      var s = this.asSignal()
      return s.map(function(v){
        var state = circuit.value()
        circuit.value(rest(state,f(state,v)))
        return v
      },a)
    }

    app.getState = function() {
      return circuit.value()
    }

    // Join 1 or more input signals into 1 output signal
    // Input signal channels will be mapped onto output signal keys
    // - duplicate channels will be merged
    // The output signal will be active when:
    // - ANY input signals are active: default
    // - ALL input signals are active: last argument is boolean true
    app.join = function() {
      return joinPoint.call(this,false,true,arguments)
    }

    // Merge 1 or more input signals into 1 output signal
    // The output signal value will be the latest input signal value
    // The output signal will be active when:
    // - ANY input signals are active: default
    // - ALL input signals are active: last argument is boolean true
    app.merge = function() {
      return joinPoint.call(this,false,false,arguments)
    }

    // Sample input signal(s)
    // The output signal will be active when:
    // - ANY input signals are active: default
    // - ALL input signals are active: last argument is boolean true
    app.sample = function() {
      return joinPoint.call(this,true,false,arguments)
    }

    // public

    app.extend({
      join: app.join,
      merge: app.merge,
      sample: app.sample,
      fold: app.fold
    })

    app.extend(function(ctx){
      return {
        value: value(ctx, 'value'),
        prime: value(ctx, 'prime')
      }
    })

    var circuit = app.signal().prime(seed)

    return app
  }

  return rest(Circuit, Circus)

})(typeof Circus==='undefined'? undefined : Circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Circuit;
else if (typeof define == "function" && define.amd) define(function() {return Circuit});
