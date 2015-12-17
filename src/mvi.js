var circusMVI = (function(circus){

  /*
  *  Circus MVI is implemented through the independent signals m, v and i
  *  that each feed one into the next in a circular m -> v -> i direction.
  */

  'use strict';

  circus = circus || require('circus')

  var typeOf = circus.typeOf

  function pathToState(data, key){
    var i, d0=data[0],d1=data[1]
    if (d0 === undefined || d1 === undefined) {
      return [true,undefined]
    }
    if ((i = key.indexOf('['))>0){
      var idx=parseInt(key.substr(i+1,key.length-2),10)
      var idxKey = key.substr(0,i)
      return [d0[idxKey][idx], d1[idxKey][idx]]
    }
    return [d0[key],d1[key]]
  }

  function mutated(state, value, path) {
    if (path[0]!=='.') path = '.' + path
    path = ('root'+path).split('.')
    var pathData = path.reduce(pathToState,[{root:state},{root:value}])
    var typeOfD = typeOf(pathData[0]), typeofV = typeOf(pathData[1])
    if ( typeOfD === typeofV && (typeOfD === typeOf.OBJECT || typeOfD === typeOf.ARRAY)) {
      return JSON.stringify(pathData[0]) !== JSON.stringify(pathData[1])
    }
    return pathData[0]!==pathData[1]
  }


  function MVI() {
    var mvi = this,
        error = circus.signal(),
        data = circus.signal([{}])

    mvi.signal = function(){
      return circus.signal.apply(null,arguments).extend({
        error: pushError()
      })
    }

    /*
    Fold the app into a new circus act that feeds directed MVI signals
      Model and intent are simple notifications that fire whenever
      their value changes, but view feeds into intent through explicit
      bindings in the render function. Put simply: views only feed
      through user intentions
    */
    var model = mvi.model = new Model(),
        view = mvi.view = new View(),
        intent = mvi.intent = new Intent()

    return mvi

    function reset(graph){
      circus.tap(graph,function(s){s.error(circus.UNDEFINED)})
    }

    function pushError() {
      var msg = ''
      return function(fn) {
        function push(v) {
          msg = msg || fn(v) || ''
        }
        if (arguments.length){
          if (typeof fn === 'function') {
            this.tap(function(v){push(v)})
          }
          else {
            msg = fn===circus.UNDEFINED? '' : msg || fn || ''
          }
          return this
        }
        return msg
      }
    }

    function pushValues(s) {
      // block model feeds during traverse
      var ma = model.active(false), err = ''
      circus.tap(s,visit)
      model.active(ma)
      error.value(err)

      function visit(s) {
        s.value(s.head())
        err =  err || s.error() || ''
      }
    }

    function Model(seed) {

      var state = seed || {}
      return circus.join({error:error, data:data}).extend(function(ctx){
        return {
          dirty: function(path) {
            return path===undefined? ctx.dirty() : mutated(state, ctx.value(), path)
          }
        }
      })
      .prime(state)
      .map(function(v){
        v.data.error = v.error
        return v.data
      })
      .map(function(v){
        state = v
        // on error, stop propagation at this state
        // bypassing all user modelling. Go straight to view
        return v.error? undefined : v
      })
      .after(function(v){
        view.value(v)
      })
    }

    function View(seed){

      return mvi.signal(seed).extend({
        click: function(signal,value) {
          return signal.pulse().value.bind(signal,value||true)
        }
      })

    }

    function Intent(seed){

      return mvi.signal(seed).extend({
        cta: function(s) {
          s = s || intent
          if (!circus.isSignal(s)) {
            s = circus.join(s)
          }

          return circus.signal().tap(function(v){
            if (v) {
              reset(intent)
              pushValues(s)
              this.active(undefined)
            }
          })
        }
      })
      .after(function(v) {
        data.value(v)
      })

    }
  }

  return circus.mvi = function() {return new MVI()}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusMVI;
else if (typeof define == "function" && define.amd) define(function() {return circusMVI});

