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
      var s = this.next(), b = []
      return this.lift(function(v){
        b.push(v)
        if (b.length === w) {
          s.value([].slice.call(b))
          b.length = 0
        }
      })
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
      return f.call(null,this)
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

    match: function(fn,args){
      var wc, mask = args[0]
      if (mask && (args.length>1 || typeof mask !== 'object')) {
        mask = [].slice.call(args).reduce(function(m,a){
          m[a]=true
          return m
        },{})
      }
      function match(v) {
        var m = mask || v
        var r,o = {}

        function memo(w,wv) {
          w.forEach(function(k){
            if (wc[k] === undefined){
              if (v[k] !== undefined) wc[k] = wv === undefined? m[k] : wv
              else if (k==='*') {
                memo(Object.keys(v), m[k])
              }
              else if (k[0]==='*') {
                var wk = k.substr(1)
                memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), m[k])
              }
              else if (k[k.length-1]==='*') {
                var wk = k.substr(0,k.length-1)
                memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)===0}), m[k])
              }
            }
          })
        }

        if (!wc) {
          wc = {}
          memo(Object.keys(m))
        }

        Object.keys(wc).forEach(function(k){
          var e = fn(v[k],wc[k])
          if (e) o[k] = e === circus.FALSE? v[k] : e === circus.UNDEFINED? undefined : e
          r = r || e
        })
        return r? o : circus.FALSE
      }
      return this.map(match)
    },

    and: function(){
      function and(v,m) {
        return (m === v && v) || (m===true && v) || (m===false && !v && circus.FALSE)
      }
      return this.match(and,arguments)
    },

    or: function(){
      function or(v,m) {
        return v || m
      }
      return this.match(or,arguments)
    },

    xor: function(){
      function xor(v,m) {
        return (!m && v) || (!v && m) || (!v && circus.UNDEFINED)
      }
      return this.match(xor,arguments)
    }

  })
})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Composables;
else if (typeof define == "function" && define.amd) define(function() {return Composables});

