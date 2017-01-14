import Channel from './channel'

'use strict';

export function Error(channel) {
  var _failure
  channel.fail(function(error) {
    _failure = _failure || error
  })
  return {
    active: function(msg) {
      return channel.bind(function(ctx) {
        return function(v) {
          return Object.keys(channel.channels).filter(function(k){
            return !channel.channels[k].value()
          }).length ? ctx.fail(msg) : ctx.next(v)
        }
      })
    },
    error: function(peek) {
      if (_failure) {
        var v = _failure
        if (!peek) _failure = false
        return v
      }
      return ''
    }
  }
}

export function test(f, m) {
  return new Channel().bind(function(ctx) {
    return function(v) {
      function resolve(r) {
        return r? ctx.next(r===true? v : r) : ctx.fail(m)
      }
      var args = [].slice.call(arguments).concat(resolve)
      var r = f.apply(null,args)
      if (r !== undefined) resolve(r, v)
    }
  })
}
