var circusComposables = (function(circus){

  'use strict';

  circus = circus || require('circus')

  circus.signal.extendBy({
    // A steady state signal
    always: function(v){
      return this.map(function(){
        return v
      })
    },

    // Batch values into chunks of size w
    batch: function(w) {
      var b = [], batch = function(v){
        b.push(v)
        if (b.length === w) {
          v = b, b = []
          return v
        }
        return circus.FALSE
      }
      return this.map(batch)
    },

    // Remove undefined values from the signal
    compact: function(){
      return this.map(function(v){
        return v || circus.FALSE
      })
    },

    flatten: function(f) {
      var s = this.next()
      function flatten(v) {
        if (circus.typeOf(v) === circus.typeOf.ARRAY) {
          v.forEach(flatten)
        }
        else {
          if (f) s.value(f(v))
          else s.value(v)
        }
      }
      return this.lift(flatten)
    },

    maybe: function(f,n) {
      return this.map(function(v){
        return f(v)? {just:v} : {nothing:n || true}
      })
    },

    // streamlined map
    pluck: function() {
      var args = [].slice.call(arguments), a0 = args[0]
      return this.map(function(v) {
        return args.length===1 && (v[a0] || circus.lens(v,a0)) || args.reduce(function(r,key){
          r[key] = circus.lens(v,key)
          return r
        },{})
      })
    },

    // named (projected) pluck
    project: function() {
      var args = [].slice.call(arguments)
      return this.map(function(v) {
        var r = {}
        return args.reduce(function(r,arg){
          Object.keys(arg).forEach(function(key){
            r[key] = circus.lens(v,arg[key])
          })
          return r
        },{})
      })
    },

    // continuously reduce incoming signal values into 
    // an accumulated outgoing value 
    reduce: function(f,accum) {
      return this.map(function(){
        if (!accum) {
          accum = this.value()
        }
        else {
          var args = [accum].concat([].slice.call(arguments))
          accum = f.apply(null,args)
        }
        return accum
      })
    },

    // Skip the first n values from the signal
    // The signal will not propagate until n + 1
    skip: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? circus.FALSE : v
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? v: circus.FALSE
      })
    },

    // Chainable context
    then: function(f) {
      f.call(this.step(),this)
      return this
    },

    // Batch values into sliding window of size w
    window: function(w) {
      var b = [], fn = function(v){
        b.push(v)
        if (--w < 0) {
          b.shift()
          return b
        }
      }
      return this.map(fn)
    },

    // Zip signal channel values into a true array. 
    zip: function(keys) {
      keys = keys || [0,1]
      var fn = function(v) {
        return keys.map(function(k){
          return v[k]
        })
      }
      return this.map(fn)
    },

    // filters

    filter: function(f) {
      return this.map(function (v) {
        return f(v)? v: circus.FALSE
      })
    },

    // Apply a matcher function with optional mask to signal or block channel values.
    // The signal is blocked if all the channels are blocked
    // Output is taken from masked channels [default all]
    // 
    // arguments:
    //  mask = object of channel matching key/values - supports wildcards
    //    key = 'n'  - match on channel 'n'
    //          '*n' - match on all remaining channels ending with 'n'
    //          'n*' - match on all remaining channels starting with 'n'
    //          '*'  - match on all remaining channels
    //
    //    value = true  - truthy test
    //            value - equality test 
    //            false - falsey test
    //            undefined - ignore
    //            
    //  fn = function that takes a channel value and a mask value and returns either of:
    //    truthy value     - signal the value
    //    falsey value     - block the value
    //
    //  all = the signal is blocked if all channels are blocked
    //  invert = take all channels not in mask
    //
    match: function(args, fn, all, invert){
      if (typeof args === 'function') {
        all = fn
        fn = args
        args = false
      }
      if (!args || !args.hasOwnProperty('length')) {
        args = [args]
      }
      var wcMask, mask = args[0], vMatch={}, iMatch={}, dkey = new Date().getTime()
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=vMatch
          return m
        },{})
      }

      function memo(keys,v,m,wv,inv) {
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
        if (inv && typeof v === 'object') {
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
          if (circus.typeOf(m)!==circus.typeOf.OBJECT || !memo(Object.keys(m),v, m,undefined,invert)) {
            wcMask[dkey] = v
          }
        }

        var passThru = all, obj = {}
        Object.keys(wcMask).forEach(function(k){
          var vv = v && v.hasOwnProperty(k)? v[k] : v
          var take = wcMask[k]===undefined
          var im = invert && wcMask[k]===iMatch
          var mv = (wcMask[k]===vMatch || im)? vv : wcMask[k]
          var e = take || fn(vv,mv)
          if (e && !invert || im) {
            obj[k] = (e===true || im)? vv : e === circus.UNDEFINED? undefined : e
          }
          passThru = all? passThru && (e || im) : passThru || e
        })
        return passThru? obj.hasOwnProperty(dkey)? obj[dkey] : Object.keys(obj).length? obj : circus.UNDEFINED : circus.FALSE
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

    // default: dropped value - needs to store previous value
    or: function(){
      var store = !arguments.length, pv
      function or(v,m) {
        if (store) {
          m = pv, pv = v
        }
        return v || m
      }
      return this.match(arguments, or)
    },

    // default: detect change - needs to store previous value
    xor: function(){
      var store = !arguments.length, pv
      function xor(v,m) {
        if (store) {
          m = pv, pv = v
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

