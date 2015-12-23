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
      }
      return this.map(batch)
    },

    // Remove undefined values from the signal
    compact: function(){
      return this.map(function(v){
        return v || circus.FALSE
      })
    },

    debounce: function(t){
      var dbid
      return this.map(function(v, next){
        if (!dbid) {
          dbid = setTimeout(function(){
            dbid=false
            next(v)
          },t||0)
        }
      })
    },

    filter: function(f) {
      return this.map(function (v) {
        return f(v)? v: circus.FALSE
      })
    },

    flatten: function(f) {
      var s = this.step()
      function flatten(v) {
        if (circus.typeOf(v) === circus.typeOf.ARRAY) {
          v.forEach(flatten)
        }
        else {
          s(f? f(v) : v)
        }
        return circus.FALSE
      }
      return this.map(flatten)
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
      return this.map(function(v){
        if (!accum) {
          accum = v
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
      var kl = keys.length, i=-1
      var fn = function(v) {
        return ++i % kl === 0 ? keys.map(function(k){
          return v[k]
        }) : circus.FALSE
      }
      return this.map(fn)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusComposables;
else if (typeof define == "function" && define.amd) define(function() {return circusComposables});

