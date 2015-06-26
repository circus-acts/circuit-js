var signal = (function(circus){

'use strict';

circus = circus || require('circus');

var cid=0
var nullMutator = {}
var noop = function(){}
var type = {}.toString

circus.alwaysDiff = false

function Channel(head,id){
  this.id = id
  this.head = head
  this.seed = circus.UNDEFINED
}

function Signal(seed, chan, fchan){
  var id = this.id = ++cid
  var _l = 0
  var _f = []
  var _chan = chan instanceof Channel && chan || new Channel(this,id)
  var _depth = _chan.keep
  var _v = _depth? []: undefined
  var _fchan = fchan
  
  if (!_fchan) _chan.tail = this
  _chan.ftail = this

  function next() {
    var v = _depth? _v[_v.l]:_v
    if (v!==undefined) v = v.value
    for (var j = 0, fl = _f.length; j < fl; j += 1) {
      _f[j].call(null, v,_chan.key)
    }
  }

  function getValue(v) {
    return (_depth? v[v.l]:v) || {dirty:true,value:undefined}
  }

  function setValue(v,m,diff){
    var cv = getValue(_v)
    var cvv = cv.value
    cv = m===v && diff(m,cvv) || {dirty:v===cvv && circus.FALSE || cvv, value:v}
    if (_depth) {
      if (_l === _depth) {_v.shift();_l--}
      _v.push(cv)
    } else {
      _v=cv
    }
    _v.l = _l++
    _chan.state = cv
  }

  function _seed() {
    if (_chan.seed !== circus.UNDEFINED) {
      var _this = this, seed = _chan.seed
      _chan.seed = circus.UNDEFINED
      seed.forEach(function(v) {_chan.head.value(v)})
    }    
  }

  this.name = function(n){
    if (n!==undefined) {
      _chan.name = n
      return this
    }
    return _chan.name
  }

  // Set the value of a signal. The new value will propagate through the signal channel
  // If the signal depth is undefined the new value replaces the existing one.
  // If the number of values == the depth the first value is dropped.
  this.value = function (v,c,m) {
    _seed() 
    if (arguments.length) {
      if (_chan.on || _chan.on===undefined){
        _chan.key = c
        _chan.on = true
        setValue(v, m || nullMutator, circus.diff)
        next()
        if (_chan.tail === this && _chan.finally && _chan.finally !== this) {
          _chan.finally.value(v)
        }
        if (_chan.pulse) {
          _chan.on = undefined
          setValue(undefined, nullMutator, circus.diff)
        }
      }
      return this
    }
    return (
      _l ? getValue(_v).value
         : _depth? []:undefined
    )
  }

  // The final state of the signal channel
  this.state = function() {
    _seed()
    return _chan.state && _chan.state.value || undefined
  }

  // Push values onto signal channel head
  this.head = function(v){
    if (arguments.length) {
      _chan.head.value(v)
    }
    return _chan.head
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    var v = getValue(_v)
    return v.dirty!==circus.FALSE || v.dirty===key
  }
  
  // Lift a function into a signal. 
  // The function will be called in global context
  // the function arguments will be the current signal value
  this.lift = function(f) {
    _f[this===_chan.finally? 'unshift':'push'](f)
    return this
  }

  // Tap the current value of the signal.
  // Value is dependent on the channel position of the signal
  // Synonym for lift
  this.tap = this.lift
  
  // Add a new signal to the signal channel after the current signal position
  // Signal value will be propagated though all signals at this point
  this.signal = function(){
    return new Signal(undefined, _chan, _fchan || this===_chan.finally || _chan.finally===true)
  }
  
  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(reset) {
    if (reset!==undefined) {
      _chan.on=!!reset
      return this
    }
    return !!_chan.on
  }
  
  // channel depth - overrides signal depth
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.keep = function(n) {
    _chan.keep = n < 2? undefined : (n || -1)
    _depth = _chan.keep
    if (_v===undefined) _v=[]
    return this
  }

  // signal depth == channel keep or:
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.depth = function(n) {
    _depth = _chan.keep && n !== _chan.keep? _chan.keep : n < 2? undefined : (n || -1)
    if (_v===undefined) _v=[]
    return this
  }

  // Pulse signal channel with latest value
  // Channel will be off after propagation 
  this.pulse = function() {
    _chan.pulse = true
    return this
  }

  // Functions lifted onto the channel after finally
  // will be propagated after all other channel signals in FILO order
  this.finally = function() {
    if (!_chan.finally) {
      _chan.finally = true
      _chan.finally = this.signal()
      if (_chan.seed === circus.UNDEFINED && this.active()) {
        _chan.finally.value(_chan.tail.value())
      }
    }
    return _chan.finally
  }

  // Return the current channel history as an array 
  this.history = function(f) {
    _seed()
    if (this!==_chan.ftail) {
      return _chan.ftail.history(f)
    }
    var _this = this
    if (typeof f === 'function') {
      return this.lift(function(){
        f(_this.history())
      })
    }
    return _l
      ? (_depth? _v:[_v]).map(function(v){return v.value})
      : []
  }

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal
  if (seed!==undefined && seed[0] !== undefined) {
    var _this = this;
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        _chan.name = arg
      }
      else if (arg instanceof Signal) {
        _this.feed(arg)
      }
      else _chan.seed = arg
    })
  }

}

