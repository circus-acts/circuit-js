import Signal, {halt} from './signal'

function idTest(v1, v2) {
  return v1 !== v2
}

export default function pure(sig) {
  var diff = sig.isSignal && idTest || sig
  return {
    pure: function(_diff) {
      diff = _diff || diff
      var ctx = this
      ctx.value = undefined
      return this.signal.applyMW(function(next, v){
        if (diff(ctx.value, v)) {
          var nv = next.apply(null, [].slice.call(arguments,1))
          if (!(nv instanceof halt)) {
            ctx.value = v
          }
        }
      })
    }
  }
}
