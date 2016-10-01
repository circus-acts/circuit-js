import Signal from './signal'
import thunkor from './thunkor'

'use strict';

export function Error(signal) {
  var _fail
  signal.fail(function(error) {
    _fail = _fail || error.message
  })
  return {
    active: function(m) {
      return signal.map(function(v) {
        return Object.keys(signal.channels).filter(function(k){
          return !signal.channels[k].value()
        }).length ? this.fail(m) : v
      })
    },
    error: function() {
      if (_fail) {
        var v = _fail
        _fail = false
        return v
      }
      return ''
    }
  }
}

export function test(f, m) {
  return function(v) {
    var fail = this.fail
    return thunkor(f.apply(null,arguments), function(j) {
      return j? (j===true? v : j) : fail(m)
    })
  }
}
