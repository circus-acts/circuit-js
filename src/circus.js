'use strict';

var _types = {}.toString, ARRAY='A',OBJECT='O', FUNCTION='F', LITERAL = 'SNBDR'
var _type = function(t) {
  return _types.call(t)[8]
}
var _typeOf = function(t) {
  t = _type(t)
  return ~LITERAL.indexOf(t) && LITERAL || t
}

_type.ARRAY = ARRAY
_type.OBJECT = OBJECT
_type.FUNCTION = FUNCTION
_type.LITERAL = LITERAL

function extend(proto, ext) {
  var args = [].slice.call(arguments,2)
  if (ext) {
    Object.keys(ext).forEach(function(k){
      proto[k] = ext[k]
    })
    args.unshift(proto)
    proto = extend.apply(null, args)
  }
  return proto
}

function fail(v) {
  if (!(this instanceof fail)) return new fail(v);
  this.value = v
}

var api = {
  UNDEFINED: Object.freeze({value:undefined}),
  extend: extend,
  fail: fail,
  typeOf : _typeOf,
  type: _type
}

export { extend, fail }
export default api