import Circus, {Signal} from '../src'
import * as error from '../src/error'

var inc = function(v){return v+1}

runTests('error', function(mock) {

    var app
    setup(function(){
        app = new Circus(error.Error)
    })

    test('test - true', function() {
        var m = error.test(function(v){return true})(1)
        return m === 1
    })

    test('test - value', function() {
        var m = error.test(function(v){return v+1})(1)
        return m === 2
    })

    test('test - fail', function() {
        var m = error.test(function(v){return !!v})(0)
        return m instanceof Signal.fail
    })

    test('test - fail with reason', function() {
        var m = error.test(function(v){return !!v},'xyz')(0)
        return m.error === 'xyz'
    })

    test('error - circuit valid', function() {
        var m = error.test(function(v){return !!v},'error!')
        var s = app.merge({m:m}).map(inc)
        s.channels.m.input(1)
        return s.error() === '' && s.value() === 2
    })

    test('error - circuit error', function() {
        var m = error.test(function(v){return !!v})
        var s = app.merge({m:m}).map(inc)
        s.channels.m.input(0)
        return s.error() === true
    })

    test('error - circuit error msg', function() {
        var m = error.test(function(v){return !!v},'error!')
        var s = app.merge({m:m}).map(inc)
        s.channels.m.input(0)
        return s.error() === 'error!'
    })

    test('error - first error only', function() {
        var m1 = error.test(function(v){return !!v},1)
        var m2 = error.test(function(v){return !!v},2)
        var s = app.merge({m1:m1,m2:m2}).map(inc)
        s.channels.m1.input(0)
        s.channels.m2.input(0)
        return s.error() === 1 && s.value() === undefined
    })

    test('error - circuit error clear', function() {
        var m = error.test(function(v){return !!v})
        var s = app.merge({m:m}).map(inc)
        s.channels.m.input(0)
        return s.error() === true && s.error() === ''
    })
})
