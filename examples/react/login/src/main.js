import circuit from './circuit'
import login from './loginService'
import view from './view'

circuit.overlay({login, view}).value({email:''})
