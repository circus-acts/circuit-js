import circus, { test } from 'circus-js'

const _ = circus.UNDEFINED

// some validation
const required = v => !!v
const email = v => /\S+@\S+\.\S+/i.test(v)

// export a circuit
export default circus.join({
    email: test( email, `please enter a valid email` ),
    password: test( required, `please enter your password` )
})
.sample({login: _ })
.map({tryLogin: _ })
.finally({view: _ })
