import Circus from './'
import Utils from './utils'

'use strict';

var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

export default function Composables(app) {
  app.extend({
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

    compose: function(){
      var args = [].slice.call(arguments)
      for (var i=args.length-1; i>=0; i--) {
        this.map(args[i])
      }
      return this
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

    // Feed signal values into fanout signal(s)
    // The input signal is terminated
    feed: function() {
      var feeds = [].slice.call(arguments)
      return this.map(function(v){
        feeds.forEach(function(s){
          s.value(v)
        })
      })
    },

    filter: function(f) {
      return this.map(function (v) {
        return f(v)? v: undefined
      })
    },

    flatten: function(f) {
      return this.map(function(v,next){
        function flatten(v) {
          if (Circus.typeOf(v) === Circus.type.ARRAY) {
            v.forEach(flatten)
          }
          else {
            next(f? f(v) : v)
          }
          return undefined
        }
        return flatten(v)
      })
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
        return args.length===1 && (v[a0] || Utils.lens(v,a0)) || args.reduce(function(r,key){
          r[key] = Utils.lens(v,key)
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
            r[key] = Utils.lens(v,arg[key])
          })
          return r
        },{})
      })
    },

    // continuously fold incoming signal values into
    // an accumulated outgoing value
    fold: function(f,accum) {
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

    // signal keep:
    //  h == 0 or undefined - keep all
    //  h >= 1         - keep n
    keep: function(h) {
      var accum = []
      var keep = h || MAXDEPTH
      this.toArray = function() {
        return accum
      }
      return this.map(function(v) {
        if (accum.length===keep) accum.shift()
        accum.push(v)
        return v
      })
    },

    // Skip the first n values from the signal
    // The signal will not propagate until n + 1
    skip: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? Circus.fail(v) : v
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? v: Circus.fail(v)
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
      var kl = keys.length, i=0
      var fn = function(v) {
        return ++i % kl === 0 ? keys.map(function(k){
          return v[k]
        }) : undefined
      }
      return this.map(fn)
    }

  })
}