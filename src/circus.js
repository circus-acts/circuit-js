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

function test(f, m) {
  return function(v) {
    var j = f.apply(this,arguments)
    return j? (j===true? v : j) : api.fail(m)
  }
}

var api = {
  extend: function extend(proto, ext) {
    var args = [].slice.call(arguments,2)
    if (ext) {
      Object.keys(ext).forEach(function(k){
        proto[k] = ext[k]
      })
      args.unshift(proto)
      proto = extend.apply(null, args)
    }
    return proto
  },

  test: test,
  typeOf : _typeOf,
  type: _type
}

export { test }
export default api