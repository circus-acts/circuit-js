import Signal from './signal'

function idTest(v1, v2) {
  return v1 !== v2
}

export default function pure(diff) {
  if (typeof diff !== 'function') diff = idTest
  return {
    pure: function(_diff) {
      diff = _diff || diff
      var ctx = this.ctx
      return this.bind(function(next, v){
        if (diff(ctx.lv, v)) {
          if (next.apply(null, [].slice.call(arguments,1))) {
            ctx.lv = v
          }
        }
      })
    }
  }
}
