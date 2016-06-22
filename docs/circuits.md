# Circuits

Circus helps you keep your application pure by dividing your logic it into declarative. An application is divid

The core idea of a circuit is to sequence data from one component to another. A large circuit with many components will retain this sequential behaviour through each and every component connection. Then, by ensuring that components are purely functional, we can completely separate the concerns of circuitry and component operation, providing us with an opportunity to scale up the complexity of the former without unduly complicating the performance and design of the latter.

## Overlays (bind)
Overlays bind or map new behaviour onto a circuit through an object graph. If the graph value is a signal, the new signal will bind (ie wrap) the matching circuit signal. If the graph value is a function, the matching circuit signal will map (ie chain) the graph function.