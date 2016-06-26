# Overview

Functional JavaScript

Circus is not a functional library for JavaScript like Lodash or Ramda. It is a library that sets up functional applications in a JavaScript way. Using syntax and constructs familiar to all JavaScript developers, it's __functional programming - the best bits__.

Perhaps the most useful, and deceptively simple, idea to come out of functional programming is the list.

Other ideas that have gained traction in JavaScript are immutability and the need for pure functions, high order functions, and even currying and partial application. In JavaScript, all of these ideas must be implemented and policed by the programmer.

 through pure functions
are lists, list operators, patterns and of course functions - pure functions, high order functions, recursive functions and so on. JavaScript has them all, and later variants of the language have added syntax to make them more accessible, more readable - sugar, but very refined.

Circus takes the idea of a lazy list and turns it into a signal - a value that changes over time.


A library for getting data to the right place at the right time - and in the right shape.

The underlying purpose of Circus is to provide a consistently functional application architecture. Circus eschews traditional object oriented design patterns such as MVC or MVVM in favour of a more fluid, functional approach called a circuit - a declarative, compositional network of signalled values that propagate over time.

Whilst many of the ideas behind Circus are already established by existing libraries and frameworks - reactive, streaming, functional composition, associativity, etc, the goal of Circus is to streamline these kinds of ideas into a simple re-usable pattern that reduces down to a single entry point: the circuit.

Circus could be implemented in an FP language but then it wouldn't be JavaScript any more. It could be implemented through a JavaScript FP library; it would still be JavasScript but would no longer be implemented in a FP way with all the

Circus is inspired by the elm programming language and its architecture, but remains resolutely JavaScript through its implementation and in its presentation of its themes.

## Modelling program behaviour
Circus puts modern JavaScript syntax to work on the modelling of program behaviour through declarative structures. Put simply, Circus cleanly divides the efforts of program design into distinct structural and functional component spaces.

Structural component space is often described in terms of routing, networking

# Signals, circuits and channels

## Signals and value propagation

Signals hold values. Their purpose is to notify other signals of the state change of the values they contain. Signals are therefore reactive in the sense that a signal 'A' connected to a signal 'B' will notify signal 'B' whenever the state of its value changes. The notification can (and usually does) contain the current state of signal 'A's value.

This reactive pattern is convenient for propagating application events such as user inputs, mouse clicks etc., from the application view state through to the model state. Signals therefore replace the more established architectural patterns of MVC, MVVM etc, with the notion of a circuit. Whilst it is convenient to uphold terms such as model and view, these concepts are no longer rooted in application architecture and so shift from a noun-like stance - the model, to a more functionally verbal stance - to model.

Signals can (and usually do) transfer the current state of their values to other signals. These values are called signal inputs and signal outputs respectively, and the overall behaviour of signal value transfer is called propagation.

Signals are nominally async / sync agnostic. Signal functors support the callback mechanism popularised by several testing frameworks whereby the functor signature will provide a done argument. Signal propagation will be suspended at this point until the done callback is executed.

### Signal functors
Signals express monadic behaviour through its API of mapping functors and implied binding. Both mapping and binding operations are associative, allowing signal networks to be constructed to any degree of complexity yet still be represented through the input / output semantics of a singular top level signal, usually referred to as the circuit. Because the circuit remains associative, its propagation behaviour remains consistent and predictable.

Circus provides several mechanisms for connecting signals together: The Signal API exposes feed and value methods that can be used to connect the output of one signal to the input of another. Signal value state changes will be propagated through the connection:

```
const signalA = circus.signal()
const signalB = circus.signal()

// connect the signals together through a feed
signalA.feed(signalB)

// input a value into signalA
SignalA.value('send me')

// output the value of signalB
SignalB.value() // => 'send me'
```

Signals are more usually connected together as circuits through a mechanism of join points.

## Circuits and channels

Circuits provide a fine grained control over the signalling and channelling of the values they contain.

Circuits are pure. They do not interfere with the values they carry and concern themselves only with the signalling and channelling of value changes.

The overall state of a circuit is not guaranteed to be structured. The circuit will faithfully report any values that are passed through it. Whereas, the state of the circuit at specific join points with specific inputs is guaranteed to be structured. The implication here is that an application is not responsible for its overall state and will instead concentrate on the state of the value inputs to each of its functional components. In other words, the circuit guarantees a separation of the concerns of application signalling from the concerns of application functionality.


## Channel syntax
Channel syntax introduces a simple arrow operator -> to the circuit in order to better discriminate between channel syntax and matcher syntax.


