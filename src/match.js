var circusMatch = (function(circus){

  'use strict';

  var vMatch={}, litKey = new Date().getTime()

  circus = circus || require('circus')

  // Apply a matcher function with optional mask to signal or block channel values.
  // By default, the signal is blocked if any channels are blocked
  // Output is taken from masked channels [default all]
  //
  // arguments:
  //  mask = object of channel matching key/values - supports wildcards
  //    key = 'n'  - match on channel 'n'
  //          '*n' - match on all remaining channels ending with 'n'
  //          'n*' - match on all remaining channels starting with 'n'
  //          '*'  - match on all remaining channels
  //
  //    value = true  - match if truthy
  //            value - match if equal (===)
  //            false - match if falsey
  //            undefined - match any
  //
  //    default: undefined
  //
  //  logicFn = function that takes the current match state and a mask state
  //       and returns either of:
  //           truthy value - signal the value
  //           falsey value - block the value
  //
  //       default: return s && m
  //
  //  min = minimum number of matches required to unblock (default all)
  //  max = maximum number of matches required to unblock (default all)
  //
  // match is the core matcher function upon which all other (dedicated) matcher functions
  // are based. Use this function as the basis for custom matcher steps. Review Dedicated
  // matcher steps and, or xor and not for examples.
  //
  function match(args, fn, min, max){

    var ctx = circus.isSignal(this)? this: (this || circus).signal()

    if (typeof args === 'function') {
      max = min
      min = fn
      fn = args
      args = false
    }

    if (!args || !args.hasOwnProperty('length')) {
      args = [args]
    }

    var wcMask, wcKeys, mask = args[0]
    if (mask && (args.length>1 || typeof mask !== 'object')) {
      mask = [].slice.call(args).reduce(function(m,a){
        if (typeof a!=='function') m[a]=vMatch
        return m
      },{})
    }

    function maskFn(m) {
      var lv
      return function(v) {
        var r = m(v,lv)
        lv=v
        return r
      }
    }

    function memo(keys,v,m,wv) {
      keys.forEach(function(k){
        if (wcMask[k] === undefined){
          if (k==='*') {
            memo(Object.keys(v), v, m, m[k])
          }
          else if (k[0]==='*') {
            var wk = k.substr(1)
            memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), v, m, m[k])
          }
          else if (k[k.length-1]==='*') {
            var wk = k.substr(0,k.length-1)
            memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)===0}), v, m, m[k])
          }
          else wcMask[k] = wv === undefined? m===v? vMatch : typeof m==='function'? maskFn(m) : m[k] : wv
        }
      })
      return keys.length
    }

    fn = fn || function(v,m) {
      return !mask? v===undefined || v : v && v===m || v && m===true || !v && m===false
    }

    function matcher(v) {
      var m = mask || v
      if (!wcMask) {
        wcMask = {}
        if (circus.typeOf(m)!==circus.typeOf.OBJECT || !memo(Object.keys(m),v, m,undefined)) {
          wcMask[litKey] = v
        }
        wcKeys = Object.keys(wcMask)
        if (min===undefined) min = wcKeys.length
        if (max===undefined) max = wcKeys.length
      }

      var count=0, fail = undefined
      wcKeys.forEach(function(k){
        var hasK = typeof v ==='object' && v.hasOwnProperty(k)
        var vv = hasK? v[k] : mask? undefined : v
        var mv = wcMask[k]===vMatch? vv : wcMask[k]
        var mm =  typeof mv === 'function' && mv(vv)
        if (mm === circus.FALSE) {fail=mm, mm=false}
        count += (hasK && wcMask[k]===undefined) || mm || fn.call(ctx, vv, mv) ? 1 : 0
      })
      return count>=min && count<=max ? v===undefined? circus.UNDEFINED : v : fail
    }
    return ctx.map(matcher)
  }

  circus.match = function(){
    return match.call(this,arguments)
  }

  // signal all or block
  circus.all = function(){
    return match.call(this, arguments, circus.all)
  }

  // signal any or block
  circus.any = function(){
    return match.call(this, arguments, circus.and, 1)
  }

  // signal one or block
  circus.one = function(){
    return match.call(this, arguments, circus.and, 1, 1)
  }

  circus.and = function(v, m){
    return v && m === v || v && m===true || !v && m===false
  }

  circus.or = function(v, m){
    return v || m
  }

  circus.xor = function(v, m){
    return v && m!==v || !v && m
  }

  circus.not = function(v, m){
    return m!==circus.FALSE? !v !== !m : !v
  }

  circus.extend({
    match: circus.match,
    all: circus.all,
    any: circus.any,
    one: circus.one
  },true)

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusMatch;
else if (typeof define == "function" && define.amd) define(function() {return circusMatch});

