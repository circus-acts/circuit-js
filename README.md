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
Lets create a couple of functions called *dbl* and *log*:

`const dbl = v => v + v`<br/>
`const log = v = > console.log(v)`

and lift them both into a channel, one after the other...

`const channel = new Channel().map(inc).tap(log)`

When the channel is signalled, the signal value is propagated through the functions...

`channel.signal('ho') // logs => "hehe"`

This channel can be connected to other channels to create a circuit...

```
const circuit = new Circuit().join({
  channel1: channel,
  channel2: channel
})
```

Note the use of standard object syntax to create an object with two props: channel2 and channel2. These are exposed on the circuit as *channels.channel1* and *channels.channel2* respectively, so it's easy to destructure them:

`{channel1, channel2} = circuit.channels`

This circuit is also a channel. Functions can be lifted into it just as before...

`circuit.map(log)`

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

### Joinpoints
When channels are connected together they form a joinpoint. The ***join*** joinpoint used above preserves the channel structure when signals propagate through it.

Another kind of joinpoint is called ***merge***. When channels are merged together, propagated values lose their channel structure and instead, are reduced into the parent channel...

```
const circuit2 = new Circuit().merge({
  channel1: (state, value) => state + value,
  channel2: (state, value) => state + value
}).map(log)
```

The first thing to note here is that the channel syntax has been relaxed a bit - Circus-js will always accept a function in place of a channel. The second thing of note are the function signatures; they have changed to accept the reducer pattern. Now, when values are propagated through the circuit, the function will receive the parent channel value as well as the propagating value. The function will *reduce* these values into one return value (usually, but not always,  a new parent value).

Signalling channel1, then channel 2, produces the following output...

```
channel1.signal('ho') // logs => 'hoho'
channel2.signal('he') // logs => 'hohohehe'
```

And that's basically it!

The Circuit-js [API](./docs/API.md) lists more lift operations like [fold](./docs/API.md#fold) and [filter](); there are functions to [add new]() operations;  and there's a [bind]() operator that binds a function to a channel context (It's powerful - the ***join*** and ***merge*** operators are examples of bound functions); but the syntax has essentially been covered here.

Next up is an attempt to explain the reasoning behind Circuit-js.

## A working app

The following application defines a set of functions and lifts them into a circuit. The goal is to keep the functions separated, pure and focused.  Circuits make this easy:

```javascript
import React from 'react'
import {render} from 'react-dom'
import Circuit from 'circuit-js'

// Some functions to change state
const add = (list, item) => list.concat(item)
const remove = (list, idx) => list.filter((_, i) => i !== idx)
const bind = channel => ({target, keyCode}) => keyCode === 13 && channel(target.value)

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
const todos = circuit({
  items: merge({add, remove})
})

todos.map(view).tap(app)

// go!
todos.signal({items: ['first entry']})
```

## So what just happened?
An app was [born](http://www.webpackbin.com/NkoXOhczf).

There are three channels, and consequently three signals in this app: *add*, *remove* and *items*, each correlating to a function on the object passed in to the circuit:

```javascript
const todos = circuit({
  items: merge({
    add,
    remove
  })
})
```

Channels hold values in their state, and signals *change* the state of channel values. An application can therefore bind to a circuit's channels and signals appropriately to generate behaviour:

Looking to the view, for a user to enter a new todo, the input field must be bound to the ***add*** signal:

```<input key={items} placeholder="What do you want to do?" onKeyDown={bind(add)}/>```

Similarly, to remove an item the button is bound to the ***remove*** signal:

```<button onClick={() => remove(i)}>x</button>```

The circuit is activated when either of these signals is raised. When this happens the circuits delivers the bound values to the appropriate functions and *these* return their values back into the circuit!

Where do the values go? They bubble up through the circuit. The ***add*** channel value is merged into the ***items***  channel. The items channel value is joined to the ***circuit***, and the circuit channel value is mapped and tapped over the view and app functions respectively.

A signal propagation diagram shows what is happening in the circuit:

```
PROPAGATION
| SIGNALS   TIMELINE ->
| add:      --------------v2---------------------------------->
| remove:   ----------------------------------1--------------->
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

