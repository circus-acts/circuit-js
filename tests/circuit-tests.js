runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - compose', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var r,j = circus.join(s1,s2).tap(function(v){r=v})
		s1.value(1)
		s2.value(2)
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - stop propagation', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join(s1,s2).map(function(){return circus.FALSE})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r === undefined && s1.value()===1 && s2.value()===2
	})

	test('join - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s2.active(false)
		var j = circus.join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r === undefined
	})

	test('join - already active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal([2])
		var j = circus.join(s1,s2)
		s1.value(1)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join (shallow diff) - always dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join(s1,s2)
		s1.value(1)
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return j.dirty()
	})

	test('join - dirty', function() {
		function diff(v1,v2) {
			return v1[0]!==v2[0] || v1[1]!==v2[1]
		}
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join(s1,s2).diff(diff)
		s1.value(1)
		s2.value(2)
		s1.value(1)
		s2.value(3)
		return j.dirty()
	})

	test('join - clean', function() {
		function diff(v1,v2) {
			return v1[0]!==v2[0] || v1[1]!==v2[1]
		}
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join(s1,s2).diff(diff)
		s1.value(1)
		s2.value(1)
		s1.value(1)
		s2.value(1)
		return !j.dirty()
	})

	test('join - named key', function() {
		var s1 = circus.signal('k1')
		var s2 = circus.signal('k2')
		var j = circus.join(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - channel block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join({
			k1:s1,
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - merge channel blocks', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join({
			k1:s1
		},
		{
			k2:s2
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - aggregate signal block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join({
			k1:s1,
			k2:circus.join({
				k3:s2
			})
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - object into aggregate signal block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.join({
			k1:s1,
			k2:{
				k3:s2
			}
		})
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:{k3:2}})
	})

	test('join - auto name spacing', function() {
		var j = {
			a: {
				b: {
					c: circus.signal()
				}
			}
		}
		var s = circus.join(j)
		return j.a.b.c.namespace === 'a.b'
	})

	test('merge', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = circus.merge(s1,s2)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === 1 && r2 === 2
	})

	test('merge - not all active',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s2.active(false)
		var m = circus.merge(s1,s2)
		s1.value(1)
		s2.value(2)
		var r = m.value()
		return r === 1
	})

	test('sample - all (default)', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3).map(inc)
		s1.value(1)
		var r1 = s.value() // blocked
		s2.value(2)
		var r2 = s.value() // blocked
		s3.value(3)
		var r3 = s.value()
		return r1 === 1 && r2 === 1 && r3 === 2
	})


	test('sample - any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(circus.merge(s2,s3)).map(inc)
		s1.value(1)
		var r1 = s.value()
		s2.value(2)
		var r2 = s.value()
		s3.value(3)
		var r3 = s.value()
		return r1 === 1 && r2 === 2 && r3 === 3
	})
})
