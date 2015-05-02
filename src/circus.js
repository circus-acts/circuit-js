var circus = (function(){

  'use strict';

  // Circus MVI is implemented through the independent signals m, v and i 
  // that feed into each other to form a circular channel folded over itself.
  // The resulting circus ring responds to descrete signal value changes 
  // over time.
  function circus(m,v,i){

    // fold circus 
    m.tail().feed(v)
    v.tail().feed(i)
    i.tail().feed(m)

    return {
      model: m,
      view: v,
      intent: i
    }
  }

  var api = {

    FALSE: Object.freeze({}),
    UNDEFINED: Object.freeze({})

  }

  Object.keys(api).forEach(function(k){circus[k] = api[k]})

  return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});