[see:](http://programmers.stackexchange.com/questions/114681/what-is-the-purpose-of-arrows)



```
a -> b // channel

```


# Functional programming

programming is
logical comparisons
data shaping
data delivery

Mechanisms for the above lend themselves to patterns which in turn lend themselves to implementations which in turn lend themselves to generalisations which result in libraries and frameworks (== boilerplate)

What is
* functional programming
* monads
* functors
* maybe
* binding

## Binding
A bind operation unpacks a signal value so that a standard function can be applied in signal context. Circus bind facilitates this behaviour by decorating the operation with bespoke context. The bind operator can therefore be used as middle-ware.

* associativity

* Do notation and pattern matching
It's no coincidence that circuits resemble Haskell do notation, and that Circus pattern matching serves the same purpose as the Haskell

# Circuit rules

1. Circuits are associative. This means that the operational order of mapped functions lifted into the circuit is consistent irrespective of complexity

2. Signal values can be


## Monadic vs applicative behaviour
In FP, the monadic style of programming leads to Circuit supports these two stalwart FP patterns - through behaviour if not

### Functors
Functors lift ordinary functions into the signal. The standard Circus functor is the map operator and this behaves in a very similar way to the JavaScript Array.map function.

### Chains
Chaining is the ability for the result of one functor to be passed in to the next without the need to unbox the value being passed on.

### Binding
Binding takes a signal value and its context and applies it to a standard function.

### Value
Signal.value is the monadic return function that is used to box and unbox the signal value.

## Circuit logic
Circus uses standard object syntax to express a circuit - a declarative, compositional network of signalled values that propagate over time.

Circuits have the property of associativity which means that propagation behaviour is consistent over the circuit irrespective of complexity or depth.

```
const app = new Circus().extend({step: s => () => steps.push(s)}),
      steps=[]

const a=app.signal().step(1)
const b=app.signal().step(2)

const circuit = app.join({
    a,
    c: app.join(b.join(a)).step(3)
}).step(4)

a.value()

steps.toString() === '1,2,3,4'
```

## Pattern matching

```
const s1 = Circus.signal()
const s2 = Circus.signal()

// wait for all channels
const circuit = Circus.join(s1, s2).all()
s1.value(1) // circuit.value() === undefined
s2.value(2) // circuit.value() === {s1:1, s2:2}


```

## Extensibility

```
const s = Circus.signal().extend({
  always: v => this.map( () => v),
  batch: size => {
    const chunk = []
    return this.map( v => {
      chunk.push(v)
      if (chunk.length === size) {
        v = chunk, chunk = []
        return v
      }
    })
  }
}).always('ok').batch(2)

s.value(1) // undefined
s.value(2) // ['ok','ok']
s.value(3) // undefined
s.value(4) // ['ok','ok']

// add new functors to all signals in circuit
Circus.extend({
    // Remove falsey values from the signal
    compact: () => this.map( v => v || Circus.FALSE )
})

s = Circus.signal().compact().keep()

s.value(1)
s.value(undefined)
s.value(3)
s.value(false)
s.value(5)

s.toArray() // [1,3,5]
```

# Useful functional patterns
## Maybe
The maybe pattern works well with circuits that need to bail early - usually with a failure message. Form validation and service calls are just two examples where circuits might need to stop propagating and divert to a different channel.

Circus provides two convenience functions that can be used to set up a maybe circuit: maybeBinder and maybe. The general usage is:

```
const p = v=> v===p // a predicate
      m = 'a message'

circuit.bind(maybeBinder).map(maybe(p,m)).match({
  just,
  nothing
})
```

## MaybeBinder
Binds signal values to a maybe context and generates circuit level just, nothing and fail channels.

The MaybeBinder lets you bail out of circuit propagation at any point with an optional fail message. Each of the output channels can be extended reactively. For example, a validation circuit might be connected to a form so that valid input propagates to the next step, whereas fails are redirected back to the user.

A circuit bound to the MaybeBinder will continue to propagate just signal values, but will halt propagation on nothing. The binding also accepts an optional message which when coupled to nothing will be placed on a fail channel.

maybe(predicate, message)
  predicate:  v -> one of
                true - continue propagation of value through just channel
                truthy - continue propagation of truthy value through just channel
                falsey - halt propagation and activate nothing channel
  message:    optional value activated on the fail channel

# Pattern matching
Circus provides simple but effective pattern matching based on the shape and state of a signal. The operator Signal.match accepts an object graph and attempts to match each of its keys to a signal channel before testing each matching channel value against the object key value. Here's the basic form:

```
const match = signal.match({
  a : 1,
  b : 2
}).value

match({a:1}) // block
match({b:2}) // block
match({a:1,b:2}) // match

```
