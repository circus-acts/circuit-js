# Circuits

Circus helps you keep your application pure by dividing your logic into declarative circuits that concern themselves with data flow, and program logic where you define what happens to the data when it arrives.

Beyond this simple statement, circuits have very little to say about program logic. Their principal concern is the flow of data through an application; how it arrives, when it arrives, where it needs to be diverted or blocked, and so on.

The core idea of a circuit is to sequence data from one component to another. A large circuit with many components will retain this sequential behaviour through each and every component connection. Then, by ensuring that components are purely functional, we can completely separate the concerns of circuitry and component operation, providing us with an opportunity to scale up the complexity of the former without unduly complicating the performance and design of the latter.

## Overlays
Overlays bind or map new behaviour onto a circuit through an object hash whose keys map those of the circuit. If the hash value is a signal, the new signal will bind (ie wrap) the matching circuit signal. If the hash value is a function, the matching circuit signal will map (ie chain) the hash function.
