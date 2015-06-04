var circusIntent = (function(circus){

  'use strict';

  circus = circus || require('circus')
  var VALID = {}

  function Intent(signal, errorSignal, error, root, seed){
  
    if (!errorSignal) {
      error = VALID
      errorSignal = circus.signal()
    }

    var intent = root && circus.signal(seed).finally().join({
          model:circus.id,
          error:errorSignal
        }).head() || signal()

    signal = intent.signal.bind(intent)
    intent.signal = function(){ 
      return new Intent(signal,errorSignal,error)
    }

    intent.add = function(seed){
      return new Intent(signal,errorSignal,error,true,seed)
    }

    intent.error = function(fn) {
      var err = {},n = this.name()
      return this.lift(function(v){
        if (error === VALID) {
          err[n] = fn(v)
          error = err[n]? err : VALID
          errorSignal.value(error)
        }
      })
    }

    return intent
  }
  
  return circus.intent = function(seed) {return new Intent(undefined,undefined,undefined, true, seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusIntent;
else if (typeof define == "function" && define.amd) define(function() {return circusIntent});

