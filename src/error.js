import Circus from './circus'

'use strict';

export function Maybe(ctx) {
  ctx.extend(function(ctx){
    return {
      maybe: function(m) {
        return ctx.finally(function(v,f) {
          return f? m.nothing() : m.just(v)
        })
      }
    }
  })
}

export function Error(ctx) {
  ctx.extend(function(ctx){
    var _fail
    ctx.fail(function(error) {
      _fail = _fail || error
    })
    return {
      active: function(m) {
        return ctx.map(function(v) {
          return Object.keys(ctx.channels).filter(function(k){
            return !ctx.channels[k].value()
          }).length ? Circus.fail(m) : v
        })
      },
      error: function() {
        if (_fail) {
          var v = _fail
          _fail = false
          return v.error
        }
        return ''
      }
    }
  })
}

export function maybeThunk(v, resolve) {
  resolve = resolve || Circus.id
  return typeof v === 'function'
  ? function(next) { v(function(tv) {next(resolve(tv))}) }
  : resolve(v)
}

export function test(f, m) {
  return function(v) {
    return maybeThunk(f.apply(null,arguments), function(j) {
      return j? (j===true? v : j) : Circus.fail(m)
    })
  }
}