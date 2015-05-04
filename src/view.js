var circusView = (function(circus){

  'use strict';

  circus = circus || require('circus')

  function View(render,_signal, seed){
  
    render = render || function(){}

    var view = _signal && _signal(seed) || circus.signal(seed).map(render).head()
    
    _signal = view.signal.bind(view)
    view.signal = function(seed){
      return new View(render, _signal, seed)
    }

    return view
    
  }
  
  circus.domEvent = function (elem,eventNameOn, eventNameOff) {
	  var s =  circus.signal()
	  elem.addEventListener(eventNameOn, function(e){s.active(true).value(e)});
	  if (eventNameOff) elem.addEventListener(eventNameOff, s.active.bind(s,false));
	  return s
	}

  return circus.view = function(render) {return new View(render)}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusView;
else if (typeof define == "function" && define.amd) define(function() {return circusView});

