var circus = (function(){

  'use strict';

  /*
  *  Circus MVI is implemented through the independent signals m, v and i 
  *  that feed into each other to form a circular channel folded over itself.
  *  The resulting ring circuit responds to discrete signal value changes 
  *  over time.
  */
  function circus(){

  }

  var type = {}.toString, ARRAY='A',OBJECT='O',LITERAL = 'SNBDR'

  // expose to mutation api for override
  function shallowCopy(n) {
    if (typeof n==='object') {
      if (n.length) return n.slice()
      var c={}
      Object.keys(n).forEach(function(k){
        c[k] = n[k]
      })
      return c
    }
    return n
  }

  /*
  * a value is dirty if any of its properties are dirty, or for key diff
  * ..dirty if that key value is dirty regardless of other changed props
  */
  function shallowDiff(m,v,d) {
    var dirty = circus.FALSE,mv=d? m : m.value, t = type.call(mv)[8]
    if (~LITERAL.indexOf(t) || mv === undefined || v === undefined) {
      dirty = mv!==v;
    }
    else {
      if (m.key !== undefined) {
        dirty = v[m.key] !== mv[m.key] && m.key || circus.FALSE
      }
      else {
        if (t === ARRAY) {
          for (var i=0, l=mv.length; i<l; i++) {
            if (d && shallowDiff(mv[i],v[i],d).dirty || mv[i] !== v[i]) {
              dirty=i
              break
            }
          }
        } else if (t === OBJECT) {
          var mk = Object.keys(mv), vk = Object.keys(v) 
          dirty = mk.length != vk.length || typeof v !== 'object' || mk.reduce(function(a,k){
            return a!==circus.FALSE || (d && shallowDiff(mv[k],v[k],d).dirty) || (mv[k] !== v[k] && k) || a
          },circus.FALSE)
        }
      }
    }
    return {dirty:dirty,value:mv}
  }

  function equal(m,v){
    return shallowDiff({value:m},v).dirty === circus.FALSE
  }

  function deepEqual(m,v){
    return shallowDiff(m,v,true).dirty === circus.FALSE
  }

  function pathToData(data, key){
    var i = key.indexOf('[')
    if (i > 0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return data[idxKey][idx]
    }
    return data[key]
  }

  // lens
  // memoize and return a value from a nested structure
  // useful for plucking values and signals from models and signal groups respectively
  var lensMemo = {}
  function lens(data,path){
    if (!lensMemo[path]) {
      path = path.split('.')
      lensMemo[path] = path.reduce(pathToData,data)
    }
    return lensMemo[path]
  }

  /*
  * Fold a new circus act that feeds directed MVI signals 
  */
  function fold(m,v,i) {

    // Model and intent are simple feeds but view feeds into 
    // intent through explicit bindings in the render function.
    // Put simply: views only feed through user intentions
    return {
      model: m.finally(function() {return this.feed(v)}),
      view: v,
      intent: i.finally(function() {return this.feed(m)})
    }
  }

  var api = {
    copy: shallowCopy,
    diff: shallowDiff,
    equal: equal,
    deepEqual: deepEqual,
    lens: lens,
    fold: fold,
    id: function(v) {return v}
  }

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});