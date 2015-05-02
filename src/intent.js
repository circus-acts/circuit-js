var circusIntent = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function Intent(state,_signal, seed){
  
    state = state || {}

    var intent = _signal && _signal(seed) || circus.signal(seed)
    
    _signal = intent.signal.bind(intent)
    intent.signal = function(seed){
      return new Intent(state,_signal,seed)
    }

    var _push = intent.push
    intent.push = function(v,k) {
      if (v !== state) {
        state = v
        _push.call(this,v,k)
      }
      return this
    }

    return intent

  }
  
  return circus.intent = function(seed) {return new Intent(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusIntent;
else if (typeof define == "function" && define.amd) define(function() {return circusIntent});

