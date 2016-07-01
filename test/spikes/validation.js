import Circus, { Circuit } from '../../src'
import Utils, {Error} from '../../src/utils'

runTests('validation', function() {

    const _ = Circus.UNDEFINED

    // some validation
    const required = v => !!v
    const email = v => /\S+@\S+\.\S+/i.test(v)

    let circuit, channels

    setup(function(){

        // export a circuit
        circuit = new Circuit().join({
            email: Utils.test( email, `please enter a valid email` ),
            password: Utils.test( required, `please enter your password` )
        })
        .extend(Error)
        .sample({login: _ })
        .active('required!')
        .map({tryLogin: _ })
        .finally({view: _ })

        channels = circuit.channels
    })

    test('email - error', function() {
        channels.email.value('x')
        return circuit.error() === `please enter a valid email`
    })

    test('password - valid', function() {
        channels.password.value('x')
        return circuit.error() === ``
    })

    test('login - required', function() {
        channels.login.value(true)
        return circuit.error() === `required!`
    })

    test('circuit - primed', function() {
        circuit.prime({email:'hi@home.com', password:'ok'})
        channels.login.value(true)
        return circuit.error() === ``
    })

    test('circuit - happy path', function() {
        channels.email.value('hi@home.com')
        channels.password.value('ok')
        channels.login.value(true)
        return circuit.error() === ``
    })

    test('circuit - error', function() {
        circuit.prime({password:'ok'})
        channels.email.value('badformat')
        channels.login.value(true)
        return circuit.error() === `please enter a valid email`
    })

    test('overlay - finally', function() {
        var r
        circuit.prime({email:'hi@home.com', password:'ok'}).overlay({
            tryLogin: function(v){return 'ok'},
            view: function(v){r=v}
        })
        channels.login.value(true)
        return r==='ok'
    })

    test('overlay - finally error', function() {
        var r
        circuit.prime({email:'hi@home.com', password:'ok'}).overlay({
            tryLogin: function(v){return Circus.fail('ha')},
            view: function(v){r=circuit.error()}
        })
        channels.login.value(true)
        return r
    })
})
