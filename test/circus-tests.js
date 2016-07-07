import Circus from '../src'

var inc = function(v){return v+1}

runTests('circus', function(mock) {

    var app
    setup(function(){
        app = new Circus()
    })

    test('fail', function() {
        var f = Circus.fail()
        return f instanceof Circus.fail
    })

    test('fail - value', function() {
        var f = Circus.fail(1)
        return f.error === 1
    })

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
