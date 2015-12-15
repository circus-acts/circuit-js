var signal = (function(circus){

'use strict';

// *** Lean ***
//  no named join points, splits or switches - use joins, feeds and logic:
//    split = signal.join(s1,s2)
//    switch = signal.feed(s1.or(),s2.or())
//    sample any = signal.sample(signal.merge(s1,s2))
//
//  state change after composition
//    dirty on state change only (not join points)

//todo: $ise public props

circus = circus || require('circus');

circus.TRUE =  Object.freeze({state:true})
circus.FALSE =  Object.freeze({state:false})
circus.UNDEFINED = Object.freeze({state:undefined})
var NULLSTATE = Object.freeze({dirty:circus.FALSE,value:undefined})
var MAXDEPTH = Number.MAX_SAFE_INTEGER || -1 >>> 1

var cid=0

function Signal(seed){

  // private
  var _head, _state = NULLSTATE, _value
  var _active
  var _fifo = [], _filo = [], _inFinally=0, _step = 0
  var _seed = circus.UNDEFINED
  var _depth = 1
  var _diff = circus.diff || function(v,s) { return v!==s }

  // compose all steps on new value
  //         next step on join value
  function compose(ctx,v,ns) {
    if (_active || _active===undefined){
      _active=true
      for (var j = ns, nl = _fifo.length; j < nl; j += 1) {
        var nv = _fifo[j].call(ctx, v)
        if (nv===undefined) break
        if (nv===circus.FALSE) return
        v = nv
      }

      // mutate
      var dirty = _state.value===undefined? v : !_diff(v,_state.value) && circus.FALSE || v
      _state = {dirty:dirty, value:v}

      if (_depth>1) {
        if (_value.length===_depth) _value.shift();
        _value.push(_state)
      } else {
        _value=_state
      }

      // finally(s) in filo order
      for (var j = 0, nl = _filo.length; j < nl; j += 1) {
        _filo[j].call(ctx, v)
      }
    }
  }

  // properties

  this.id = ++cid
  this.name = ''
  this.namespace = ''

  this.head = function() {
    return _head
  }

  // Set or read the signal value
  //
  this.value = function(v) {
    if (_seed !== circus.UNDEFINED) {
      var sv = _seed
      _seed = circus.UNDEFINED
      for (var i=0, l=sv.length; i<l; i++) {
        this.value(sv[i])
      }
    }
    if (arguments.length) {
      _head = v
      compose(this,v,0)
    }
    return _state.value
  }

  // Allow values to be injected into the signal at
  // arbitrary step points > 0.
  this.step = function(s) {
    s = s || _step+1, ctx = this
    return function(v){
      compose(ctx,v,s)
    }
  }

  // An active signal will propagate values
  // An inactive signal will prevent value propagation
  this.active = function(reset) {
    if (arguments.length) {
      if (this.parent) this.parent.active(reset)
      var pa = _active
      _active = reset===undefined? undefined : !!reset
      return pa
    }
    return !!_active
  }

  // Set the diff function for this signal
  this.diff = function(diff) {
    _diff = diff
    return this
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
  // FILO functions are executed after all FIFO functions regardless of propagation status
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

  // By default, a dirty signal is one whose value or object reference has changed.
  // This means that join points are always dirty unless a shallow or deep diff is used.
  this.dirty = function(key) {
    return _state.dirty!==circus.FALSE
  }

// Tap the current signal state value
// The function will be called in signal context
this.tap = function(f) {
  return this.map(function(v){
    f.call(this,v)
    return v
  })
}

// circuitry...
//  join points - map multiple input signals onto one output signal
//  feeds - map one input signal onto multiple output signals (fanout)

function joinPoint(ctx, sampleOnly, joinOnly, args) {

  var signals = [].slice.call(args), channels = [], step = ctx.step(), inclusive

  // flatten joining signals into channels
  // - accepts and blocks out nested signals
  var ns = (ctx.namespace? ctx.namespace + '.' : '') + ctx.name
  while (signals.length) {
    var cblock = signals.shift()
    if (cblock === circus.id) {
      inclusive = ctx
      cblock = ctx
    }
    if (!(cblock instanceof Signal)) {
      Object.keys(cblock).forEach(function(k,i){
        var s = cblock[k]
        if (!(s instanceof Signal)) {
          s = new Signal([k,ns]).join(s)
        }
        s.parent = ctx
        s.name = s.name || k
        s.namespace = ns
        channels.push(s)
      })
    }
    else {
      channels.push(cblock)
    }
  }

  var jv={}, sv, keys=[]
  function merge(i,r) {
    var active, key = keys[i] = channels[i].name || i
    return function(v) {
      active=true
      if (joinOnly || sampleOnly) {
        var nv = {}
        for (var c=0, l=channels.length; c<l; c++) {
          var s = channels[c]
          active = active && s.active()
          nv[keys[c]] = jv[keys[c]]
        }
        jv = nv
        jv[key] = v
      }
      else {
        jv = v
      }

      if (active) {
        step(sampleOnly? sv : jv)
      }

      return r
    }
  }

  for (var i=0, l = channels.length; i<l; i++) {
    // merge incoming signals into join point
    var s = channels[i], r = s===inclusive? circus.FALSE : undefined
    s[r? 'map':'finally'](merge(i,r))
  }
  return sampleOnly? ctx.map(function(){}).finally(function(v){sv=v}) : ctx
}

// Join 2 or more input signals into 1 output signal
// Input signal values will be preserved as output channels
// Duplicate channels will be merged
// The output signal will be active when all of the input signals are active
this.join = function(){
  return joinPoint(this,false,true,arguments)
}

// Merge 2 or more input signal values into 1 output signal
// The output signal value will be the latest input signal value
// The output signal will be active when any of the input signals are active
this.merge = function(fn){
  return joinPoint(this,false,false,arguments)
}

// Sample input signal(s)
// The output signal will be active when all of the input signals are active
this.sample = function() {
  return joinPoint(this,true,false,arguments)
}

// Feed signal values into fanout signal(s)
// The input signal is terminated
this.feed = function() {
  var feeds = [].slice.call(arguments)
  return this.map(function(v){
    feeds.forEach(function(s){
      s.value(v)
    })
  })
}

  // seed signal with any combination of:
  //  name - string
  //  value - array
  //  signal - fanout
  if (seed!==undefined && seed[0] !== undefined) {
    var ctx = this, ni=0, feeds=[];
    [].slice.call(seed).forEach(function(arg){
      if (typeof arg === 'string') {
        if (!ni++) {
          ctx.name = arg
        }
        else ctx.namespace = arg
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

circus.signal = function(seed){return new Signal(arguments)}

circus.signal.extendBy = function(obj) {
  Object.keys(obj).forEach(function(k){
    Signal.prototype[k] = obj[k]
  })
}

circus.isSignal = function(s) {
  return s instanceof Signal
}

return circus.signal

})(circus)

if (typeof module != "undefined" && module !== null && module.exports) module.exports = signal;
else if (typeof define == "function" && define.amd) define(function() {return signal});

