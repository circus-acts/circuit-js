import Signal from './signal'

'use strict';

var UNDEFINED = {}

var _types = {}.toString, ARRAY='A',OBJECT='O', FUNCTION='F', LITERAL = 'SNBDR'
var _type = function(t) {
  return _types.call(t)[8]
}
var _typeOf = function(t) {
  t = _type(t)
  return ~LITERAL.indexOf(t) && LITERAL || t
}

_type.ARRAY = ARRAY
_type.OBJECT = OBJECT
_type.FUNCTION = FUNCTION
_type.LITERAL = LITERAL

function diff(v1,v2, recurse) {
  var T = _type(v1)
  if (~_type.LITERAL.indexOf(T) || T === _type.FUNCTION || v1 === undefined || v2 === undefined || v1.isSignal) {
    return v1!==v2
  }
  else {
    if (T === _type.ARRAY) {
      return  v1.length !== v2.length || v1.some(function(v,i) {
        return recurse? diff(v,v2[i],recurse) : v !== v2[i]
      })
    } else if (T === _type.OBJECT) {
      var mk = Object.keys(v1), vk = Object.keys(v2)
      return mk.length != vk.length || typeof v2 !== 'object' || mk.some(function(k,i){
        return recurse? diff(v1[k],v2[k],recurse) : v1[k] !== v2[k] || mk[i] !== vk[i]
      })
    }
  }
  return false
}

function pathToData(data, key) {
  var i = key.indexOf('[')
  if (i > 0){
    var idx=parseInt(key.substr(i+1,key.length-2),10)
    var idxKey = key.substr(0,i)
    return data.hasOwnProperty(idxKey)? data[idxKey][idx] : UNDEFINED
  }
  return data && data.hasOwnProperty(key)? data[key] : UNDEFINED
}

// return a value from a nested structure
// useful for plucking values from models and signals from signal groups
function lens(data,name,ns,def) {
  if (arguments.length<4) {
    def=null
  }
  var path = ((ns? ns + '.' :'') + name).split('.')
  var v = path.reduce(pathToData,data)

  if (data && v===UNDEFINED && _typeOf(data) === _type.OBJECT && data.constructor==={}.constructor) {
    v = Object.keys(data).reduce(function(a,k){
      return a!==UNDEFINED && a || lens(data[k],name,'',def)
    },UNDEFINED)
  }
  return v!==UNDEFINED? v : def
}

function traverse(s, fn, acc, tv) {
  var c = s.channels || s.isSignal && {s:s} || s, seed = acc!=UNDEFINED, fmap=[]
  fn = fn || function id(s){return s}
  function stamp(c, fn, sv){
    var obj = {}
    Object.keys(c).forEach (function(ck){
      var t = c[ck]
      var n = (t.isSignal && t.name) || ck
      var v = (sv||{})[n]
      if (t.channels && t.channels !== s.channels) {
        var a = stamp(t.channels,fn, v)
        obj[n] = a[0]
        acc = a[1]
      }
      else {
        fmap.push(acc = obj[n] = fn.apply(null, seed? [acc,t,v]:[t,v]))
      }
    })
    return [obj, acc, fmap]
  }
  return stamp(c, fn, tv)
}

const api = {

  lens: lens,
  typeOf : _typeOf,
  type: _type,

  // force arity on diffs and traverses
  diff: function(v1,v2) {
    return diff(v1,v2)
  },

  deepDiff: function(v1,v2) {
    return diff(v1,v2,true)
  },

  equal: function(v1,v2) {
    return !diff(v1,v2)
  },

  deepEqual: function(v1,v2) {
    return !diff(v1,v2,true)
  },

  reduce: function(s, fn, seed, tv) {
    return traverse(s, fn, seed, tv)[1]
  },

  map: function(s, fn, tv) {
    return traverse(s, fn, UNDEFINED,tv)[0]
  },

  flatmap: function(s, fn, tv) {
    return traverse(s, fn, UNDEFINED,tv)[2]
  },

  tap: function(s, fn, tv) {
    traverse(s, fn, UNDEFINED, tv)
  }
}

export default api
