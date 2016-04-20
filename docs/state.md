# State

Modern application design views an application's state and it's set of internal values as synonymous. Actually this has always been true; if an application displays some text on a screen, then somewhere, perhaps deep inside the application, there will be a variable, or register, holding the value that is being displayed.

This is not quite the whole picture.

The state of an application describes its behaviour at an arbitrary point in time. If an application has a calendar for example, and that calender is open and a date has been highlighted, then somewhere in the overall state of the application, there will be a set of values that describe the calendar, the highlighted text, the selected date and so on.

A functional programming approach, made popular in recent times, is to make explicit the relationship between state and behaviour, such that by setting the external state of say the calendar widget, the application will render or re-render the calendar as previously described. The key to this idea is the externalisation and separation of application state from the components designed to manipulate it.

```
// some application state
const state = {
    calendar: {
        open: true,
        date: '27/05/2016'
    }
}

// a pure functional component
function Calendar(props) {
    return props.open? <calendar {...props} /> : null
}

// somewhere else in the application...
const widget = Calendar(state.calendar)
```

The essence of this programming style is the

In such a programming style the distinction between state and behaviour is made concrete by the idea of a centralized, public state being directed by some mechanism through a collection of pure mapping functions, stateless in themselves but

This is distinctly different from the OOP encapsulation approach whereby objects are

One of the major benefits of this style of programming is the ability to reason about the behaviour of an application to any level of detail. Focusing on the calendar requires only the set of values needed to render its behaviour.

The aim of OOP is to encapsulate state and behaviour into objects that communicate their instructions and intentions to each other through messages. Ultimately program state is abstracted away.

The aim of FP is to generate a set of pure functions that map specific values onto program state and behaviour.

The aim of Circus is to deliver the right values to the right place at the right time. A pure function component then only needs to focus on mapping its input values onto its output state and or behaviour.

A procedural approach (familiar as end to end testing):
1. click on the calendar icon
2. move to the required date
3. click on the date

In programming, application state, or a selected part of it, is made explicit.

The value, or set of values, held by an application correlates to what the application is doing
Explicitly setting the state, the appli

Application state is whatever you, the programmer, requires it to be. This may seem like an obvious statement, but in order to fulfil it, you will need to consider

the programmer needs to decide . Circus goes a long way in helping you define the state of your application by providing stateful signals that propagate their values through a connected circuit.

In a Circus application, a circuit will have many values that change over time. At any point the collective sum and shape of the values will be determined by the overall state of the circuit. This implies that application state and circuit state are not always the same thing.

Circus values are monadic and signal bound and are distributed through the circuit as, where and when signals are connected together. Each signal value is in itself stateful.

and each behaves statefully
Circus apps control their own state by default but this behaviour can be replaced by an external state management strategy such as immutable.js or redux.

## State API
Circus apps expose the following two state methods:

app = new Circus(state) // prime new circuit with state.
getState() // returns an object representation of internal state.

## Built in state
Circus maintains state through a simple strategy that favours operational speed over size.
