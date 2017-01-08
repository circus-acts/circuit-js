import {fail} from './channel'
import thunkor from './thunkor'

'use strict';

export function Error(channel) {
  var _failure
  channel.fail(function(error) {
    _failure = _failure || error.message
  })
  return {
    active: function(msg) {
      var channel = this
      return channel.map(function(v) {
        return Object.keys(channel.channels).filter(function(k){
          return !channel.channels[k].value()
        }).length ? fail(msg) : v
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
  return function(v) {
    return thunkor(f.apply(null,arguments), function(r) {
      return r? (r===true? v : r) : fail(m)
    })
  }
}
