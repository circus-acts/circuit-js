import Circus from '../src'

runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}

	var app

	setup(function(){
		app = new Circus.Circuit()
	})

	test('new circuit - is signal', function() {
		return Circus.isSignal(app.join())
	})

    test('new signal', function(){
        return Circus.isSignal(app.signal())
    })

    test('new signal - ctx', function(){
        var s = app.asSignal(app)
        return Circus.isSignal(s)
    })

    test('existing signal', function(){
        var s = app.signal()
        var n = s.asSignal()
        return n===s
    })

	test('circuit - stop propagation', function() {
		var s1 = app.signal()
		var s2 = app.signal()
		var j = app.join(s1,s2).map(Circus.fail)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r[0] === 1 && r[1] === 2 && s1.value()===1 && s2.value()===2
	})

	test('circuit - fail bubbling', function() {
		var s1 = app.signal().map(Circus.fail)
		var j1 = app.join(s1)
		var f,j = app.join(j1).finally(function(v){f=v})
		s1.value(2)
		return f instanceof Circus.fail
	})

	test('channel - input', function() {
		var a = app.signal()
		var c = app.join({a:a})
		return Circus.isSignal(c.channels.a) && a !== c.channels.a
	})

	test('channel - input -> output', function() {
		var a = app.signal().map(inc)
		var c = app.join({a:a})
		c.channels.a.value(1)
		return a.value() === 2
	})

	test('channel - input -> output names', function() {
		var output = app.signal('output')
		var c = app.join({input:output})
		return c.channels.input.name==='input' && c.channels.input.output.name === 'output'
	})

	test('channel - implied map', function(){
		var r,a = app.join({
			a: inc
		}).channels.a.value(1)

		return a === 2
	})

	test('associativity - input / output', function(){
		var s=[], step = function(v){return function(){s.push(v)}}
		var b=app.signal().tap(step(2))
		var j=app.join({
			a: b
		}).tap(step(3))
		var a = j.channels.a.tap(step(1))
		a.value(123)


		return s.toString() === '1,2,3'
	})

	test('associativity - deep join', function(){
		var steps=[]
		app.extend({seq:function(s){return this.tap(function(){
			steps.push(s)
		})}})
		var a=app.signal('a').seq(1)
		var b=app.signal('b')
		var j=app.join({
			a: a,
			c: app.join(a,b.join(a).seq(2)).seq(3)
		}).seq(4)
		a.value(123)

		return steps.toString() === '1,2,3,4'
	})

	test('channel value - literal (always)', function(){
		var r = app.join({
			a: 'a'
		})
		r.channels.a.value(123)
		return r.value().a==='a'
	})

	test('channel value - passive', function(){
		var r,s=app.signal().prime(2).map(inc)
		var c = app.join({
			a: inc,
			b: s.id
		}).tap(function(v){r=v})
		c.channels.a.value(1)
		return r.b===2
	})

	test('circuit value - prime', function(){
		var a=app.signal()
		var r = app.join({
			a: a
		})
		r.prime({a:123})

		return a.value()===123
	})

	test('channel value - prime deep', function(){
		var a=app.signal()
		var r = app.join({
			b: {
				a: a
			}
		})
		r.prime({b:{a:123}})

		return a.value()===123
	})

	test('circuit value - outer join state', function(){
		var a,r = app.join({
			a: app.signal().map(function(v,jv) {
				a=jv
				return v
			})
		})
		r.value('abc')
		r.channels.a.value(123)

		return a==='abc' && r.value().a===123
	})


	test('circuit value - outer merge state', function(){
		var a,r = app.merge({
			a: app.signal().map(function(v,mv) {
				a=mv
				return v
			})
		})
		r.value('abc')
		r.channels.a.value(123)

		return a==='abc' && r.value()===123
	})

	test('circuit - placeholder', function(){
		var c = app.join({a:Circus.UNDEFINED})
		return c.channels.a.value(1) === 1
	})

	test('circuit - overlay placeholder', function(){
		var o = {a:inc}
		var c = app.join({a:Circus.UNDEFINED}).overlay(o)
		return c.channels.a.value(0) === 1
	})

	test('circuit - overlay input (pre)', function(){
		var b = app.signal('b').map(dbl)
		var o = {a:inc}
		var c = app.join({a:b}).overlay(o)
		return c.channels.a.value(0) === 2
	})

	test('circuit - overlay input (signal)', function(){
		var b = app.signal('b').map(dbl)
		var o = {a:app.signal().map(inc)}
		var c = app.join({a:b}).overlay(o)
		return c.channels.a.value(0) === 2
	})

	test('circuit - overlay output (pre)', function(){
		var b = app.signal('b').map(dbl)
		var o = {b:[inc]}
		var c = app.join({a:b}).overlay(o)
		return c.channels.a.value(0) === 2
	})

	test('circuit - overlay output (post)', function(){
		var b = app.signal('b').map(dbl)
		var o = {b:inc}
		var c = app.join({a:b}).overlay(o)
		return c.channels.a.value(0) === 1
	})

	test('circuit - overlay input & output', function(){
		var b = app.signal('b')
		var o = {a:inc, b:dbl}
		var c = app.join({a:b}).overlay(o)
		return c.channels.a.value(1) === 4
	})

	test('circuit - overlay deep', function(){
		var b = app.signal('b')
		var o = {a:{a:{a:inc}}}
		var c = app.join({a:{a:{a:b}}}).overlay(o)
		return c.channels.a.channels.a.channels.a.value(1) === 2
	})

	test('circuit - overlay aggregate', function(){
		var a = app.signal('a')
		var b = app.signal('b')
		var o = {a:inc,b:inc}
		var c = app.join({a:a}).sample({b:b}).overlay(o)
		return c.channels.a.value(1) === 2 && c.channels.b.value(1) === 2
	})

	test('circuit - overlay aggregate map fn', function(){
		var a = app.signal('a')
		var b = app.signal('b')
		var o = {a:inc}
		var c = app.join({b:b}).map({a:a}).overlay(o)
		return c.channels.a.value(0) === 1
	})

	test('circuit - overlay aggregate finally fn', function(){
		var a = app.signal('a')
		var b = app.signal('b')
		var o = {a:inc}
		var c = app.merge({b:b}).finally({a:a}).overlay(o)
		c.value(0)
		return c.channels.a.value() === 1
	})

    test('extend - app ctx', function(){
        var ctx = new Circus.Circuit()
        ctx.extend({c:true})

        return ctx.signal().c && !app.signal().c
    })

    test('extend - app ctx + signal ctx', function(){
        var r1,r2,ctx = new Circus.Circuit()
        ctx.extend(function(c1){r1=c1;return {b:true}})
        ctx.extend(function(c2){r2=c2;return {c:true}})
        var s = ctx.signal()
        return r1===s && r2===s
    })

})
