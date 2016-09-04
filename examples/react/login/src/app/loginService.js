import { test } from 'circus-js'

const login = ({email, password}) => {
    // assume this is going to be an async request
    return function(next) {
        // do some async work and call next with the resolved value
        setTimeout(function(){
            next(password==='XXX' && {loggedIn:`you're in!`})
        })
    }
}

export default test(login,'login details not recognised (hint - try XXX)')