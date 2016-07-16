import Circus from '../../src'
import {Maybe, Error} from '../../src/error'

runTests('maybe', function() {

    // some validation
    const password = v => !!v? v :  Circus.fail('error')
    const email = v => /\S+@\S+\.\S+/i.test(v)? v : Circus.fail()

    let circuit, channels, result

    setup(function(){

        circuit = new Circus(Maybe, Error).join({
            email,
            password
        })
        .maybe({
            nothing: () => result = false,
            just: (v) => result = v
        })

        result = undefined
        channels = circuit.channels
    })

    test('maybe nothing', function() {
        channels.email.value('x')
        return result === false
    })

    test('maybe just value', function() {
        channels.password.value('x')
        return result.password === 'x'
    })


    test('maybe nothing with failure', function() {
        channels.password.value('')
        return result === false && circuit.error()==='error'
    })
})
