# Introduction

Circus is a view agnostic reactive pipeline that delivers time related data to the components of an application. This allows the components to be isolated, functionally pure and easy to test.

Circus is built around three core ideas: signals, circuits and channels. A signal is a value that changes over time. Signals can be connected together to form circuits., and a circuit, a set of signals connected together to form signal channels. The circuit delivers - or routes if you prefer - signalled data to isolated components and guarantees sequential, time related, data delivery.

By explicitly abstracting the mechanism by which components are connected together, Circus provides

Circus is a collection of extensible modules that support a functional and reactive approach to building applications. At the heart of circus is the concept of a signal, a monadic value that changes over time, and its ability to be connected to other signals to form circuits. Signal values propagate through the circuit, the output of one signal becoming the input of another signal connected to it.

## Core concepts - modularised

### Circus.signal
A signal is a monad whose value changes over time. Signals can be connected together to form a circuit. Connected signals propagate their values through the circuit. Values NEVER travel backwards.

### Circus.logic
Circus.logic extends core signals with several operators that enable them to be connected together.

* join - Join one or more signals into one, preserving channel identity
* merge - Merge one or more signals into one, replacing channel identity
* feed - Feed the value of one signal into one or more signals
* switch -

### Circus.circuit
Given that two or more signals connected together form a circuit, this module builds on that concept to provide circuit state and the ability to change state through a reduce operation called fold.

```
// fold: ((cv,v,[done]) -> cv) -> Signal
const signal = new Signal()
const circuit = new Circuit().join(signal).prime(1).tap() // 2

signal.fold((state,value)=> {state+value}).value(1).tap() // 1
```

 A circuit is formed whenever two or more signals are connected together. Circuits inherit signal properties and can be connected together to form even larger circuits.

```
        s
s + s + s
        s + s
```

### Channel
A channel is formed whenever one signal is connected to another. Channels are typically extended through a circuit and describe the path of value propagation.

```
            sv -> sv
sv -> sv -> sv
            sv
```

### Logic
Circus.logic extends core Signals with several logical operators that pass, block or augment value propagation. Circus logic operates on signal channel values

* all - pass if all channel values are truthy, otherwise block
* any - pass if any channel values are truthy, otherwise block
* one - pass if one and only one channel value is truthy, otherwise block
* none - pass if all channel values are falsey, otherwise block

## Functional application
Every signal has a basic but extensible set of functional operators that should be familiar to anyone who's used a functional library.

* map: ((v,[done]) -> v) -> Signal

## Reactive state
Signals automatically propagate values through a circuit but the library says little about how values enter or leave the circuit. Specifically, signals expose a small set of functions that are used to set and retrieve the current signal value.

* value: ([v] -> undefined) -> v
* prime: (v -> undefined) -> Signal
* tap: (v -> undefined) -> Signal





[![Build Status](https://travis-ci.org/philtoms/circus.svg?branch=master)](https://travis-ci.org/philtoms/circus)

The following notes track the wip of this project - still very much in discovery phase...

# Signal
A signal is a value that changes over time.

###Tech talk
At the heart of Circus lies the concept of a Signal - a value that changes over time - lifted
directly from the Elm programming language. Conceptually overlapping streams, observables and reactive programming in general, signals provide appropriate syntax for functional composition and pattern matching of complex values that ultimately represent the model state of an application.

In Elm, signals are tamed and driven explicitly through the foldp function that constantly folds changing signal values into program state. The functionally recursive nature of the language allows a single expression to ultimately leads back to the major components of the application - often organised in a flexible and reusable model, update, view pattern loosely termed Elm architecture.

```
// Elm:
-- MODEL
type alias Model = { ... }

-- UPDATE
type Action = Reset | ...

update : Action -> Model -> Model
update action model =
  case action of
    Reset -> ...

-- VIEW
view : Model -> HTML
view = ...

foldp: (a -> state state) -> state -> Signal a -> Signal state

```

In Circus, this whole concept is abstracted into the Signal function and its extensible, public  operational behaviour.

// Circus:
signal(address).prime(s).map(a => a).value(a)
```

This isn't a very promising start. The the value stands at the tail rather than the head of the statement, the composition seems to be constrained to whatever properties are available on the signal - what's with the map, where is the foldp function or its equivalent?

This example simply illustrates the point that Circus is not a JavaScript port of elm. Rather, it applies some very inspirational ideas to a more idiomatically JavaScript development approach. These ideas: values that change over time, functional composition, pattern matching, are better illustrated with an example of how signals might be applied through a more recognisable pattern - a micro framework called circus.MVI

```js
import { m, mvi } from 'mithril.circus'

// expose m, v and i signals on a single program instance
const app = mvi()

// MODEL: I -> Model -> V
app.model.map(greet)

const greet = { name, password } => ({
  greet: password==='secret' name && name[0].toUpperCase() + name.substr(1) + '!!'
})

// VIEW: M -> View -> I
app.view.map(render)

// map the state onto a view (using mithil)
const render = (state) => {
  const input = inputHelper.bind(state)
  return m('div',
    state.greet? m('div',[m('span','Welcome'),m('span',state.greet)]) : [
      m('h1', 'Please login'),
      input('name')
      input('password','password')
    ])
  ])
}

