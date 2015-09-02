var circus = (function(){

  'use strict';

  function circus(){

  }

  function Mutator (v) {this.value=shallowCopy(v)}

  var type = {}.toString, ARRAY='A',OBJECT='O',LITERAL = 'SNBDR'

  // expose to mutation api for override
  function shallowCopy(n,o) {
    if (typeof n==='object') {
      if (n.length) return n.slice()
      var c={}
      Object.keys(n).forEach(function(k){
        if (o && o[k]!==undefined) c[k] = o[k]
        else c[k] = n[k]
      })
      return c
    }
    return n
  }

  function shallowMerge(v1, v2) {
    if (v1 === undefined) return shallowCopy(v2)
    return shallowCopy(v1,v2)
  }

  /*
  * a value is dirty if any of its properties are dirty, or for key diff..
  *  dirty if that key value is dirty regardless of other changed props
  */
  function diff(m,v,d) {
    var dirty = circus.FALSE, mutator = m instanceof Mutator
    var mv = mutator? m.value : m, t = type.call(mv)[8]
    if (~LITERAL.indexOf(t) || mv === undefined || v === undefined) {
      dirty = mv!==v || circus.FALSE
    }
    else {
      if (mutator && m.key !== undefined) {
        dirty = v[m.key] !== mv[m.key] && m.key || circus.FALSE
      }
      else {
        if (t === ARRAY) {
          for (var i=0, l=mv.length; i<l; i++) {
            if (d && diff(mv[i],v[i],d).dirty || mv[i] !== v[i]) {
              dirty=i
              break
            }
          }
        } else if (t === OBJECT) {
          var mk = Object.keys(mv), vk = Object.keys(v)
          dirty = mk.length != vk.length || typeof v !== 'object' || mk.reduce(function(a,k){
            return a!==circus.FALSE || (d && diff(mv[k],v[k],d).dirty) || (mv[k] !== v[k] && k) || a
          },circus.FALSE)
        }
      }
    }
    return {dirty:dirty,value:mv}
  }

  function equal(m,v){
    return diff(new Mutator(m),v).dirty === circus.FALSE
  }

  function deepEqual(m,v){
    return diff(new Mutator(m),v,true).dirty === circus.FALSE
  }

  function pathToData(data, key){
    var i = key.indexOf('[')
    if (i > 0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return data[idxKey][idx]
    }
    return data && (data.hasOwnProperty('channels')?  data.channels[key] : data[key])
  }

  // lens
  // return a value from a nested structure
  // useful for plucking values and signals from models and signal groups respectively
  function lens(data,name,ns,def){
    if (arguments.length<4) {
      def=null
    }
    var path = ((ns? ns + '.' :'') + name).split('.')
    var v = path.reduce(pathToData,data)

    return v!==undefined? v : def
  }

  function reduce(s, jp, fn, acc) {
    return traverse(s,jp,fn,acc)[1]
  }

  function map(s, jp, fn) {
    return traverse(s,jp,fn)[0]
  }

  function traverse(s, jp, fn, acc) {
    if (typeof jp === 'function'){
      acc = fn
      fn = jp
      jp = undefined
    }
    var c = (jp? s.jp[jp].channels : s.channels).ordered
    function stamp(c, fn){
      var obj = {}
      c.forEach (function(t){
        var n = t.signal.name
        if (t.channels && t.channels !== s.channels && !t.channels.sampleOnly) {
          var a = stamp(t.channels.ordered,fn, acc)
          acc = a[1],obj[n] = a[0]
        }
        else {
          acc = obj[n] = fn.call(t,acc)
        }
      })
      return [obj,acc]
    }
    return stamp(c,fn)
  }

  var api = {
    id: function(v) {return v},
    noop:function(){},
    copy: shallowCopy,
    merge: shallowMerge,
    diff: diff,
    equal: equal,
    deepEqual: deepEqual,
    lens: lens,
    map: map,
    reduce: reduce,
    traverse: function(s,j,f) {traverse(s,j,f)},
    typeOf: function(t) {
      t = type.call(t)[8]
      return ~LITERAL.indexOf(t) && LITERAL || t
    },
    Mutator : Mutator
  }
  api.typeOf.ARRAY = ARRAY
  api.typeOf.OBJECT = OBJECT
  api.typeOf.LITERAL = LITERAL

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});