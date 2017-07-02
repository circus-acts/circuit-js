import Circuit, {Signal} from '../src'
import * as error from '../src/error'

var inc = function(v){return v+1}

runTests('error', function(mock) {

    var app
    setup(function(){
        app = new Circuit().import(error.Error)
    })

    test('test - true', function() {
        var m
        error.test(function(v){return true}).tap(function(e){m=e}).signal(1)
        return m === 1
    })

    test('test - value', function() {
        var m
        error.test(function(v){return v+1}).tap(function(e){m=e}).signal(1)
        return m === 2
    })

    test('test - fail', function() {
        var m
        error.test(function(v){return !!v && v}).fail(function(e){m=e}).signal(0)
        return m === true
    })

    test('test - fail with reason', function() {
        var m
        error.test(function(v){return !!v && v}, 'xyz').fail(function(e){m=e}).signal(0)
        return m === 'xyz'
    })

    test('test - arity', function() {
        var m
        error.test(function(v1, v2){return v2 === 2}).tap(function(e){m=e}).signal(1, 2)
        return m === 1
    })

    test('async - true', function(done) {
        var m, async = (v, next) => {
            setTimeout(next(true))
        }
        error.test(async).tap(function(v) {done(v === 123)}).signal(123)
    })

    test('async - value', function(done) {
        var m, async = (v, next) => {
            setTimeout(next(123))
        }
        error.test(async).tap(function(v) {done(v === 123)}).signal(1)
    })

    test('async - fail', function(done) {
        var m, async = (v, next) => {
            setTimeout(next(false))
        }
        error.test(async).fail(done).signal(0)
    })

    test('async - fail message', function(done) {
        var m, async = (v, next) => {
            setTimeout(next(false))
        }
        error.test(async, 'xyz').fail(function(v) {done(v==='xyz')}).signal(0)
    })

    test('async - arity', function(done) {
        var m, async = (v1, v2, next) => {
            setTimeout(next(v2 === 456))
        }
        error.test(async).tap(function(v) {done(v === 123)}).signal(123, 456)
    })

    test('error - circuit valid', function() {
        var m = error.test(function(_, v){return !!v && v},'error!')
        var s = app.merge({m}).map(inc)
        s.signals.m(1)
        return s.error() === '' && s.value() === 2
    })

    test('error - circuit error', function() {
        var m = error.test(function(_, v){return !!v && v})
        var s = app.merge({m}).map(inc)
        s.signals.m(0)
        return s.error() === true && s.value() === undefined
    })

    test('error - circuit error msg', function() {
        var m = error.test(function(_, v){return !!v && v},'error!')
        var s = app.merge({m}).map(inc)
        s.signals.m(0)
        return s.error() === 'error!'
    })

    test('error - first error only', function() {
        var m1 = error.test(function(_, v){return !!v && v},1)
        var m2 = error.test(function(_, v){return !!v && v},2)
        var s = app.merge({m1, m2}).map(inc)
        s.signals.m1(0)
        s.signals.m2(0)
        return s.error() === 1 && s.value() === undefined
    })

    test('error - circuit error clear', function() {
        var m = error.test(function(_, v){return !!v && v})
        var s = app.merge({m}).map(inc)
        s.signals.m(0)
        return s.error() === true && s.error() === ''
    })

    test('error - peek', function() {
        var m = error.test(function(_, v){return !!v && v})
        var s = app.merge({m}).map(inc)
        s.signals.m(0)
        return s.error(true) === true && s.error() === true
    })
})
