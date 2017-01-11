import Channel from './channel'
import thunkor from './thunkor'

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
    error: function() {
      if (_failure) {
        var v = _failure
        _failure = false
        return v
      }
      return ''
    }
  }
}

export function test(f, m) {
  return new Channel().bind(function(ctx) {
    return function(v) {
      return thunkor(f.apply(null, arguments), function(r) {
        return r? ctx.next(r===true? v : r) : ctx.fail(m)
      })
    }
  })
}
