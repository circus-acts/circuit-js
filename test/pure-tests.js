import Circuit, {Channel} from '../src'
import Pure, {pure} from '../src/pure'

runTests('pure', function(mock) {

    var channel
	setup(function() {
        channel = new Channel()
	})

    test('pure',function() {
        var r=0, s = channel.bind(pure).tap(function(){r++})
        s.signal(1)
        s.signal(1)
        return r===1
    })

    test('pure after halt',function() {
        var _halt = function({next}) {
            return function(v) {
                return v===1? next(v) : undefined
            }
        }
        var r=0, s = channel.bind(_halt).bind(pure).tap(function(){r++})
        s.signal(1)
        s.signal(2)
        s.signal(1)
        return r===1
    })

    test('pure after fail',function() {
        var _fail = function(ctx) {
            return function(v) {
                return v===1? ctx.next(v) : ctx.fail()
            }
        }
        var r=0, s = channel.bind(_fail).bind(pure).tap(function(){r++})
        s.signal(1)
        s.signal(2)
        s.signal(1)
        return r===1
    })

    test('pure - diff', function() {
        var r=0, diff = function(v1, v2) {return v1 !== v2 - 1}
        var s = channel.bind(pure(diff)).tap(function(){r++})
        s.signal(1)
        s.signal(2)
        return r === 1
    })

    test('import Pure',function() {
        var r=0, s = channel.import(Pure).pure().tap(function(){r++})
        s.signal(1)
        s.signal(1)
        return r===1
    })

    test('import Pure - diff', function() {
        var r=0, diff = function(v1, v2) {return v1 !== v2 - 1}
        var s = channel.import(Pure(diff)).pure().tap(function(){r++})
        s.signal(1)
        s.signal(2)
        return r === 1
    })

    test('pure - circuit', function() {
        var r=0, s = new Circuit().join({a:Channel.id}).pure().tap(function(){r++})
        s.signals.a(1)
        s.signals.a(1)
        return r === 1
    })



})
