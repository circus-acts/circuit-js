runTests('circus', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var mul3 = function(v){return v*3}
	var noop = function(){}

	var app = new Circus(),
		signal = app.signal.bind(app)

	test('named signal',function() {
		var r = signal('sig1')
		return r.name === 'sig1'
	})

	test('unnamed signal', function() {
		return signal().name === undefined
	})

	test('value ',function() {
		return signal().value(2) === 2
	})

	test('value - undefined',function() {
		return signal().value(undefined) === undefined
	})

	test('value - pure',function() {
		var r=0, s = signal().pure().tap(function(){r++})
		s.value(1)
		s.value(1)
		return r===1
	})

	test('value - impure',function() {
		var r=0, s = signal().tap(function(){r++})
		s.value(1)
		s.value(1)
		return r===2
	})

	test('set value ',function() {
		var s = signal()
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('value - bind',function() {
		var bv = signal().value
		return bv(2)===2
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
		return signal().map(dbl).value(1) === 2
	})

	test('map - before',function() {
		return signal().map(dbl).map(Circus.before(inc)).value(1) === 4
	})

	test('map - undefined halts propagation',function() {
		var s = signal().map(function(v){return undefined}).map(inc)
		s.value(1)
		return s.value() === 1
	})

	test('map - Circus.UNDEFINED continues propagation',function() {
		var r = 1
		return signal().map(function(v){return Circus.UNDEFINED}).map(function(v){}).value(1) === undefined
	})

	test('map - Circus.fail aborts propagation',function() {
		var s = signal().map(inc).map(function(v){return Circus.fail()}).map(inc)
		s.value(1)
		return s.value() === 2
	})

	test('map - signal',function() {
		var b = signal().map(inc)
		return signal().map(b).value(1) === 2 && b.value()===2
	})

	test('map - signal flow',function() {
		var b = signal().map(inc)
		return signal().map(dbl).map(b).map(mul3).value(1) === 9 && b.value()===3
	})

	test('map - signal flow inline merge',function() {
		var b = signal().map(inc)
		var s = signal().map(dbl).map(b).map(mul3)
		return b.value(1) === 2 && s.value()===6
	})


	test('map - async',function(done) {
		var r = 0
		function async(v,next) {
			setTimeout(function(){
				next(v+1)
			})
		}
		signal().map(async).tap(function(v){done(v===2)}).value(1)
	})

	test('map - async signal ',function(done) {
		var r = 0
		var async = signal().map(function(v,next) {
			setTimeout(function(){
				next(v+1)
			})
		})
		var s = signal().map(async).tap(function(v){
			done(v===2)
		})
		s.value(1)
	})

    test('flow',function() {
        var e,s = app.signal()
        .flow(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.value(0)
        return e === 4
    })

    test('bind - pre',function() {
        var e,s = app.signal().map(inc).tap(function(v){
            e = v
        })
        s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 3
    })

    test('bind',function() {
        var s = app.signal().map(inc).map(dbl)
        var e = s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 6
    })

    test('bind - no functors',function() {
        var e = app.signal().bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 0
    })

    test('bind - includes taps',function() {
        var e,s = app.signal().map(inc).map(dbl).tap(function(v){
            e = v
        })
        s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 7
    })

    test('bind - composed',function() {
    	var b = function(f,args){return f(args[0]+1)}
        var e = app.signal().map(inc).bind(b).bind(b).value(0)
        return e === 3
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

	test('prime', function() {
		return signal().map(inc).prime(1).value() === 1
	})

	test('channel - halted propagation', function() {
		var r,s = signal().map(function(){return Circus.FALSE}).channel(function(){r=true})
		s.value(1)
		return !r
	})

	test('fail', function() {
		var f = Circus.fail()
		return f instanceof Circus.fail
	})

	test('fail - value', function() {
		var f = Circus.fail(1)
		return f.value === 1
	})

	test('finally', function() {
		var r,s = signal().finally(function(v){r=v})
		s.value(1)
		return r===1
	})

	test('finally - fifo', function() {
		var r = [], s = signal()
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.value(1)
		return r[0] === 1 && r[1] === 2
	})

	test('finally - filo', function() {
		var r = [], s = signal()
		s.finally(Circus.before(function(v){r.push(1)}))
		s.finally(Circus.before(function(v){r.push(2)}))
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('finally - halted propagation', function() {
		var r,s = signal().map(inc).map(function(){return undefined}).finally(function(v){r=v})
		s.value(1)
		return r===undefined && s.value()===2
	})

	test('finally - aborted propagation', function() {
		var r,s = signal().map(inc).map(function(){return Circus.fail()}).finally(function(v){r=v})
		s.value(1)
		return r instanceof Circus.fail && s.value()===2
	})

	test('finally - aborted propagation value', function() {
		var r,s = signal().map(inc).map(function(){return Circus.fail(123)}).finally(function(v){r=v}).value(1)
		return r.value===123
	})

	test ('channel', function(){
		var s = signal().map(inc)
		var a = s.channel().map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

	test ('channel - after', function(){
		var s = signal().map(inc)
		var a = s.channel(Circus.after).map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

	test ('channel - after, take steps', function(){
		var s = signal().map(inc)
		var a = s.channel(Circus.after, true).map(dbl)
		s.map(mul3).value(1)

		// in: 1 -> mul3 -> out: inc -> dbl
		return s.value()===8
	})

	test ('channel -after, shared state', function(){
		var s = signal().map(inc)
		var a = s.channel().map(dbl)
		a.value(1)

		return s.value()===4 && a.value()===4
	})

	test ('channel - before', function(){
		var s = signal().map(inc)
		var b = s.channel(Circus.before).map(dbl)
		s.map(mul3).value(1)

		return s.value()===9
	})

	test ('channel - before, take steps', function(){
		var s = signal().map(inc)
		var b = s.channel(Circus.before,true).map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

})
