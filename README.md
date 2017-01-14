# Circuit-js

[![Build Status](https://travis-ci.org/philtoms/circuit-js.svg?branch=master)](https://travis-ci.org/philtoms/circuit-js)

A library for building applications using circuit architecture - a functionally declarative software pattern that promotes application development through pure functions, composition and associativity - wrapped in a JavaScript hash.

## Installation
```shell
npm install --save circuit-js
```

## The basics
Circuit-js uses standard object syntax to define connectible signal channels that propagate data state changes though a circuit. What this means is that functions can be connected together by lifting them into channels which in turn are connected together to create circuits.

### Signals, channels and circuits
Lets create a couple of robust functions called *dbl* and *log*:

`dbl = v => v + v`<br/>
`log = v = > console.log(v)`

and lift them both into a channel, one after the other...

`channel1 = new Channel().map(inc).tap(log)`

When the channel is signalled, the signal value is propagated through the functions...

`channel1.signal('ho') // logs => "hehe"`

This channel can be connected to other channels to create a circuit...

```
channel2 = new Channel().map(inc).tap(log)

circuit = new Circuit().join({
  channel1,
  channel2
})
```

This circuit is also a channel. Functions can be lifted into it just as before...

`circuit.tap(log)`

Now, when either of the channels is signalled, the circuit will output two logs!

```
channel2.signal('he') // logs..
 => 'hehe'
 => {channel1: undefined, channel2: 'hehe'}

```

### State
An important feature of circuits is that they preserve state. So, signalling channel1 again...

```
channel1.signal('ho') // logs..
 => 'hoho'
 => {channel1: 'hoho, channel2: 'hehe'}
```

...adds the new signalled value to the current circuit state.

### Join-points
When channels are connected together they form a joinpoint. The ***join*** join-point used above preserves the channel structure when signals propagate through it.

Another kind of join-point is called ***merge***. When channels are merged together, propagated values lose their channel structure and instead, are reduced into the parent channel. Functions lifted into a merged channel will receive the parent channel value as well as the signalled value, so a new signature is required.

```
// new signature takes parent value and original signalled value
dbl = (pv = '', v) => pv + v + v

channel1 = new Channel().map(dbl)
channel2 = new Channel().map(dbl)

circuit = new Circuit().merge({
  channel1,
  channel2
}).map(log)
```

Signalling channel1, and then channel 2, produces a different output. The structure preserved by the ***join*** has been replaced by the merged values returned by most recent channel signal...

```
channel1.signal('ho') // logs => 'hoho'
channel2.signal('he') // logs => 'hohohehe'
```

Notice that the lifted function is still being mapped over the signal value. This is because in a merged channel, the parent value is now the propagating signal and the originating signal value is purely contextual. A new channel will help to explain this behaviour:

```
circuit = new Circuit().merge({
  channel1,
  channel2,
  channel3: new Channel().map(dbl).map(dbl).tap(log) // 2 maps!
}).map(log)

channel1.signal('ho') // logs => 'hoho'
channel2.signal('he') // logs => 'hohohehe'
channel3.signal('ha') // logs => 'hohohehehahahaha'
```

The first mapping in channel3 takes the parent signal value ```hohohee``` and adds ```ha + ha```. The second mapping takes the propagated value  ```hohohehehaha``` and again applies ```ha + ha```.

All circuit lift functions share this behaviour; they all have the same signature ``` (v, ...context)```, and any context values are preserved through propagation.

This is *serious* stuff - there's nothing funny about it at all!


## A working app

The following application defines a set of functions and lifts them into a circuit. The goal is to keep the functions separated, pure and focused. Circuits make this super easy:

```javascript
import React from 'react'
import {render} from 'react-dom'
import Circuit from 'circuit-js'

// Some functions to change state
const add = (list, item) => list.concat(item)
const remove = (list, idx) => list.filter((_, i) => i !== idx)

// A helper function to bind events to signals
const bind = signal => ({target, keyCode}) => keyCode === 13 && signal(target.value)

// A function to generate a view
const view = ({items}) => {
  const {add, remove} = todos.signals.items
  return <div>
    <h1>todos</h1>
    <ul>{items.map((item, i) => <li key={i}>
      <span>{item} </span>
      <button onClick={() => remove(i)}>x</button>
      </li>)}
    </ul>
    <input key={items} placeholder="What do you want to do?" onKeyDown={bind(add)}/>
  </div>
}

// a function to mount a component
const app = component => render(component, document.querySelector('#todo'))

// A circuit to pull it all together.
const {circuit, merge} = new Circuit()
const todos = circuit.join({
  items: merge({add, remove})
})

todos.map(view).tap(app)

// go!
todos.signal({items: ['first entry']})
```

### So what just happened?

There are three channels, and consequently three signals in this app: *add*, *remove* and *items*, each correlating to a function on the object passed in to the circuit:

```javascript
const todos = circuit.join({
  items: merge({
    add,
    remove
  })
})
```

Channels hold values in their state, and signals *change* the state of channel values. An application therefore binds to a circuit's signals to add values, and maps or taps into the channels to read off the latest signal values.

Looking to the view, for a user to enter a new todo, the input field has been bound to the ***add*** signal:

```<input key={items} placeholder="What do you want to do?" onKeyDown={bind(add)}/>```

Similarly, to remove an item the button is bound to the ***remove*** signal:

```<button onClick={() => remove(i)}>x</button>```

The circuit is activated when either of these signals is raised. When this happens the circuit delivers the bound values to the channelled functions and *these* return their values back into the circuit!

The circuit ***todos*** maps these values over the view, and taps *this* output (a React component) into the app. React takes control here...

Where do propagating values end up? They bubble up through the circuit. The ***add*** channel value is merged into the ***items***  channel. The items channel value is joined to the ***circuit***, and the circuit channel value is mapped and tapped over the view and app functions respectively.

A signal propagation diagram shows what is happening in this circuit:

```
PROPAGATION
| SIGNALS   TIMELINE ->
| add:      --------------v2---------------------------------->
| remove:   ---------------------------------1---------------->
| items:    ---------------[v1, v2]-----------[v1]------------>
V circuit:  {items: [v1]}---{items: [v1, v2]}--{items: [v1]}-->
```

## Round up

* distinct separation of concerns - circuits, channels and signals keep functions lean and focused
* consistent and predictable logic - composable, associative signals
* functional behaviour - map, tap, reduce etc..
* extensible - custom signals through extend and binding operators

### Copyright

Source code is licensed under the ISC License (ISC). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.

