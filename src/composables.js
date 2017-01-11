import Utils from './utils'

'use strict';

var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

// unbound extensions
export default function Composables(sig) {
  return {
    // A steady state signal
    always: function(v){
      return sig.map(function(){
        return v
      })
    },

    // Batch values into chunks of size w
    batch: function(w) {
      return sig.bind(function(ctx) {
        ctx.batch = []
        return function batch(v){
          ctx.batch.push(v)
          if (ctx.batch.length === w) {
            v = ctx.batch, ctx.batch = []
            return ctx.next(v)
          }
        }
      })
    },

    compose: function(){
      var args = [].slice.call(arguments)
      for (var i=args.length-1; i>=0; i--) {
        sig.map(args[i])
      }
      return sig
    },

    debounce: function(t){
      var dbid
      return sig.map(function(v, next){
        if (!dbid) {
          dbid = setTimeout(function(){
            dbid=false
            next(v)
          },t||0)
        }
      })
    },

    flatten: function(f) {
      return sig.bind(function(ctx){
        return function flatten(v) {
          if (Utils.typeOf(v) === Utils.type.ARRAY) {
            v.forEach(flatten)
          }
          else {
            ctx.next(f? f(v) : v)
          }
        }
      })
    },

    // pipe : (A -> B, B -> C) -> Channel C
    //        (A -> B, Channel C) -> Channel B ? C
    //        (A -> B -> B (C), C -> D) -> Channel D
    //
    // Convenient compose functor that maps from left to right.
    // eg : pipe(v => v + 'B', v ==> v + 'C').input('A') -> Channel 'ABC'
    //
    pipe: function(){
      for (var i=0; i<arguments.length; i++) {
        sig.map(arguments[i])
      }
      return sig
    },

    // map object key values
    pluck: function() {
      var args = [].slice.call(arguments), a0 = args[0]
      return sig.map(function(v) {
        return args.length===1 && (v[a0] || Utils.lens(v,a0)) || args.map(function(key){
          return Utils.lens(v,key)
        })
      })
    },

    // named (projected) map
    project: function() {
      var args = [].slice.call(arguments)
      return sig.map(function(v) {
        var r = {}
        return args.reduce(function(r,arg){
          Object.keys(arg).forEach(function(key){
            r[key] = Utils.lens(v,arg[key])
          })
          return r
        },{})
      })
    },

    // signal keep:
    //  h == 0 or undefined - keep all
    //  h >= 1         - keep n
    keep: function(h) {
      return sig.bind(function(ctx) {
        ctx.accum = []
        ctx.keep = h || MAXDEPTH
        sig.keep.toArray = function() {
          return ctx.accum
        }
        return function keep(v) {
          if (ctx.accum.length===ctx.keep) ctx.accum.shift()
          ctx.accum.push(v)
          return ctx.next(v)
        }
      })
    },

    // Skip the first n values from the signal
    // The signal will not propagate until n + 1
    skip: function (n) {
      return sig.bind(function(ctx) {
        return function skip(v) {
          if (n-- <= 0) return ctx.next(v)
        }
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return sig.bind(function(ctx) {
        return function take(v) {
          if (n-- > 0) return ctx.next(v)
        }
      })
    },

    // Batch values into sliding window of size w
    window: function(w) {
      return sig.bind(function(ctx) {
        ctx.window = []
        return function window(v) {
          ctx.window.push(v)
          if (ctx.window.length > w) {
            ctx.window.shift()
            return ctx.next(ctx.window)
          }
        }
      })
    },

    // Zip signal channel values into a true array.
    zip: function(keys) {
      return sig.bind(function(ctx){
        ctx.i = 0
        return function zip(v) {
          keys = keys || Object.keys(v)
          var kl = keys.length
          return ++ctx.i % kl === 0 && ctx.next(keys.map(function(k){
            return v[k]
          }))
        }
      })
    }

  }
}
