var circuit = (function(circus){

  'use strict'

  circus = circus || require('circus');

  // private

  function joinPoint(sampleOnly, joinOnly, args) {

    var ctx = circus.isSignal(this)? this: (this || circus).signal()
    var signals = [].slice.call(args), ss=0, any=true;
    while (typeof signals[0] === 'string') {
      ctx[++ss==1? 'name' : 'namespace'] = signals.shift()
    }

    var _super = ctx.prime
    ctx.prime = function(pv) {
      _super(pv)
      circus.tap(this, function(s,v){
        s.prime(v)
      },pv)
      return ctx
    }

    // flatten joining signals into channels
    // - accepts and blocks out nested signals
    var channels = [], ns = (ctx.namespace? ctx.namespace + '.' : '') + ctx.name
    while (signals.length) {
      var cblock = signals.shift()
      if (!circus.isSignal(cblock)) {
        if (typeof cblock === 'boolean') {
          any = !cblock
        }
        else Object.keys(cblock).forEach(function(k,i){
          var s = cblock[k]
          if (!circus.isSignal(s)) {
            s = circus.join(k,ns,s)
          }
          s.parent = ctx
          s.name = s.name || k
          s.namespace = ns
          channels.push(s)
        })
      }
      else {
        channels.push(cblock)
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
          step(sampleOnly? ctx.value() : jv)
        }
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals into join point - after state change
      channels[i].after(merge(i))
    }

    ctx.channels = channels

    // sampled values are halted awaiting sampling
    return sampleOnly? ctx.map(function(){}) : ctx
  }

  // public

  // Join 2 or more input signals into 1 output signal
  // Input signal values will be preserved as output channels
  // Duplicate channels will be merged
  // The output signal will be active when any of the input signals are active
  // if the last signal is boolean true
  //  The output signal will be active when all of the input signals are active
  circus.join = function(){
    return joinPoint.call(this,false,true,arguments)
  }

  // Merge 2 or more input signal values into 1 output signal
  // The output signal value will be the latest input signal value
  // The output signal will be active when any of the input signals are active
  // if the last signal is boolean true
  //  The output signal will be active when all of the input signals are active
  circus.merge = function(){
    return joinPoint.call(this,false,false,arguments)
  }

  // Sample input signal(s)
  // The output signal will be active when all of the input signals are active
  circus.sample = function() {
    return joinPoint.call(this,true,false,arguments)
  }

  circus.extend({
    join: circus.join,
    merge: circus.merge,
    sample: circus.sample
  },true)

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circuit;
else if (typeof define == "function" && define.amd) define(function() {return circuit});

