import Circuit from '../src/circuit'
import Signal from '../src/signal'
import Utils from '../src/utils'

runTests('join', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul3 = function(v){return v*3}

	var app = new Circuit()
	var signal = app.signal.bind(app)

	test('join', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({s1,s2})
		s1.input(1)
		s2.input(2)
		var r = j.value()
		return r.s1 === 1 && r.s2 === 2
	})

	test('join - channels', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({
			k1:s1,
			k2:s2
		})
		s1.input(1)
		s2.input(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:2})
	})

	test('join - nested channels', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({
			k1:s1,
			k2:app.join({
				k3:s2
			})
		})
		s1.input(1)
		s2.input(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - pure object hash', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({
			k1:s1,
			k2:{
				k3:s2
			}
		})
		s1.input(1)
		s2.input(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - auto name spacing', function() {
		var j = {
			a: {
				b: {
					c: signal()
				}
			}
		}
		var s = app.join(j)
		return s.a.b.c.name === 'c'
	})

	test('join - name conflict', function() {
		var j = {
			map: signal()
		}
		try {
			var s = app.join(j)
		}
		catch(e) {
			return true
		}
	})

	test('merge', function() {
		var s1 = signal()
		var s2 = signal()
		var m = app.merge({s1,s2})
		s1.input(1)
		var r1 = m.value()
		s2.input(2)
		var r2 = m.value()
		return r1 === 1 && r2 === 2
	})

	test('sample - block', function() {
		var s1 = signal()
		var s2 = signal().sample({s1})
		s2.input(1)
		return s2.value() === undefined
	})

	test('sample - pass', function() {
		var s1 = signal()
		var s2 = signal().sample({s1}).map(inc)
		s2.input(1)
		s1.input(true)
		return s2.value() === 2
	})

	test('sample - successive', function() {
		var s1 = signal()
		var s2 = signal().sample({s1}).map(inc)
		s2.input(1)
		var r1 = s2.value()
		s1.input(true)
		var r2 = s2.value()
		s2.input(2)
		var r3 = s2.value()
		s1.input(true)
		var r4 = s2.value()
		return r1 === undefined && r2 === 2 && r3 === 2 && r4 === 3
	})
})
