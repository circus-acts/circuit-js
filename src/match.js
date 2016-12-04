import Signal, {halt} from './signal'

'use strict';

var vMatch = {}, Match = {}, litKey = {}

function maskFn(sig, mf) {
  var lv
  return function(v) {
    var r = mf.call(sig,v,lv)
    lv=v
    return r
  }
}

function latest(signals) {
  return Object.keys(signals || {}).reduce(function(a,k) {
    var i = signals[k].step-1
    a[i] = a[i] || {}
    a[i][k] = vMatch
    return a
  }, []).pop() || false
}

function wildCard(keys) {
  for (var i=0, l=keys.length; i<l; i++) {
    var k = keys[i]
    if (k === '*') return 0
    if (k[0] === '*') return 1
    if (k[k.length-1] === '*') return k.length-1
  }
  return false
}

function memo(mask, keys, v, m, wv, sig) {
  keys.forEach(function(k){
    if (mask[k] === undefined){
      if (k === '*') {
        memo(mask, Object.keys(v), v, m, m[k], sig)
      }
      else if (k[0] === '*') {
        var wk = k.substr(1)
        memo(mask, Object.keys(v).filter(function(vk) {return vk.indexOf(wk) > 0}), v, m, m[k], sig)
      }
      else if (k[k.length-1] === '*') {
        var wk = k.substr(0,k.length-1)
        memo(mask, Object.keys(v).filter(function(vk) {return vk.indexOf(wk) === 0}), v, m, m[k], sig)
      }
      else mask[k] = wv === undefined? m === v? vMatch : typeof m[k] === 'function'? maskFn(sig, m[k]) : m[k] : wv
    }
  })
  return keys.length
}

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
  var sig = this.signal
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

  var m = mask || latest(sig.signals)
  var wc = m && wildCard(Object.keys(m))
  var wcMask = {}
  if (wc===false) memo(wcMask,Object.keys(m), vMatch, m, undefined, sig)
  var wcKeys = Object.keys(wcMask)
  var lb = lBound === undefined? 1 : lBound === -1? wcKeys.length : lBound
  var ub = uBound === undefined || uBound === -1? wcKeys.length : uBound

  function matcher(v) {
    if (wc!==false || !wcKeys.length) {
      m = mask || v
      wcMask = {}
      memo(wcMask,Object.keys(m), v, m, undefined, sig)
      wcKeys = Object.keys(wcMask)
      if (!wcKeys.length) {
        wcMask[litKey] = v
        wcKeys = [litKey]
      }
      lb = lBound === undefined? 1 : lBound === -1? wcKeys.length : lBound
      ub = uBound === undefined || uBound === -1? wcKeys.length : uBound
    }
    // b* = boolean...
    // v* = value...
    // m* = match...
    var count=0
    var some = lb===1 && ub===2
    for (var i=0; i < wcKeys.length; i++) {
      var k = wcKeys[i]
      var hasK = typeof v ==='object' && v.hasOwnProperty(k)
      var bv = hasK && wcMask[k] === undefined
      if (!bv) {
        var vv = hasK? v[k] : mask? undefined : v
        var mv = wcMask[k] === vMatch? vv : wcMask[k]
        bv = typeof mv === 'function'? mv.call(sig,vv) : mv
        if (bv===mv) bv = fn.call(sig, vv, mv)
      }
      count += bv ? 1 : 0
      // early exit for some
      if (some && count) break
    }
    return count>=lb && count<=ub ? v : halt()
  }
  return sig.map(matcher)
}

Match.match = match

// signal every or block
Match.all = function all(m){
  return match.call(this, m, Match.and, -1)
}

// signal some or block
Match.any = function any(m){
  return match.call(this, m, Match.and, 1, 2)
}

// signal one or block
Match.one = function one(m){
  return match.call(this, m, Match.and, 1, 1)
}

// signal none or block
Match.none = function none(m){
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

export default Match
