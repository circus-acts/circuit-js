import Circuit, {Signal} from '../src'
import Pure, {pure} from '../src/pure'

runTests('pure', function(mock) {

	var app
	setup(function() {
		app = new Circuit(Pure)
	})

    test('Pure',function() {
        var r=0, s = app.signal().tap(function(){r++})
        s.input(1)
        s.input(1)
        return r===1
    })

    test('Pure after halt',function() {
        var halt = function(v) {
            return v===1? v : this.halt()
        }
        var r=0, s = app.signal().map(halt).tap(function(){r++})
        s.input(1)
        s.input(2)
        s.input(1)
        return r===1
    })

    test('Pure after fail',function() {
        var fail = function(v) {
            return v===1? v : this.fail()
        }
        var r=0, s = app.signal().map(fail).tap(function(){r++})
        s.input(1)
        s.input(2)
        s.input(1)
        return r===1
    })

    test('Pure - circuit', function() {
    	var r=0, s = app.merge({a:Signal.id}).tap(function(){r++})
    	s.channels.a.input(1)
    	s.channels.a.input(1)
    	return r === 1
    })

    test('pure - step', function() {
        var r=0
        var s = new Signal().extend(pure).pure().tap(function(){r++})
        s.input(1)
        s.input(1)
        return r === 1
    })

    test('pure - diff', function() {
        var r=0, diff = function(v1, v2) {return v1 !== v2 - 1}
        var s = new Signal().extend(pure).pure(diff).tap(function(){r++})
        s.input(1)
        s.input(2)
        return r === 1
    })

})
