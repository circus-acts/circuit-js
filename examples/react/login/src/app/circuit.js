import Circus, { Error, test } from 'circus-js'

const _ = Circus.id

// some validation
const required = v => !!v
const email = v => /\S+@\S+\.\S+/i.test(v)

// export a circuit
const circuit = new Circus().extend(Error).join({
    email: test( email, `please enter a valid email` ),
    password: test( required, `please enter your password` )
})
.sample({login: _ })
.active()

export const channels = circuit.channels
export default circuit
