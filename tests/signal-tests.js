runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}

	test('named signal',function() {
		return circus.signal('sig1').name() === 'sig1'
	})

	test('unnamed signal', function() {
		return circus.signal().name() === undefined
	})

	test('name - change',function() {
		return circus.signal('sig1').name('sig2').name() === 'sig2'
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
		var c1 = circus.signal(s.history()).value()
		s.head(4)
		var c2 = circus.signal(s.history()).value()
		return c1===3 && c2===4
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
		var s = circus.signal().map(function(v,i,m){ 
			m.value[0] = ++a[0]
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - mutated array key', function() {
		var a = [123,456]
		var s = circus.signal().map(function(v,i,m){ 
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
		var s = circus.signal().map(function(v,i,m){
			v.x=123
			return v
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,i,m){
			m.value.x = b++
			return m
		})
		s.head(a)
		s.head(a)
		return s.dirty()
	})

	test('not dirty - same mutated object',function() {
		var a = {x:'yz'}
		var s = circus.signal().map(function(v,i,m){
			m.value.x=123
			return m
		})
		s.head(a)
		s.head(a)
		return !s.dirty()
	})

	test('dirty - mutated object key',function() {
		var a = {},b=0
		var s = circus.signal().map(function(v,i,m){
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
		var s = circus.signal().map(function(v,i,m){
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
		var s = circus.signal().map(function(v,i,m){
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
		var s = circus.signal().map(function(v,i,m){
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
		var s = circus.signal().map(function(v,i,m){
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

	test('map - FALSE',function() {
		var e = 'xyz'
		var s = circus.signal()
		.map(function(v){
			return circus.FALSE
		}).tap(function(v){
			e = v			
		})
		s.head(123)
		return e === 'xyz'
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

	test('active - state', function() {
		var s = circus.signal()
		s.head(1)
		return s.active()
	})

	test('active - off', function() {
		var s = circus.signal()
		s.head(1)
		s.active(false)
		s.head(2)
		return s.value() === 1
	})

	test('pulse',function() {
		var r = 0
		var s1 = circus.signal().pulse()
		var s2 = circus.signal().sample(s1).tap(function(){r++})
		s2.head(1)
		s1.head(1)
		s2.head(1)
		return r === 1 && s1.active() === false
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

	test('then', function() {
		var chain = function(s) {
			return s.map(inc).map(inc)	
		}
		return circus.signal([1]).then(chain).state() === 3
	})

	test('finally', function() {
		var r, s = circus.signal()
		s.map(inc)
		s.finally().map(dbl).tap(function(v){r=v})
		s.head(1)
		return r === 4
	})

	test('finally - delayed seed', function() {
		var r = circus.signal([1]).finally().map(inc).value()
		return r === 2
	})

	test('finally - not active', function() {
		var r = circus.signal([1]).active(false).finally().map(inc).value()
		return r === undefined
	})

	test('finally - lift order', function() {
		var r1,r2, s = circus.signal()
		s.map(inc)
		s.finally().map(function(){return 1}).tap(function(v){r1=v})
		s.finally().map(dbl).tap(function(v){r1=r2=v})
		s.head(1)
		return r1 === 1 && r2 === 4
	})

	test('feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1)
		s2.head(2)
		return s1.value() === 2
	})

	test('feed - active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1,function(v){return v})
		s2.head(2)
		return s1.value() === 2
	})

	test('feed - blocked', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1,function(v){return !v})
		s2.head(2)
		return s1.value() === undefined
	})

	test('signal of signals - inverted feed', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal(s1,s2)
		s.head(1)
		return s1.value() === 1 && s2.value() === 1
	})

	test('named signal of signals', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = circus.signal('s',s1,s2)
		s.head(1)
		return s.name() === 's' && s1.value() === 1 && s2.value() === 1
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
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	test('join all - not all active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r === undefined
	})

	test('join all - dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		return j.dirty()
	})

	test('join all - clean', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		s1.head(1)
		s2.head(2)
		return !j.dirty()
	})

	test('join all - some dirty', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		s1.head(3)
		s2.head(2)
		return j.dirty()
	})

	test('named key join', function() {
		var s1 = circus.signal('k1')
		var s2 = circus.signal('k2')
		var j = s1.join(s2)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	test('object join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join({
			k1:s1,
			k2:s2
		})
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	test('inclusive object join', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join({
			k1:circus.id,
			k2:s2
		})
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	test('join any', function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.join(s2, circus.signal.anyActive)
		s2.head(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === undefined && r[1] === 2
	})

	test('join any - not active', function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2, circus.signal.anyActive)
		s1.head(1)
		s2.head(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === undefined
	})

	test('join any truthy', function() {
		var s1 = circus.signal()
		var s2 = circus.signal('s2')
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
		var m = s1.merge(s2, circus.signal.allActive)
		s1.head(1)
		var r1 = m.value()
		s2.head(2)
		var r2 = m.value()
		return r1 === undefined && r2 === 2
	})

	test('merge all - not all active',function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var m = s1.merge(s2, circus.signal.allActive)
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

	test('sample',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sample(s2,function(v){
			return v[0] === 1 && v[1] === 2
		})
		s1.head(1)
		var r1 = s.value()
		s2.head(2)
		var r2 = s.value()
		return r1 === undefined && r2 === 1
	})

	test('sample - object',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample({s2:s2,s3:s3},function(v){
			return v[0] === 1 && v.s2 === 2 && v.s3 === 3
		})
		s1.head(1)
		s2.head(2)
		s3.head(3)
		var r4 = s.value()
		return r4 === 1
	})

	test('sample all',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3, circus.signal.allActive)
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
		var s3 = circus.signal()
		var s = s1.sample(s2,s3,function(v){
			return v[0] === 1 && v[1] === 2 && v[2] === 3
		})
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		s3.head(3)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1
	})

	test('sample - falsey',function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sample(s2,function(v2){return v2 === 'x'})
		var r1 = s.value()
		s1.head(1)
		var r2 = s.value()
		s2.head(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined
	})

	test('join point', function() {
		function inc(v) {
			v.s++
			if (v.s1) v.s1++
			if (v.s2) v.s2++
			return v
		}
		var s = circus.signal('s').join('jp1').map(inc).join('jp2').map(inc).head(1)
		var s1 = circus.signal('s1')
		var s2 = circus.signal('s2')
		s.jp.jp1.join(s1)
		s.jp.jp2.join(s2)
		s1.head(1)
		var r1 = s.state()
		s2.head(1)
		var r2 = s.state()
		return r1.s === 2 && r1.s1 === 2 && r2.s === 3 && r2.s1 === 3 && r2.s2 === 2
	})

	test('split', function() {
		var s1 = circus.signal().merge('jp').head(1)
		var s2 = circus.signal().split(s1.jp.jp).map(inc).head(2)
		return s1.state() === 2 && s2.state() === 3
	})

	test('split - multiple', function() {
		var r=[],inc=function(v){
			v=v+1;
			r.push(v);
			return v
		}
		var s1 = circus.signal().merge('jp1').map(inc).merge('jp2').map(inc).head()
		var s2 = circus.signal().split(s1.jp.jp1, s1.jp.jp2).head(1)
		return s1.state() === 2 && r.toString() === '2,3,2'
	})

	test('split - true', function() {
		var s1 = circus.signal().merge('jp').head()
		var s2 = circus.signal().split(s1.jp.jp, function(){return true}).map(inc).head(2)
		return s1.state() === 2 && s2.state() === 3
	})

	test('split - false', function() {
		var s1 = circus.signal().merge('jp').head()
		var s2 = circus.signal().split(s1.jp.jp, function(){return false}).map(inc).head(2)
		return s1.state() === undefined && s2.state() === 2
	})

	test('split - fanout', function() {
		var s1 = circus.signal().merge('jp1').head()
		var s2 = circus.signal().merge('jp2').head()
		var s3 = circus.signal().split(s1.jp.jp1, s2.jp.jp2).map(inc).head(3)
		return s1.state() === 3 && s2.state() === 3 && s3.state() === 4
	})

	test('switch', function() {
		var s1 = circus.signal().merge('jp').map(inc).head()
		var s2 = circus.signal().switch(s1.jp.jp).map(inc).head(1)
		return s1.state() === 2 && s2.state() === 1
	})

	test('switch - true', function() {
		var s1 = circus.signal().merge('jp').map(inc).head()
		var s2 = circus.signal().switch(s1.jp.jp, function(){return true}).map(inc).head(1)
		return s1.state() === 2 && s2.state() === 1
	})

	test('switch - false', function() {
		var s1 = circus.signal().merge('jp').map(inc).head()
		var s2 = circus.signal().switch(s1.jp.jp, function(){return false}).map(inc).head(1)
		return s1.state() === undefined && s2.state() === 2
	})

	test('join - map', function() {
		function map(v) {
			return {
				s1:v.s1+1,
				s2:v.s2+1
			}
		}
		var s1 = circus.signal('s1').head(1)
		var s2 = circus.signal('s2').join(s1,map).head(2)
		return s2.state().s1 === 2 && s2.state().s2 === 3
	})

	test('join - mask', function() {
		function mask(v) {
			return circus.signal.mask({
				s1:true,
				s2:false
			})
		}
		var s1 = circus.signal('s1').head(1)
		var s2 = circus.signal('s2').join(s1,mask).head(2)
		return s2.state().s1 === 1 && s2.state().s2 === undefined
	})

	test('join - logical mask', function() {
		function mask(v) {
			return circus.signal.mask({
				s1:v.s1 === 1,
				s2:v.s2 === 3
			})
		}
		var s1 = circus.signal('s1').head(1)
		var s2 = circus.signal('s2').join(s1,mask).head(2)
		return s2.state().s1 === 1 && s2.state().s2 === undefined
	})

    test('then', function() {
        var c = function(s) {
            return s.map(inc).map(inc)
        }
        return circus.signal([1]).then(c).value() === 3
    })

})
