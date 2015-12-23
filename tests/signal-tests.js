runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}
	var noop = function(){}

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

	test('value ',function() {
		return circus.signal().value(2) === 2
	})

	test('value - undefined',function() {
		return circus.signal().value(undefined) === undefined
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
		var s = circus.signal().map(function(v){return [].concat(v)})
		s.value(a)
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

	test('dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().diff(circus.shallowDiff).map(function(v){
			return [++v[0]]
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated array element', function() {
		var a = [123]
		var s = circus.signal().diff(circus.shallowDiff).map(function(v){
			return [v[0]]
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - new object',function() {
		var a = {x:0}
		var s = circus.signal().map(function(v){return {}})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - same object',function() {
		var a = {x:0}
		var s = circus.signal().map(function(v){
			v.x++
			return v
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('dirty - mutated object',function() {
		var a = {x:0}
		var s = circus.signal().diff(circus.shallowDiff).map(function(v){
			return {x:v.x++}
		})
		s.value(a)
		s.value(a)
		return s.dirty()
	})

	test('not dirty - mutated object',function() {
		var a = {x:0}
		var s = circus.signal().diff(circus.shallowDiff).map(function(v){
			return {x:v.x}
		})
		s.value(a)
		s.value(a)
		return !s.dirty()
	})

	test('custom diff',function() {
		var diff = function() {return true}
		var a = {x:123}
		var s = circus.signal().diff(diff).map(function(v){
			return v
		})

		s.value(a)
		s.value(a)
		return s.dirty()
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

	test('tap - undefined',function() {
		var e = 'xyz'
		var s = circus.signal().tap(noop).tap(function(v){
			e=123
		})
		s.value(s.head())
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
		return circus.signal().map(function(v){return undefined}).map(inc).value(1) === 1
	})

	test('map - circus.UNDEFINED continues propagation',function() {
		var r = 1
		return circus.signal().map(function(v){return circus.UNDEFINED}).map(function(v){}).value(1) === undefined
	})

	test('map - circus.FALSE aborts propagation',function() {
		return circus.signal().map(function(v){return circus.FALSE}).map(inc).value(1) === undefined
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

	test('prime', function() {
		s = circus.signal().map(inc)
		s.value(1)
		s.prime(1)
		return s.head() === 1 && s.value() === 1
	})

	test('prime - cold',function() {
		var s = circus.signal([1,2,3]).keep()
		s.value(4)
		var c1 = circus.signal().prime(s.history()).value()
		s.value(5)
		var c2 = circus.signal().prime(s.history()).value()
		return c1===4 && c2===5
	})

	test('after', function() {
		var r,s = circus.signal().after(function(){r=true})
		s.value(1)
		return r
	})

	test('after - filo', function() {
		var r = [], s = circus.signal()
		s.after(function(v){r.push(1); return v})
		s.after(function(v){r.push(2); return v})
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('after - halted propagation', function() {
		var r,s = circus.signal().map(function(){return circus.FALSE}).after(function(){r=true})
		s.value(1)
		return !r
	})

	test('finally', function() {
		var r,s = circus.signal().after(function(){r=true})
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

	test('finally - halted propagation', function() {
		var r,s = circus.signal().map(function(){return circus.FALSE}).finally(function(){r=true})
		s.value(1)
		return !r
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

    test('error - set / get', function(){
        var s = circus.signal().error(function(v){return v==1})
        s.value(1)
        return s.error() === true
    })

    test('error - message', function(){
        var s = circus.signal().error(function(v){return v==1 && 'msg'})
        s.value(1)
        return s.error() === 'msg'
    })

    test('error - not set', function(){
        var s = circus.signal().error(function(v){return v==2 && 'msg'})
        s.value(1)
        return s.error() === ''
    })

    test('error - first', function(){
        var i=0, msg=function(v){return ++i}
        var s = circus.signal().error(msg).error(msg)
        s.value(1)
        return s.error() === 1
    })

    test('error - next', function(){
        var i=0, msg = function() {return ++i===2 && 2}
        var s = circus.signal().error(msg).error(msg)
        s.value(1)
        return s.error() === 2
    })

})
