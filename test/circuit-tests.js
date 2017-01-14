import Circuit, {Channel} from '../src'
import Utils from '../src/utils'

runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}
	var seq = function(s){
		return function(a){
			return (a || []).concat(s)
		}
	}
	var app

	setup(function(){
		app = new Circuit()
	})

	test('circuit - propagation', function() {
		var s1 = app.channel()
		var s2 = app.channel()
		var j = app.join({s1,s2})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return r.s1 === 1 && r.s2 === 2
	})

	test('propagation order', function(){
		var a=app.channel().map(seq(1))
		var b=app.channel().map(seq(2))
		var c=app.channel().map(seq(3))
		var s1=app.merge({
			c:app.merge({
				b:app.merge({a}).map(b)
			}).map(c)
		})
		s1.signals.c.b.a([])

		return Utils.deepEqual(s1.value(), [1, 2, 3])
	})

	test('circuit - fail bubbling', function() {
		var s1 = app.channel().bind(function(ctx) {return function(){return ctx.fail(123)}})
		var j1 = app.join({s1})
		var r,j = app.join({j1}).fail(function(f){r=f})
		s1.signal(2)
		return r === 123
	})

	test('circuit - implied map', function(){
		var s = app.join({
			a: inc
		})
		s.channels.a.signal(1)

		return s.channels.a.value() === 2
	})

	test('channel - passive', function(){
		var a = app.channel()
		var b = app.channel().prime(2)
		var s = app.join({
			a: a,
			b: b.id
		})

		a.signal(1)
		var r1 = s.value().b === 2

		b.signal(1)
		var r2 = s.value().b === 2

		return r1 && r2
	})

	test('channel - always', function(){
		var s = app.join({
			a: 123
		})
		s.signals.a(1)

		return s.value().a === 123
	})

	test('channel - always undefined', function(){
		var s = app.join({
			a: undefined
		})
		s.signals.a(1)

		return s.value().a === undefined
	})

	test('prime', function(){
		var a=app.channel()
		var r = app.join({
			a: a
		}).prime({a:123})

		return a.value()===123
	})

	test('set state', function(){
		var a=app.channel()
		var r = app.join({
			a: a
		}).setState({a: {$value: 123}})

		return a.value()===123
	})

	test('set state - nested state', function(){
		var a=app.channel()
		var r = app.join({
			b: app.channel()
		}).setState({b: {$value: 123}})

		return r.channels.b.value()===123
	})

	test('set state - sample state', function(){
		var a=app.channel()
		// {name: value, steps: {sv: 123}} ?
		var r = app.channel().setState({0: {sv: 123}, $value: 456}).sample({
			a: a
		})
		a.signal(true)
		return r.value()===123
	})

	test('prime - deep', function(){
		var a=app.channel()
		var r = app.join({
			b: {
				a: a
			}
		}).prime({b:{a:123}})

		return a.value()===123
	})

	test('join - channel identity', function(){
		var ctx,r = app.join({
			a: inc
		}).map(function(v,channel) {
			ctx = channel
		}).map(function(v,channel) {
			ctx = channel
		})
		r.signals.a(123)

		return ctx==='a'
	})

	test('overlay - placeholder', function(){
		var o = {a:inc}
		var c = app.join({a:Channel.id}).overlay(o)
		c.signals.a(1)
		return c.channels.a.value() === 2
	})

	test('overlay', function(){
		var b = app.channel().map(dbl)
		var o = {a:inc}
		var c = app.join({a:b}).overlay(o)
		c.signals.a(1)
		return c.channels.a.value() === 3
	})

	test('overlay - sample', function(){
		var a = app.channel()
		var b = app.channel()
		var o = {a:inc,b:inc}
		var c = app.join({a:a}).sample({b:b}).overlay(o)
		c.signals.a(1)
		c.signals.b(1)
		return c.channels.a.value() === 2 && c.channels.b.value() === 2
	})

	test('overlay - signal', function(){
		var b = app.channel().map(dbl)
		var o = {a:app.channel().map(inc)}
		var c = app.join({a:b}).overlay(o)
		c.signals.a(1)
		return c.channels.a.value() === 3
	})

	test('overlay - deep', function(){
		var b = app.channel()
		var o = {a:{a:{a:inc}}}
		var c = app.join({a:{a:{a:b}}}).overlay(o)
		c.signals.a.a.a(1)
		return c.channels.a.channels.a.channels.a.value() === 2
	})

	test('getState', function() {
		var r = new Circuit().join({
			a: app.channel()
		})
		r.signals.a(123)
		return Utils.deepEqual(r.getState(), r.$state)
	})

    test('extend - app', function(){
        var app1 = new Circuit().extend(function(){return {c:true}})
        var app2 = new Circuit()

        return app1.channel().c && !app2.channel().c
    })

    test('extend - app + signal context', function(){
        var r1,r2,circuit = new Circuit()
        circuit.extend(function(c1){r1=c1;return {b:true}})
        circuit.extend(function(c2){r2=c2;return {c:true}})
        var s = circuit.channel()
        return r1===s && r2===s
    })

})
