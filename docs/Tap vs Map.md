# Tap vs Map

Channel.tap and Channel.map are very similar functions - they both receive and process signalled values. The only difference between the two is that map propagates its return value and tap does not. Small difference, potentially huge consequences.

Traditionally tap is seen as a bit of a debugging aid. Tapping a channel will safely expose its current value (its state) every time it's signalled.

```
log = v => console.log({v})

signal = Channel().tap(log)

channel.signal(1) // => {1}
channel.signal(2) // => {2}
channel.signal('ho') // => {ho: 'ho'}
```

Moreover, the value will depend on where the channel is tapped. Lets try to propagate a value to demonstrate the built in safety that tap provides:
```
dbl = v => v + v
log = v => console.log({v}) || dbl(v) // this won't have any effect

channel = Channel().tap(log).map(dbl).tap(log)

channel.signal(1) // => {1}, {2}
channel.signal(2) // => {2}, {4}
channel.signal('ho') // => {ho: 'ho'}, {hoho: 'hoho'} -- see how it works?
```

And now let's replace all the taps in the last example with maps:

```
dbl = v => v + v
log = v => console.log({v}) || dbl(v)

channel = Channel().map(log).map(dbl).map(log)

channel.signal(1) // => {1}, {4}
channel.signal(2) // => {2}, {8}
channel.signal('he') // => {he: 'he'}, {hehehehe: 'hehehehe'} -- just not funny!
```

Big difference, of course. Map is the function for manipulating circuit state as values are signalled and propagated through it. Tap is the function for responding to state changes without disturbing any of the values that are actually circulating.

