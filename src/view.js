var circusView = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function View(state,_signal, seed){
  
    state = state || {}

    var view = _signal && _signal(seed) || circus.signal(seed)
    
    _signal = view.signal.bind(view)
    view.signal = function(seed){
      return new View(state,_signal,seed)
    }

    var _push = view.push
    view.push = function(v,k) {
      if (v !== state) {
        state = v
        _push.call(this,v,k)
      }
      return this
    }

    return view
    
  }
  
  circus.domEvent = function (elem,eventNameOn, eventNameOff) {
	  var s =  circus.signal()
	  elem.addEventListener(eventNameOn, function(e){s.active(true).value(e)});
	  if (eventNameOff) elem.addEventListener(eventNameOff, s.active.bind(s,false));
	  return s
	}

  return circus.view = function(seed) {return new View(seed)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusView;
else if (typeof define == "function" && define.amd) define(function() {return circusView});

