import Circus from './circus'

'use strict';

function diff(v1,v2, recurse) {
  var T = Circus.type(v1)
  if (~Circus.type.LITERAL.indexOf(T) || T === Circus.type.FUNCTION || v1 === undefined || v2 === undefined || Circus.isSignal(v1)) {
    return v1!==v2
  }
  else {
    if (T === Circus.type.ARRAY) {
      return  v1.length !== v2.length || v1.some(function(v,i) {
        return recurse? diff(v,v2[i],recurse) : v !== v2[i]
      })
    } else if (T === Circus.type.OBJECT) {
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
    return data.hasOwnProperty(idxKey)? data[idxKey][idx] : Circus.UNDEFINED
  }
  return data && data.hasOwnProperty(key)? data[key] : Circus.UNDEFINED
}

function lens(data,name,ns,def) {
  if (arguments.length<4) {
    def=null
  }
  var path = ((ns? ns + '.' :'') + name).split('.')
  var v = path.reduce(pathToData,data)

  if (data && v===Circus.UNDEFINED && Circus.typeOf(data) === Circus.type.OBJECT && data.constructor==={}.constructor) {
    v = Object.keys(data).reduce(function(a,k){
      return a!==Circus.UNDEFINED && a || lens(data[k],name,'',def)
    },Circus.UNDEFINED)
  }
  return v!==Circus.UNDEFINED? v : def
}

function traverse(s, fn, acc, tv) {
  var c = s.channels || Circus.isSignal(s) && {s:s} || s, seed = acc!=Circus.UNDEFINED, fmap=[]
  fn = fn || function id(s){return s}
  function stamp(c, fn, sv){
    var obj = {}
    Object.keys(c).forEach (function(ck){
      var t = c[ck]
      var n = (Circus.isSignal(t) && t.name) || ck
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

export function Error(ctx) {
  if (!this instanceof Error) return new Error(ctx)
  ctx.extend(function(ctx){
    var _fail
    ctx.finally(function(v,f) {
      if (f) {
        _fail = _fail || f.error || true
      }
    })

    // important: this functor flatmaps a circuit's channels
    // at the point that it is employed. Make this the last
    // binding if all channels are required.
    var channels = api.flatmap(ctx)

    return {
      active: function(m) {
        return ctx.map(function(v) {
          for(var c=0; c<channels.length; c++) {
            if (!channels[c].active()) return Circus.fail(m || 'required')
          }
          return v
        })
      },
      error: function(v) {
        if (_fail) {
          var v = _fail
          _fail = false
          return v || true
        }
        return ''
      }
    }
  })
}

export function test(f, m) {
  return Circus.isAsync(f)
  ? function(v, next) {
    return f.call(this,v,function(j){
      return next(j? (j===true? v : j) : Circus.fail(m))
    })
  }
  : function(v) {
    var j = f.call(this,v)
    return j? (j===true? v : j) : Circus.fail(m)
  }
}

const api = {

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

  // lens
  // re,turn a value from a nested structure
  // useful for plucking values and signals from models and signal groups respectively
  lens: lens,

  reduce: function(s, fn, seed, tv) {
    return traverse(s, fn, seed, tv)[1]
  },

  map: function(s, fn, tv) {
    return traverse(s, fn, Circus.UNDEFINED,tv)[0]
  },

  flatmap: function(s, fn, tv) {
    return traverse(s, fn, Circus.UNDEFINED,tv)[2]
  },

  tap: function(s, fn, tv) {
    traverse(s, fn, Circus.UNDEFINED, tv)
  },

  test: test
}

export default api