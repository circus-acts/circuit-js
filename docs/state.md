# State

Circus apps control their own state by default but this behaviour can be replaced by an external state management strategy such as immutable.js or redux.

## State API
Circus apps expose the following two state methods:

app = new Circus(state) // prime new circuit with state.
getState() // returns an object representation of internal state.

## Built in state
Circus maintains state through a simple strategy that favours operational speed over size.