// Then - chainable context
Signal.prototype.then = function(f) {
  return f.call(null,this)
}

// Feed signal values into fanout signal channel(s)
Signal.prototype.feed = function() {
  var _this = this, p = popTail(arguments), args = p.signals,fn = p.tail
  args.forEach(function(fs){
    _this.lift(function(v){
      if (!fn || fn(v)) fs.head(v)
    })
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.diff
Signal.prototype.copy = circus.copy

// Map a signal onto a new signal on the same channel
// the mapping function receives the current signal value and
// an opt-in mutator object. The mapping function should return a new 
// value or the mutator object containing the value.
Signal.prototype.map = function(f) {
  var _this = this, s = this.signal()
  var m = /\(.+,.+,.+\)\s*[{=]/.test(f.toString())
  this.lift(function(v,c){
    var args = [v,c]
    if (m || circus.alwaysDiff) {
      m={value:Signal.prototype.copy(v),dirty:_this.dirty()}
      if (circus.alwaysDiff) args = [m,c]; else args.push(m)
    }
    var v = f.apply(null,args)
    if (v !== circus.FALSE) {
      s.value(v,c,m)
    }
  })
  return s
}

Signal.prototype.reduce = function(f,accum) {
  var _this = this, s = this.signal()
  return this.map(function(){
    if (!accum) {
      accum = _this.value()
    }
    else {
      var args = [accum].concat([].slice.call(arguments))
      accum = f.apply(null,args)
    }
    return accum
  })
}

function join(_this, sampleOnly, joinOnly, args) {
  var s = _this.signal()
  var tkey = _this.name() || 0, keys = [tkey]
  var joinFn = args.tail
  var signals = args.signals

  var jpName = signals.shift()
  if (typeof jpName !== 'string') {
    signals.unshift(jpName)
    jpName=false
  }

  if (signals.length) {
    var sblock = signals.pop(),sid
    if (!(sblock instanceof Signal)) {
      Object.keys(sblock).forEach(function(k){
        var id = sblock[k] === circus.id, s = id? _this:sblock[k] 
        s.name(k)
        if (s === _this) 
          tkey = k
        else
          signals.push(s)
        
        sid = sid || id
      })
    }
    else signals.push(sblock)
  }

  signals.unshift(sampleOnly? false:_this)
  var h = _this.head(), jp = h.jp || {}, isJoin = h.jp && joinOnly
  if (jpName) {
    keys[0] = joinOnly? signals[0].name() || 0 : undefined
    jp[jpName] = {join:function(j,fn) {
      var l = signals.length
      signals.push(j)
      return signals[l].lift(valueOf(l,fn))
    }}
  }
  h.jp = jp

  var si = sampleOnly? 1:0
  function valueOf(i,fn) {
    var key = keys[i+si] = signals[i].name() || i+si
    fn = fn || joinFn
    return function(v) {
      var nv
      if (signals.reduce(anyDirty,false)) {
        if (isJoin) nv = Signal.prototype.copy(_this.value()); else {nv={}; nv[tkey]=_this.value()}
        signals.forEach(function(a,j){if (j || !isJoin) nv[keys[j+si]] = a.value()})
      }
      else {
        nv = s.value()
        nv[key] = v
      }
      if (sampleOnly && !sid) nv[tkey]=_this.value()
      var test = !fn || fn.call(null,nv,key)
      if (test) {
        if (joinOnly) {
          v = nv
          if (typeof test === 'object') {
            v = test
            if (test instanceof Test) {
              v = test.value
              if (test.mask) {
                v = {}, test = test.value
                Object.keys(test).forEach(function(k){
                  if (test[k]) v[k] = nv[k]
                })
              }
            }
          }
        }
        s.value(sampleOnly? _this.value() : v,key)
      }
    }
  }

  // lift current value of target signal 
  var i = !sampleOnly && signals[0]? 1:0 
  if (i) signals[0].lift(valueOf(0)); else signals.shift()
  for (var l = signals.length; i<l; i++) {
    // lift final values of incoming signals
    signals[i].finally().lift(valueOf(i))
  }
  return s
}

function joinAt(_this, args, mapFn) {
  var p = popTail(args), args = p.signals,fn = p.tail
  args.forEach(function(jp){jp.join(_this,fn)})
  return _this.map(function(v){
    return mapFn(fn,v)?  v : circus.FALSE
  })
}

function popTail(args, def, type) {
  var tail
  args = [].slice.call(args)
  if (args.length) {
    var tail = args.pop()
    if (typeof tail !== (type || 'function') || tail instanceof Signal) {
      args.push(tail)
      tail = def
    }
  }
  return {signals:args,tail:tail}
}

function anyDirty (a,s) {return a || s.dirty()}
function Test(prop,value) {
  this[prop] = true
  this.value = value
}
function extend(o1, o2) {
  Object.keys(o2).forEach(function(k){
    o1[k] = o2[k]
  })
  return o1
}

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as keyed or indexed output values
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true. Default - join all
Signal.prototype.join = function(){
  return join(this,false,true,popTail(arguments,_allActive))
}

// Merge 2 or more input signal values into 1 output signal value
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true. Default - merge any
Signal.prototype.merge = function(fn){
  return join(this,false,false,popTail(arguments,_anyActive))
}

// Sample input signal(s). The output signal will be active when any of the 
// input signals are active or the optional guard function returns true.  
// Default - signal any
Signal.prototype.sample = function() {
  return join(this,true,false,popTail(arguments,_anyActive))
}

// Split a signal into two or more channels. The signal value will be propagated
// in all channels (default or true) or none at all (false)
Signal.prototype.split = function() {
  return joinAt(this,arguments,function(fn,v){
    return !fn || fn(v)
  })
}

// Switch a signal into one or more different channels. The signal value will 
// either be propagated in the new channels (default or true) or the existing
// channel (false)
Signal.prototype.switch = function() {
  return joinAt(this,arguments,function(fn,v){
    return fn && !fn(v)
  })
}

circus.signal = function(seed){return new Signal(arguments)}

circus.signal.allActive = function(v) {
  return Object.keys(v).reduce(function(a,k){return a && v[k]!==undefined},true)
}

circus.signal.anyActive = function(v) {
  return Object.keys(v).reduce(function(a,k){return a || v[k]!==undefined},false)
}

circus.signal.mask = function(obj) {
  return new Test('mask',obj)
}

circus.signal.pick = function(v) {
  return new Test('pick',v)
}

circus.signal.extendBy = function(obj) {
  extend(Signal.prototype,obj)
}

var _allActive = circus.signal.allActive
var _anyActive = circus.signal.anyActive

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

