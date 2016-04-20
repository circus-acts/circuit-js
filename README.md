# CircusJS

[![Build Status](https://travis-ci.org/philtoms/circus-js.svg?branch=master)](https://travis-ci.org/philtoms/circus-js)

A library for building applications using circuit architecture - a functionally declarative design pattern that encourages application development through pure functions, composition and associativity - in JavaScript.

Define a circuit:

```
// ./circuit.js
import circus, { maybe, maybeBinder } from 'circus-js'

const _ = circus.UNDEFINED

// some validation
const required = v => !!v
const emailTest = v => /\S+@\S+\.\S+/i.test(v)

// export a circuit
export default circus.join({
    username: maybe( required, `please enter a username` ),
    email: maybe( emailTest, `please enter a valid email` )
})
.sample({cta: _ })
.match({
  just: {login: _ },
  nothing: {view: _ }
})
.bind(maybeBinder)
```

CircusJS works very well with reactive libraries like React or Mithril. Use pure functional view components and let the circuit handle state:

```
// ./view.js
import React from 'react'
import { render } from 'react-dom'
import circuit, { channels } from './circuit'

export default ({ username, email }) => render(
<div>
  <label>User name: <input defaultValue={username} onInput={channels.username.value}></label>
  <label>E-mail: <input defaultValue={email} onInput={channels.email.value}></label>
  <p className='error'>{circuit.error()}</p>
  <button onClick={channels.cta.value}>Login</button>
</div>
,document.querySelector('#login'))
```

Import and bind application components to the circuit. Those underscores act like expansion slots - the circuit's already operational, but extra functionality can be plugged in through overlays:

```
// ./main.js
import circuit from './circuit'
import login from './loginService'
import view from './view'

circuit.overlay({login, view}).value({username:'',email:''})
```

## Features

* distinct separation of concerns - circuits, channels and overlays
* consistent, predictable circuit logic - associative signals
* functional behaviour - functors, chains and binding
* simple and efficient pattern matching
* extensible - custom signal and circuit functors

## Installation
```shell
npm install --save circus-js
```

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.

