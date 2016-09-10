import Circus from '../src'

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
        return Circus.isSignal(s)
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
		var s1 = app.signal().map(Circus.fail)
		var j1 = app.join({s1})
		var r,j = app.join({j1}).fail(function(f){r=f})
		s1.input(2)
		return r instanceof Circus.fail
	})

	test('channel - implied map', function(){
		var s = app.merge({
			a: inc
		})
		s.channels.a.input(1)

		return s.value() === 2
	})

	test('channel - identity map', function(){
		var s = app.merge({
			a: Circus.id
		})
		s.channels.a.input(1)

		return s.value() === 1
	})

	test('channel - value (always) map', function(){
		var s = app.merge({
			a: 123
		})
		s.channels.a.input(1)

		return s.value() === 123
	})

	test('channel - value (always undefined) map', function(){
		var s = app.merge({
			a: Circus.UNDEFINED
		})
		s.channels.a.input(1)

		return s.value() === undefined
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

	test('channel value - literal (always)', function(){
		var r = app.join({
			a: 'a'
		})
		r.channels.a.input(123)
		return r.value().a==='a'
	})

	test('channel value - passive', function(){
		var r=0, p = app.signal()
		var c = app.join({
			a: inc,
			b: p.id
		}).tap(function(){r++})
		p.input(1)
		c.channels.a.input(1)
		return r===1 && p.value()===1
	})

	test('circuit value - prime values', function(){
		var a=app.signal()
		var r = app.join({
			a: a
		}).prime({a:123})

		return a.value()===123
	})

	test('circuit value - prime deep', function(){
		var a=app.signal()
		var r = app.join({
			b: {
				a: a
			}
		}).prime({b:{a:123}})

		return a.value()===123
	})

	test('circuit value - join context', function(){
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


	test('circuit value - merge context', function(){
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

	test('circuit - placeholder', function(){
		var c = app.join({a:Circus.id})
		c.channels.a.input(1)
		return c.channels.a.value() === 1
	})

	test('circuit - overlay placeholder', function(){
		var o = {a:inc}
		var c = app.join({a:Circus.id}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 2
	})

	test('circuit - overlay input (pre)', function(){
		var b = app.signal().map(dbl)
		var o = {a:inc}
		var c = app.join({a:b}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 3
	})

	test('circuit - overlay input (signal)', function(){
		var b = app.signal().map(dbl)
		var o = {a:app.signal().map(inc)}
		var c = app.join({a:b}).overlay(o)
		c.channels.a.input(1)
		return c.channels.a.value() === 3
	})

	test('circuit - overlay deep', function(){
		var b = app.signal()
		var o = {a:{a:{a:inc}}}
		var c = app.join({a:{a:{a:b}}}).overlay(o)
		c.channels.a.channels.a.channels.a.input(1)
		return c.channels.a.channels.a.channels.a.value() === 2
	})

	test('circuit - overlay sample', function(){
		var a = app.signal()
		var b = app.signal()
		var o = {a:inc,b:inc}
		var c = app.join({a:a}).sample({b:b}).overlay(o)
		c.channels.a.input(1)
		c.channels.b.input(1)
		return c.channels.a.value() === 2 && c.channels.b.value() === 2
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

    test('impure', function() {
    	var r=0, s = app.merge({a:Circus.id}).tap(function(){r++})
    	s.channels.a.input(1)
    	s.channels.a.input(1)
    	return r === 2
    })

    test('pure', function() {
    	var r=0, s = app.merge({a:Circus.id}).pure().tap(function(){r++})
    	s.channels.a.input(1)
    	s.channels.a.input(1)
    	return r === 1
    })

})
