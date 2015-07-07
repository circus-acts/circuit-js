var circusIntent = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function Intent(seed){
  
    var err = {},
        error = circus.signal()

    var intent = circus.signal(seed).finally(function(){
      return this.join({
        data:circus.id,
        error:error
      })
    })

    intent.signal = function(seed){
      var signal = circus.signal(seed)
      signal.error = intent.error
      return signal
    }

    intent.error = function(fn) {
      var n = this.name() || 'data'
      function push(v,msg) {
        var m = msg || fn(v)
        if (!err[n] || !m) {
          err[n] = m
          error.value(err)
        }
      }
      if (typeof fn === 'function') {
        this.lift(push)
      }
      else push(null,fn)
      return this
    }

    return intent
  }
  
  return circus.intent = function(seed) {return new Intent(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusIntent;
else if (typeof define == "function" && define.amd) define(function() {return circusIntent});

