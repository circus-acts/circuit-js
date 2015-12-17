var circuit = (function(circus){

  'use strict'

  circus = circus || require('circus');

  // private

  function joinPoint(ctx, sampleOnly, joinOnly, args) {

    // flatten joining signals into channels
    // - accepts and blocks out nested signals
    var signals = [].slice.call(args), ss=0;
    while (typeof signals[0] === 'string') {
      ctx[++ss==1? 'name' : 'namespace'] = signals.shift()
    }
    var channels = [], ns = (ctx.namespace? ctx.namespace + '.' : '') + ctx.name
    while (signals.length) {
      var cblock = signals.shift()
      if (!circus.isSignal(cblock)) {
        Object.keys(cblock).forEach(function(k,i){
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

    var jv, sv, keys=[]
    var step = ctx.step(sampleOnly? undefined : circus.FALSE)
    function merge(i) {
      var active, key = keys[i] = channels[i].name || i
      return function(v) {
        active=true
        if (joinOnly || sampleOnly) {
          var nv = {} // dirty by default
          for (var c=0, l=channels.length; c<l; c++) {
            var s = channels[c]
            nv[keys[c]] = jv? jv[keys[c]] : s.value()
            active = active && s.active()
          }
          jv = nv
          jv[key] = v
        }
        else {
          jv = v
        }

        if (active) {
          step(sampleOnly? sv : jv)
        }
      }
    }

    for (var i=0, l = channels.length; i<l; i++) {
      // merge incoming signals into join point
      channels[i].after(merge(i))
    }

    ctx.channels = channels

    return sampleOnly? ctx.map(function(){}).after(function(v){sv=v}) : ctx
  }

  // public

  // Join 2 or more input signals into 1 output signal
  // Input signal values will be preserved as output channels
  // Duplicate channels will be merged
  // The output signal will be active when all of the input signals are active
  circus.join = function(){
    return joinPoint(circus.isSignal(this)? this : circus.signal(),false,true,arguments)
  }

  // Merge 2 or more input signal values into 1 output signal
  // The output signal value will be the latest input signal value
  // The output signal will be active when any of the input signals are active
  circus.merge = function(){
    return joinPoint(circus.isSignal(this)? this : circus.signal(),false,false,arguments)
  }

  // Sample input signal(s)
  // The output signal will be active when all of the input signals are active
  circus.sample = function() {
    return joinPoint(circus.isSignal(this)? this : circus.signal(),true,false,arguments)
  }

  circus.signal.extendBy({
    join: circus.join,
    merge: circus.merge,
    sample: circus.sample
  })

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circuit;
else if (typeof define == "function" && define.amd) define(function() {return circuit});

