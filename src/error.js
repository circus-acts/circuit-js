import Signal, {fail} from './signal'
import thunkor from './thunkor'

'use strict';

export function Error(signal) {
  var _failure
  signal.fail(function(error) {
    _failure = _failure || error.message
  })
  return {
    active: function(s, c, m) {
      return signal.map(function(v) {
        return Object.keys(signal.channels).filter(function(k){
          return !signal.channels[k].value()
        }).length ? fail(m) : v
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
    return thunkor(f.apply(null,arguments), function(j) {
      return j? (j===true? v : j) : fail(m)
    })
  }
}
