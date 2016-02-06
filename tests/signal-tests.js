runTests('signal', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul = function(v){return v*3}
	var noop = function(){}

	var app = new Circus(),
		signal = app.signal.bind(app)

	test('named signal',function() {
		var r = signal('sig1')
		return r.name === 'sig1'
	})

	test('unnamed signal', function() {
		return signal().name === ''
	})

	test('value ',function() {
		return signal().value(2) === 2
	})

	test('value - undefined',function() {
		return signal().value(undefined) === undefined
	})

	test('value - pure',function() {
		var r=0, s = signal().tap(function(){r++})
		s.value(1)
		s.value(1)
		return r===1
	})

	test('value - impure',function() {
		var r=0, s = signal().tap(function(){r++})
		s.value(1,true)
		s.value(1,true)
		return r===2
	})

	test('set value ',function() {
		var s = signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('tap',function() {
		var e = 'xyz'
		var s = signal().tap(function(v){
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
		var s = signal().map(inc).tap(t1).map(inc).tap(t2)
		s.value(e)
		return e1 === 1 && e2 === 2
	})

	test('map',function() {
		var e = 'xyz'
		var s = signal().map(dbl).tap(function(v){
			e = v
		})
		s.value(123)
		return e === 246
	})

	test('map - undefined stops propagation',function() {
		return signal().map(function(v){return undefined}).map(inc).value(1) === 1
	})

	test('map - Circus.UNDEFINED continues propagation',function() {
		var r = 1
		return signal().map(function(v){return Circus.UNDEFINED}).map(function(v){}).value(1) === undefined
	})

	test('map - Circus.FALSE aborts propagation',function() {
		return signal().map(function(v){return Circus.FALSE}).map(inc).value(1) === undefined
	})


	test('map - async',function(done) {
		var r = 0
		function async(v,next) {
			setTimeout(function(){
				next(v+1)
			})
		}
		signal().map(async,true).tap(function(v){done(v===2)}).value(1)
	})

	test('active - initial state', function() {
		var s = signal()
		return s.active() === false
	})


	test('active - state', function() {
		var s = signal()
		s.value(1)
		return s.active() === true
	})

	test('active - nested state', function() {
		var s = signal()
		s.active(true)
		s.active(true)
		s.active(false)
		s.active(false)
		return !s.active()
	})

	test('active - prevent propagation', function() {
		var s = signal()
		s.value(1)
		s.active(false)
		s.value(2)
		return s.value() === 1
	})

	test('keep - depth', function() {
		var s = signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.toString() === '2,3'
	})

	test('keep - history', function() {
		var s = signal().keep(2)
		s.value(1)
		s.value(2)
		s.value(3)
		var v = s.history()
		return v.length === 2 && v[0]===2
	})

	test('history - drop', function() {
		var s = signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 3 && s.history().length === 1
	})

	test('history - keep', function() {
		var s = signal().keep()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.history()[0] === 1 && s.history().length === 3
	})

	test('prime', function() {
		return signal().map(inc).prime(1).value() === 1
	})

	test('after', function() {
		var r,s = signal().after(function(){r=true})
		s.value(1)
		return r
	})

	test('after - filo', function() {
		var r = [], s = signal()
		s.after(function(v){r.push(1); return v})
		s.after(function(v){r.push(2); return v})
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('after - halted propagation', function() {
		var r,s = signal().map(function(){return Circus.FALSE}).after(function(){r=true})
		s.value(1)
		return !r
	})

	test('finally', function() {
		var r,s = signal().after(function(){r=true})
		s.value(1)
		return r
	})

	test('finally - filo', function() {
		var r = [], s = signal()
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('finally - halted propagation', function() {
		var r,s = signal().map(function(){return Circus.FALSE}).finally(function(){r=true})
		s.value(1)
		return r
	})

	test('feed', function() {
		var s1 = signal()
		var s2 = signal().feed(s1).map(inc)
		s2.value(2)
		return s1.value() === 2 & s2.value() === 2
	})

	test('feed - fanout', function() {
		var s1 = signal()
		var s2 = signal()
		var s3 = signal().feed(s1,s2)
		s3.value(3)
		return s1.value() === 3 && s2.value() === 3
	})

})
