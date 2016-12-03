# Circuit-js

[![Build Status](https://travis-ci.org/philtoms/circuit-js.svg?branch=master)](https://travis-ci.org/philtoms/circuit-js)

A library for building applications using circuit architecture - a functionally declarative software pattern that promotes application development through pure functions, composition and associativity - wrapped in a JavaScript hash.

## Installation
```shell
npm install --save circuit-js
```

## The basics
Circuit-js uses standard object syntax to define connectible signals that propagate data state changes though a circuit.

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
  const {add, remove} = todos.channels.items
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
  items: merge({add, remove}) // merge add and remove channels into items
})

todos.map(view).tap(app)

// go!
todos.input({items: ['first entry']})
```

## So what just happened?
An app was [born](http://www.webpackbin.com/NkoXOhczf).

There are three signals in this app: *add*, *remove* and *items*, each correlating to a function on the object passed in to the circuit function:

```javascript
const todos = circuit({
  items: merge({
    add,
    remove
  })
})
```

The circuit function returns an active circuit *todos* with three input channels connected to the underlying signals. The app binds two of them, *channels.add* and *channels.remove* in the view so that when the user types in a new todo, or clicks on remove todo, the circuit is activated through the bindings.

The circuits delivers the bound values to the appropriate functions and *they* return their values back into the circuit! Where do the values go? They bubble up through the circuit. The *add* signal value is merged into the *items* signal. The *items* signal value is joined to the *circuit* (there's no merge function here), and the circuit signal value is mapped and tapped over the view and app functions respectively.

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

* distinct separation of concerns - circuits, channels and overlays
* consistent and predictable logic - composable, associative signals
* functional behaviour - map, tap, reduce etc..
* extensible - custom signals through binding and middleware

### Copyright

Source code is licensed under the ISC License (ISC). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.

