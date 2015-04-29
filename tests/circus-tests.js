function runtests(mock) {

	// named signal
	test(function() {
		return circus.signal().name('sig1').name() === 'sig1'
	})

	// unnamed signal
	test(function() {
		return circus.signal().name() === undefined
	})


	// seed: primitive
	test(function() {
		return circus.signal(123).value() === 123
	})

	// 	seed: array
	test(function() {
		return circus.signal([123]).value()[0] === 123
	})

	// 	seed: object
	test(function() {
		var a = {x:123}
		return circus.signal(a).value().x === 123
	})

	// 	seed: undefined
	test(function() {
		var r =
			circus.signal(circus.UNDEFINED).value() === undefined &&
			circus.signal().value() === undefined
		return r
	})

	// immutability: primitive
	test(function() {
		var a = 123
		var s = circus.signal(a)
		a = 'xyz'
		return s.value() === 123 && a === 'xyz'
	})

	// immutability: array (shallow copy)
	test(function() {
		var a = [123]
		var v = circus.signal(a).value()
		a[0] = 'xyz'
		return v[0] == 123 && v !== a
	})

	// 	immutability: object (shallow copy)
	test(function() {
		var a = {x:'yz'}
		var v = circus.signal(a).value()
		a.x = 123
		return v.x==='yz' && v !== a
	})

	// signal 
	test(function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	// lift
	test(function() {
		var e = 'xyz'
		var s = circus.signal().lift(function(v){
			e=v
		})
		s.value(123)
		return e === 123
	})

	// always
	test(function() {
		var s = circus.signal()
		var r = s.always(123)
		s.value('xyz')
		return r.value() === 123
	})

	// take
	test(function() {
		var s = circus.signal().take(2)
		for (var i=0; i<5; i++) s.head.value(i)
		return s.value() === 1
	})

	// skip, take - keep
	test(function() {
		var s = circus.signal().keep(2).skip(2).take(2)
		for (var i=0; i<5; i++) s.head.value(i)
		var r = s.toArray()
		return r.length === 2 && r[0] === 2 && r[1] === 3
	})

	// tap / lift
	test(function() {
		var e = 0,e1,e2
		var inc = function(v){return v+1}
		var t1 = function(v) {e1=v}
		var t2 = function(v) {e2=v}
		var s = circus.signal().map(inc).lift(t1).map(inc).tap(t2)
		s.head.value(e)
		return e1 === 1 && e2 === 2
	})

	// map
	test(function() {
		var e = 'xyz'
		var s = circus.signal()
		.map(function(v){
			return v * 2
		}).tap(function(v){
			e = v			
		})
		s.head.value(123)
		return e === 246
	})

	// reduce
	test(function() {
		var e = 'xyz'
		var s = circus.signal()
		.reduce(function(a,v){
			return a+v
		}).tap(function(v){
			e = v			
		})
		s.head.value(1)
		s.head.value(1)
		s.head.value(1)
		return e === 3
	})

	// active - off
	test(function() {
		var s = circus.signal(1).active(false)
		s.head.value(2)
		return s.value() === 1
	})

	// active - on
	test(function() {
		var s = circus.signal(1).active(false)
		s.value(2)
		s.active(true)
		s.value(3)
		return s.value() === 3
	})

	// active - on off event
	test(function() {
		var e = 'xyz'
		var s = circus.signal(1).off(function(v){e=v})
		s.active(false)
		return e === 1
	})

	// active - on on event
	test(function() {
		var e = 'xyz'
		var s = circus.signal(1).on(function(v){e=v})
		s.active(false).active(true)
		return e === 1
	})

	// depth
	test(function() {
		var s = circus.signal().depth(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.toArray()
		return v.length === 2 && v[0]===2
	})

	// keep
	test(function() {
		var s = circus.signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.toArray()
		return v.length === 2 && v[0]===2
	})

	// to array
	test(function() {
		var s = circus.signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.toArray()[0] === 3
	})

	// to array - signal
	test(function() {
		var a,s = circus.signal().keep()
		s.toArray(function(v){
		 	a = v
		})
		s.value(1)
		 .value(2)
		 .value(3)

		return a.length === 3
	})

	// to array - keep
	test(function() {
		var s = circus.signal().keep()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.toArray().length === 3
	})

	// compact
	test(function() {
		var s = circus.signal().keep().compact()
		s.head.value(1)
		s.head.value(circus.UNDEFINED)
		s.head.value('')
		s.head.value(0)
		s.head.value(3)
		var r = s.toArray() 
		return r.length === 2 && r[0] === 1 && r[1] === 3
	})

	// feed
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal().feed(s1)
		s2.value(2)
		return s1.value() === 2
	})

	// join all
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var j = s1.joinAll(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === 2
	})

	// join all - not all active
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.joinAll(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r === undefined
	})

	// named key join
	test(function() {
		var s1 = circus.signal().name('k1')
		var s2 = circus.signal().name('k2')
		var j = s1.joinAll(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return r.k1 === 1 && r.k2 === 2
	})

	// join any
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var j = s1.join(s2)
		s1.value(1)
		s2.value(2)
		var r = j.value()
		return typeof r === 'object' && r[0] === 1 && r[1] === undefined
	})


	// merge all
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var m = s1.mergeAll(s2)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		return r1 === undefined && r2 === 2
	})

	// merge all - not all active
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var m = s1.mergeAll(s2)
		s1.value(1)
		s2.value(2)
		var r = m.value()
		return r === undefined
	})

	// merge any
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal().active(false)
		var s3 = circus.signal()
		var m = s1.merge(s2,s3)
		s1.value(1)
		var r1 = m.value()
		s2.value(2)
		var r2 = m.value()
		s3.value(3)
		var r3 = m.value()
		return r1 === 1 && r2 === 1 && r3 === 3
	})

	// sample all
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sampleAll(s2,s3)
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		s3.value(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined && r4 === 1
	})

	// sample any
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s3 = circus.signal()
		var s = s1.sample(s2,s3)
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		s3.value(3)
		var r4 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1 && r4 === 1
	})

	// sample - truthy
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sampleAll(s2,function(v2){return v2 === 2})
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === 1
	})

	// sample - falsy
	test(function() {
		var s1 = circus.signal()
		var s2 = circus.signal()
		var s = s1.sampleAll(s2,function(v2){return v2 === 'x'})
		var r1 = s.value()
		s1.value(1)
		var r2 = s.value()
		s2.value(2)
		var r3 = s.value()
		return r1 === undefined && r2 === undefined && r3 === undefined
	})

	// pulse
	test(function() {
		var r = 0
		var s1 = circus.signal().pulse()
		var s2 = circus.signal().sampleAll(s1).tap(function(){r++})
		s2.head.value(1)
		s1.head.value(1)
		s2.head.value(1)
		return r === 1 && s1.active() === false
	})
}

runtests(mock.window)

test.print(function(value) {console.log(value)})
