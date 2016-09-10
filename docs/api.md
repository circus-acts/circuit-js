
### Construction
Signal : () -> Signal
Signal : (A) -> Signal A
Signal : (A -> B) -> Signal B
Signal : (A -> B -> B (C)) -> Signal C
Signal : ({A, B}) -> Signal {A: Signal A, B: Signal B}
Signal : ({A, B: B -> C}) -> Signal {A: Signal A, B: Signal C}
Signal : (Signal A) -> Signal A

### Tuning
bind
pulse
prime
tap

### Composition
map : () -> Signal
map : (A) -> Signal A
map : (A -> B) -> Signal B
map : (A -> B -> B (C)) -> Signal C
map : (A -> B -> B.resolve (C)) -> Signal C
map : (A -> B -> B.reject (C)) -> Signal
map : (Signal A) -> Signal A

pipe : (A -> B, B -> C) -> Signal C
pipe : (A -> B, Signal C) -> Signal B ? C
pipe : (A -> B -> B (C), C -> D) -> Signal D

### Circuitry
join : ({A, B}) -> Signal {A: Signal A, B: Signal B}
join : ({A, B: B -> C}) -> Signal {A: Signal A, B: Signal C}
merge : ({A, B}) -> Signal A | Signal B
feed
fail
finally

### Circuit logic
Signal(S).sample : ({A, B}) -> Signal S
Signal(S).filter : (A -> !!A) -> Signal S
Signal(S).filter : ({A -> !!A, B -> !!B}) -> Signal S
every
some
one
none

### Propagation
input : (A) -> Signal A
Signal(A).value : () -> A
