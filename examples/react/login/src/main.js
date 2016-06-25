import circuit from './circuit'
import tryLogin from './loginService'
import view from './view'

const init = {email:''}
circuit.overlay({tryLogin, view}).prime(init)
view(init)
