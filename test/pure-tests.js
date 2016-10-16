import Circuit, {Signal} from '../src'
import pure from '../src/pure'

runTests('pure', function(mock) {

    var sig
	setup(function() {
        sig = new Signal().extend(pure).pure()
	})

    test('pure',function() {
        var r=0, s = sig.tap(function(){r++})
        s.input(1)
        s.input(1)
        return r===1
    })

    test('pure after halt',function() {
        var halt = function(v) {
            return v===1? v : this.halt()
        }
        var r=0, s = sig.map(halt).tap(function(){r++})
        s.input(1)
        s.input(2)
        s.input(1)
        return r===1
    })

    test('pure after fail',function() {
        var fail = function(v) {
            return v===1? v : this.fail()
        }
        var r=0, s = sig.map(fail).tap(function(){r++})
        s.input(1)
        s.input(2)
        s.input(1)
        return r===1
    })

    test('pure - diff', function() {
        var r=0, diff = function(v1, v2) {return v1 !== v2 - 1}
        var s = sig.pure(diff).tap(function(){r++})
        s.input(1)
        s.input(2)
        return r === 1
    })

    test('Pure - circuit', function() {
        var r=0, s = new Circuit().join({a:Signal.id}).tap(function(){r++}).pure()
        s.channels.a.input(1)
        s.channels.a.input(1)
        return r === 1
    })



})
