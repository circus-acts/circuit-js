import Circuit, {Channel} from '../../src'
import Utils from '../../src/utils'
import * as error from '../../src/error'

runTests('validation', function() {

    const _ = Channel.id

    // some validation
    const required = v => !!v
    const email = v => /\S+@\S+\.\S+/i.test(v)

    let circuit

    setup(function(){

        // export a circuit
        circuit = new Circuit().join({
            email: error.test( email, `please enter a valid email` ),
            password: error.test( required, `please enter your password` )
        })
        .extend(error.Error)
        .sample({login: _ })
        .active('required!')
    })

    test('email - error', function() {
        circuit.signals.email('x')
        return circuit.error() === `please enter a valid email`
    })

    test('password - valid', function() {
        circuit.signals.password('x')
        return circuit.error() === ``
    })

    test('login - required', function() {
        circuit.signals.login(true)
        return circuit.error() === `required!`
    })

    test('circuit - primed', function() {
        circuit.prime({email:'hi@home.com', password:'ok'})
        circuit.signals.login(true)
        return circuit.error() === ``
    })

    test('circuit - happy path', function() {
        circuit.signals.email('hi@home.com')
        circuit.signals.password('ok')
        circuit.signals.login(true)
        return circuit.error() === ``
    })

    test('circuit - error', function() {
        circuit.prime({password:'ok'})
        circuit.signals.email('badformat')
        circuit.signals.login(true)
        return circuit.error() === `please enter a valid email`
    })
})
