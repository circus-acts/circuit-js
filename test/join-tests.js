import Circuit from '../src/circuit'
import Utils from '../src/utils'

runTests('join', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul3 = function(v){return v*3}

	var app, channel
	setup(function() {
		app = new Circuit()
		channel = app.channel
	})

	test('assign - channels', function() {
		var s1 = channel()
		var s2 = channel()
		var j = app.assign({
			k1:s1,
			k2:s2
		})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:2})
	})

	test('signals - auto name spacing', function() {
		var j = {
			a: {
				b: {
					c: app.channel()
				}
			}
		}
		var s = app.assign(j)
		s.signals.a.b.c(123)
		return Utils.deepEqual(s.value(), {a: {b: {c: 123}}})
	})

	test('assign - nested join points', function() {
		var s1 = channel()
		var s2 = channel()
		var j = app.assign({
			k1:app.assign({
				k2:s2
			})
		})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:{k2:2}})
	})

	test('assign - join point auto binding', function() {
		var assign = app.assign
		var s1 = channel()
		var s2 = channel()
		var j = assign({
			k1:assign({
				k2:s2
			})
		})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:{k2:2}})
	})

	test('join - object hash syntax', function() {
		var s1 = channel()
		var s2 = channel()
		var j = app.assign({
			k1:s1,
			k2:{
				k3:s2
			}
		})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('fold - reduce', function(){
		function r(cv, v) {
			return cv + v
		}
		var m = app.fold({
			a: r,
			b: r
		})
		m.signal(1)
		m.signals.a(2)
		m.signals.b(2)

		return m.value() === 5
	})

	test('fold - context', function(){
		var ctx,m = app.fold({
			a: function(cv, v) {
				ctx=cv
				return v
			}
		})
		m.signal('abc')
		m.signals.a(123)

		return ctx === 'abc' && m.value() === 123
	})

	test('latch', function(){
		function r(cv, v) {
			return cv + v
		}
		var m = app.latch({
			a: r,
			b: r
		})
		m.signal(1)
		m.signals.a(2)
		m.signal(1)

		return m.value() === 3
	})


	test('sample - block', function() {
		var s1 = channel()
		var s2 = app.fold({inc}).sample({s1}).prime(1)
		s2.signals.inc(1)
		return s2.value() === 1
	})

	test('sample - pass', function() {
		var s1 = channel()
		var s2 = app.fold({inc}).sample({s1}).prime(1)
		s2.signals.inc(1)
		s1.signal(true)
		return s2.value() === 2
	})

	test('sample - jp value', function() {
		var s1 = channel()
		var s2 = app.fold({inc}).sample({s1}).map(inc).prime(0)
		s2.signals.inc(1)
		var r1 = s2.value()
		s1.signal(true)
		var r2 = s2.value()
		s1.signal(true)
		var r3 = s2.value()
		return r1 === 0 && r2 === 2 && r3 === 2
	})
})
