[![Build Status](https://travis-ci.org/philtoms/circus.svg?branch=master)](https://travis-ci.org/philtoms/circus)

# CircusJS MVI

A Javascript frp library for front end developers.

Signal takes an event such as a keypress and maps it onto a signal whose value change descretely over time. Signals can be connected together to form logical cicuits that turn asynchronous speghetti into sequential code making it easier to understand the overall state of a program at any given point in time. 

Signal is part of the CircusJS set of class acts that fit together to create modern web applicatins, but it can be used independently.

Signal uses established functional patterns like map, reduce and merge to transform signal values from one signal to another. Using these familiar terms and patterns, complex circuits can be constructed from descrete, testable units of code.

```javascript
	var searchTerm = circus.signal('keypress').skip(3).concat().model()
	var searchResuts = circus.signal()
```

## Installation
 ```shell
npm install --save-dev circus
```
## Model === application state
In Circus MVI, the model represents the application state - all of it. If an aplication needs to act on mouse state, then mouse state must be signaled to the model.

## Immutable characteristics
Circus values are plain old javascript so they have core language mutability. That is to say that simple values are immutable by default but complex values like arrays and objects have immutable reference characteristics - they can be compared for equality very cheaply.

## Circus acts
Acts are circuit patterns

## Hot or cold?
If you had to describe Circus in terms of hot or cold observables, it would be hot by default. That is to say, Circus signals always provide the latest value. Late subscribers get the latest value. The cold observable pattern is available through composition:

```javascript
	// seed a signal. Because it is hot by default, the signal value will not
	// be propogated

	var signalA = circus.signal(['X','Y','Z'])

	var signalB = circus.signal(signalA.toArray).
```

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. 


