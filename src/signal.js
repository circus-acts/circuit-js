var signal = (function(circus){

'use strict';

//todo: $ise public props
//      merge map / lift into next (to keep v in ctx)
//      - issues: keep lift and map semantically discrete
//      add true merge, rename cur to latest
circus = circus || require('circus');

var cid=0
var nullMutator = {}

circus.alwaysDiff = false
circus.TRUE =  Object.freeze({state:true})
circus.FALSE =  Object.freeze({state:false})
circus.UNDEFINED = Object.freeze({state:undefined})
circus.MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

function Signal(seed){

  var _active
  var _state
  var _pulse
  var _filo = []
  var _notify = []
  var _seed = circus.UNDEFINED
  var _keep = 1
  this.name=''
  this.namespace=''

  function seedValue() {
    if (_seed !== circus.UNDEFINED) {
      var seed = _seed
      _seed = circus.UNDEFINED
      seed.forEach(function(v) {_head.value(v)})
    }    
  }

  this.next = function() {
    return _step.next || new SignalStep(this)
  }
  
  this.step = function() {
    return _step
  }

  this.value = function(v) {
    if (_active || _active===undefined){
      seedValue()
      if (arguments.length) {
        // _filo.reduce(function(a,f) {
        //   return f(a)
        // },_head.value(v))
        _head.value(v)
      }
    }
    return _tail.value()
  }

  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(reset) {
    if (arguments.length) {
      var pa = _active
      _active= reset===undefined? undefined : !!reset
      return pa
    }
    return _active
  }

  var _head = new SignalStep(this), _step = _head, _tail

  this.id = cid
  this.depth = _head.depth
  this.head = _head.value.bind(_head)

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
    return _tail.history()
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
    _filo.unshift(fn)
    return this
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
  // The map function can prevent propagation by returning undefined or circus.FALSE
  // (return circus.UNDEFINED to map a true undefined value)
  this.map = function(f) {
    var _this = this, s = this.next()
    var m = /^f\S+\s*\([^\)]+,[^\)]+,[^\)]+\)/.test(f.toString())
    return this.lift(function(v,k){
      var args = [v,k]
      if (m || circus.alwaysDiff) {
        m={value:Signal.prototype.copy(v),dirty:_this.dirty()}
        if (circus.alwaysDiff) args = [m,k]; else args.push(m)
      }
      var nv = f.apply(this,args)
      if (nv !== circus.FALSE && nv !== undefined) {
        if (nv === circus.UNDEFINED) nv = undefined
        nv = s.value(nv,k,m)
      }
      return nv
    })
  }

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal
  if (seed!==undefined && seed[0] !== undefined) {
    var _this = this,ni=0, feeds=[];
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        if (!ni++) {
          _this.name = arg
        }
        else _this.namespace = arg
      }
      else if (arg instanceof Signal) {
        feeds.push(arg)
      }
      else _seed = arg
    })
    if (feeds.length) {
      this.feed.apply(this,feeds)
    }
  }

  function SignalStep(_signal){
    var id = this.id = ++cid
    var _l = 0
    var _n = []
    var _depth = _keep
    var _v = _depth>1? []: undefined

    if (_step) _step.next = this
    else _step = this
    _tail = this
    this.active = _signal.active

    function next(_this,v,c) {
      var nv = v
      for (var j = 0, nl = _n.length; j < nl; j += 1) {
        var nv = _n[j].call(_this, v,c)
        if (nv===undefined) nv = v
      }
      return nv
    }

    function getValue() {
      return (_depth>1? _v[_v.l]:_v) || {dirty:true,value:undefined}
    }

    function setValue(v,m,diff){
      _active = true
      if (v === circus.UNDEFINED) v = undefined
      if (!_depth)  _l++, (_v = {dirty:true,value:v})
      else {
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
    }

    this.signal = _signal

    // Set the value of a signal. The new value will propagate through the signal channel
    // If the signal depth is 0 the new value will be dirty
    // If the number of values == the depth the first value is dropped.
    this.value = function (v,c,m) {
      seedValue() 
      if (arguments.length) {
        setValue(v, m || nullMutator, circus.diff)
        var nv = next(this,v,c)
        if (this === _tail || nv === circus.FALSE) {
          if (nv === circus.FALSE) nv = v
          nv = _filo.reduce(function(a,f) {
            var na = f(a)
            return na===circus.FALSE || na===undefined? a:na
          },nv)         
        }
        if (_pulse) {
          nv = undefined
          setValue(nv, m|| nullMutator, circus.diff)
          _active = undefined
        }
        return nv
      }
      return (
        _l ? getValue().value
           : _depth>1? [] : undefined
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
// The input signal is terminated
Signal.prototype.feed = function() {
  var _this = this, p = popTail(arguments), args = p.signals,fn = p.tail
  _this.map(function(v){
    args.forEach(function(fs){
      if (!fn || fn(v)) fs.value(v)
    })
    return circus.FALSE
  })
  return this
}

// expose mutator to api for override
Signal.prototype.diff = circus.diff
Signal.prototype.copy = circus.copy

function join(_this, sampleOnly, joinOnly, args) {
  var sn = _this.next(), soStep = _this.joinStep = _this.step()
  var tkey = _this.name || 0, keys = [tkey]
  var guard = args.tail
  args = args.signals
 
  var jpName = args.shift()
  if (typeof jpName !== 'string') {
    args.unshift(jpName)
    jpName = Object.keys(_this.jp || {}).length
  }

  // flatten the signals
  var signals = [],sblock,isBlock, name=[]
  while (args.length) {
    sblock = args.shift()
    if (!(sblock instanceof Signal)) {
      isBlock = true
      var ns = (_this.namespace? _this.namespace + '.' : '') + _this.name
      Object.keys(sblock).forEach(function(k){
        var s = sblock[k] === circus.id? _this:sblock[k]
        if (typeof s === 'object') {
          if (!(s instanceof Signal)) {
            s = new Signal([k,ns]).join(s)
          }
          s.parent = _this
          s.name = s.name || k
          s.namespace = ns
          signals.push(s)
          name.push(s.name)
        }
      })
    }
    else {
      signals.push(sblock)
      sblock = false
    }
  }
  if (!_this.name) _this.name = name.join('/')
  if (!sampleOnly && !sblock) signals.unshift(_this)

  var jp = _this.jp || {}, isJp = _this.jp && joinOnly
  if (jp!==_this.jp || !jp[jpName]) {
    keys[0] = joinOnly? signals[0].name || 0 : undefined
    jp[jpName] = {
      join:function(j,fn) {
        var l = signals.length
        signals.push(j)
        j.lift(valueOf(l,fn))
      }
    }
  }

  _this.jp = jp
  // signal always set to the latest join
  _this.channels = {}
  var channels = []
  function valueOf(i,fn, so) {
    var key = keys[i] = signals[i].name || i
    fn = fn || guard
    if (!so) {
      var step = signals[i].joinStep || signals[i].step()      
      step.channels = signals[i].channels
      _this.channels.ordered = _this.channels.ordered || []
      _this.channels.ordered[i] = _this.channels[key] = channels[i] = step
      jp[jpName].channels = _this.channels
    }
    return function(v) {
      var nv, ov = channels[0].value()
      if (channels.some(function(s) {return s.dirty()})) {
        if (isJp) nv = Signal.prototype.copy(ov); else {
          nv={}
          if (!isBlock) nv[tkey]=ov
          channels.forEach(function(a,j){if (j || !isJp) nv[keys[j]] = a.value()})
        }
      }
      else {
        nv = sn.value() || {}
      }
      nv[key] = v
      var test = !fn || fn.call(soStep,nv,key)
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
  if (sampleOnly) _this.channels.sampleOnly = true

  return _this.lift()
}

function joinAt(_this, args, mapFn, jmapFn) {
  var p = popTail(args), args = p.signals,fn = p.tail, feeds=[]
  args.forEach(function(jp){
    if (jp instanceof Signal) feeds.push(jp)
    else jp.join(_this,fn)
  })
  return _this.map(function(v){
    if (feeds.length && jmapFn(fn,v)) {
      feeds.forEach(function(s){
        s.value(v)
      })
    }
    return mapFn(fn,v)? v: circus.FALSE
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

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as output channels
// The output signal will be active when all of the input signals are active
Signal.prototype.joinAll = function(){
  return join(this,false,true,popTail(arguments,_allActive))
}

// Merge 2 or more input signal values into 1 output signal
// The output signal will be active when any of the input signals are active
// or the optional guard function returns true.
Signal.prototype.merge = function(fn){
  return join(this,false,false,popTail(arguments,_anyActive))
}

// Merge 2 or more input signal values into 1 output signal
// The output signal will be active when all of the input signals are active
Signal.prototype.mergeAll = function(fn){
  return join(this,false,false,popTail(arguments,_allActive))
}

// Sample input signal(s). The output signal will be active when any of the 
// input signals are active or the optional guard function returns true.
Signal.prototype.sample = function() {
  return join(this,true,false,popTail(arguments,_anyActive))
}

// Sample input signal(s). The output signal will be active when all of the 
// input signals are active
Signal.prototype.sampleAll = function() {
  return join(this,true,false,popTail(arguments,_allActive))
}

function splitFn(fn,v){
  return !fn || fn(v)
}

function switchFn(fn,v){
  return fn && !fn(v)
}

// Split a signal into two or more channels. The signal value will be propagated
// in all channels (default or true) or none at all (false)
Signal.prototype.split = function() {
  return joinAt(this,arguments,splitFn, splitFn)
}

// Switch a signal into one or more different channels. The signal value will 
// either be propagated in the new channels (default or true) or the existing
// channel (false)
Signal.prototype.switch = function() {
  return joinAt(this,arguments,switchFn, splitFn)
}

circus.signal = function(seed){return new Signal(arguments)}

circus.signal.allActive = function(v) {
  return this.signal.channels.ordered.every(function(c){return c.active()})
}

circus.signal.anyActive = function(v) {
  return Object.keys(v).some(function(k){return v[k]!==undefined})
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

circus.isSignal = function(s) {
  return s instanceof Signal
}

var _allActive = circus.signal.allActive
var _anyActive = circus.signal.anyActive

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

