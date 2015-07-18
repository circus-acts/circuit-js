  var mithrilCircus = (function(circus,mvi,mithril){

  'use strict';

  mithril = mithril || require('mithril')
	circus = circus || require('circus')
  mvi = mvi || require('circusMVI')

  // A simple adaptor that kick starts the application before
  // returning the rendered view wrapped in a mithril component.
  var _fold = mvi.fold
  mvi.fold = function(m, v, i, seed) {
    var app = _fold(m, v, i), started=0

    var api = {
      mutateOn: mutateOn,
      view: view
    }

    return api

    // Opt-in mutable state. 
    // Mithril will only redraw guarded sections when their model
    // bindings are dirty 
    function mutateOn (binding) {
      var args = [].slice.call(arguments,1)
      return app.model.dirty(binding)? mithril.apply(null,args) : {subtree:'retain'}
    }

    // project latest render into mithril component. Note that the application state
    // can vary independently of mithril redraw.
    function view() {
      // kick-start the app 
      if (!started++ && seed) {
        m.value(seed)
      }
      return app.view.value()
    }
  }

  // extend mithril into signal 
  var _signal = mvi.signal
  mvi.signal = function(seed) {

    var signal = _signal(seed)

    signal.httpGET = function (url, map) {
      return signal.request({url:url,method:'GET'},map)
    }

    signal.httpPOST = function (url,map) {
      return signal.request({url:url,method:'POST'})
    }

    signal.request = function (options,map) {
      var s = this.next()

      if (!map) map = populate

      return this.tap(function(v) {
        options = map(circus.copy(options),v)
        mithril.request(options).then(response,error)

        // shape response / error into standard MVI channels
        function response(data) {
          s.value({data:data})
        }

        function error(err) {
          s.value({error:err})
        }
      })
    }

    function populate(options,data) {
      if (options.method === 'GET') {
        Object.keys(data).forEach(function(k){
          options.url.replace(':'+k,data[k])
        })
      }
      else options.data = data
      return options
    }

    return signal
  }

  return circus

})(circus,circusMVI,m)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = mithrilCircus;
else if (typeof define == "function" && define.amd) define(function() {return mithrilCircus});