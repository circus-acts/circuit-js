import Circus from '../src'
import {Signal} from '../src/signal'

var inc = function(v){return v+1}
var dbl = function(v){return v+v}
var mul3 = function(v){return v*3}
var noop = function(){}

runTests('signal', function(mock) {

	var signal
	setup(function(){
		signal = new Signal()
	})

    test('new signal', function(){
        return Circus.isSignal(signal)
    })

    test('as signal', function(){
        var s = signal.asSignal()
        return Circus.isSignal(s)
    })

    test('as signal - from this', function(){
        var s1 = signal
        var s2 = s1.asSignal(s1)
        return s1 === s2
    })

    test('as signal - from map', function(){
        var r = signal.asSignal(inc).value(1)
        return r === 2
    })

	test('named signal',function() {
		var r = new Signal('sig1')
		return r.name === 'sig1'
	})

	test('unnamed signal', function() {
		return signal.name === undefined
	})

	test('value ',function() {
		return signal.value(2) === 2
	})

	test('value - undefined',function() {
		return signal.value(undefined) === undefined
	})

	test('value - pure',function() {
		var r=0, s = signal.pure().tap(function(){r++})
		s.value(1)
		s.value(1)
		return r===1
	})

	test('value - pure after fail',function() {
		var fail = function(v) {
			return v===1? v : Circus.fail()
		}
		var r=0, s = signal.pure().map(fail).tap(function(){r++})
		s.value(1)
		s.value(2)
		s.value(1)
		return r===1
	})

	test('value - impure',function() {
		var r=0, s = signal.tap(function(){r++})
		s.value(1)
		s.value(1)
		return r===2
	})

	test('set value ',function() {
		var s = signal
		s.value(1)
		s.value(2)
		s.value(3)
		return s.value() === 3
	})

	test('value - bind',function() {
		var bv = signal.value
		return bv(2)===2
	})

	test('tap',function() {
		var e = 'xyz'
		var s = signal.tap(function(v){
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
		var s = signal.map(inc).tap(t1).map(inc).tap(t2)
		s.value(e)
		return e1 === 1 && e2 === 2
	})

	test('map',function() {
		return signal.map(dbl).value(1) === 2
	})

	test('map - before',function() {
		return signal.map(dbl).map(Circus.before(inc)).value(1) === 4
	})

	test('map - undefined halts propagation',function() {
		var s = signal.map(function(v){return undefined}).map(inc)
		s.value(1)
		return s.value() === 1
	})

	test('map - Circus.UNDEFINED continues propagation',function() {
		var r = 1
		return signal.map(function(v){return Circus.UNDEFINED}).map(function(v){}).value(1) === undefined
	})

	test('map - Circus.fail aborts propagation',function() {
		var s = signal.map(function(v){return Circus.fail()}).map(inc)
		s.value(1)
		return s.value() === 1
	})

	test('map - signal',function() {
		var b = new Signal().map(inc)
		return signal.map(b).value(1) === 2 && b.value()===2
	})

	test('map - signal flow',function() {
		var b = new Signal().map(inc)
		return signal.map(dbl).map(b).map(mul3).value(1) === 9 && b.value()===3
	})

	test('map - signal flow inline merge',function() {
		var b = new Signal().map(inc)
		var s = signal.map(dbl).map(b).map(mul3)
		return b.value(1) === 2 && s.value()===6
	})

	test('map - async',function(done) {
		var r = 0
		function async(v,next) {
			setTimeout(function(){
				next(v+1)
			})
		}
		signal.map(Circus.async(async)).tap(function(v){done(v===2)}).value(1)
	})

	// test('map - async signal ',function(done) {
	// 	var r = 0
	// 	var async = signal.map(function(v,next) {
	// 		setTimeout(function(){
	// 			next(v+1)
	// 		})
	// 	})
	// 	// what does async signal mean??
	// 	var s = new Signal().map(Circus.async(async)).tap(function(v){
	// 		done(v===2)
	// 	})
	// 	s.value(1)
	// })

	test('map - async fail',function(done) {
		var r = 0
		function async(v,next) {
			setTimeout(function(){
				next(Circus.fail())
			})
		}
		signal.map(Circus.async(async)).finally(function(v, f){
			done(f instanceof Circus.fail)
		}).value(1)
	})

    test('flow',function() {
        var e,s = signal
        .flow(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.value(0)
        return e === 4
    })

	test('flow - signals',function() {
		var s1 = new Signal().map(inc)
		var s2 = new Signal().map(inc)
		return new Signal().flow(s1,s2).value(1) === 3
	})

    test('bind - pre',function() {
        var e,s = signal.map(inc).tap(function(v){
            e = v
        })
        s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 3
    })

    test('bind',function() {
        var s = signal.map(inc).map(dbl)
        var e = s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 6
    })

    test('bind - no functors',function() {
        var e = signal.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 0
    })

    test('bind - includes taps',function() {
        var e,s = signal.map(inc).map(dbl).tap(function(v){
            e = v
        })
        s.bind(function(f,args){return f(args[0]+1)}).value(0)
        return e === 7
    })

    test('bind - composed',function() {
    	var b = function(f,args){return f(args[0]+1)}
        var e = signal.map(inc).bind(b).bind(b).value(0)
        return e === 3
    })

	test('prime', function() {
		return signal.map(inc).prime(1).value() === 1
	})

	test('channel - halted propagation', function() {
		var r,s = signal.map(function(){return Circus.FALSE}).channel(function(){r=true})
		s.value(1)
		return !r
	})

	test('finally', function() {
		var r,s = signal.finally(function(v){r=v})
		s.value(1)
		return r===1
	})

	test('finally - fifo', function() {
		var r = [], s = signal
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.value(1)
		return r[0] === 1 && r[1] === 2
	})

	test('finally - filo', function() {
		var r = [], s = signal
		s.finally(Circus.before(function(v){r.push(1)}))
		s.finally(Circus.before(function(v){r.push(2)}))
		s.value(1)
		return r[0] === 2 && r[1] === 1
	})

	test('finally - halted propagation', function() {
		var r,s = signal.map(inc).map(function(){return undefined}).finally(function(v){r=v})
		s.value(1)
		return r===undefined && s.value()===2
	})

	test('finally - aborted propagation', function() {
		var r1,r2,s = signal.map(function(){return Circus.fail()}).map(inc).finally(function(v,f){r1=v, r2=f})
		s.value(1)
		return r1 === 1 && r2 instanceof Circus.fail
	})

	test ('channel', function(){
		var s = signal.map(inc)
		var a = s.channel().map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

	test ('channel - after', function(){
		var s = signal.map(inc)
		var a = s.channel(Circus.after).map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

	test ('channel - after, take steps', function(){
		var s = signal.map(inc)
		var a = s.channel(Circus.after, true).map(dbl)
		s.map(mul3).value(1)

		// in: 1 -> mul3 -> out: inc -> dbl
		return s.value()===8
	})

	test ('channel -after, shared state', function(){
		var s = signal.map(inc)
		var a = s.channel().map(dbl)
		a.value(1)

		return s.value()===4 && a.value()===4
	})

	test ('channel - before', function(){
		var s = signal.map(inc)
		var b = s.channel(Circus.before).map(dbl)
		s.map(mul3).value(1)

		return s.value()===9
	})

	test ('channel - before, take steps', function(){
		var s = signal.map(inc)
		var b = s.channel(Circus.before,true).map(dbl)
		s.map(mul3).value(1)

		return s.value()===12
	})

})
