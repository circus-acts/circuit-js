'use strict'

export default function Events(app) {

  var events = [],
      pCount = 0,
      steadyCircuit=true,
      noop = function(){}

  app.stateChange = function(s,e) {
    //filo event order
    _events.unshift({
      start: s || noop,
      stop: e || noop
    })
  }

  return  {
    // Circuits are active when they start propagation and steady when they stop
    start: function(ctx, v){
      if (!pCount++ && steadyCircuit && events.length) {
        for (var i=0,el=events.length; i < el; i++) {
          events[i].start(ctx,v)
        }
      }
    },

    // Circuit propagation is re-entrant. Any 'extra' circuit work performed in this
    // state will simply prolong it until there are no more propagations.
    stop: function(ctx,v){
      if (!(--pCount) && events.length) {
        if (steadyCircuit) {
          steadyCircuit = false
          for (var i=0,el=events.length; i < el; i++) {
            events[i].stop(ctx,v)
          }
        }
        else steadyCircuit = true
      }
    }
  }
}