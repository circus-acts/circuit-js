var CircusMVI = (function(Circus){

  /*
  *  Circus.MVI
  *  Application state and logic is completely expressed by and manipulated through
  *  Circus signals, arranged as M(odel) V(iew) I(ntent) circuitry that cyclically
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

  Circus = Circus || require('Circus')

  function MVI() {
    var mvi = new Circuit()

    // selectors
    var justHead = function(s) {return s.head},
        justIntent = function(v) {
          return v.hasOwnProperty('intent')? v.intent : v},
        justModel = function(v) {
          return v.hasOwnProperty('intent')? Circus.map(mvi.intent,justHead) : v},
        maybeError = {error:function(v){
          return v===true || Circus.FALSE}},
        justValid = {error:function(v){
          return v===false}},
        withIntent = function(v) {
          return v.hasOwnProperty('intent')? v : {intent:v, error:false}
        }

    // capture the start and end events associated with a state change
    mvi.stateChange(
      function() { mviError=false },
      function() { error.value(mviError) }
    )

    mvi.extend(function(ctx){
      return {
        value: trapValue(ctx),
        error: pushError(ctx)
      }
    })

    mvi.prime = function(seed) {
      mvi.signal().tap(function(pv){
        Circus.tap(mvi.intent, function(s,v){
          s.value(v)
          s.error('')
        }, seed || {})
        mviError=pv
      }).value(true) // don't prime model
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

    var error = mvi.signal('error').pulse(),
        mviError = false,
        intent = new Intent(),
        model = new Model(),
        view = new View()

    function Model() {
      return mvi.model = mvi.signal('model')
      .map(withIntent)
      .merge(intent).match(justValid).map(justIntent)
    }

    function View(){
      return mvi.view = mvi.signal('view').extend({
        error: function() {
          return mviError
        },
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
          var ss = arguments.length? mvi.join.apply(mvi,arguments) : mvi.intent
          return mvi.signal().tap(function(v) {
            if (v){
              Circus.tap(ss,function(s){
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

  return Circus.mvi = function() {return new MVI()}

})(Circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = CircusMVI;
else if (typeof define == "function" && define.amd) define(function() {return CircusMVI});

