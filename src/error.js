import Circus from './circus'
import Utils from './utils'

'use strict';

export function Maybe(ctx) {
  ctx.extend(function(ctx){
    return {
      maybe: function(m) {
        return ctx.finally(function(v, f) {
          return f? m.nothing() : m.just(v)
        })
      }
    }
  })
}

export function Error(ctx) {
  ctx.extend(function(ctx){
    var _fail
    ctx.finally(Circus.before(function(v,f) {
      if (f) {
        _fail = _fail || f.error || true
      }
    }))

    // important: this functor flatmaps a circuit's channels
    // at the point that it is deployed. Make this the last
    // functor when all channels are required.
    var channels = Utils.flatmap(ctx)

    return {
      active: function(m) {
        return ctx.map(function(v) {
          for(var c=0; c<channels.length; c++) {
            if (!channels[c].active()) return Circus.fail(m || 'required')
          }
          return v
        })
      },
      error: function(v) {
        if (_fail) {
          var v = _fail
          _fail = false
          return v || true
        }
        return ''
      }
    }
  })
}

export function test(f, m) {
  return Circus.isAsync(f)
  ? function(v, next) {
    return f.call(this,v,function(j){
      return next(j? (j===true? v : j) : Circus.fail(m))
    })
  }
  : function(v) {
    var j = f.call(this,v)
    return j? (j===true? v : j) : Circus.fail(m)
  }
}