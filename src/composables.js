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
      var s = this.signal(), b = []
      this.lift(function(v){
        b.push(v)
        if (b.length === w) {
          s.value([].slice.call(b))
          b.length = 0
        }
      })
      return s
    },

    // Remove undefined values from the signal
    compact: function(){
      return this.map(function(v){
        return v || circus.FALSE
      })
    },

    chain: function(f) {
      return f.call(null,this)
    },

    filter: function(f) {
      return this.map(function (v) {
        return f(v)? v: circus.FALSE
      })
    },

    flatten: function(f) {
      var s = this.signal()
      function flatten(v) {
        if (type.call(v) === '[object Array]') {
          v.forEach(flatten)
        }
        else {
          if (f) s.value(f(v))
          else s.value(v)
        }
      }
      this.lift(flatten)
      return s
    },

    maybe: function(f,n) {
      return this.map(function(v){
        return f(v)? {just:v} : {nothing:n}
      })
    },

    // streamlined map
    pluck: function() {
      var s = this.signal(), args = [].slice.call(arguments)
      this.lift(function(v) {
        var r = {}
        args.forEach(function(key){
          r[key] = circus.lens(v,key)
        })
        s.value(r)
      })
      return s
    },

    // named (projected) pluck
    project: function() {
      var s = this.signal(), args = [].slice.call(arguments)
      this.lift(function(v) {
        var r = {}
        args.forEach(function(arg){
          Object.keys(arg).forEach(function(key){
            r[key] = circus.lens(v,arg[key])
          })
        })
        s.value(r)
      })
      return s
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
      var s = this.signal(), b = []
      this.lift(function(v){
        b.push(v)
        if (--w <= 0) {
          s.value([].slice.call(b))
          b.shift()
        }
      })
      return s
    },

    zip: function() {
      var s = this.signal(), args = [].slice.call(arguments)
      var keys = args.length && args || [0,1]
      var fn = keys.pop()
      if (typeof fn !== 'function') {
        keys.push(fn)
        fn = function(v) {
          return keys.map(function(k){
            return v[k]
          })
        }
      }
      this.lift(function(v){
        s.value(fn(v))
      })
      return s
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Composables;
else if (typeof define == "function" && define.amd) define(function() {return Composables});

