var circus = (function(){

  'use strict';

  function circus(){

  }

  var type = {}.toString, ARRAY='A',OBJECT='O',LITERAL = 'SNBDR'

  function shallowDiff(v1,v2, recurse) {
    var t = type.call(v1)[8]
    if (~LITERAL.indexOf(t) || v1 === undefined || v2 === undefined) {
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

  function reduce(s, fn, seed) {
    return traverse(s, fn, seed)[1]
  }

  function map(s, fn) {
    return traverse(s, fn)[0]
  }

  function tap(s, fn) {
    traverse(s, fn)
  }

  function traverse(s, fn, acc) {
    var c = s.channels, seed = arguments.length===3
    function stamp(c, fn){
      var obj = {}
      c.forEach (function(t){
        var n = t.name
        if (t.channels && t.channels !== s.channels) {
          var a = stamp(t.channels,fn, acc)
          obj[n] = a[0]
          acc = a[1]
        }
        else {
          acc = obj[n] = fn.apply(null, seed? [acc,t]:[t])
        }
      })
      return [obj,acc]
    }
    return stamp(c,fn)
  }

  var api = {

    TRUE: Object.freeze({state:true}),
    FALSE: Object.freeze({state:false}),
    NULL: Object.freeze({state:null}),
    UNDEFINED: Object.freeze({state:undefined}),

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
  api.typeOf.LITERAL = LITERAL

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});