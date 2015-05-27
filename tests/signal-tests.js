runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('named signal',function() {
		return circus.signal().name('sig1').name() === 'sig1'
	})

	test('unnamed signal', function() {
		return circus.signal().name() === undefined
	})


	test('seed - primitive', function(done) {
		var s = circus.signal(123)
		return done(function(){return s.value() === 123})
	})

	test('seed - array',function(done) {
		var s = circus.signal([123])
		return done(function(){return s.value()[0] === 123})
	})

	test('seed - object',function(done) {
		var a = {x:123}
		var s = circus.signal(a)
		return done(function(){return s.value().x === 123})
	})

	test('seed - UNDEFINED',function(done) {
		var s = circus.signal(circus.UNDEFINED)
		return done(function() {return s.value()===undefined})
	})

	test('seed - undefined',function(done) {
		var s = circus.signal()
		return done(function() {return s.value()===undefined})
	})

	test('dirty - primitive', function() {
		return circus.signal().map(function(v){return v}).head(123).dirty()
	})

	test('not dirty - same primitive', function() {
		var a = 123
		var s = circus.signal().map(function(v){return v})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - new array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return v})
		return s.dirty()
	})

	test('not dirty - same array', function() {
		var a = [123]
		var s = circus.signal().map(function(v){
			v[0]++
			return v
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('not dirty - referenced array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v){return v})
		s.head(a)
		a[0]='abc'
		s.head(a)
		return !s.dirty()
	})

	test('dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().map(function(v,m){ 
			m.value[0] = ++a[0]
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - mutated array key', function() {
		var a = [123,456]
		var s = circus.signal().map(function(v,m){ 
			m.value[0] = ++a[0]
			m.key = 1
			return m
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - new object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v){return {}})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - same object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v,m){
			v.x=123
			return v
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,m){
			m.value.x = b++
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - same mutated object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v,m){
			m.value.x=123
			return m
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - mutated object key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,m){
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - same mutated object key',function() {
		var a = {x:'yz'},b=0
		var s = circus.signal().map(function(v,m){
			m.value.x=123
			m.value.y=b++
			m.key = 'x'
			return m
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('test dirty key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,m){
			m.value.x = b++
			m.key = 'x'
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty('x')
	})

	test('test not dirty key',function() {
		var a = {x:123}
		var s = circus.signal().map(function(v,m){
			m.value.x = 123
			m.key = 'x'
			return m
		})
		s.head(a)
		s.head(a)
		return !s.dirty('x')
	})

	test('always diff',function() {
		circus.alwaysDiff = true
		var a = {}, b=0
		var s = circus.signal().map(function(m){
			m.value.x = b++
			return m
		})
		s.head(a)
		s.head(a)
		circus.alwaysDiff = false
		return s.dirty()
	})

	test('custom mutator',function() {
		var save = circus.mutator
		circus.mutator = function(m) {return {dirty:false,value:m.value}}
		var a = {x:123}
		var s = circus.signal().map(function(v,m){
			m.value.x++
			return m
		})
		s.head(a)
		s.head(a)
		circus.mutator = save
		return !s.dirty()
	})

	test('set value ',function() {
		var s = circus.signal()
		s.head(1)
		s.head(2)
		s.head(3)
		return s.value() === 3
	})

	test('lift',function() {
		var e = 'xyz'
		var s = circus.signal().lift(function(v){
			e=v
		})
		s.head(123)
		return e === 123
	})

	test('tap / lift', function() {
		var e = 0,e1,e2
		var t1 = function(v) {e1=v}
		var t2 = function(v) {e2=v}
		var s = circus.signal().map(inc).lift(t1).map(inc).tap(t2)
		s.head(e)
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
		s.head(123)
		return e === 246
	})

	test('reduce', function() {
		var e = 'xyz'
		var s = circus.signal()
		.reduce(function(a,v){
			return a+v
		}).tap(function(v){
			e = v			
		})
		s.head(1)
		s.head(1)
		s.head(1)
		return e === 3
	})

	test('active - off', function() {
		var s = circus.signal()
		s.head(1)
		s.active(false)
		s.head(2)
		return s.value() === 1
	})

	test('active off / on', function() {
		var s = circus.signal(1).active(false)
		s.head(2)
		s.active(true)
		s.head(3)
		return s.value() === 3
	})

	test('active - conditional', function() {
		var s = circus.signal().active(function(v){return v === 1})
		s.head(1)
		s.head(2)
		return s.value() === 1
	})

	test('active - on off event', function() {
		var e = 'xyz'
		var s = circus.signal().off(function(v){e=v})
		s.head(1)
		s.active(false)
		return e === 1
	})

	test('active - on on event', function() {
		var e = 'xyz'
		var s = circus.signal().on(function(v){e=v})
		s.head(1)
		s.active(false).active(true)
		return e === 1
	})

	test('depth', function() {
		var s = circus.signal().depth(2)
		s.head(1)
		s.head(2)
		s.head(3)
		var v = s.history()
		return v.length === 2 && v[0]===2
	})

	test('keep - value', function() {
		var s = circus.signal().keep(2)
		s.head(1)
		s.head(2)
		s.head(3)
		var v = s.value()
		return v===3
	})

	test('keep - history', function() {
		var s = circus.signal().keep(2)
		s.head(1)
		s.head(2)
		s.head(3)
		var v = s.history()
		return v.length === 2 && v[0]===2
	})

	test('history - drop', function() {
		var s = circus.signal()
		s.head(1)
		s.head(2)
		s.head(3)
		return s.history()[0] === 3 && s.history().length === 1
	})

	test('history - signal', function() {
		var a,s = circus.signal().keep()
		s.history(function(v){
		 	a = v
		})
		s.head(1)
		s.head(2)
		s.head(3)

		return a.length === 3
	})

	test('history - keep', function() {
		var s = circus.signal().keep()
		s.head(1)
		s.head(2)
		s.head(3)
		return s.history()[0] === 1 && s.history().length === 3
	})

	test('head', function() {
		var r, s = circus.signal().map(inc).tap(function(v){r=v}).head(1)
		return r === 2
	})

	test('finally', function() {
		var r, s = circus.signal()
		s.map(inc)
		s.finally().map(dbl).tap(function(v){r=v})
		s.head(1)
		return r === 4
	})

	test('feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1)
		s2.head(2)
		return s1.value() === 2
	})

	test('feed - fanout', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal().feed(s1,s2)
		s3.head(3)
		return s1.value() === 3 && s2.value() === 3
	})

	test('join all', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.joinAll(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join all - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.joinAll(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r === undefined
	})

	test('named key join', function() {
		var s1 = circus.signal().name('k1')
		var s2 = circus.signal().name('k2')
		var j = s1.joinAll(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	test('join any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === undefined
	})

	test('join any truthy', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().name('s2')
		var m = s1.join(s2,function(v){
			return v && v.s2 == 2
		})
		s1.head(1)
		var r1 = m.value()
		s2.head(2)
		var r2 = m.value()
		return r1 === undefined && r2.s2 === 2
	})


	test('merge all', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.mergeAll(s2)
		s1.head(1)
		var r1 = m.value()
		s2.head(2)
		var r2 = m.value()
		return r1 === undefined && r2 === 2
	})

	test('merge all - not all active',function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var m = s1.mergeAll(s2)
		s1.head(1)
		s2.head(2)
		var r = m.value()
		return r === undefined
	})

	test('merge any truthy',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.merge(s2,function(v){
			return v > 2
		})
		s1.head(1)
		var r1 = m.value()
		s2.head(2)
		var r2 = m.value()
		return r1 === undefined && r2 === undefined
	})

	test('merge any',function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var s3 = circus.signal()
		var m = s1.merge(s2,s3)
		s1.head(1)
		var r1 = m.value()
		s2.head(2)
		var r2 = m.value()
		s3.head(3)
		var r3 = m.value()
		return r1 === 1 && r2 === 1 && r3 === 3
	})

	test('sample all',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sampleAll(s2,s3)
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		var r3 = s.value()
		s3.head(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined && r4 === 1
	})

	test('sample any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3)
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		var r3 = s.value()
		s3.head(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1 && r4 === 1
	})

	test('sample - truthy', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sampleAll(s2,function(v2){return v2 === 2})
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1
	})

	test('sample - falsey',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sampleAll(s2,function(v2){return v2 === 'x'})
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined
	})

	test('pulse',function() {
		var r = 0
		var s1 = circus.signal().pulse()
		var s2 = circus.signal().sampleAll(s1).tap(function(){r++})
		s2.head(1)
		s1.head(1)
		s2.head(1)
		return r === 1 && s1.active() === false
	})
})
