(function(circus){

  'use strict';

  circus = circus || require('signal')

  var type = {}.toString, ARRAY='A',OBJECT='O', FUNCTION='F', LITERAL = 'SNBDR'

  function shallowDiff(v1,v2, recurse) {
    var t = type.call(v1)[8]
    if (~LITERAL.indexOf(t) || t === FUNCTION || v1 === undefined || v2 === undefined) {
      return v1!==v2
    }
    else {
        if (t === ARRAY) {
          return  v1.length !== v2.length || v1.some(function(v,i) {
            return recurse? shallowDiff(v,v2[i],recurse) : v !== v2[i]
          })
        } else if (t === OBJECT) {
          var mk = Object.keys(v1), vk = Object.keys(v2)
          return mk.length != vk.length || typeof v2 !== 'object' || mk.some(function(k,i){
            return recurse? shallowDiff(v1[k],v2[k],recurse) : v1[k] !== v2[k] || mk[i] !== vk[i]
          })
        }
    }
    return false
  }

  function deepDiff(v1,v2){
    return shallowDiff(v1,v2,true)
  }

  function equal(v1,v2){
    return !shallowDiff(v1,v2)
  }

  function deepEqual(v1,v2){
    return !shallowDiff(v1,v2,true)
  }

  function pathToData(data, key){
    var i = key.indexOf('[')
    if (i > 0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return data.hasOwnProperty(idxKey)? data[idxKey][idx] : circus.UNDEFINED
    }
    return data && data.hasOwnProperty(key)? data[key] : circus.UNDEFINED
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

    if (data && v===circus.UNDEFINED && circus.typeOf(data) === circus.typeOf.OBJECT && data.constructor==={}.constructor) {
      v = Object.keys(data).reduce(function(a,k){
        return a!==circus.UNDEFINED && a || lens(data[k],name,'',def)
      },circus.UNDEFINED)
    }
    return v!==circus.UNDEFINED? v : def
  }

  function reduce(s, fn, seed, tv) {
    return traverse(s, fn, seed, tv)[1]
  }

  function map(s, fn, tv) {
    var m = traverse(s, fn, circus.UNDEFINED,tv)[0]
    // break out the mapped value if s is not a channel block
    return s.channels? m : m[0]
  }

  function tap(s, fn, tv) {
    traverse(s, fn, circus.UNDEFINED, tv)
  }

  function traverse(s, fn, acc, tv) {
    var c = s.channels || [s], seed = acc!=circus.UNDEFINED
    fn = fn || function id(s){return s}
    function stamp(c, fn, sv){
      var obj = {}
      c.forEach (function(t){
        var n = t.name || 0
        var v = (sv||{})[t.name]
        if (t.channels && t.channels !== s.channels) {
          var a = stamp(t.channels,fn, v)
          obj[n] = a[0]
          acc = a[1]
        }
        else {
          acc = obj[n] = fn.apply(null, seed? [acc,t,v]:[t,v])
        }
      })
      return [obj,acc]
    }
    return stamp(c,fn, tv)
  }

  var api = {

    diff:false,
    shallowDiff: shallowDiff,
    deepDiff: deepDiff,
    equal: equal,
    deepEqual: deepEqual,
    lens: lens,
    map: map,
    reduce: reduce,
    tap: tap,
    typeOf: function(t) {
      t = type.call(t)[8]
      return ~LITERAL.indexOf(t) && LITERAL || t
    }
  }

  api.typeOf.ARRAY = ARRAY
  api.typeOf.OBJECT = OBJECT
  api.typeOf.FUNCTION = FUNCTION
  api.typeOf.LITERAL = LITERAL

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});