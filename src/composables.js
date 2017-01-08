import {halt} from './channel'
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
      var b = [], batch = function(v){
        b.push(v)
        if (b.length === w) {
          v = b, b = []
          return v
        }
        return halt()
      }
      return sig.map(batch)
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
      return sig.map(function(v) {
        return halt(function(next){
          function flatten(v) {
            if (Utils.typeOf(v) === Utils.type.ARRAY) {
              v.forEach(flatten)
            }
            else {
              next(f? f(v) : v)
            }
            return undefined
          }
          return flatten(v)
        })
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
      var accum = []
      var keep = h || MAXDEPTH
      sig.toArray = function() {
        return accum
      }
      return sig.map(function(v) {
        if (accum.length===keep) accum.shift()
        accum.push(v)
        return v
      })
    },

    // Skip the first n values from the signal
    // The signal will not propagate until n + 1
    skip: function (n) {
      return sig.map(function (v) {
        return (n-- > 0)? halt() : v
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return sig.map(function (v) {
        return (n-- > 0)? v: halt()
      })
    },

    // Batch values into sliding window of size w
    window: function(w) {
      var b = [], window = function(v){
        b.push(v)
        if (--w < 0) {
          b.shift()
          return b
        }
      }
      return sig.map(window)
    },

    // Zip signal channel values into a true array.
    zip: function(keys) {
      var i = 0
      var zip = function(v) {
        keys = keys || Object.keys(v)
        var kl = keys.length
        return ++i % kl === 0 ? keys.map(function(k){
          return v[k]
        }) : halt()
      }
      return sig.map(zip)
    }

  }
}
