  var mithrilCircus = (function(circus,circusMVI,mithril){

  'use strict';

  circus = circus || require('circus')
  circusMVI = circusMVI || require('circusMVI')
  mithril = mithril || require('mithril')

  function MithrilMVI() {
    var mvi = circusMVI()
    //mvi.view.debounce()

    // Opt-in mutable state. Mithril will only redraw guarded sections
    // when their model bindings are dirty
    mithril.mutateOn = function(binding) {
      var args = [].slice.call(arguments,1)
      return mvi.model.dirty(binding)? mithril.apply(null,args) : {subtree:'retain'}
    }

    // sync to latest request
    var requestId=0

    // extend mithril into signal
    circus.signal.extendBy({

      httpGET: function (url, map) {
        return this.request({url:url,method:'GET'},map)
      },

      httpPOST: function (url, map) {
        return this.request({url:url,method:'POST'},map)
      },

      request: function (options, map) {
        var ctx = this
        if (!map) map = autoPopulate

        return this.map(function(v, next) {
          options = map(circus.map(options),v)
          mithril.request(options).then(response(++requestId),error)

          // shape response / error into standard MVI channels
          function response(key) {
            return function(data) {
              if (key===requestId) {
                next(data)
              }
            }
          }

          function error(err) {
            // todo: sort out signal inheritance
            //ctx.error(err || 'invalid request')
            next(circus.FALSE)
          }
        })

        function autoPopulate(options,data) {
          if (options.method === 'GET') {
            Object.keys(data).forEach(function(k){
              options.url.replace(':'+k,data[k])
            })
          }
          else options.data = data
          return options
        }
      }
    })

    // A simple decorator that kick starts the application before
    // returning the rendered view wrapped in a mithril component.
    mvi.component = function(seed) {

      // kick-start the app by priming mvi state with a seed value.
      mvi.prime(seed)

      return {
        view: view
      }

      // project latest render into mithril component. Note that the application state
      // can vary independently of mithril redraw.
      function view() {
        return mvi.view.value()
      }
    }

    return mvi
  }

  circus.mvi = function(seed) {return new MithrilMVI(seed)}

  return circus

})(circus,circusMVI,m)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = mithrilCircus;
else if (typeof define == "function" && define.amd) define(function() {return mithrilCircus});