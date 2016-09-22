import Signal from './signal'

function idTest(v1, v2) {
  return v1 !== v2
}

function test(diff) {
  var hv
  diff = diff || idTest
  return function(next, v) {
    if (diff(hv, v)) {
      var nv = next.apply(null, [].slice.call(arguments,1))
      if (!(this.error)) {
        hv = v
      }
      return nv
    }
  }
}

var pure = function(signal) {
  return {
    pure: function(diff) {
      return signal.bind(test(diff))
    }
  }
}
export {pure}

export default function Pure(signal) {
  if (typeof signal === 'function') {
    var diff = signal
    return function(signal) {
      return signal.bind(test(diff))
    }
  }
  return signal.bind(test())
}
