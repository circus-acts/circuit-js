import Circus from '../src'
import Utils from '../src/utils'

runTests('join', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul3 = function(v){return v*3}

	var app = new Circus.Circuit()
	var signal = app.signal.bind(app)

	test('join', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - compose', function() {
		var s1 = signal()
		var s2 = signal()
		var r,j = app.join(s1,s2).tap(function(v){r=v})
		s1.value(1)
		s2.value(2)
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - named key', function() {
		var s1 = signal('k1')
		var s2 = signal('k2')
		var j = app.join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:2})
	})

	test('join - channels', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({
			k1:s1,
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return Utils.deepEqual(r,{k1:1,k2:2})
	})

	test('join - merge channels', function() {
		var s1 = signal()
		var s2 = signal()
		var j = app.join({
			k1:s1
		},
		{
			k2:s2
		})
		s1.value(1)
		s2.value(2)
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
		s1.value(1)
		s2.value(2)
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
		s1.value(1)
		s2.value(2)
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
		return j.a.b.c.name === 'c'
	})

	test('merge', function() {
		var s1 = signal()
		var s2 = signal()
		var m = app.merge(s1,s2)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === 1 && r2 === 2
	})

	test('sample', function() {
		var s1 = signal()
		var s2 = signal()
		var s3 = signal()
		var s = s1.sample(s2,s3).map(inc)
		s1.value(1)
		var r1 = s.value()
		s2.value(2)
		var r2 = s.value()
		s3.value(3)
		var r3 = s.value()
		return r1 === 1 && r2 === 2 && r3 === 3
	})

	test('latch - value true', function(){
		var r,s = signal().prime(1).finally(function(v){r=v}).latch(true)
		return r === 1
	})

	test('latch - hold value true', function(){
		return signal().prime(1).map(inc).latch(true).value(2) === 3
	})

	test('latch - value false', function(){
		var r,s = signal().prime(1).finally(function(v){r=v}).latch(false)
		return r === undefined
	})

	test('latch - hold value false', function(){
		var s = signal().prime(1).latch(false).map(inc)
		s.value(1)
		return s.value()=== 1
	})

	test ('latch - signal off', function(){
		var ls = signal()
		return signal().prime(1).latch(ls).map(inc).value() === 1
	})

	test ('latch - signal on', function(){
		var ls = signal(), s = signal().prime(1).latch(ls).map(inc)
		ls.value(true)
		return s.value() === 2
	})

	test ('latch - hold signal on', function(){
		var ls = signal(), s = signal().prime(1).latch(ls).map(inc)
		ls.value(true)
		return s.value(2) === 3
	})
})
