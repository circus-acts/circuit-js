import circuit from './circuit'
import tryLogin from './loginService'
import view from './view'

const init = {email:''}

// Connect the logic up to the circuit and prime it with
// an initial state
circuit.overlay({tryLogin, view}).prime(init)

// Since this circuit contains a sampled signal (login), it
// won't fire off a new view on its own.
view(init)
