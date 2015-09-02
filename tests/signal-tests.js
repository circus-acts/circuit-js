runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('named signal',function() {
		return circus.signal('sig1').name === 'sig1'
	})

	test('named && namespaced signal',function() {
		var s = circus.signal('sig1', 'ns1')
		return s.name==='sig1' && s.namespace === 'ns1'
	})

	test('namespaced signal',function() {
		var s = circus.signal('', 'ns1')
		return s.name==='' && s.namespace === 'ns1'
	})

	test('unnamed signal', function() {
		return circus.signal().name === ''
	})

	test('seed - primitive', function() {
		var s = circus.signal([123])
		return s.value() === 123
	})

	test('seed - array',function() {
		var s = circus.signal([[123]])
		return s.value()[0] === 123
	})

	test('seed - object',function() {
		var a = {x:123}
		var s = circus.signal([a])
		return s.value().x === 123
	})

	test('seed - undefined',function() {
		var s = circus.signal()
		return s.value()===undefined
	})

	test('seed - hot',function() {
		var s = circus.signal([1,2,3])
		return s.value()===3
	})

	test('seed - cold',function() {
		var s = circus.signal([1,2,3]).keep()
		s.value(4)
		var c1 = circus.signal(s.history()).value()
		s.value(5)
		var c2 = circus.signal(s.history()).value()
		return c1===4 && c2===5
	})

	test('value ',function() {
		var s = circus.signal([1])
		s.value(2)
		return s.value() === 2
	})

	test('value - undefined',function() {
		var s = circus.signal([1])
		s.value(undefined)
		return s.value() === undefined
	})

	test('dirty - initial', function() {
		var s = circus.signal()
		return !s.dirty()
	})

	test('dirty - primitive', function() {
		var s = circus.signal().map(function(v){return v})
		s.value(123)
		return s.dirty()
	})

	test('not dirty - same primitive', function() {
		var a = 123
		var s = circus.signal().map(function(v){return v})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return v})
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){
			v[0]++
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('not dirty - referenced array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return v})
		s.value(a)
		a[0]='abc'
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(v)
			m.value[0] = ++a[0]
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated array key', function() {
		var a = [123,456]
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(v)
			m.value[0] = ++a[0]
			m.key = 1
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v){return {}})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v){
			v.x=123
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(v)
			m.value.x = b++
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same mutated object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(v)
			m.value.x=123
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(a)
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same mutated object key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(a)
			m.value.x=123
			m.value.y=b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('test dirty key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(a)
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return s.dirty('x')
	})

	test('test not dirty key',function() {
		var a = {x:123}
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(a)
			m.value.x = 123
			m.key = 'x'
			return m
		})
		s.value(a)
		s.value(a)
		return !s.dirty('x')
	})

	test('always diff',function() {
		circus.alwaysDiff = true
		var a = {}, b=0
		var s = circus.signal().map(function(){
			var m = new circus.Mutator(a)
			m.value.x = b++
			return m
		})
		s.value(a)
		s.value(a)
		circus.alwaysDiff = false
		return s.dirty()
	})

	test('custom diff',function() {
		var diff = function(m) {return {dirty:circus.FALSE,value:m.value}}
		var a = {x:123}
		var s = circus.signal().map(function(v){
			var m = new circus.Mutator(v)
			m.value.x++
			return m
		})

		s.value(a,diff)
		return !s.dirty()
	})

	test('set value ',function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('tap',function() {
		var e = 'xyz'
		var s = circus.signal().tap(function(v){
			e=v
		})
		s.value(123)
		return e === 123
	})

	test('tap / tap', function() {
		var e = 0,e1,e2
		var t1 = function(v) {
			e1=v
		}
		var t2 = function(v) {
			e2=v
		}
		var s = circus.signal().map(inc).tap(t1).map(inc).tap(t2)
		s.value(e)
		return e1 === 1 && e2 === 2
	})

	test('map',function() {
		var e = 'xyz'
		var s = circus.signal()
		.map(function(v){
			return v * 2
		}).tap(function(v){
			e = v
		})
		s.value(123)
		return e === 246
	})

	test('map - undefined stops propagation',function() {
		return circus.signal([1]).map(function(v){return undefined}).map(inc).value() === 1
	})

	test('active - initial state', function() {
		var s = circus.signal()
		return s.active() === false
	})


	test('active - state', function() {
		var s = circus.signal()
		s.value(1)
		return s.active() === true
	})

	test('active - last state', function() {
		var s = circus.signal()
		var r1 = s.active(true)
		var r2 = s.active(false)
		return r1===undefined && r2===true
	})

	test('active - off', function() {
		var s = circus.signal()
		s.value(1)
		s.active(false)
		s.value(2)
		return s.value() === undefined
	})

	test('active - off / on', function() {
		var s = circus.signal()
		s.value(1)
		s.active(false)
		s.value(2)
		s.active(true)
		return s.value() === 1
	})

	test('keep - depth', function() {
		var s = circus.signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.toString() === '2,3'
	})

	test('keep - stateless', function() {
		var s = circus.signal().keep(0)
		s.value(1)
		s.value(1)
		return s.value()===1 && !s.dirty() && !s.history()
	})

	test('keep - clean', function() {
		var s = circus.signal().keep(1)
		s.value(1)
		s.value(1)
		return !s.dirty()
	})

	test('keep - history', function() {
		var s = circus.signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.length === 2 && v[0]===2
	})

	test('history - drop', function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 3 && s.history().length === 1
	})

	test('history - keep', function() {
		var s = circus.signal().keep()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 1 && s.history().length === 3
	})

	test('head', function() {
		var r, s = circus.signal().map(inc).tap(function(v){r=v})
		s.value(1)
		return r === 2 && s.head() === 1
	})

	test('finally', function() {
		var r,s = circus.signal().finally(function(){r=true})
		s.value(1)
		return r
	})

	test('finally - filo', function() {
		var r = [], s = circus.signal()
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1).map(inc)
		s2.value(2)
		return s1.value() === 2 & s2.value() === 2
	})

	test('feed - fanout', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal().feed(s1,s2)
		s3.value(3)
		return s1.value() === 3 && s2.value() === 3
	})

	test('signal of signals - inverted feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal(s1,s2)
		s.value(1)
		return s1.value() === 1 && s2.value() === 1
	})

	test('named signal of signals', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal('s',s1,s2)
		s.value(1)
		return s.name === 's' && s1.value() === 1 && s2.value() === 1
	})

	test('join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s2.active(false)
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r[0] === 1 && r[1] === undefined
	})

	test('join - dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		return j.dirty()
	})

	test('join - clean', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		s1.value(1)
		s2.value(2)
		return !j.dirty()
	})

	test('join - some dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		s1.value(3)
		s2.value(2)
		return j.dirty()
	})

	test('join - named key', function() {
		var s1 = circus.signal('k1')
		var s2 = circus.signal('k2')
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return circus.deepEqual(r,{k1:1,k2:2})
	})

	test('join - channel block', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = circus.signal().join({
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
		var j = circus.signal().join({
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
		var j = circus.signal().join({
			k1:s1,
			k2:circus.signal().join({
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
		var j = circus.signal().join({
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
		var s = circus.signal().join(j)
		return j.a.b.c.namespace === 'a.b'
	})

	test('merge', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.merge(s2)
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
		var m = s1.merge(s2)
		s1.value(1)
		s2.value(2)
		var r = m.value()
		return r === 1
	})

	test('sample', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3).map(inc)
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		s3.value(3)
		var r4 = s.value()
		return r1 === undefined && r2 === 1 && r3 === 2 && r4 === 2
	})

	test('join point', function() {
		function inc(v) {
			v.s++
			if (v.s1) v.s1++
			if (v.s2) v.s2++
			return v
		}
		// maybe too complicated?
		var s = circus.signal('s').join('jp1').map(inc).join('jp2').map(inc)
		var r1 = circus.copy(s.value(1))
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		s.jp.jp1.join(s1)
		s.jp.jp2.join(s2)
		s1.value(1)
		var r2 = circus.copy(s.value())
		s2.value(1)
		var r3 = circus.copy(s.value())
		//  r1: both joins are jp only so no channels means v(1) gets through (1+1+1)
		return r1.s === 3 && r1.s1 === undefined &&
		//  r2: jp1: 3 + 1 + 1, 1+1+1
				r2.s === 5 && r2.s1 === 3 && r2.s2 === undefined &&
		//  r3: jp2: 5 + 1, 3+1, 1+1
				r3.s === 6 && r3.s1 === 4 && r3.s2 === 2
	})

	test('switch', function() {
		var s1 = circus.signal().map(inc)
		var s2 = circus.signal().switch(s1).map(inc)
		s2.value(1)
		return s1.value() === 2 && s2.value() === 2
	})

	test('switch - jp', function() {
		var s1 = circus.signal().merge('jp').map(inc)
		var s2 = circus.signal().switch(s1.jp.jp).map(inc)
		s2.value(1)
		return s1.value() === 2 && s2.value() === 2
	})

	test('channels - join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		s1.join(s2)
		return circus.equal(Object.keys(s1.channels), ['0','1'])
	})

	test('channels - sample', function() {
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		var j = s1.sample(s2)
		return circus.equal(Object.keys(s1.channels), ['0'])
	})

	test('channels - merge', function() {
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		s1.merge(s2)
		return circus.equal(Object.keys(s1.channels), ['0','1'])
	})

	test('channels - jp', function() {
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		s1.sample(s2).join('jp2',s2)
		return circus.equal(Object.keys(s1.jp.jp2.channels), ['0','1'])
	})


})
