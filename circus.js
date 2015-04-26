var circus = (function(){
  
var cid=0

var noop = function(){}
function signal(c,seed){
  var _v = []
  var _l = 0
  var _i = 0
  var _f = []
  var _chan = typeof c == 'object' && c || {name:c,id:++cid,head:this,off:false}
  var _depth = _chan.keep
  var _pulse = {}
  var _dirty
  
  function next() {
    if (_i < _l) {
      var item = _depth? _v[_i++]:_v
      for (var j = 0, fl = _f.length; j < fl; j += 1) {
        _f[j].apply(null, [item])
      }
      if (_chan.on === _pulse) {
        _chan.on = undefined
      }
    }
  }
  
  function scopy(o){
    var r={}
    Object.keys(o).forEach(function(k){
      r[k] = o[k]
    })
    return r
  }

  function value(v,k){
    if (v!==circus.FALSE) {
      // shallow copy value into signal
      var cv = _depth? _v[_l]:_v
      _dirty = k? v!==cv[k] : v!==cv
      var no = nv = v.length? v.slice(0): v === circus.UNDEFINED? undefined : typeof v === 'object'? scopy(v) : v
      if (k!==undefined) {
        no = scopy(cv)
        no[k] = nv
      }
      if (_depth) {
        if (_l === _depth) {_v.shift();_i--;_l--}
        _v.push(no)
      } else {
        _v=no
      }
      _l++
    }
  }
  
  if (seed!=undefined) {
    _depth = seed.length
    _chan.seed = true
    value(seed)
  }
  
  this.name = function(){
    return _chan.name
  }
  // Set the value of a signal. The new value will propagate through the signal channel
  // If the signal depth is undefined the new value replaces the existing one.
  // If the number of values == the depth the first value is dropped.
  this.value = function (v,k) {
    if (v!==undefined) {
      if (_chan.on || _chan.on===undefined){
        _chan.on = _chan.on || true
        value(v,k)
        next()
      }
      return this
    } else {
    var v = _l
      ? _depth? _v[_l-1]:_v
      : _depth? []:undefined
    }
    return k!==undefined? v[k] : v
  }
  
  // Lift a function into a signal. 
  // The function will be called in global context
  // the function arguments will be the current signal value(s)
  this.lift = function(f) {
    _f.push(f)
    return this
  }

  // Add a new signal to the signal channel at the current signal position
  // signal value will be propagated though all signals at this point
  this.signal = function(seed){
    return new signal(_chan,seed)
  }
  
  // Explicitly activate or deactivate a signal channel or
  // return the current active state
  //   notify registered handlers of state change
  // An active channel will propagate signal values
  // An inactive channel will prevent value propagation
  // An inactive channel prevents join propagation 
  this.active = function(on) {
    if (on!==undefined) {
      _chan.on = !!on
      var notify = _chan.on && _chan.onon || !_chan.on && _chan.onoff || noop
      notify(_chan.tail.value())
      return this
    }
    return !!_chan.on
  }
  
  // Register channel activation event handler
  // The handler will receive the current channel value
  this.on = function(f) {
    _chan.onon = f
    return this
  }
  
  // Register channel deactivation event handler
  // The handler will receive the current channel value
  this.off = function(f) {
    _chan.onoff = f
    return this
  }
  
  // channel depth - overrides signal depth
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.keep = function(n) {
    _chan.keep = n < 2? undefined : (n || -1)
    _depth = _chan.keep
    return this
  }

  // signal depth == channel keep or:
  //  n == undefined - keep all
  //  n < 2          - keep 1 
  this.depth = function(n) {
    _depth = _chan.keep && n !== _chan.keep? _chan.keep : n < 2? undefined : (n || -1)
    return this
  }

  this.pulse = function() {
    return this.lift(function(){
      _chan.on = _pulse
    })
  }
  
  this.toArray = function() {
    return _l
      ? _depth? _v.slice():[_v]
      : []
  }
  
  this.head = _chan.head
  _chan.tail = this
}

// Feed signal values into new signal channel
signal.prototype.feed = function(s) {
  this.lift(s.head.value)
  return s
}

// Map a signal onto a new signal on the same channel
signal.prototype.map = function(f) {
  var s = this.signal()
  this.lift(function(){
    s.value(f.apply(null,arguments))
  })
  return s
}

// Tap the current value of the signal
// value is dependent on the channel position of the signal
signal.prototype.tap = function(f){
  return this.lift(f)
}

// A steady state signal
signal.prototype.always = function(v){
  return this.map(function(){
    return v
  })
}

signal.prototype.reduce = function(f,accum) {
  var _this = this,v,s = this.signal()
  this.lift(function(){
    if (!accum) {
      accum = _this.value()
      s.value(accum)
    }
    else {
      var args = [accum].concat([].slice.apply(arguments))
      accum = f.apply(null,args)
      s.value(accum)
    }
  })
  return s
}

// remove undefined signal values from the channel
signal.prototype.compact = function(){
  return this.map(function(v){
    return v || circus.FALSE
  })
}

// take the first n values from the signal
// the signal will not propagate after n
signal.prototype.take = function (n) {
  return this.map(function (v) {
    return (n-- > 0)? v : circus.FALSE
  })
}

function merge(m,active) {
  var isOn, s = this.signal(), n = []
  function valueOf(i) {
    var ni = n[i] = m[i].name() || i
    return function(v) {
      var _on = active() 
      if (_on){
        if (!isOn) {
          m.forEach(function(a,j){s.value(a.value(),n[j])})
        }
        else {
          s.value(v,ni)
        }
      }
      isOn = _on
    }
  }
  for (var i=0,l = m.length; i<l; i++) {
    m[i].tap(valueOf(i))
  }
  return s
}

// Join 2 or more input signals to form 1 output signal 
// Output signal will be keyed on input name or index
// The output signal will be active when all input signals are active
signal.prototype.join = function(){
  var m = [this].concat([].slice.apply(arguments));

  return merge.call(this,m,function(){
    return m.reduce(function(r,a){return r && a.active()},true)
  })
}

// Merge 2 or more input signals into 1 output signal 
// Output signal will be keyed on input name or index
// The output signal will be active when any of the input signals are active
signal.prototype.merge = function(){
  var m = [this].concat([].slice.apply(arguments));

  return merge.call(this,m,function(){
    return m.reduce(function(r,a){return r || a.active()},false)
  })
}

// Sample input signal(s) and optionally test for truthyness but 
// do not take the sample value(s)
// The output signal will be active when any of the input signals 
// are active [and truthy]
signal.prototype.sample = function() {
  var _this=this,args = [].slice.apply(arguments), s = this.signal()
  var f = args.pop()
  if (typeof f !== 'function') {
    args.push(f)
    f=undefined
  }
  for (var i=0,l = args.length; i<l; i++) {
    args[i].tap(function(){
      if (!f || f.apply(null,arguments)) s.value(_this.value())
    })
  }
  return s
}

function circus(){
}

circus.signal = function(name,seed){return new signal(name,seed)}
circus.foldp = function(v){}
circus.domEvent = function (elem,eventNameOn, eventNameOff) {
  var s =  circus.signal()
  elem.addEventListener(eventNameOn, function(e){s.active(true).value(e)});
  if (eventNameOff) elem.addEventListener(eventNameOff, s.active.bind(s,false));
  return s
}

// FALSE can be used to stop signal propagation
circus.FALSE = Object.freeze({})

// UNDEFINED can be used to update a value to undefined
circus.UNDEFINED = Object.freeze({})

return circus;

})()

if (typeof module != "undefined" && module !== null && module.exports) module.exports = circus;
else if (typeof define == "function" && define.amd) define(function() {return circus});

