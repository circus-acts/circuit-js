  var mithrilCircus = (function(circus,circusMVI,mithril){

  'use strict';

  circus = circus || require('circus')
  circusMVI = circusMVI || require('circusMVI')
  mithril = mithril || require('mithril')

  function MithrilMVI() {
    var mvi = circusMVI()

    // Opt-in mutable state.
    // Mithril will only redraw guarded sections when their model
    // bindings are dirty
    mithril.mutateOn = function(binding) {
      var args = [].slice.call(arguments,1)
      return mvi.model.dirty(binding)? mithril.apply(null,args) : {subtree:'retain'}
    }

    // extend mithril into signal
    circus.signal.extendBy({

      httpGET: function (url, map) {
        return signal.request({url:url,method:'GET'},map)
      },

      httpPOST: function (url,map) {
        return signal.request({url:url,method:'POST'},map)
      },

      request: function (options,map) {
        var ctx = this

        if (!map) map = populate

        return this.tap(function(v) {
          options = map(circus.copy(options),v)

          //TODO: aggregate outstanding promises to ensure sequence
          mithril.request(options).then(response,error)

          // shape response / error into standard MVI channels
          function response(data) {
            s.value({data:data})
          }

          function error(err) {
            ctx.error(err || 'invalid request')
          }
        })

        function populate(options,data) {
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
      var started=0

      return {
        view: view
      }

      // project latest render into mithril component. Note that the application state
      // can vary independently of mithril redraw.
      function view() {
        // kick-start the app by priming with a seed value.
        // if seed is provided, the app will enter an active (validated) state,
        // otherwise it will enter an inactive state with empty values
        if (!started++ && seed) {
          mvi.intent.prime(seed)
        }
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