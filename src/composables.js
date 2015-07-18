var circusComposables = (function(circus){

  'use strict';

  circus = circus || require('circus')

  var type = {}.toString

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
        if (type.call(v) === '[object Array]') {
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
      var args = [].slice.call(arguments)
      return this.map(function(v) {
        return args.length===1 && circus.lens(v,args[0]) || args.reduce(function(r,key){
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
      f.call(null,this)
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
    // 
    // arguments:
    //  mask = object of channel matching key/values with wildcard
    //    key = 'n'  - match on channel 'n'
    //          '*n' - match on all remaining channels ending with 'n'
    //          'n*' - match on all remaining channels starting with 'n'
    //          '*'  - match on all remaining channels
    //
    //    value = true  - signal channel value if truthy
    //            value - signal channel value if equal 
    //            false - signal channel value if falsey
    //            
    //  fn = function that takes a channel value and a mask value and returns one of:
    //    truthy value     - signal return value
    //    circus.TRUE      - signal channel value
    //    true             - signal channel value
    //    circus.UNDEFINED - signal undefined
    //    falsey values    - block
    //    circus.FALSE     - block
    //    false            - block
    //    undefined        - block
    //
    //  inclusive = the signal is blocked if any channels are blocked
    //
    match: function(args, fn, inclusive){
      if (typeof args === 'function') {
        fn = args
        args = false
      }
      if (!args || !args.hasOwnProperty('length')) {
        args = [args]
      }
      var wcMask, mask = args[0], vMatch={}
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=vMatch
          return m
        },{})
      }

      function memo(keys,v,m,wv) {
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
      }

      fn = fn || function(v,m) {
        return !mask? v!==undefined : v===m || v && m===true || !v && m===false
      }

      function match(v) {
        var m = mask || v
        if (!wcMask) {
          wcMask = {}
          memo(Object.keys(m),v, m)
        }

        var passThru = inclusive, obj = {}
        Object.keys(wcMask).forEach(function(k){
          var mv = wcMask[k]===vMatch? v[k] : wcMask[k]
          var e = fn(v[k],mv)
          if (e) obj[k] = e===true? v[k] : e === circus.UNDEFINED? undefined : e
          passThru = inclusive? passThru && e : passThru || e
        })
        return passThru? obj : circus.FALSE
      }
      return this.map(match)
    },

    and: function(){
      function and(v,m) {
        return v && m === v || v && m===true || !v && m===false
      }
      return this.match(arguments, and, true)
    },

    or: function(){
      function or(v,m) {
        return v || m
      }
      return this.match(arguments, or, true)
    },

    xor: function(){
      function xor(v,m) {
        return v && m!==v || !v && m
      }
      return this.match(arguments, xor)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Composables;
else if (typeof define == "function" && define.amd) define(function() {return Composables});

