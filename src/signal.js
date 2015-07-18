var signal = (function(circus){

'use strict';

//todo: $ise public props

circus = circus || require('circus');

var cid=0
var nullMutator = {}
var noop = function(){}
var type = {}.toString

circus.alwaysDiff = false
circus.TRUE =  Object.freeze({'true':true})
circus.FALSE =  Object.freeze({'false':true})
circus.UNDEFINED = Object.freeze({'undefined':true})
circus.MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

function Signal(seed){

  var _key
  var _on
  var _state
  var _pulse
  var _filo = [], _finally
  var _notify = []
  var _seed = circus.UNDEFINED
  var _keep = 1
  var _head = new SignalStep(), _step = _head, _tail
  this.id = cid

  function seedValue() {
    if (_seed !== circus.UNDEFINED) {
      var seed = _seed
      _seed = circus.UNDEFINED
      seed.forEach(function(v) {_head.value(v)})
    }    
  }

  this.next = function() {
    return _step.next || new SignalStep()
  }
  
  this.step = function() {
    return _step
  }

  this.value = function(v) {
    seedValue()
    if (arguments.length) {
      _head.value(v)
      return this
    }
    return (_finally || _tail).value()
  }

  this.notify = function(fn){
    if (fn) {
      _notify.push(fn)
    }
    else {
      var v = this.value()
      _notify.forEach(function(n){n(v)})
    }
    return this
  }

  this.depth = _head.depth

  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(reset) {
    if (reset!==undefined) {
      _on=!!reset
      return this
    }
    return !!_on
  }

  // Lift a function into a signal. 
  // The function will be called in current step context
  // the function arguments will be the current step value
  this.lift = function(f) {
    _step.lift(f)
    return this
  }

  // Tap the current value of the signal.
  // Value is dependent on the current step
  // - Synonym for lift
  this.tap = this.lift

  // signal depth - overrides step depth
  //  n == undefined - keep all
  this.keep = function(n) {
    _keep = arguments.length? n : circus.MAXDEPTH
    _head.depth(_keep)
    return this
  }

  // Return the current signal history as an array 
  this.history = function() {
    seedValue()
    return (_finally || _tail).history()
  }

  // Pulse signal with latest value
  // Signal will be inactive after propagation 
  this.pulse = function() {
    _pulse = true
    return this
  }

  // lift function onto signal tail
  // function returning signal is lifted onto the signal tail in FILO order
  // 
  this.finally = function(fn) {
    var s = this.step(), fs = new Signal()
    s.finally=true
    fs.keep(_keep)
    var r = fn.call(s,fs)
    if (r instanceof Signal) {
      _finally = _finally || r
      _filo.unshift(r)
      r = this
    }
    delete s.finally
    return r
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    var dirty = _state ? _state.dirty : true
    return dirty!==circus.FALSE || dirty===key
  }

  // Map a step onto a new step on the same signal
  // the mapping function receives the current step value and
  // an opt-in mutator object. The mapping function should return a new 
  // value or the mutator object containing the value.
  // The map function has three return states:
  //  undefined (no return) - do not map value
  //  circus.FALSE - do not map value and stop propagation
  //  value - map and propagate value (use circus.UNDEFINED to map undefined value)
  this.map = function(f) {
    var _this = this, s = this.next()
    var m = /\(.+,.+,.+\)\s*[{=]/.test(f.toString())
    return this.lift(function(v,k){
      var args = [v,k]
      if (m || circus.alwaysDiff) {
        m={value:Signal.prototype.copy(v),dirty:_this.dirty()}
        if (circus.alwaysDiff) args = [m,k]; else args.push(m)
      }
      var nv = f.apply(this,args)
      if (nv !== circus.FALSE) {
        if (nv === undefined) nv = v
        s.value(nv,k,m)
      }
    })
  }

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal
  if (seed!==undefined && seed[0] !== undefined) {
    var _this = this;
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        _this.name = arg
      }
      else if (arg instanceof Signal) {
        _this.feed(arg)
      }
      else _seed = arg
    })
  }

  function SignalStep(){
    var id = this.id = ++cid
    var _l = 0
    var _n = []
    var _depth = _keep
    var _v = _depth>1? []: undefined

    if (_step) _step.next = this
    else _step = this
    _tail = this

    function next(_this,v) {
      for (var j = 0, nl = _n.length; j < nl; j += 1) {
        _n[j].call(_this, v,_key)
      }
    }

    function getValue() {
      return (_depth>1? _v[_v.l]:_v) || {dirty:true,value:undefined}
    }

    function setValue(v,m,diff){
      var cv = getValue().value
      _state = m===v && diff(m,cv) || {dirty:v===cv && circus.FALSE || cv, value:v}
      if (_depth>1) {
        if (_l === _depth) {_v.shift();_l--}
        _v.push(_state)
      } else {
        _v=_state
      }
      _v.l = _l++
    }

    // Set the value of a signal. The new value will propagate through the signal channel
    // If the signal depth is 0 the new value will be dirty
    // If the number of values == the depth the first value is dropped.
    this.value = function (v,c,m) {
      seedValue() 
      if (arguments.length) {
        if (_on || _on===undefined){
          _key = c
          _on = true
          if (v === circus.UNDEFINED) v = undefined
          if (_depth) setValue(v, m || nullMutator, circus.diff); else _l++ && (_v = {dirty:true,value:v})
          if (!this.finally) {
            next(this,v)
            if (_tail === this) {
              if (_finally) {
                v = _filo.reduce(function(a,f) {
                  f.value(a)
                  return f.value()
                },this.value())
              }
              v = _finally && v  || this.value()
              _notify.forEach(function(n) {n(v)})
            }
            if (_pulse) {
              _on = undefined
              setValue(undefined, nullMutator, circus.diff)
            }
          }
        }
        return this
      }
      return (
        _l ? getValue().value
           : _depth>1? []:undefined
      )
    }

    // A dirty signal is one whose value or object reference has changed, or,
    // if it's a mutated array or object, where one of its members has changed
    this.dirty = function(key) {
      var v = getValue()
      return v.dirty!==circus.FALSE || v.dirty===key
    }
    
    // signal depth == channel keep or:
    //  n == undefined - keep all
    //  n < 2          - keep 1 
    this.depth = function(n) {
      _depth = arguments.length? n : circus.MAXDEPTH
      if (_depth > 1 && _v===undefined) _v=[]
      return this
    }

    this.history = function(f) {
      return _l
        ? (_depth>1? _v:[_v]).map(function(v){return v.value})
        : []
    }

    // Lift a function into a signal. 
    // The function will be called in signal step context
    // the function arguments will be the current signal value
    this.lift = function(f) {
      if (f) _n.push(f)
      _step = _step.next || _step
    }

  }
   
}

