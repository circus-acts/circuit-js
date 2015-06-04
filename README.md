[![Build Status](https://travis-ci.org/philtoms/circus.svg?branch=master)](https://travis-ci.org/philtoms/circus)

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

## Circus acts
Acts are circuit patterns

## Hot or cold?
Circus doesn't really deal with observables because it has no notion of subscribers, but  patterns will be discerned, and in such cases, circus would be hot by default. Cold behaviour is always available through composition:

```javascript
	signalA = circus.signal(['X','Y','Z'])
	signalB = circus.signal(signalA.keep().history()).map(doSomething)
```

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
* -->  mapped or lifted function
* --J  join 
* -JA  joinAll
* --M  merge
* --+  channel m/j point
* -?+  conditional channel m/j point

```

Our validation scheme accounts for required fields, a validly formed email, and a strength regulated password with confirmation. Notice how the channel points are aligned vertically with the joins and merges, and moreover, how each point is arranged synchronously.

The circuit is easily translated into code. Signals constructed through circus.intent have implicit error and intent channels so the only channels that need defining are the field mappings:

```javascript

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

Circus has a certain ring to it...

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. 


