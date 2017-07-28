# Circuit-js

[![Build Status](https://travis-ci.org/philtoms/circuit-js.svg?branch=master)](https://travis-ci.org/philtoms/circuit-js)

A library for building applications using circuit architecture - a functionally declarative software pattern that promotes application development through pure functions, composition and associativity - wrapped in a JavaScript hash.

## Installation
```shell
npm install --save circuit-js
```

## The basics
Circuit-js uses standard object syntax to define connectible signal channels that propagate data state changes though a circuit. What this means is that functions can be connected together by lifting them into channels which in turn are connected together to create circuits. When values are signalled on a circuit, they are propagated through to the functions lifted into it.

### Signals, channels and circuits
Lets create a couple of simple functions called *dbl* and *log*...

`dbl = v => v + v`<br/>
`log = v => console.log(v)`

...and lift them both into a channel, one after the other...

`channel1 = new Channel().map(dbl).tap(log)`

When the channel is signalled, the signal value is propagated through the functions...

`channel1.signal('ho') // maps 'ho' onto 'hoho' (by doubling it) and then logs => hoho`

This channel can be connected to other channels to create a circuit...

```
channel2 = new Channel().map(dbl).tap(log)

circuit = new Circuit().assign({
  channel1,
  channel2
})
```

This circuit is also a channel. Functions can be lifted into it just as before...

`circuit.tap(log)`

Now, when either of the channels is signalled, the circuit will output two logs - one for the channel and one for the circuit!

```
channel2.signal('he') // logs..
 => hehe
 => {channel1: 'hoho', channel2: 'hehe'}
```

### Join-points
When channels are connected together in a circuit they form a joinpoint. The ***assign*** join-point used above preserves the channel structure when signals propagate through it. This is why the structure of the value logged by the circuit reflects the structure of the join-point connected to it.

Another kind of join-point is called ***fold***. When channels are folded together, propagated values lose their channel structure and instead, are folded into the parent channel. To facilite this behaviour, functions lifted into a folded channel receive the parent channel value which acts as an accumulator, as well as the signalled value.

A new signature is required:

```
// new signature takes parent value and signalled value
dblUp = (pv = '', sv) => pv + dbl(sv)

channel1 = new Channel().map(dblUp)
channel2 = new Channel().map(dblUp)

circuit = new Circuit().fold({
  channel1,
  channel2
}).tap(log)
```
Signalling `channel1`, and then `channel2`, produces a different output. The structure preserved by the assign join has been replaced by the folded values returned by most recent channel.

```
channel1.signal('ho') // logs => hoho
channel2.signal('he') // logs => hohohehe
```

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
const {assign, fold} = new Circuit()
const todos = assign({
  items: fold({add, remove})
})

todos.map(view).tap(app)

// go!
todos.signal({items: ['first entry']})
```

### So what just happened?

There are three channels, and consequently three signals in this app: `add`, `remove` and `items`, each correlating to a function on the object passed in to the circuit:

```javascript
const todos = assign({
  items: fold({
    add,
    remove
  })
})
```

Channels hold values in their state, and signals *change* the state of channel values. An application signals a circuit channel to add or change values, and maps or taps into a channel to read off its latest signal values.

Looking to the view, for a user to enter a new todo, the input field has been bound to the `add` signal:

```<input key={items} placeholder="What do you want to do?" onKeyDown={bind(add)}/>```

Similarly, to remove an item the button is bound to the ***remove*** signal:

```<button onClick={() => remove(i)}>x</button>```

The circuit is activated when either of these signals is raised. When this happens the circuit delivers the signalled values to the channelled functions which in turn propagate *their* values back into the circuit.

The circuit `todos` maps these values over the view, and taps *this* output (a React component) into the app. React takes over control from here until the next event...

### Signal propagation
Where do propagating values end up? They bubble up through the circuit. The ***add*** channel value is folded into the ***items***  channel. The items channel value is joined to the ***circuit***, and the circuit channel value is mapped and tapped over the view and app functions respectively.

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

