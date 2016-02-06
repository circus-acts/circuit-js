var CircusMatch = (function(Circus){

  'use strict';

  var vMatch={}, litKey = new Date().getTime()

  Circus = Circus || require('Circus')

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
  //      default: true
  //
  //  logicFn = function that takes the current match state and a mask state
  //       and returns either of:
  //           truthy value - signal the value
  //           falsey value - block the value
  //
  //       default: return s && m
  //
  //  lBound = minimum number of matches required to unblock (default all)
  //  uBound = maximum number of matches required to unblock (default all)
  //
  // match is the core matcher function upon which all other (dedicated) matcher functions
  // are based. Use this function as the basis for custom matcher steps. Review Dedicated
  // matcher steps and, or xor and not for examples.
  //
  function match(){

    var ctx = this.asSignal()
    var args = [].slice.call(arguments)
    var mask, fn, lBound, uBound

    args.forEach(function(a){
      var T=typeof a
      if (T === 'string') {if (!mask) {mask={}}; mask[a]=vMatch}
      if (T === 'function' && !fn) fn=a
      if (T === 'number' && !lBound) lBound=a
      if (T === 'number' && lBound) uBound=a
      if (T === 'object' && !a.length) mask=a
    })

    function maskFn(mf) {
      var lv, boolFn = function(v) {
        var r = mf(v,lv)
        lv=v
        return r
      }
      return boolFn
    }

    var wcMask, wcKeys, isObject
    function memo(keys,v,m,wv) {
      keys.forEach(function(k){
        if (wcMask[k] === undefined){
          if (k === '*') {
            memo(Object.keys(v), v, m, m[k])
          }
          else if (k[0] === '*') {
            var wk = k.substr(1)
            memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk)>0}), v, m, m[k])
          }
          else if (k[k.length-1] === '*') {
            var wk = k.substr(0,k.length-1)
            memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk) === 0}), v, m, m[k])
          }
          else wcMask[k] = wv === undefined? m === v? vMatch : typeof m[k] === 'function'? maskFn(m[k]) : m[k] : wv
        }
      })
      return keys.length
    }

    fn = fn || Circus.and

    function matcher(v) {
      var m = mask || v
      if (!wcMask) {
        isObject = Circus.typeOf(m) === Circus.typeOf.OBJECT
        wcMask = {}
        if (!isObject || !memo(Object.keys(m),v, m,undefined)) {
          wcMask[litKey] = v
        }
        wcKeys = Object.keys(wcMask)
        if (lBound === undefined) lBound = wcKeys.length
        if (uBound === undefined) uBound = wcKeys.length
      }

      var count=0, fail = undefined
      wcKeys.forEach(function(k){
        var hasK = typeof v ==='object' && v.hasOwnProperty(k)
        var vv = hasK? v[k] : mask? undefined : v
        var mv = wcMask[k] === vMatch? vv : wcMask[k]
        var bf = typeof mv === 'function' && mv
        var bm = bf && bf(vv) || vv && Circus.isSignal(mv) && mv.value(vv)
        if (bm === Circus.FALSE) {fail=bm, bm=false}
        var bv = (hasK && wcMask[k] === undefined) || bm || fn.call(ctx, vv, mv)
        count += bv ? 1 : 0
        // breaks immutability. Can do better?
        if (isObject && mask && bm && bv) v[k]=bv
      })
      return count>=lBound && count<=uBound ? v === undefined? Circus.UNDEFINED : v : fail
    }
    return ctx.map(matcher)
  }

  // build custom pattern. Defaults to Circus.any
  Circus.prototype.match = function(){
    return match.apply(this,arguments)
  }

  // signal all or block
  Circus.prototype.all = function(m){
    return match.call(this, m, Circus.and)
  }

  // signal any or block
  Circus.prototype.any = function(m){
    return match.call(this, m, Circus.and, 1)
  }

  // signal one or block
  Circus.prototype.one = function(m){
    return match.call(this, m, Circus.and, 1, 1)
  }

  // signal none or block
  Circus.prototype.none = function(m){
    return match.call(this, m, Circus.and, 0, 0)
  }

  // logical match functions operate on current and previous channel values,
  // or current value and mask if provided: Circus.and(mvalue)
  ;(function(ops){
    Object.keys(ops).forEach(function(op){
      Circus[op] = function(v, m){
        if (arguments.length===1){
          m = arguments[0]
          return function(v) {
            return Circus[op](v, m)
          }
        }
        return ops[op](v,m)
      }
    })
  })({
    and: function(v, m) {return v && (m === v || m === true) || !v && m === false? v === undefined? Circus.UNDEFINED : v : false},
    or:  function(v, m) {return v || m},
    xor: function(v, m) {return v && m!==v?  v : !v && m},
    not: function(v, m) {return !v}
  })

  Circus.extend({
    match: Circus.prototype.match,
    all: Circus.prototype.all,
    any: Circus.prototype.any,
    one: Circus.prototype.one,
    none: Circus.prototype.none
  })

})(Circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = CircusMatch;
else if (typeof define == "function" && define.amd) define(function() {return CircusMatch});

