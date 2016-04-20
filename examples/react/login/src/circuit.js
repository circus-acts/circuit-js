import circus, { maybe, maybeBinder } from 'circus-js'

const _ = circus.UNDEFINED

// some validation
const required = v => !!v
const emailTest = v => /\S+@\S+\.\S+/i.test(v)

// export a circuit
export default circus.join({
    email: maybe( emailTest, `please enter a valid email` ),
    password: maybe( required, `please enter your password` )
})
.sample({cta: _ })
.match({
  just: {login: _ },
  nothing: {view: _ }
})
.bind(maybeBinder)

const maybeBinder = (f) => {

}

this.bind = function(b) {

}