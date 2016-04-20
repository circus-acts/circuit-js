runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}

	var app

	setup(function(){
		app = new Circuit({a:'abc'})
	})

	test('new circuit - is signal', function() {
		return Circus.isSignal(app.join())
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

	test('associativity', function(){
		var s=[], set = function(v){return function(){s.push(v)}}
		var b=app.signal().tap(set(2))
		var j=app.join({
			a: b
		}).tap(set(3))
		var a = j.channels.a.tap(set(1))
		a.value(123)


		return s.toString() === '1,2,3'
	})

	test('channel - deep associativity', function(){
		var steps=[]
		app.extend({seq:function(s){return this.tap(function(){
			steps.push(s)
		})}})
		var a=app.signal('a').seq(1)
		var b=app.signal('b')
		var j=app.join({
			a,
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
		var r,s=app.signal().prime('abc'), c = app.join({
			a: inc,
			b: s.id
		}).tap(function(v){r=v})
		c.channels.a.value(123)
		return r.b==='abc'
	})

	test('channel value - deep', function(){
		var a=app.signal().map(inc)
		var r = app.join({
			b: {
				a: a
			}
		})
		r.value({b:{a:123}})

		return a.value()===124
	})

	test('circuit value - prime', function(){
		var a=app.signal().map(inc)
		var r = app.join({
			a: a
		})
		r.prime({a:123})

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

	test('maybe - just', function() {
		var m = app.maybe(function(v){return !!v})(1)
		return m.just === 1 && m.nothing === undefined
	})

	test('maybe - nothing', function() {
		var m = app.maybe(function(v){return !!v})(0)
		return m.just === undefined && m.nothing===true
	})

	test('maybe - nothing value', function() {
		var m = app.maybe(function(v){return !!v},'xyz')(0)
		return m.just === undefined && m.nothing === 'xyz'
	})

	test('maybe - circuit valid', function() {
		var m = app.maybe(function(v){return !!v},'error!')
		var c = app.merge({m}).map(inc)
		c.channels.m.value(1)
		return c.error() === '' && c.value() === 2
	})

	test('maybe - circuit error', function() {
		var m = app.maybe(function(v){return !!v})
		var c = app.merge({m}).map(inc)
		c.channels.m.value(0)
		return c.error() === true && c.value() === undefined
	})

	test('maybe - circuit error msg', function() {
		var m = app.maybe(function(v){return !!v},'error!')
		var c = app.join({m})
		c.value({m:false})
		return c.error() === 'error!'
	})

	test('maybe - circuit error clear', function() {
		var m = app.maybe(function(v){return !!v},'error!')
		var c = app.join({m})
		c.value({m:false})
		return c.error() && !c.error()
	})

	test('maybe - first error only', function() {
		var e=0, m = app.maybe(function(v){return !!v},++e)
		var c = app.merge({m}).map(inc)
		c.channels.m.value(0)
		c.channels.m.value(0)
		return c.error() === 1 && c.value() === undefined
	})

})
