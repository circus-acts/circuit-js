'use strict';

var Match = {}, litKey = {}

function maskFn(mf) {
  var lv
  return function(v, vv, k) {
    var r = mf(v, vv, lv, k)
    lv=vv
    return r
  }
}

function latest(channels) {
  return Object.keys(channels || {}).reduce(function(a,k) {
    var i = channels[k].step-1
    a[i] = a[i] || {}
    a[i][k] = true
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

function memo(mask, keys, v, m, wv, fn) {
  keys.forEach(function(k){
    if (mask[k] === undefined){
      if (fn) {
        mask[k] = wv === undefined? m === v? true : typeof m[k] === 'function'? maskFn(m[k]) : m[k] : wv
      }
      else if (k === '*') {
        memo(mask, Object.keys(v), v, m, m[k])
      }
      else if (k[0] === '*') {
        var wk = k.substr(1)
        memo(mask, Object.keys(v).filter(function(vk) {return vk.indexOf(wk) > 0}), v, m, m[k])
      }
      else if (k[k.length-1] === '*') {
        var wk = k.substr(0,k.length-1)
        memo(mask, Object.keys(v).filter(function(vk) {return vk.indexOf(wk) === 0}), v, m, m[k])
      }
      else mask[k] = wv === undefined? m === v? true : typeof m[k] === 'function'? maskFn(m[k]) : m[k] : wv
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
  var args = [].slice.call(arguments)
  var mask, keyFn, lBound, uBound

  args.forEach(function(a){
    var T=typeof a
    if (T === 'string') {if (!mask) {mask={}}; mask[a]=true}
    else if (T === 'function' && !keyFn) keyFn=a
    else if (T === 'number' && lBound===undefined) lBound=a
    else if (T === 'number' && lBound!==undefined) uBound=a
    else if (T === 'object' && !a.length) mask=a
  })

  var any = lBound===1 && uBound===-1
  var block = lBound===1 && uBound===0

  return function(ctx) {
    var m = mask || latest(ctx.channel.channels)
    var wc = m && wildCard(Object.keys(m))
    var wcMask = {}
    if (wc===false) memo(wcMask,Object.keys(m), {}, m, undefined, !!keyFn)
    var wcKeys = Object.keys(wcMask)
    var lb = lBound === undefined || lBound === -1? wcKeys.length : lBound
    var ub = uBound === undefined || uBound === -1? wcKeys.length : uBound

    return function matcher(v, c1, c2) {
      var isObj = typeof v ==='object'
      if (wc!==false || !wcKeys.length) {
        m = mask || v
        wcMask = {}
        memo(wcMask,Object.keys(m), v, m, undefined, !!keyFn)
        wcKeys = Object.keys(wcMask)
        if (!wcKeys.length) {
          wcMask[litKey] = v
          wcKeys = [litKey]
        }
        lb = lBound === undefined || lBound === -1? wcKeys.length : lBound
        ub = uBound === undefined || uBound === -1? wcKeys.length : uBound
      }
      // b* = boolean...
      // v* = value...
      // m* = mask...
      var count=0
      for (var i=0; i < wcKeys.length; i++) {
        var mk = wcKeys[i]
        var vk = typeof v === 'object' && v.hasOwnProperty(mk)
        var vv = keyFn ? keyFn(mk, vk ? v[mk] : v) : vk ? v[mk] : undefined
        if (vk || vv !== undefined) {
          var mv = wcMask[mk] === undefined ? vv : wcMask[mk].signal || wcMask[mk]
          var bv = typeof mv === 'function'? mv(v, vv, mk) : maskFn(Match.and(mv))(v, vv, mk)
          count += bv ? 1 : 0
          // early exit?
          if (count && (any || block)) break
        }
      }
      if (block && count===0) ctx.next(v)
      else if (count>=lb && count<=ub) ctx.next(v)
    }
  }
}

Match.match = function(m){
  return this.bind(match.apply(null,arguments))
}

// signal all or block
Match.all = function(m){
  return this.bind(match(m, undefined, undefined))
}

// signal any or block
Match.any = function(m){
  return this.bind(match(m, 1, -1))
}

// signal some or block
Match.some = function(m){
  return this.bind(match(m, 1, undefined))
}

// signal one or block
Match.one = function(m){
  return this.bind(match(m, 1, 1))
}

// signal none or block
Match.none = function(m){
  return this.bind(match(m, 0, 0))
}

// always block
Match.switch = function(m, fn) {
  return this.bind(match(m, 1, 0, fn))
}

// logical match functions operate on current and previous channel values
// or current value and mask
;(function(ops){
  Object.keys(ops).forEach(function(op){
    Match[op] = function(m, v, lv){
      return arguments.length === 1 && function(a, v, lv) {
        return ops[op](v, m===undefined? lv : typeof m === 'function'? m(v) :  m)
      }
      || ops[op](v, lv)
    }
  })
})({
  and: function(v, m) { return v && (m === v || m === true) || !v && m === false? true : false },
  or:  function(v, m) { return v || m },
  xor: function(v, m) { return v && m!==v?  v : !v && m },
  not: function(v, m) { return !v && m || !v}
})

export default Match
