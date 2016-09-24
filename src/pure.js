import Signal from './signal'

function idTest(v1, v2) {
  return v1 !== v2
}

function test(diff) {
  var lv
  diff = diff || idTest
  return function(next, v) {
    if (diff(lv, v)) {
      if (next.apply(null, [].slice.call(arguments,1))) {
        lv = v
      }
    }
  }
}

// step
var pure = function(signal) {
  return {
    pure: function(diff) {
      diff = diff || idTest
      var lv
      return signal.map(function(nv){
        if (diff(lv,nv)) {
          return (lv = nv)
        }
        else return this.halt()
      })
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
