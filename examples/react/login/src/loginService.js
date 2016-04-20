import { maybe } from 'circus-js'

const login = ({email, password}, next) => {
    // assume this is going to be an async request
    return next(password==='XXX' && `you're in`)
}

export default maybe(login,'login details not recognised (hint - try XXX!)')