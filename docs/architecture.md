# Architecture

A software architecture is a pattern or a set of related patterns that describes how the lexical parts of a software are combined and how they communicate with one another. A common software architecture is MVC which provides guidance for the separation of a program into model, view and controller modules.

A circuit architecture
- has well defined inputs and outputs connected by channels
- provides a data flow logic using join points and pattern matching
- is a three dimensional (layered) architecture (natural continuations)

### AOP criticism
AOP aspects == overlays and should be applied for cross cutting concerns: validation? animation, logging etc. Otherwise the established criticism for reduced readability applies (comefrom).

## Applications

## Websites

Websites differ from applications in one important detail - state. Website state is restful and past in through the HTTP protocol. Circus needs to map this external state onto it's own initial internal state.

## MVI
Circus MVI is derived from the work done by [] in Cyclejs, and stands for Model -> View -> Intent.

The pattern describes the flow of information through a circuit, and usefully demarks the architectural regions (or layers) of an application into model, view and intention regions.

In MVI, as in all circuits, the flow of information is strictly one way from the model into the view, and then into the intentions (usually via user interaction), and finally back into the model again. Thus the flow of information in MVI is circular and will continue to flow until the circuit is stable.

Since MVI is just an architectural pattern applied to a circuit, the signals and circuit involved, do not have any additional specialised behaviour. Each signal in the circuit is concerned with mapping input values onto output values, and the circuit as a whole is concerned with moving output values from one signal into the input values of another, connected signal. But MVI provides an implied semantic overload to this behaviour.

###  MODEL: I -> Model -> V
The purpose of the model is to aggregate and map signalled intentions onto application state and pass this data on to the view. The model is usually the place to tap the current state into the domain. E.g., to save the application state to storage, to call external services etc.

### VIEW: M -> View -> I
The view maps the current model state over a render function. The render function either returns a view state suitable for mounting, or performs the mounting process immediately as a side effect. The mounted view feeds the intention signal channel(s) through user actions.

### INTENT: V -> Intent > M
Intentions are signals whose values are generated from user actions and system events. Most of the application's UI logic is expressed through intentions that join together to form a circuit component that feeds the model.
