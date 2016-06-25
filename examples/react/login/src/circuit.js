import Circus, { Circuit, test } from 'circus-js'

const _ = Circus.UNDEFINED

// some validation
const required = v => console.log(v) && !!v
const email = v => console.log(v) && /\S+@\S+\.\S+/i.test(v)

// export a circuit
const circuit = new Circuit().join({
    email: test( email, `please enter a valid email` ),
    password: test( required, `please enter your password` )
})
.sample({login: _ })
.map({tryLogin: _ })
.finally({view: _ })

const channels = circuit.channels

export { channels}
export default circuit