const inputHelper = (name,type) {
  return m('label',[name, m('input', {
    type,
    onchange:m.withAttr('value',intentions[name].value),
    value:this[name]
  })
}

// INTENT: V -> Intent > M
const intentions = {
  name: circus.signal(),
  password: circus.signal()
}
app.intent.join(intentions)

Mithril: mount the MVI component on the dom
m.mount(document.body, app.component())
```

## Signals

A signal is an object whose value changes over time. A signal has state and behaviour.

### State

A signal can be in one of 3 states

1. Active (true) - the signal will propagate
2. Blocked (false)- the signal will block
3. Unset [reset] (undefined) - a new signal will block until it receives an input

Signal state can be set through the signal.active method and reset though the pulse operator

```js
  var s = signal()
  s.active() // false
  s.value(1).active() // true

  s.active(false) // false
  s.active(true) // true

  s.pulse().value(1) // true then false
```

## Value

A signal has a value that changes over time.

```js
signal.value(v) // sets the signal value
signal.value()  // returns signal value => v
signal.history() // returns the history of signal values over time
```

Signals can keep and return value history

```js
signal.keep().value(1)
signal.value(2)
signal.history() // ==> [1,2]

// limit
signal.keep(2).value(1)
signal.value(2)
signal.value(3)
signal.history() // ==> [2,3]
```

signals can be instructed to ignore duplicate values

```js
s = signal.dedup().tap(debug)
s.value(1) // ==> 1
s.value(1) // ==>
s.value([1]) // ==> [1]
s.value([1]) // ==> [1]
```
The default diff test is the identity === operator which works well with immutable values. The dedup operator takes an optional diff function (x,y -> true|false).

## Operators

A signal has a set of chainable and extensible operators that are executed whenever the signal receives a new value

```js
    signal.map(v -> fn).tap(v -> fn)
```

### Comparisons


## Channels
Channels connect signals together allowing values to move from one signal to another. Values passed into a signal sequentially will travel down the same channel, one after the other. Values passed into a signal at the same time - in parallel - will travel down their own channels.

Whenever a value is pushed to a connected signal, a channel is created to allow the value to move
between signal points.

Channels are signal helpers that guarantee identity and can be used as signal factories. Channels
can be used in place of string name / namespace identities, providing the facility to block out
a circuit independently of signal implementation.

```js
id = channel('id') // create a new channel identity
id.map // returns a new signal with id

match(id) // match on signal identity

idBlock = channel('idb', {p1:id, p2:signal()}) // create a new channel identity block

match(idBlock) // match on all identities in idBlock
match(idBlock.p2) match on p2 identity

// variations
channel('id.p1.p2')     // ==> {id: {p1: {p2:signal}}}
channel('id,p1,p2')     // ==> {id:signal, p1:signal, p2:signal}
channel('id','p1,'p2')  // ==> {id:signal, p1:signal, p2:signal}

```

Channels can be generated directly as above, or through signals and signal joins.

### Adding a channel to a signal
Signals and channels are interchangeable. Adding a signal to another signals channels effectively generates a tunnelling channel, that is, a signal channel that does not participate in the block signal operations but is routed nonetheless.

```js
s1 = signal()
s2 = signal().map(/* 'x' */).feed(s1)
c = channel().value(123)

// join the channel to the circuit
s2.join(c)

s2.value('x')
s1.channels(c).value() // => 123
```

##Circuits

Circuits are formed between signals using join points and feeds

* join(signal* | signalBlock) - one or more incoming signals to the current signal
* merge(signal* | signalBlock) - one or more incoming signals with the current signal
* sample(signal* | signalBlock) - one or more incoming signals pulses the current signal
* feed(signal+) - the current signal to one or more incoming signals

### Join point behaviour

A circuit is active when any of its signals are active. By default, active signal state is propagated over join points when any of the incoming signals is active. This behaviour can be modified at the join point to block until all incoming signals are active.

* join - one or more signals into a signal block with discrete channels
* merge - the latest of one or more input signals into the output signal
* sample - one or more input signals, pulsing the current output signal

### Comparisons

Circuits are routes.
Circuit signals fulfil a similar role to Redux reduce patterns with consistent, explicit syntax and behaviour
- signals are monadic
- signals are synchronous

##Pattern matching

match on f(value,mask) -> truthy (circus.FALSE, UNDEFINED are truthy values in this context)

* all - all channels truthy
* any - at least 1 channel truthy
* one - only one channel at a time
* none - no channels truthy

An optional mask can be applied to restrict the match to a subset of key/values.
* The mask key can be wildcarded
* The mask value can be truthy, falsey, undefined or function
  * truthy values propagate when matched
  * falsey values block when matched
  * undefined values always propagate
  * functions receive v and return truthy or falsey values or circus.FALSE
    * circus.FALSE stops propagation (finally will be called)

## Implied feeds (switch)
Where the PM value is a signal, the matcher will feed directly into that signal. The signal output will become the value of the matched pattern and thus will become part of the PM signal output value.

### logical mask functions

* and(v) => pv & v
* or(v)  => pv | v
* xor(v) => pv ^ v
* not(v) => !v


# MVI - micro framework

Typically, micro frameworks:
* are small,
* don't do very much,
* form the kernel of an idea that can be developed into a dsl

The MVI framework simplifies a signal based application by providing a strong pattern based implementation.

Application state and logic is completely expressed by and manipulated through
circus signals, arranged as M(odel) V(iew) I(ntent) circuitry that cyclically
feeds the values of each signal into the next.

The direction of information travel is strictly M -> V -> I
```
          +--> Model--+
          ^           |
          |           v
        Intent  <--  View
```
The values in the circuit represent the application state and are manipulated
through functional composition using map / reduce semantics. For example,
the model will likely map its input onto a different shaped output:
   model.map(fn) // where fn: x > y eg., updateService(data)

## MVI Operators

MVI extends the standard signal operators to include

* error - toggle active state and optionally set a signal error message
* cta - toggle active state

# CircusJS MVI

A JavaScript frp library for front end developers.

Signal takes an event such as a key press and maps it onto a signal whose value change discretely over time. Signals can be connected together to form logical circuits that turn asynchronous spaghetti into sequential code making it easier to understand the overall state of a program at any given point in time.

Signal is part of the CircusJS set of class acts that fit together to create modern web applications, but it can be used independently.

Signal uses established functional patterns like map, reduce and merge to transform signal values from one signal to another. Using these familiar terms and patterns, complex circuits can be constructed from discrete, testable units of code.

```javascript
	var searchTerm = circus.signal('keypress').skip(3).concat().model()
	var searchResuts = circus.signal()
```

## Installation
```shell
npm install --save-dev circus
```
## Model === application state
In Circus MVI, the model represents the application state - all of it. If an application needs to act on mouse state, then mouse state must be signalled to the model.

## Immutable characteristics
Circus values are plain old JavaScript so they have core language mutability. That is to say that simple values are immutable by default but complex values like arrays and objects have immutable reference characteristics - they can be compared for equality very cheaply but object properties or array values are changeable.

## Prep
### How shall we handle validation?
### Will animation enhance UX?

### Lets build an intention circuit to define validation channels.
Each channel is conditionally merged with the error channel before joining the main intent channel. The error channel is then joined with the intent channel which eventually feeds the model.

```
intent -----------------------------------------------------------J --> feed(model)
  error -------------------M ---------------M ----------------M --+
  email ------> required -?+ ----> formed -?+ --------------------+
  password ---> required -?+ --> strength -?+ -JA --> equal -?+ --+
  register -------------------------------------------------------+
  confirm --------------------------------------+
  title ------> required -?+ -------------------------------------+
  firstName --> required -?+ -------------------------------------+
  lastName ---> required -?+ -------------------------------------+
  address
    line1 ----> required -?+ -------------------------------------+
    line2 --------------------------------------------------------+
    town -----> required -?+ -------------------------------------+
    county ---> required -?+ -------------------------------------+
    country --> required -?+ -------------------------------------+


#### key:
* -->  lifted function
* --J  join
* -JA  joinAll
* --M  merge
* --+  channel m/j point
* -?+  conditional channel m/j point

```

Our validation scheme accounts for required fields, a validly formed email, and a strength regulated password with confirmation. Notice how the channel points are aligned vertically with the joins and merges, and moreover, how each point is arranged synchronously.

The circuit is easily translated into code. Signals constructed through circus.intent have implicit error and intent channels so the only channels that need defining are the field mappings:

```js
	// create some helper functions to simplify the circuit definition
	function required(msg) {
		return circus.intent().required(msg)
	}
	function formed(v) {
		return /email/.match(v)
	}

	// partially construct the circuit using a signal block of named channels
	var intent = circus.intent({
	    email: required().error(formed),
	    password: required().feed(strength).joinAll(confirm),
	    register: circus.signal(),
	    confirm: circus.signal(),
	    title: required(),
	    firstName: required(),
	    lastNme: required(),
	    address: circus.intent({
	    	line1: required(),
	    	line2: circus.signal(),
	    	town: required(),
	    	county: required(),
	    	country: required()
	    })
	})
	// and bind
	intent.bindAll()

```
This circuit definition uses the delayed binding mechanism to allow inline bindings between as yet undefined channels.

### Why call it Circus?

it has a certain ring to it...

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.


