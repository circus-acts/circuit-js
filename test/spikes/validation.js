import Circus from '../../src'
import Utils from '../../src/utils'
import * as error from '../../src/error'

runTests('validation', function() {

    const _ = Circus.id

    // some validation
    const required = v => !!v
    const email = v => /\S+@\S+\.\S+/i.test(v)

    let circuit, channels

    setup(function(){

        // export a circuit
        circuit = new Circus().join({
            email: error.test( email, `please enter a valid email` ),
            password: error.test( required, `please enter your password` )
        })
        .extend(error.Error)
        .sample({login: _ })
        .active('required!')

        channels = circuit.channels
    })

    test('email - error', function() {
        channels.email.input('x')
        return circuit.error() === `please enter a valid email`
    })

    test('password - valid', function() {
        channels.password.input('x')
        return circuit.error() === ``
    })

    test('login - required', function() {
        channels.login.input(true)
        return circuit.error() === `required!`
    })

    test('circuit - primed', function() {
        circuit.prime({email:'hi@home.com', password:'ok'})
        channels.login.input(true)
        return circuit.error() === ``
    })

    test('circuit - happy path', function() {
        channels.email.input('hi@home.com')
        channels.password.input('ok')
        channels.login.input(true)
        return circuit.error() === ``
    })

    test('circuit - error', function() {
        circuit.prime({password:'ok'})
        channels.email.input('badformat')
        channels.login.input(true)
        return circuit.error() === `please enter a valid email`
    })
})
