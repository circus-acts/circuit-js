var circusView = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function View(seed){
  
    var view = circus.signal(seed)
    
    return view
    
  }
  
  circus.domEvent = function (elem,eventNameOn, eventNameOff) {
	  var s =  circus.signal()
	  elem.addEventListener(eventNameOn, function(e){s.active(true).value(e)});
	  if (eventNameOff) elem.addEventListener(eventNameOff, s.active.bind(s,false));
	  return s
	}

  circus.view = function(seed) {return new View(seed)}
  circus.view.click = function(signal,value) {
    return signal.pulse().value.bind(signal,value||true)
  }

  return circus.view

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusView;
else if (typeof define == "function" && define.amd) define(function() {return circusView});

