var signal = (function(circus){

'use strict';

//todo: $ise public props
//      add true merge, rename cur to latest
circus = circus || require('circus');
circus.alwaysDiff = false
circus.TRUE =  Object.freeze({state:true})
circus.FALSE =  Object.freeze({state:false})
circus.UNDEFINED = Object.freeze({state:undefined})

var cid=0
var nullState = {dirty:circus.FALSE,value:undefined}
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

function Signal(seed){

  var _head, _state = nullState, _value
  var _active
  var _fifo = [], _filo = [], _step = 0
  var _seed = circus.UNDEFINED
  var _depth = 1

  function mutate(v,diff) {
    var dirty = _depth? _state.dirty!==circus.FALSE && _state.dirty : circus.FALSE
    diff = diff || v instanceof circus.Mutator && circus.diff
    _state = diff && diff(v,_state.value) || {dirty:dirty || v===_state.value && circus.FALSE || _state.value, value:v}
  }

  // compose all on new value
  //      next step on join value
  function setState(_this,v,ns,diff) {
    for (var j = ns || 0, nl = _fifo.length; j < nl; j += 1) {
      var nv = _fifo[j].call(_this, v)
      if (nv===undefined) break
      v = nv
    }

    mutate(v,diff)

    if (_depth>1) {
      if (_value.length===_depth) _value.shift();
      _value.push(_state)
    } else {
      _value=_state
    }

    // finally(s) in filo order
    for (var j = 0, nl = _filo.length; j < nl; j += 1) {
      _filo[j].call(_this, v)
    }

  }

  // properties

  this.id = ++cid
  this.name = ''
  this.namespace = ''

  this.head = function() {
    return _head
  }

  this.value = function(v,diff) {
    if (_active || _active===undefined){
      if (_seed !== circus.UNDEFINED) {
        var sv = _seed
        _seed = circus.UNDEFINED
        for (var i=0, l=sv.length; i<l; i++) {
          this.value(sv[i])
        }
      }
      if (arguments.length) {
        _active = true
        _head = v
        setState(this,v,0,diff)
      }
      return _state.value
    }
  }

  this.step = function(diff) {
    var step = _step, _this = this
    return function(v,reset){
      var ns = reset? step : step + 1
      setState(_this,v,ns, diff)
    }
  }

  // An active signal will propagate values
  // An inactive signal will prevent value propagation
  this.active = function(reset) {
    if (arguments.length) {
      var pa = _active
      _active= reset===undefined? undefined : !!reset
      return pa
    }
    return !!_active
  }

  // Map the current signal state onto a new state
  // The function will be called in signal context and
  // can prevent propagation by returning undefined
  this.map = function(f) {
    _fifo.push(f)
    _step = _fifo.length
    return this
  }

  // Lift a function onto a signal tail in FILO order
  // The function will be executed after all FIFO functions regardless of propagation status
  this.finally = function(f) {
    _filo.unshift(f)
    return this
  }

  // signal keep:
  //  n == undefined - keep all
  //  n == 1         - keep 1
  //  n == 0         - don't keep - always pristine
  this.keep = function(n) {
    _depth = arguments.length? n : MAXDEPTH
    if (_depth > 1 && _value===undefined) _value=[]
    return this
  }

  // Return the current signal history as an array
  this.history = function(f) {
    return !_depth? undefined : (_depth>1? _value:[_value]).map(function(v){return v.value})
  }

  // A dirty signal is one whose value or object reference has changed, or,
  // if it's a mutated array or object, where one of its members has changed
  this.dirty = function(key) {
    return _state.dirty!==circus.FALSE
  }

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal - fanout
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

}

// Tap the current signal state value
// The function will be called in signal context
Signal.prototype.tap = function(f) {
  return this.map(function(v){
    f.call(this,v)
    return v
  })
}

// circuitry...
//  join points - map multiple input signals into one output signal
//  feeds - map one input signal into multiple output signals (fanout)
//  switches - map one input signal into multiple output signal join points

function joinPoint(_this, sampleOnly, joinOnly, args) {

  var step = _this.step(joinDiff)
  var signals = [].slice.call(args)

  var jpName = signals.shift()
  if (typeof jpName !== 'string') {
    signals.unshift(jpName)
    jpName = Object.keys(_this.jp || {}).length
  }

  // flatten joining signals into channels - accepts
  // and blocks out nested signals
  var channels = [], cblock
  var ns = (_this.namespace? _this.namespace + '.' : '') + _this.name
  while (signals.length) {
    cblock = signals.shift()
    if (!(cblock instanceof Signal)) {
      Object.keys(cblock).forEach(function(k,i){
        var s = cblock[k]
        if (typeof s === 'object') {
          if (!(s instanceof Signal)) {
            s = new Signal([k,ns]).join(s)
          }
          s.parent = _this
          s.name = s.name || k
          s.namespace = ns
          channels.push(s)
        }
      })
    }
    else {
      channels.push(cblock)
      cblock = false
    }
  }

  var isJp = _this.jp && joinOnly, jp = _this.jp || {}
  if (jp!==_this.jp || !jp[jpName]) {
    jp[jpName] = {
      join:function(j) {
        var l = channels.length
        channels.push(j)
        j.map(merge(l))
      }
    }
  }
  // signal channels always set to the latest join
  jp[jpName].channels = _this.channels = channels
  _this.jp = jp

  // a join is dirty if any of its inputs are dirty. If so,
  // do shallow copy to maintain diff value
  var dirty
  function joinDiff(m,v) {
    return {dirty:dirty,value:v}
  }

  var jv, sv, keys=[], merge = function(i) {
    var key = keys[i] = channels[i].name || i,active
    return function(v) {
      if (isJp && !_this === channels[i]) {
        jv = v
        active = true
      }
      else {
        var nv = {}
        dirty=active=false
        for (var c=0, l=channels.length; c<l; c++) {
          var s = channels[c]
          active = active || s.active()
          dirty = dirty || s.dirty()
          if (!jv) {
            nv[keys[c]]=s.value()
          }
        }
        if (joinOnly) {
          jv = jv || nv
          jv[key] = v
        }
        else jv = sampleOnly? sv : v
      }
      if (active) {
        if (_this !== channels[i]) {
          step(jv,cblock)
          return v
        }
        return jv
      }
    }
  }

  var cidx = !sampleOnly && !cblock? 1 : 0
  if (cidx) {
    channels.unshift(_this)
    _this.map(merge(0))
  }

  for (var i=cidx, l = channels.length; i<l; i++) {
    // merge incoming signals into join point
    channels[i].finally(merge(i))
  }
  return sampleOnly? _this.map(function(v){sv=v}) : _this
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
Signal.prototype.join = function(){
  return joinPoint(this,false,true,arguments)
}

// Merge 2 or more input signal values into 1 output signal
// The output signal will be active when any of the input signals are active
Signal.prototype.merge = function(fn){
  return joinPoint(this,false,false,arguments)
}

// Sample input signal(s). The output signal will be active when any of the
// input signals are active.
Signal.prototype.sample = function() {
  return joinPoint(this,true,false,arguments)
}

// Switch an input signal into two or more output signals.
Signal.prototype.switch = function() {
  var _this=this, args = [].slice.call(arguments), feeds=[]
  args.forEach(function(jp){
    if (jp instanceof Signal) feeds.push(jp)
    else jp.join(_this)
  })
  if (feeds.length) {
    this.tap(function(v){
      feeds.forEach(function(s){
        s.value(v)
      })
    })
  }
  return this
}

// Feed signal values into fanout signal(s)
// The input signal is terminated
Signal.prototype.feed = function() {
  var feeds = [].slice.call(arguments)
  return this.map(function(v){
    feeds.forEach(function(s){
      s.value(v)
    })
  })
}


circus.signal = function(seed){return new Signal(arguments)}

circus.signal.extendBy = function(obj) {
  extend(Signal.prototype,obj)
}

circus.isSignal = function(s) {
  return s instanceof Signal
}

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

