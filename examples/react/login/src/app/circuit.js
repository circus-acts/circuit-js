import Circus, { Circuit, Error, test } from 'circus-js'

const _ = Circus.UNDEFINED

// some validation
const required = v => !!v
const email = v => /\S+@\S+\.\S+/i.test(v)

// export a circuit
const circuit = new Circuit().join({
    email: test( email, `please enter a valid email` ),
    password: test( required, `please enter your password` )
})
.extend(Error)
.sample({login: _ })
.active()
.map({tryLogin: _ })
.finally({view: _ })

const channels = circuit.channels

export { channels }
export default circuit
