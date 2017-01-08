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

	test('join - channels', function() {
		var s1 = channel()
		var s2 = channel()
		var j = app.join({
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
		var s = app.join(j)
		s.signals.a.b.c(123)
		return Utils.deepEqual(s.value(), {a: {b: {c: 123}}})
	})

	test('join - nested join points', function() {
		var s1 = channel()
		var s2 = channel()
		var j = app.join({
			k1:app.join({
				k2:s2
			})
		})
		s1.signal(1)
		s2.signal(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:{k2:2}})
	})

	test('join - join point auto binding', function() {
		var join = app.join
		var s1 = channel()
		var s2 = channel()
		var j = join({
			k1:join({
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
		var j = app.join({
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

	test('merge', function() {
		var s1 = channel()
		var s2 = channel()
		var m = app.merge({s1,s2})
		s1.signal(1)
		var r1 = m.value()
		s2.signal(2)
		var r2 = m.value()
		return r1 === 1 && r2 === 2
	})

	test('sample - block', function() {
		var s1 = channel()
		var s2 = app.merge({inc}).sample({s1}).prime(1)
		s2.signals.inc(1)
		return s2.value() === 1
	})

	test('sample - pass', function() {
		var s1 = channel()
		var s2 = app.merge({inc}).sample({s1}).prime(1)
		s2.signals.inc(1)
		s1.signal(true)
		return s2.value() === 2
	})

	test('sample - jp value', function() {
		var s1 = channel()
		var s2 = app.merge({inc}).sample({s1}).map(inc).prime(0)
		s2.signals.inc(1)
		var r1 = s2.value()
		s1.signal(true)
		var r2 = s2.value()
		s1.signal(true)
		var r3 = s2.value()
		return r1 === 0 && r2 === 2 && r3 === 2
	})
})
