var circusIntent = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function Intent(signal, errorSignal, error, root, seed){
  
    if (!errorSignal) {
      error = circus.FALSE
      errorSignal = circus.signal()
    }

    var intent = root && circus.signal(seed).finally().join({
          model:circus.id,
          error:errorSignal
        },circus.signal.anyActive).head() || signal()

    signal = intent.signal.bind(intent)
    intent.signal = function(){ 
      return new Intent(signal,errorSignal,error)
    }

    intent.add = function(seed){
      return new Intent(signal,errorSignal,error,true,seed)
    }

    intent.error = function(fn) {
      var err = {}, n = this.name(), push = function(v,msg) {
        if (error === circus.FALSE) {
          err[n] = msg || fn(v)
          error = err[n]? err : circus.FALSE
          errorSignal.value(error)
        }
      }
      if (typeof fn === 'function') {
        return this.lift(push)
      }
      else push(null,fn)
      return this
    }

    return intent
  }
  
  return circus.intent = function(seed) {return new Intent(undefined,undefined,undefined, true, seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusIntent;
else if (typeof define == "function" && define.amd) define(function() {return circusIntent});

