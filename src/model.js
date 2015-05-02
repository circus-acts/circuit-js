var curcusModel = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function Model(state,_signal, seed){
  
    state = state || {}

    var model = _signal && _signal(seed) || circus.signal(seed)
    
    _signal = model.signal.bind(model)
    model.signal = function(seed){
      return new Model(state,_signal,seed)
    }

    var _push = model.push
    model.push = function(v,k) {
      if (v !== state) {
        state = v
        _push.call(this,v,k)
      }
      return this
    }

    return model
    
  }

  return circus.model = function(seed) {return new Model(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = curcusModel;
else if (typeof define == "function" && define.amd) define(function() {return curcusModel});

