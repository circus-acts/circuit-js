import Circus, {Signal} from '../src'

runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}
	var seq = function(s){
		return function(steps){
			return [].concat(steps,s)
		}
	}
	var app

	setup(function(){
		app = new Circus()
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

	test('circuit - fail bubbling', function() {
		var s1 = app.signal().map(Signal.fail)
		var j1 = app.join({s1})
		var r,j = app.join({j1})
		j.fail(function(f){r=f})
		s1.input(2)
		return r instanceof Signal.fail
	})

	test('channel - implied map', function(){
		var s = app.merge({
			a: inc
		})
		s.channels.a.input(1)

		return s.value() === 2
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
		s.channels.a.input(1)

		return s.value().a === 123
	})

	test('channel - always undefined', function(){
		var s = app.join({
			a: undefined
		})
		s.channels.a.input(1)

		return s.value() === undefined
	})

	test('channel value - literal (always)', function(){
		var r = app.join({
			a: 'a'
		})
		r.channels.a.input(123)
		return r.value().a==='a'
	})

	test('propagation order', function(){
		var a=app.signal().map(seq(1))
		var b=app.signal().map(seq(2))
		var c=app.signal().map(seq(3))
		var s1=app.signal().map(a).map(b).map(c)
		var s2=app.merge({
			c:app.signal().merge({
				b:app.signal().merge({a}).map(b)
			}).map(c)
		})
		s1.input([])
		s2.channels.c.channels.b.channels.a.input([])

		return s1.value().toString() === s2.value().toString()
	})

	test('prime', function(){
		var a=app.signal()
		var r = app.join({
			a: a
		}).prime({a:123})

		return a.value()===123
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

	test('context - join', function(){
		var a,r = app.join({
			a: app.signal().map(function(v,j) {
				a=j.value
				return v
			})
		})
		r.input('join value')
		r.channels.a.input(123)

		return a==='join value' && r.value().a===123
	})


	test('context - merge', function(){
		var a,r = app.merge({
			a: app.signal().map(function(v,m) {
				a=m.value
				return v
			})
		})
		r.input('abc')
		r.channels.a.input(123)

		return a==='abc' && r.value()===123
	})

	test('overlay - placeholder', function(){
		var o = {a:inc}
		var c = app.join({a:Signal.id}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 2
	})

	test('overlay', function(){
		var b = app.signal().map(dbl)
		var o = {a:inc}
		var c = app.join({a:b}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 3
	})
	test('overlay - sample', function(){
		var a = app.signal()
		var b = app.signal()
		var o = {a:inc,b:inc}
		var c = app.join({a:a}).sample({b:b}).overlay(o)
		c.channels.a.input(1)
		c.channels.b.input(1)
		return c.channels.a.value() === 2 && c.channels.b.value() === 2
	})

	test('overlay - signal', function(){
		var b = app.signal().map(dbl)
		var o = {a:app.signal().map(inc)}
		var c = app.join({a:b}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 3
	})

	test('overlay - deep', function(){
		var b = app.signal()
		var o = {a:{a:{a:inc}}}
		var c = app.join({a:{a:{a:b}}}).overlay(o)
		c.channels.a.channels.a.channels.a.input(1)
		return c.channels.a.channels.a.channels.a.value() === 2
	})

    test('extend - app ctx', function(){
        var app1 = new Circus().extend({c:true})
        var app2 = new Circus()

        return app1.signal().c && !app2.signal().c
    })

    test('extend - app ctx + signal ctx', function(){
        var r1,r2,ctx = new Circus()
        ctx.extend(function(c1){r1=c1;return {b:true}})
        ctx.extend(function(c2){r2=c2;return {c:true}})
        var s = ctx.signal()
        return r1===s && r2===s
    })

})
