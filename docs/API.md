# API

## Function annotations

`A -> B`

An anonymous function  with arguments `A` returning `B`

<br>
`fn : A -> B`

A function `fn` with arguments `A` returning `B`

<br>
`fn : () -> B`

A function `fn` with no arguments returning `A`

<br>
`fn : (A, B) -> C`

A function `fn` with arguments `A` and `B` returning `C`

<br>
`channel.fn : A -> B`

A channel function `fn` with arguments `A` returning `B`

<br>
`channel.ftor : (A -> B) -> Channel B`

A channel functor `ftor` that takes a function A -> B and returns a `Channel B`

<br>
`Channel.fn : A -> B`

A static global Channel function `fn` with arguments `A` returning `B`

<br>
## `Channel : () -> Channel`<br>

The Channel constructor function returns a new channel with undefined state and the set of functions and functors described below.


<br>
## `channel.name : () -> name`

Return the channel name if it exists. Otherwise return `undefined`.


<br>
## `channel.signal : A -> A`
`channel.signal : () -> A`

Signal a new value. The signal will propagate through the channel.

### Examples
```
channel.signal(123) // channel.value() === 123

const v = [1, 2, 3]
channel.signal(v) // returns v

const inc = v => v + 1
channel.map(inc).signal(1) // channel.value() === 2
```

<br>
## `channel.pulse : () -> Channel`
`channel.pulse : (A) -> Channel A`

Reset channel value after propagation.

The pulse modifier ensures that the channel value is reset to `undefined` or the optional `pulse` argument value after every subsequent signal propagation.

<br>
## `channel(A).asSignal : (A) -> Channel A`
`(A -> B) -> Channel B`

return a value, a function or a signal in Channel context


<br>
## `channel(A).value() : () -> A`

Return the current channel value.


<br>
## `channel(A).clone : () -> Channel B`

Clone a channel into a new context


<br>
## `channel().prime : (A) -> Channel A`
                (state(A)) -> Channel A

Set signal value or state directly, bypassing any propagation steps


<br>
## `channel(A).map : (A -> B) -> Channel B`

Map over the current signal value


<br>
## `channel(A).fail : (F) -> Channel A -> F(A)`

Register a fail handler.
The handler will be called after failed propagation.
The value passed to the handler will be the fail value.


<br>
## `channel(A).feed : (F) -> Channel A -> F(A)`

Register a feed handler.
The handler will be called after successful propagation.
The value passed to the handler will be the state value.


<br>
## `channel(A).filter : (A -> boolean) -> Channel A`

Filter the signal value.
- return truthy to continue propagation
- return falsey to halt propagation


<br>
## `channel(A).fold : ((A, B) -> A, A) -> Channel A`

Continuously fold incoming signal values into an accumulated outgoing value.

<br>
## `channel(A).tap : (A) -> Channel A`

Tap the current signal state value.
- tap ignores any value returned from the tap function.

eg : tap(A => console.log(A)) -> Channel A

<br>
channel(A).getState : () -> {value: A}

Return the current channel state which minimally includes the current value of the channel.

Note that state also includes channel context values which may be freely
accessed and amended within the binding context of propagation. Like most
JavaScript contexts, these values should be sparingly used in channel extensions.
They play no part in core channel propagation.

example with context:
channel.signal(true)
channel.getState() // -> {$value: true}

<br>
## `channel().bind : (Channel -> {A}) -> Channel`

bind a function to channel context
Note: bound function must call context.next() to propagate

<br>
## `channel().extend : (Channel -> {A}) -> Channel`

Extend a channel with a custom step (or steps)
Note: chainable steps must return channel

<br>

Channel.id: (A) -> A
Identity function
