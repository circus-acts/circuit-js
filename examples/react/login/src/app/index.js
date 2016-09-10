import circuit from './circuit'
import tryLogin from './loginService'
import view from './view'

const init = {email:''}

// Connect the logic up to the circuit and prime it with
// an initial state
circuit.map(tryLogin).prime(init).finally(view)

// Since this circuit contains a sampled signal (login), it
// won't auto push to the view so bypass it here.
view(init)
