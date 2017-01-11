import Signal, {halt} from './channel'

function idDiff(v1, v2) {
  return v1 !== v2
}

function test(ctx, diff) {
  return function test(v) {
    if (diff(ctx.value, v)) {
      ctx.value = v
      return ctx.next.apply(null, [].slice.call(arguments))
    }
  }
}

function pure(ctx) {
  if (!ctx.channel) {
    var diff = ctx
    return function(ctx) {
      return test(ctx, diff)
    }
  }
  return test(ctx, idDiff)
}

export {pure}
export default function Pure(channel) {
  var diff = channel.signal? idDiff : channel
  return {pure: function() {return this.bind(pure(diff))}}
}
