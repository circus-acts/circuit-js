import Circus from '../src'
import {Signal} from '../src/signal'

var inc = function(v){return v+1}
var dbl = function(v){return v+v}
var mul3 = function(v){return v*3}
var noop = function(){}
var seq = function(s){
	return function(steps){
		return [].concat(steps,s)
	}
}

var Promise = function(cb){
	var thenR, thenF,
		resolve = function(v) {thenR(v)},
		reject = function(v) {thenF(v)}
	cb(resolve,reject)
	return {
		then: function(r,f) {thenR=r,thenF=f}
	}
}

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
        var r = signal.asSignal(inc).input(1).value()
        return r === 2
    })

	test('input ',function() {
		return signal.input(2).value() === 2
	})

	test('input - undefined',function() {
		return signal.input(undefined).value() === undefined
	})

	test('input - pure',function() {
		var r=0, s = signal.diff().tap(function(){r++})
		s.input(1)
		s.input(1)
		return r===1
	})

	test('input - pure after fail',function() {
		var fail = function(v) {
			return v===1? v : Circus.fail()
		}
		var r=0, s = signal.diff().map(fail).tap(function(){r++})
		s.input(1)
		s.input(2)
		s.input(1)
		return r===1
	})

	test('input - impure',function() {
		var r=0, s = signal.tap(function(){r++})
		s.input(1)
		s.input(1)
		return r===2
	})

	test('set input ',function() {
		var s = signal
		s.input(1)
		s.input(2)
		s.input(3)
		return s.value() === 3
	})

	test('input - natural bind',function() {
		var bv = signal.input
		bv(2)
		return signal.value()===2
	})

	test('tap',function() {
		var e = 'xyz'
		var s = signal.tap(function(v){
			e=v
		})
		s.input(123)
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
		s.input(e)
		return e1 === 1 && e2 === 2
	})

	test('map',function() {
		return signal.map(dbl).input(1).value() === 2
	})

	test('map - undefined halts propagation',function() {
		var s = signal.map(function(v){return undefined}).map(inc)
		s.input(1)
		return s.value() === undefined
	})

	test('map - Circus.UNDEFINED continues propagation',function() {
		var r = 1
		return signal.map(function(v){return Circus.UNDEFINED}).map(function(v){return 'abc'}).input(1).value() === 'abc'
	})

	test('map - Circus.fail aborts propagation',function() {
		var s = signal.map(function(v){return Circus.fail()}).map(inc)
		return s.input(1).value() === undefined
	})

	test('map - signal',function() {
		var b = new Signal().map(inc)
		signal.map(b).input(1)
		return  signal.value() === 2
	})

	test('map - signal flow',function() {
		var a = new Signal().map(inc)
		var b = new Signal().map(dbl)
		signal.map(a).map(b).map(mul3).input(1)
		return signal.value() === 12
	})

	test('map - async',function(done) {
		function async(v) {
			return function(next) {
				setTimeout(function(){
					next(v+1)
				})
			}
		}
		signal.map(async).tap(function(v){done(v===2)}).input(1)
	})

	test('map - async fail',function(done) {
		function async(v) {
			return function(next) {
				setTimeout(function(){
					next(Circus.fail())
				})
			}
		}
		signal.map(async).fail(function(f){
			done(true)
		}).input(1)
	})

	test('map - promise',function(done) {
		function async(v) {
			return new Promise(function(resolve){
				setTimeout(function(){
					resolve(v+1)
				})
			})
		}
		var s = signal.map(async).tap(function(v){
			done(v===2)
		})
		s.input(1)
	})

	test('map - promise reject',function(done) {
		function async(v) {
			return new Promise(function(_, reject){
				setTimeout(function(){
					reject('error')
				})
			})
		}
		var s = signal.map(async).fail(function(f){
			done(true)
		})
		s.input(1)
	})

    test('pipe',function() {
        var e,s = signal
        .pipe(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.input(0)
        return e === 4
    })

	test('pipe - signals',function() {
		var s1 = new Signal().map(inc)
		var s2 = new Signal().map(inc)
		return new Signal().pipe(s1,s2).input(1).value() === 3
	})

    test('bind',function() {
        var s = signal.map(inc).map(dbl)
        s.bind(function(next,v){return next(v+1)})
        return s.input(0).value() === 4
    })

    test('bind - composed',function() {
    	var b = function(next,v){return next(v+1)}
        var e = signal.map(inc).bind(b).bind(b).input(0).value()
        return e === 3
    })

	test('prime', function() {
		return signal.map(inc).prime(1).value() === 1
	})

	test('finally', function() {
		var r,s = signal.finally(function(v){r=v})
		s.input(1)
		return r===1
	})

	test('finally - fifo', function() {
		var r = [], s = signal
		s.finally(function(v){r.push(1)})
		s.finally(function(v){r.push(2)})
		s.input(1)
		return r[0] === 1 && r[1] === 2
	})

	test('finally - halted propagation', function() {
		var r,s = signal.map(inc).map(function(){return undefined}).finally(function(v){r=v})
		s.input(1)
		return r===undefined && s.value()===undefined
	})

	test('finally - aborted propagation', function() {
		var r1,r2,s = signal.map(function(){return Circus.fail()}).map(inc).finally(function(v){r1=v})
		s.input(1)
		return r1 === 1
	})

	test('fail', function() {
		var r = [], s = signal
		s.finally(function(v){r.push(2)})
		s.fail(function(v){r.push(1)})
		s.input(Circus.fail())
		return r[0] === 1 && r[1] === 2
	})

	test('fail - fifo', function() {
		var r = [], s = signal
		s.fail(function(v){r.push(2)})
		s.fail(function(v){r.push(1)})
		s.input(Circus.fail())
		return r[0] === 2 && r[1] === 1
	})

	test('propagation order', function(){
		var a=new Signal('a').map(seq(1))
		var b=new Signal('b').map(seq(2))
		var c=new Signal('c').map(seq(3))
		var s1=new Signal().map(a).map(b).map(c).input([]).value().toString()
		var s2=new Signal().map(a.clone().map(b.clone().map(c.clone()))).input([]).value().toString()

		return s1 === s2
	})

})
