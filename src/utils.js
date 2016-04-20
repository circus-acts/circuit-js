(function(Circus){

  'use strict';

  // pull in Circus from signal - the true
  Circus = Circus || require('./circus')

  var type = {}.toString, ARRAY='A',OBJECT='O', FUNCTION='F', LITERAL = 'SNBDR'

 function diff(v1,v2, recurse) {
    var T = type.call(v1)[8]
    if (~LITERAL.indexOf(T) || T === FUNCTION || v1 === undefined || v2 === undefined || Circus.isSignal(v1)) {
      return v1!==v2
    }
    else {
      if (T === ARRAY) {
        return  v1.length !== v2.length || v1.some(function(v,i) {
          return recurse? diff(v,v2[i],recurse) : v !== v2[i]
        })
      } else if (T === OBJECT) {
        var mk = Object.keys(v1), vk = Object.keys(v2)
        return mk.length != vk.length || typeof v2 !== 'object' || mk.some(function(k,i){
          return recurse? diff(v1[k],v2[k],recurse) : v1[k] !== v2[k] || mk[i] !== vk[i]
        })
      }
    }
    return false
  }


  Circus.diff = function(v1,v2) {
    return diff(v1,v2)
  }

  Circus.deepDiff = function(v1,v2) {
    return diff(v1,v2,true)
  }

  Circus.equal = function(v1,v2) {
    return !diff(v1,v2)
  }

  Circus.deepEqual = function(v1,v2) {
    return !diff(v1,v2,true)
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

  // lens
  // return a value from a nested structure
  // useful for plucking values and signals from models and signal groups respectively
  Circus.lens = function(data,name,ns,def) {
    if (arguments.length<4) {
      def=null
    }
    var path = ((ns? ns + '.' :'') + name).split('.')
    var v = path.reduce(pathToData,data)

    if (data && v===Circus.UNDEFINED && Circus.typeOf(data) === Circus.typeOf.OBJECT && data.constructor==={}.constructor) {
      v = Object.keys(data).reduce(function(a,k){
        return a!==Circus.UNDEFINED && a || Circus.lens(data[k],name,'',def)
      },Circus.UNDEFINED)
    }
    return v!==Circus.UNDEFINED? v : def
  }

  Circus.reduce = function(s, fn, seed, tv) {
    return traverse(s, fn, seed, tv)[1]
  }

  Circus.map = function(s, fn, tv) {
    return traverse(s, fn, Circus.UNDEFINED,tv)[0]
  }

  Circus.tap = function(s, fn, tv) {
    traverse(s, fn, Circus.UNDEFINED, tv)
  }

  function traverse(s, fn, acc, tv) {
    var c = s.channels || s, seed = acc!=Circus.UNDEFINED
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
          acc = obj[n] = fn.apply(null, seed? [acc,t,v]:[t,v])
        }
      })
      return [obj,acc]
    }
    return stamp(c,fn, tv)
  }

  Circus.typeOf = function(t) {
    t = type.call(t)[8]
    return ~LITERAL.indexOf(t) && LITERAL || t
  }

  Circus.typeOf.ARRAY = ARRAY
  Circus.typeOf.OBJECT = OBJECT
  Circus.typeOf.FUNCTION = FUNCTION
  Circus.typeOf.LITERAL = LITERAL

})(Circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = Circus;
else if (typeof define == "function" && define.amd) define(function() {return Circus});