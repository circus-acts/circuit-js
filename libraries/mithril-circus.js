  var mithrilCircus = (function(circus,mithril){

  'use strict';

  mithril = mithril || require('mithril')
	circus = circus || require('circus')

  // A simple adaptor that kick starts the application before
  // returning the rendered view wrapped in a mithril component.
  var _fold = circus.fold
  circus.fold = function(m, v, i, seed) {
    var app = _fold(m, v, i), started=0

    return {
      // Opt-in mutable state. 
      // Mithril will only redraw guarded sections when their model
      // bindings are dirty 
      mutateOn: function(binding) {
        var args = [].slice.call(arguments,1)
        return app.model.dirty(binding)? mithril.apply(null,args) : {subtree:'retain'}
      },
  
      // project latest render into mithril component. Note that the application state
      // can vary independently of mithril redraw.
      view: function() {
        // kick-start the app 
        if (!started++) {
          m.value(seed || '')
        }
        return app.view.value()
      }
    }
  }

  return circus

})(circus,m)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = mithrilCircus;
else if (typeof define == "function" && define.amd) define(function() {return mithrilCircus});