var circusLogic = (function(circus){

  'use strict';

  circus = circus || require('circus')

  circus.signal.extendBy({
    // Apply a matcher function with optional mask to signal or block channel values.
    // By default, the signal is blocked if any channels are blocked
    // Output is taken from masked channels [default all]
    //
    // arguments:
    //  mask = object of channel matching key/values - supports wildcards
    //    key = 'n'  - match on channel 'n'
    //          '*n' - match on all remaining channels ending with 'n'
    //          'n*' - match on all remaining channels starting with 'n'
    //          '*'  - match on all remaining channels
    //
    //    value = true  - match if truthy
    //            value - match if equal (===)
    //            false - match if falsey
    //            undefined - match any
    //
    //    default: undefined
    //
    //  fn = function that takes a channel value and a mask value and returns either of:
    //    truthy value - signal the value
    //    falsey value - block the value
    //
    //    default: return !mask? c!==undefined : c===m || c && m===true || !c && m===false
    //
    //  all = the signal is blocked if all channels are blocked
    //  not = take all channels not in mask
    //
    // match is the core logic function upon which all other (dedicated) logic functions
    // are based. Use this function as the basis for custom logic steps. Review Dedicated
    // logic steps for details.
    //
    match: function(args, fn, all, not){
      if (typeof args === 'function') {
        all = fn
        fn = args
        args = false
      }
      if (!args || !args.hasOwnProperty('length')) {
        args = [args]
      }
      var wcMask, mask = args[0], vMatch={}, iMatch={}, dateKey = new Date().getTime()
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=vMatch
          return m
        },{})
      }

      function memo(keys,v,m,wv,invert) {
        keys.forEach(function(k){
          if (wcMask[k] === undefined){
            if (k==='*') {
              memo(Object.keys(v), v, m, m[k])
            }
            else if (k[0]==='*') {
              var wk = k.substr(1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), v, m, m[k])
            }
            else if (k[k.length-1]==='*') {
              var wk = k.substr(0,k.length-1)
              memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)===0}), v, m, m[k])
            }
            else wcMask[k] = wv === undefined? m===v? vMatch : m[k] : wv
          }
        })
        if (invert && typeof v === 'object') {
          Object.keys(v).forEach(function(k){
            if (!wcMask.hasOwnProperty(k)) {
              wcMask[k] = iMatch
            }
          })
        }
        return keys.length
      }

      fn = fn || function(v,m) {
        return !mask? v!==undefined : v===m || v && m===true || !v && m===false
      }

      function match(v) {
        var m = mask || v
        if (!wcMask) {
          wcMask = {}
          if (circus.typeOf(m)!==circus.typeOf.OBJECT || !memo(Object.keys(m),v, m,undefined,not)) {
            wcMask[dateKey] = v
          }
        }

        var passThru = all, obj = {}
        Object.keys(wcMask).forEach(function(k){
          var mk = v && v.hasOwnProperty(k)? k:undefined
          var vv = mk? v[k] : v
          var take = wcMask[k]===undefined
          var im = not && wcMask[k]===iMatch
          var mv = (wcMask[k]===vMatch || im)? vv : wcMask[k]
          var e = take || fn(vv,mv,mk)
          if (e && !not || im) {
            obj[k] = (e===true || im)? vv : e === circus.UNDEFINED? undefined : e
          }
          passThru = all? passThru && (e || im) : passThru || e
        })
        return passThru? obj.hasOwnProperty(dateKey)? obj[dateKey] : Object.keys(obj).length? obj : circus.UNDEFINED : undefined
      }
      return this.map(match)
    },

    // default: signal all or block
    and: function(){
      function and(v,m) {
        return v && m === v || v && m===true || !v && m===false
      }
      return this.match(arguments, and, true)
    },

    // default: dropped value - mask on state
    or: function(){
      var ctx = this, mos = !arguments.length
      function or(v, m, k) {
        if (mos) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v || m
      }
      return this.match(arguments, or)
    },

    // default: detect change - mask on state
    xor: function(){
      var ctx = this, mos = !arguments.length
      function xor(v,m,k) {
        if (mos) {
          m = ctx.value()
          if (k && m) m = m[k]
        }
        return v && m!==v || !v && m
      }
      return this.match(arguments, xor)
    },

    // default: exclude truthy values
    not: function(){
      function not(v,m) {
        return m && v !== m || !v
      }
      return this.match(arguments, not,true,true)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusComposables;
else if (typeof define == "function" && define.amd) define(function() {return circusComposables});

