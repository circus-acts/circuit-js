var circusMVI = (function(circus){

  /*
  *  Circus MVI is implemented through the independent signals m, v and i
  *  that feed into each other to form a circular channel folded over itself.
  *  The resulting ring circuit responds to discrete signal value changes
  *  over time.
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
    var typeOfD = typeOf.call(pathData[0]), typeofV = typeOf.call(pathData[1])
    if ( typeOfD === typeofV && (typeOfD === typeOf.OBJECT || typeOfD === typeOf.ARRAY)) {
      return JSON.stringify(pathData[0]) !== JSON.stringify(pathData[1])
    }
    return pathData[0]!==pathData[1]
  }


  function MVI() {
    var mvi = this,
        err = false,
        errGraph

    mvi.signal = function(){
      var signal = circus.signal()
      signal.error = pushError
      return signal
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

    function reset(){
      // stamp out a 'valid' error graph
      mvi.error = errGraph = circus.map(intent,function(){return false})
      err = false
    }

    function pushError(fn) {
      var n,ns,m,e, _this = this, step = this.step()
      function push(v,c,msg) {
        if (!errGraph) reset()
        m = msg || (fn && fn(v))
        if (m) {
          n = n || _this.name || 'value'
          ns = ns || _this.namespace || ''
          e = circus.lens(errGraph,ns) || errGraph
          e[n] = e[n] || m
          err = err || m
        }
      }
      if (typeof fn === 'function') {
        this.lift(function(v){push(v)})
      }
      else {
        var msg = fn
        fn=undefined
        push(null,null,msg)
      }
      return this
    }

    return mvi

    function prime(values,s) {
      // block model feeds during traverse
      var ma = model.active(false)
      circus.traverse(s,visit)
      model.active(ma)

      function visit() {
        var v = circus.lens(values,this.signal.name, this.signal.namespace)
        this.signal.value(v)
      }
    }


    function Model() {

      var state = {}

      var model = mvi.signal()
      .map(function(v){
        return err? circus.FALSE : v
      })
      .finally(function(v){
        v = err? view.head() : v
        view.value(v)
      })

      var _value = model.value.bind(model)
      model.value = function(v) {
        state = _value()
        return _value(v)
      }

      var _dirty = model.dirty.bind(model)
      model.dirty = function(path) {
        return path===undefined? _dirty() : mutated(state, _value(), path)
      }

      return model
    }

    function View(){

      var view = mvi.signal().finally(reset)

      view.click = function(signal,value) {
        return signal.pulse().value.bind(signal,value||true)
      }

      return view
    }

    function Intent(){

      var intent = mvi.signal().finally(function(v) {
        model.value(v)
      })

      intent.prime = function(values,inactive) {
        values = values || circus.map(intent,function(){return ''})
        prime(values,intent)
        if (inactive) reset()
        view.value(values)
      }

      intent.cta = function(s) {
        s = s || intent
        if (!circus.isSignal(s)) {
          s = circus.signal()
          s.join.apply(s,arguments)
        }

        return circus.signal().lift(function(v){
          if (v) {
            prime(view.head(),s)
            this.active(undefined)
          }
        })
      }

      return intent
    }
  }

  return circus.mvi = function() {return new MVI()}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusMVI;
else if (typeof define == "function" && define.amd) define(function() {return circusMVI});

