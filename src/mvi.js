var circusMVI = (function(circus){

  /*
  *  Circus.MVI
  *  Application state and logic is completely expressed by and manipulated through
  *  circus signals, arranged as M(odel) V(iew) I(ntent) circuitry that cyclically
  *  feeds the values of each signal into the next.
  *
  *  The direction of information travel is strictly M -> V -> I
  *
  *            +--> Model--+
  *            ^           |
  *            |           v
  *          Intent <--  View
  *
  *  This micro framework also provides a dedicated error signal that bypasses
  *  the model and feeds directly into the view.
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
        head = function(s) {return s.head},
        justIntent = function(v) {return v.intent || v},
        justModel = function(v) {return v.intent? circus.map(mvi.intent,head) : v},
        maybeError = {error:function(v){
          return v===true || circus.FALSE}},
        justValid = {error:function(v){
          return v===false}}

    var error = circus.signal('error').pulse(),
        intent = new Intent(),
        model = new Model(),
        view = new View()


    var mviError = false
    circus.stateStart = function(ctx) {
      mviError=false
    }

    circus.stateEnd = function(ctx) {
      error.value(mviError)
    }

    mvi.signal = function(){
      return circus.signal.apply(null,arguments).extend(function(ctx){
        return {
          value: trapValue(ctx),
          error: pushError(ctx)
        }
      })
    }

    mvi.prime = function(seed) {
      circus.signal().tap(function(pv){
        circus.tap(mvi.intent, function(s,v){
          s.value(v)
          s.error('')
        }, seed || {})
        mviError=pv
      }).value(true)
      return this
    }

    function trapValue(ctx) {
      var _value = ctx.value
      return function(v) {
        if (arguments.length) {
          ctx.head = v
        }
        var nv = _value.apply(ctx,arguments)
        return nv
      }
    }

    function pushError(ctx) {
      var _error
      function push(msg) {
        _error = !msg? '' : _error || msg
        mviError = mviError || !!_error
      }
      return function(f) {
        if (typeof f !== 'function') {
          if (arguments.length) {
            push(f)
          }
          return _error
        }
        return ctx.map(function(v){
          push(f(v))
          return _error? undefined : v
        })
      }
    }

    function Model() {
      return mvi.model = mvi.signal('model').extend(function(ctx){
        return {
          dirty: function(path) {
            return path===undefined? ctx.dirty() : mutated(state, ctx.value(), path)
          }
        }
      })
      .merge(intent).match(justValid).map(justIntent)
    }

    function View(){
      return mvi.view = mvi.signal('view').extend({
        click: function(signal,value) {
          return signal.pulse().keep(0).value.bind(signal,value||true)
        }
      })
      .merge(intent,model).map(justModel)
    }

    function Intent(){
      mvi.intent = mvi.signal('intent').extend({
        // Call To Action: this signal maps over a subset of intentions, feeding them
        // with their own head values (as if the user had entered all of them through the view)
        cta: function() {
          // all intentions or subset?
          var ss = arguments.length? mvi.join.apply(null,arguments) : mvi.intent
          return mvi.signal().tap(function(v) {
            if (v){
              circus.tap(ss,function(s){
                s.value(s.head)
              })
            }
          })
        }
      })
      return mvi.join(mvi.intent,error)
    }

    return mvi
  }

  MVI.prototype = Object.create(circus.prototype)
  MVI.prototype.constructor = MVI

  return circus.mvi = function() {return new MVI()}

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circusMVI;
else if (typeof define == "function" && define.amd) define(function() {return circusMVI});

