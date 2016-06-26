import Circus, {test} from '../src'

runTests('circus', function(mock) {

    var app, channels, sigBlock, valBlock
    setup(function(){

        app = new Circus.Circuit()

        sigBlock = {
            i1:app.signal(),
            i2:app.signal(),
            i3: {
                i4:app.signal(),
                i5:app.signal()
            }
        }

        valBlock = {
            i1:1,
            i2:new Date(),
            i3:{
                i4:1,
                i5:2
            }
        }

        channels = app.join(sigBlock);
    })

    test('test - true', function() {
        var m = app.test(function(v){return true})(1)
        return m === 1
    })

    test('test - value', function() {
        var m = app.test(function(v){return v+1})(1)
        return m === 2
    })

    test('test - fail', function() {
        var m = app.test(function(v){return !!v})(0)
        return m instanceof Circus.fail
    })

    test('test - fail with reason', function() {
        var m = app.test(function(v){return !!v},'xyz')(0)
        return m.value === 'xyz'
    })

    // test('test - circuit valid', function() {
    //     var m = app.test(function(v){return !!v},'error!')
    //     var s = app.merge({m:m}).map(inc)
    //     s.channels.m.value(1)
    //     return s.error() === '' && s.value() === 2
    // })

    // test('test - circuit error', function() {
    //     var m = app.test(function(v){return !!v})
    //     var s = app.merge({m:m}).map(inc)
    //     s.channels.m.value(0)
    //     return s.error() === true
    // })

    // test('test - circuit error msg', function() {
    //     var m = app.test(function(v){return !!v},'error!')
    //     var s = app.merge({m:m}).map(inc)
    //     s.channels.m.value(0)
    //     return s.error() === 'error!'
    // })

    // test('test - first error only', function() {
    //     var m1 = app.test(function(v){return !!v},1)
    //     var m2 = app.test(function(v){return !!v},2)
    //     var s = app.merge({m1:m1,m2:m2}).map(inc)
    //     s.channels.m1.value(0)
    //     s.channels.m2.value(0)
    //     return s.error() === 1
    // })

    // test('test - circuit error clear', function() {
    //     var m = app.test(function(v){return !!v})
    //     var s = app.merge({m:m}).map(inc)
    //     s.channels.m.value(0)
    //     return s.error() === true && s.error() === ''
    // })

    test('typeof - Array', function(){
        return Circus.typeOf([]) === Circus.type.ARRAY
    })

    test('typeof - Object', function(){
        return Circus.typeOf({}) === Circus.type.OBJECT
    })

    test('typeof - Date', function(){
        return Circus.typeOf(new Date()) === Circus.type.LITERAL
    })

    test('typeof - String', function(){
        return Circus.typeOf('') === Circus.type.LITERAL
    })

    test('typeof - Number', function(){
        return Circus.typeOf(1) === Circus.type.LITERAL
    })

    test('typeof - Boolean', function(){
        return Circus.typeOf(true) === Circus.type.LITERAL
    })

    test('typeof - Regex', function(){
        return Circus.typeOf(/a/) === Circus.type.LITERAL
    })

})
