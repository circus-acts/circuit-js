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
      var args = [].slice.call(arguments)
      return this.map(function(v) {
        return args.reduce(function(r,key){
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
      var fn = function(v) {
        return keys.map(function(k){
          return v[k]
        })
      }
      return this.map(fn)
    },

    // filters

    match: function(fn,mask){
      function match(v) {
        var m = mask || v
        var r,o = {}
        Object.keys(m).forEach(function(k){
          var e = fn(v[k],m[k])
          if (e) o[k] = e === circus.FALSE? v[k] : e === circus.UNDEFINED? undefined : e
          r = r || e
        })
        return r? o : circus.FALSE
      }
      return this.map(match)
    },

    and: function(mask){
      function and(v,m) {
        return (m === v && v) || (m===true && v) || (m===false && !v && circus.FALSE)
      }
      return this.match(and,mask)
    },

    or: function(mask){
      function or(v,m) {
        return v || m
      }
      return this.match(or,mask)
    },

    xor: function(mask){
      function xor(v,m) {
        return (!m && v) || (!v && m) || (!v && circus.UNDEFINED)
      }
      return this.match(xor,mask)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Composables;
else if (typeof define == "function" && define.amd) define(function() {return Composables});

