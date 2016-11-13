import Circuit, {Signal, fail} from '../src'
import Utils from '../src/utils'

runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}
	var seq = function(s){
		return function(a, v){
			return [].concat(v || a, s)
		}
	}
	var app

	setup(function(){
		app = new Circuit()
	})

    test('as signal - from app', function(){
        var s = app.asSignal(app)
        return s.isSignal
    })

	test('circuit - propagation', function() {
		var s1 = app.signal()
		var s2 = app.signal()
		var j = app.join({s1,s2})
		s1.input(1)
		s2.input(2)
		var r = j.value()
		return r.s1 === 1 && r.s2 === 2
	})

	test('propagation order', function(){
		var a=app.signal().map(seq(1))
		var b=app.signal().map(seq(2))
		var c=app.signal().map(seq(3))
		var s1=app.merge({
			c:app.jp.merge({
				b:app.jp.merge({a}).map(b)
			}).map(c)
		})
		var s2=app.signal().map(a.clone()).map(b.clone()).map(c.clone())
		s1.channels.c.b.a([])
		s2.input([])

		return s1.value().toString() === s2.value().toString()
	})

	test('circuit - fail bubbling', function() {
		var s1 = app.signal().map(function(){return fail(123)})
		var j1 = app.join({s1})
		var r,j = app.jp.join({j1}).fail(function(f){r=f})
		s1.input(2)
		return r.message === 123
	})

	test('circuit - implied map', function(){
		var s = app.join({
			a: inc
		})
		s.signals.a.input(1)

		return s.signals.a.value() === 2
	})

	test('channel - passive', function(){
		var a = app.signal()
		var b = app.signal().prime(2)
		var s = app.join({
			a: a,
			b: b.id
		})

		a.input(1)
		var r1 = s.value().b === 2

		b.input(1)
		var r2 = s.value().b === 2

		return r1 && r2
	})

	test('channel - always', function(){
		var s = app.join({
			a: 123
		})
		s.channels.a(1)

		return s.value().a === 123
	})

	test('channel - always undefined', function(){
		var s = app.join({
			a: undefined
		})
		s.channels.a(1)

		return s.value().a === undefined
	})

	test('prime - state', function(){
		var a=app.signal()
		var r = app.join({
			a: a
		}).prime({a: {$value: 123}})

		return a.value()===123
	})

	test('prime - value', function(){
		var a=app.signal()
		var r = app.join({
			a: a
		}).prime({a:123})

		return a.value()===123
	})

	test('prime - sample value', function(){
		var a=app.signal()
		var r = app.prime({sample: {sv: 123}, $value: 456}).sample({
			a: a
		})
		a.input(true)
		return r.value()===123
	})

	test('prime - deep', function(){
		var a=app.signal()
		var r = app.join({
			b: {
				a: a
			}
		}).prime({b:{a:123}})

		return a.value()===123
	})

	test('merge - reduce', function(){
		var ctx,r = app.merge({
			a: app.signal().map(function(cv, v) {
				ctx=cv
				return v
			})
		})
		r.input('abc')
		r.channels.a(123)

		return ctx==='abc' && r.value()===123
	})

	test('join - channel identity', function(){
		var ctx,r = app.join({
			a: inc
		}).map(function(v,channel) {
			ctx = channel
		}).map(function(v,channel) {
			ctx = channel
		})
		r.channels.a(123)

		return ctx==='a'
	})

	test('overlay - placeholder', function(){
		var o = {a:inc}
		var c = app.join({a:Signal.id}).overlay(o)
		c.channels.a(1)
		return c.signals.a.value() === 2
	})

	test('overlay', function(){
		var b = app.signal().map(dbl)
		var o = {a:inc}
		var c = app.join({a:b}).overlay(o)
		c.channels.a(1)
		return c.signals.a.value() === 3
	})

	test('overlay - sample', function(){
		var a = app.signal()
		var b = app.signal()
		var o = {a:inc,b:inc}
		var c = app.join({a:a}).sample({b:b}).overlay(o)
		c.channels.a(1)
		c.channels.b(1)
		return c.signals.a.value() === 2 && c.signals.b.value() === 2
	})

	test('overlay - signal', function(){
		var b = app.signal().map(dbl)
		var o = {a:app.signal().map(inc)}
		var c = app.join({a:b}).overlay(o)
		c.channels.a(1)
		return c.signals.a.value() === 3
	})

	test('overlay - deep', function(){
		var b = app.signal()
		var o = {a:{a:{a:inc}}}
		var c = app.join({a:{a:{a:b}}}).overlay(o)
		c.channels.a.a.a(1)
		return c.signals.a.signals.a.signals.a.value() === 2
	})

	test('getState', function() {
		var r = new Circuit().join({
			a: app.signal()
		})
		r.channels.a(123)
		return Utils.deepEqual(r.getState(), {join: {join: true}, $value: {a: {$value: 123}}})
	})

    test('bind - app', function(){
        var app1 = new Circuit().bind(function(){return {c:true}})
        var app2 = new Circuit()

        return app1.signal().c && !app2.signal().c
    })

    test('bind - app + signal', function(){
        var r1,r2,circuit = new Circuit()
        circuit.bind(function(c1){r1=c1;return {b:true}})
        circuit.bind(function(c2){r2=c2;return {c:true}})
        var s = circuit.signal()
        return r1===s && r2===s
    })


	test('channels - auto name spacing', function() {
		var j = {
			a: {
				b: {
					c: app.signal()
				}
			}
		}
		var s = app.join(j)
		s.channels.a.b.c(123)
		return Utils.deepEqual(s.value(), {a: {b: {c: 123}}})
	})
})
