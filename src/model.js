var curcusModel = (function(circus){

  'use strict';

  circus = circus || require('circus')

  var type = {}.toString
  var idx,idxKey

  function pathToState(data, key){
    var i, d0=data[0],d1=data[1]
    if (d0 === undefined || d1 === undefined) {
      return [true,undefined]
    }
    if ((i = key.indexOf('['))>0){
      idx=parseInt(key.substr(i+1,key.length-2),10)
      idxKey = key.substr(0,i)
      return [d0[idxKey][idx], d1[idxKey][idx]]
    }
    return [d0[key],d1[key]]
  }

  function mutated(state, value, path) {
    if (path[0]!=='.') path = '.' + path
    path = ('root'+path).split('.')
    var pathData = path.reduce(pathToState,[{root:state},{root:value}])
    var typeOfD = type.call(pathData[0]), typeofV = type.call(pathData[1])
    if ( typeOfD === typeofV && (typeOfD === '[object Object]' || typeOfD === '[object Array]')) {
      return JSON.stringify(pathData[0]) !== JSON.stringify(pathData[1])
    }
    return pathData[0]!==pathData[1]
  }
  
  function Model(seed) {
  
    var state = {}

    var model = circus.signal(seed)
    
    var _value = model.value.bind(model)
    model.value = function() {
      state = circus.copy(_value())
      return _value.apply(this,arguments)
    }

    var _dirty = model.dirty.bind(model)
    model.dirty = function(binding) {
      return binding===undefined? _dirty() : mutated(state, _value(), binding)
    }

    return model
    
  }

  circus.model = function(seed) {return new Model(seed)}

  return circus.model

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = curcusModel;
else if (typeof define == "function" && define.amd) define(function() {return curcusModel});

