import { test } from 'circus-js'

const login = ({email, password}, next) => {
    // assume this is going to be an async request
    return next(password==='XXX' && {loggedIn:`you're in!`})
}

export default test(login,'login details not recognised (hint - try XXX)')