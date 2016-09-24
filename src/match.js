import Signal from './signal'

'use strict';

var objConstructor = {}.constructor
var vMatch={}, litKey = new Date().getTime()

// Pattern match a signal value to pass or block propagation
//
// optional arguments:
//  mask = comma delimited list of strings matching channel names
//
//    or object of channel matching key/values - supports wildcards
//      key = 'n'  - match on channel 'n'
//            '*n' - match on all remaining channels ending with 'n'
//            'n*' - match on all remaining channels starting with 'n'
//            '*'  - match on all remaining channels
//
//      value = true  - match if truthy
//              value - match if equal (===)
//              false - match if falsey
//              undefined - match any
//              matchFn - see below
//
//  matchFn = function that takes the current match state and a mask value and
//            returns either of:
//              truthy value - signal the value
//              falsey value - block the value
//
//  lBound = minimum number of matches required to signal (default all)
//  uBound = maximum number of matches required to signal (default all)
//
// match is the core function upon which all other higher order matchers are
// based. Use this function as the basis for custom match steps. Review dedicated
// matchers every, some, one and none for examples.
//
// The boolean functions and, or, xor and not are all high order functions that return
// the appropriate match function. They also provide a basic pattern matching facility
// by way of signalling:
//
//    .match(Match.and(6, signal().tap(v))) // signal 6
//
// By default:
//    - every channel is tested (use some for early signal result)
//    - the signal is blocked if all channels are blocked
//    - the match function is provided by Match.and
//
function match(){

  var ctx = this.asSignal()
  var args = [].slice.call(arguments)
  var mask, fn, lBound, uBound

  args.forEach(function(a){
    var T=typeof a
    if (T === 'string') {if (!mask) {mask={}}; mask[a]=vMatch}
    else if (T === 'function' && !fn) fn=a
    else if (T === 'number' && lBound===undefined) lBound=a
    else if (T === 'number' && lBound!==undefined) uBound=a
    else if (T === 'object' && !a.length) mask=a
  })
  fn = fn || Match.and

  function maskFn(mf) {
    var lv
    return function(v) {
      var r = mf.call(ctx,v,lv)
      lv=v
      return r
    }
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
          memo(Object.keys(v).filter(function(vk) {return vk.indexOf(wk) > 0}), v, m, m[k])
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

  function matcher(v) {
    var m = mask || v
    if (!wcMask) {
      isObject = m.constructor === objConstructor
      wcMask = {}
      if (!isObject || !memo(Object.keys(m),v, m, undefined)) {
        wcMask[litKey] = v
      }
      wcKeys = Object.keys(wcMask)
      if (lBound === undefined) lBound = 1
      if (lBound === -1) lBound = wcKeys.length
      if (uBound === undefined) uBound = wcKeys.length
      if (uBound === -1) uBound = wcKeys.length
    }

    // b* = boolean...
    // v* = value...
    // m* = match...
    var count=0
    var some = lBound===1 && uBound===2
    for (var i=0; i < wcKeys.length; i++) {
      var k = wcKeys[i]
      var hasK = typeof v ==='object' && v.hasOwnProperty(k)
      var bv = hasK && wcMask[k] === undefined
      if (!bv) {
        var vv = hasK? v[k] : mask? undefined : v
        var mv = wcMask[k] === vMatch? vv : wcMask[k]
        bv = typeof mv === 'function'? mv.call(ctx,vv) : mv
        if (bv===mv) bv = fn.call(ctx, vv, mv)
      }
      count += bv ? 1 : 0
      // early exit for some
      if (some && count) break
    }
    return count>=lBound && count<=uBound ? v : this.halt()
  }
  return ctx.map(matcher)
}

// build a custom match
function base(){
  return match.apply(this,arguments)
}

// signal every or block
function all(m){
  return match.call(this, m, Match.and, -1)
}

// signal some or block
function any(m){
  return match.call(this, m, Match.and, 1, 2)
}

// signal one or block
function one(m){
  return match.call(this, m, Match.and, 1, 1)
}

// signal none or block
function none(m){
  return match.call(this, m, Match.and, 0, 0)
}

// logical match functions operate on current and previous channel values,
// or current value and mask if provided: Match.and(mvalue)
// or switch on current value and mask: Match.and(mvalue, Signal)
;(function(ops){
  Object.keys(ops).forEach(function(op){
    Match[op] = function(v, m){
      if (arguments.length===1) m = v
      var f = m, s = f && f.isSignal || typeof f === 'function'
      if (s) m = arguments.length===2? v : undefined
      if (arguments.length===1 || s){
        return function(v,lv) {
          v = Match[op](v, m===undefined? lv : m)
          return s && v? this.asSignal(f).input(v) : v
        }
      }
      return ops[op](v,m)
    }
  })
})({
  and: function(v, m) { return v && (m === v || m === true) || !v && m === false? v === undefined? true : v : false },
  or:  function(v, m) { return v || m },
  xor: function(v, m) { return v && m!==v?  v : !v && m },
  not: function(v, m) { return !v && m || !v}
})

export default function Match(app) {
  app.extend({
    match: base,
    all: all,
    any: any,
    one: one,
    none: none
  })
}
