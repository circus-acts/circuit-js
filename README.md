# Circus-js

[![Build Status](https://travis-ci.org/philtoms/circus-js.svg?branch=master)](https://travis-ci.org/philtoms/circus-js)

A library for building applications using circuit architecture - a functionally declarative software pattern that encourages application development through pure functions, composition and associativity - wrapped in a JavaScript hash.

## Installation
```shell
npm install --save circus-js
```

## The basics

Circus-js uses standard object hash syntax to define connectible signals that propagate data state changes though a circuit.

Define a circuit:


```javascript
// ./circuit.js
import Circus, { test } from 'circus-js'

// some validation
const required = v => !!v
const emailTest = v => /\S+@\S+\.\S+/i.test(v)

const login = (user, done) => {
    // likely to be async, so return the response through done
    setTimeout( () => done(user.password==='XXX' && 'You're in!' || 'Invalid user'))
}

// generate a circuit
const circuit = new Circus()
    .join({
        email: test( emailTest, `please enter a valid email` ),
        password: test( required, `please enter a password` ),
    })
    .map(login)

// and export it
export default circuit

```


Circus-js works very well with reactive libraries like React or Mithril. Use pure functional view components and let the circuit handle state:


```javascript
// ./view.js
import React from 'react'
import { render } from 'react-dom'
import circuit from './circuit'


// bind the circuit channels to form inputs
const { channels } = circuit
const input_email = e => channels.email.value(e.target.value)
const input_password = e => channels.password.value(e.target.value)

// When its all connected up, circuit state will be delivered here...
export default ({email, loggedIn, error}) => render(
  loggedIn ? <p>{loggedIn}</p>
  : <fieldset>
      <label>
        <span>E-mail:</span>
        <input
          defaultValue={email}
          onBlur={input_email}/>
      </label>
      <label>
        <span>Password:</span>
        <input
          type='password'
          onBlur={input_password}/>
      </label>
      <p className='error'>
        {error || ''}
      </p>
    </fieldset>
,document.querySelector('#login'))

```


Import the circuit and connect its output to the view. From this point on, the circuit is complete and
any changes to its state will be propagated to the view:


```
// ./main.js
import circuit from './circuit'
import view from './view'

// fire up the circuit with an empty state
circuit
  .finally(view)
  .value({email:''})

```

## Features

* distinct separation of concerns - circuits, channels and overlays
* consistent and predictable logic - composable, associative signals
* functional behaviour - functors, chains and binding
* simple and efficient pattern matching
* extensible - custom signal and circuit functors

### Copyright

Source code is licensed under the ISC License (ISC). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.

