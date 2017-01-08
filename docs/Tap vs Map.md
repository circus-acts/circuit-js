# Tap vs Map

Signal.tap and Signal.map are very similar functions - they both receive and process signalled values. The only difference between the two is that map propagates its return value and tap does not. Small difference, potentially huge consequences.

Traditionally tap is seen as a bit of a debugging aide. Tapping a signal will safely expose its current value (its state) every time it's signalled.

```
log = v => console.log({v})

signal = Signal().tap(log)

signal.input(1) // => {1}
signal.input(2) // => {2}
signal.input('ho') // => {ho: 'ho'}
```

Moreover, the value will depend on where the signal is tapped. Lets try to propagate a value to demonstrate the built in safety that tap provides:
```
dbl = v => v + v
log = v => console.log({v}) || dbl(v) // this won't have any effect

signal = Signal().tap(log).map(dbl).tap(log)

signal.input(1) // => {1}, {2}
signal.input(2) // => {2}, {4}
signal.input('ho') // => {ho: 'ho'}, {hoho: 'hoho'} -- see how it works?
```

And now let's replace all the taps in the last example with maps:

```
dbl = v => v + v
log = v => console.log({v}) || dbl(v)

signal = Signal().map(log).map(dbl).map(log)

signal.input(1) // => {1}, {4}
signal.input(2) // => {2}, {8}
signal.input('he') // => {he: 'he'}, {hehehehe: 'hehehehe'} -- just not funny!
```

Big difference, of course. Map is the function for manipulating circuit state as values are signalled and propagated through it. Tap is the function for responding to state changes without disturbing any of the values that are actually circulating.

## Late binding
Both tap and map are late binding. That is, tapping or mapping a function into an active circuit will immediately call that function with the current circuit value.

Normally, as with all of the examples so far, circuits are created complete with said taps and maps before any values are signalled. Everything behaves as expected when values are subsequently passed through the circuit.

Late binding allows a tap or a map function to respond to the current circuit state when it is added to the circuit. The function is immediately called with the latest value as if it had just been propagated. This behaviour is very useful for setting or resetting an application by bringing it in line with circuit state without having to run through the state changes one by one:
```
// as if all those inputs had been replayed..
signal = Signal().prime('ho')

signal.tap(log) // => {ho: 'ho'}
```

Most circuits are designed to be complete with values continuously propagating between models and views. These circuits can be difficult to start up. They can be primed, but priming does not propagate and a view lifted into a circuit will not be displayed. Values can be signalled through channel inputs, but what values, and which channels? Should channels be explicitly exposed just to boot up an application? No. Late binding solves the problem elegantly by allowing a circuit to be set up and primed before selectively kick starting it with a single mapping function: the last piece of the puzzle, the last domino:
```
inc = v => v + 1
stop = window.confirm(`submit`)
log = v => console.log({v})

looper = Signal().filter(stop).map(inc).tap(log).prime(0)

// start
looper.map(looper)
```

This is where tapping really shines. Late binding a tapping function, however complex, will not disturb the circuit. Whereas late binding a mapping function, however simple, will cause a circuit state change and subsequent propagation.

Late binding a tapping function has a similar