// Feed signal values into fanout signal(s)
Signal.prototype.feed = function() {
  var _this = this, p = popTail(arguments), args = p.signals,fn = p.tail
  args.forEach(function(fs){
    _this.lift(function(v){
      if (!fn || fn(v)) fs.value(v)
    })
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.diff
Signal.prototype.copy = circus.copy

function join(_this, sampleOnly, joinOnly, args) {
  var sn = _this.next(), soStep = _this.step()
  var tkey = _this.name || 0, keys = [tkey]
  var joinFn = args.tail
  var signals = args.signals
 
  var jpName = signals.shift()
  if (typeof jpName !== 'string') {
    signals.unshift(jpName)
    jpName = Object.keys(_this.jp || {}).length
  }

  if (signals.length) {
    var sblock = signals.pop()
    if (!(sblock instanceof Signal)) {
      Object.keys(sblock).forEach(function(k){
        var s = sblock[k] === circus.id? _this:sblock[k]
        if (typeof s === 'object') {
          if (!(s instanceof Signal)) {
            s = new Signal().join(s)
          }
          s.name = k
          signals.push(s)
        }
      })
    }
    else {
      signals.push(sblock)
      sblock = false
    }
  }

  if (!sampleOnly && !sblock) signals.unshift(_this)

  var jp = _this.jp || {}, isJoin = _this.jp && joinOnly
  if (jp!==_this.jp || !jp[jpName]) {
    keys[0] = joinOnly? signals[0].name || 0 : undefined
    jp[jpName] = {
      channels:{},
      join:function(j,fn) {
        var l = signals.length
        signals.push(j)
        j.lift(valueOf(l,fn))
      }
    }
  }

  _this.jp = jp
  _this.channels = []

  function valueOf(i,fn, so) {
    var key = keys[i] = signals[i].name || i
    fn = fn || joinFn
    if (!so) {
      var channels = signals[i].channels
      signals[i] = signals[i].step()
      signals[i].channels = channels
      _this.channels[key] = jp[jpName].channels[key] = signals[i]
    }
    return function(v) {
      var nv, ov = signals[0].value()
      if (signals.reduce(anyDirty,false)) {
        if (isJoin) nv = Signal.prototype.copy(ov); else {
          nv={}
          if (!sblock) nv[tkey]=ov
        }
        signals.forEach(function(a,j){if (j || !isJoin) nv[keys[j]] = a.value()})
      }
      else {
        nv = sn.value()
        nv[key] = v
      }
      var test = !fn || fn.call(_this,nv,key)
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
        sn.value(sampleOnly? soStep.value() : v,key)
      }
    }
  }

  if (sampleOnly) _this.lift(valueOf(0,undefined,true))
  for (var i=0, l = signals.length; i<l; i++) {
    // lift values of incoming signals
    signals[i].lift(valueOf(i))
  }

  return _this.lift()
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
// Input signal values will be preserved as output channels
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true. 
Signal.prototype.join = function(){
  return join(this,false,true,popTail(arguments,_anyActive))
}

// Merge 2 or more input signal values into 1 output signal
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true.
Signal.prototype.merge = function(fn){
  return join(this,false,false,popTail(arguments,_anyActive))
}

// Sample input signal(s). The output signal will be active when any of the 
// input signals are active or the optional guard function returns true.
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

