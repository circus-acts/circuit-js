import Signal from './signal'
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

    flatten: function(f) {
      return this.map(function(v) {
        return function(next){
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
        }
      })
    },

    maybe: function(f) {
      return this.map(function(v){
        return f(v)? {just:v} : {nothing:true}
      })
    },

    // pipe : (A -> B, B -> C) -> Signal C
    //        (A -> B, Signal C) -> Signal B ? C
    //        (A -> B -> B (C), C -> D) -> Signal D
    //
    // Convenient compose functor that maps from left to right.
    // eg : pipe(v => v + 'B', v ==> v + 'C').input('A') -> Signal 'ABC'
    //
    pipe: function(){
      var args = [].slice.call(arguments)
      for (var i=0; i<args.length; i++) {
        this.map(args[i])
      }
      return this
    },

    // map object key values
    pluck: function() {
      var args = [].slice.call(arguments), a0 = args[0]
      return this.map(function(v) {
        return args.length===1 && (v[a0] || Utils.lens(v,a0)) || args.map(function(key){
          return Utils.lens(v,key)
        })
      })
    },

    // named (projected) map
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
        return (n-- > 0)? Signal.fail(v) : v
      })
    },

    // Take the first n values from the signal
    // The signal will not propagate after n
    take: function (n) {
      return this.map(function (v) {
        return (n-- > 0)? v: Signal.fail(v)
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
      return this.map(window)
    },

    // Zip signal channel values into a true array.
    zip: function(keys) {
      var i = 0
      var zip = function(v) {
        keys = keys || Object.keys(v)
        var kl = keys.length
        return ++i % kl === 0 ? keys.map(function(k){
          return v[k]
        }) : undefined
      }
      return this.map(zip)
    }

  })
}