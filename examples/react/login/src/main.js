import circuit from './circuit'
import tryLogin from './loginService'
import view from './view'

circuit.overlay({tryLogin, view}).prime({email:''})
