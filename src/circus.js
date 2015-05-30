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
  function shallowDiff(m,v) {
    var dirty = circus.FALSE,nv=m.value
    if (m.key !==undefined) {
      dirty = v[m.key] !== nv[m.key] && m.key || circus.FALSE
    }
    else {
      if (nv.length) {
        for (var i=0, l=nv.length; i<l; i++) {
          if (nv[i] !== v[i]) {
            dirty=i
            break
          }
        }
      } else {
        dirty = Object.keys(nv).reduce(function(a,k){
          return a!==circus.FALSE || (nv[k] !== v[k] && k) || a
        },circus.FALSE)
      }
    }
    return {dirty:dirty,value:nv}
  }

  /*
  * Stage a new circus act that feeds directed MVI signals 
  */
  function stage(m,v,i) {

    // Model and intent are simple feeds but view feeds into 
    // intent through explicit bindings in the render function.
    m.finally().feed(v.head())
    i.finally().active(function(){return i.dirty()}).feed(m.head())

    return {
      model: m.head(),
      view: v.head(),
      intent: i.head()
    }
  }

  var api = {

    FALSE: Object.freeze({}),
    UNDEFINED: Object.freeze({}),
    copy: shallowCopy,
    diff: shallowDiff,
    stage: stage,
    id: function(v) {return v}
  }

  // publish the api on the main circus function
  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});