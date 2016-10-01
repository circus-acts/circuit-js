import Circus from '../src'
import Signal from '../src/signal'

var inc = function(v){return v+1}
var dbl = function(v){return v+v}
var mul3 = function(v){return v*3}
var noop = function(){}
var seq = function(s){
	return function(steps){
		return [].concat(steps,s)
	}
}

// var Promise = function(cb){
// 	var thenR, thenF,
// 		resolve = function(v) {thenR(v)},
// 		reject = function(v) {thenF(v)}
// 	cb(resolve,reject)
// 	return {
// 		then: function(r,f) {thenR=r,thenF=f}
// 	}
// }

runTests('signal', function(mock) {

	var signal
	setup(function(){
		signal = new Signal()
	})

    test('new signal', function(){
        return signal.isSignal
    })

    test('new signal - from signal', function(){
        return signal.signal().isSignal
    })

    test('as signal', function(){
        var s = signal.asSignal()
        return s.isSignal
    })

    test('as signal - from this', function(){
        var s1 = signal
        var s2 = s1.asSignal(s1)
        return s1 === s2
    })

    test('as signal - from map', function(){
        var s = signal.asSignal(inc)
        s.input(1)
        return s.value() === 2
    })

    test('clone', function(){
    	var c = signal.map(inc).clone()
    	c.input(1)
    	return c.value() === 2
    })

	test('input ',function() {
		var s = signal
		s.input(2)
		return s.value() === 2
	})

	test('input - arity',function() {
		var s = signal
		s.input(1,2,3)
		return s.value() === 1
	})

	test('input - args',function() {
		var a,s = signal.tap(function(){a=arguments})
		s.input(1,2,3)
		return a.length===3
	})

	test('input - undefined',function() {
		var s = signal
		s.input(undefined)
		return s.value() === undefined
	})

	test('input - impure',function() {
		var r=0, s = signal.tap(function(){r++})
		s.input(1)
		s.input(1)
		return r===2
	})

	test('input - natural bind',function() {
		var bv = signal.input
		bv(2)
		return signal.value()===2
	})

    test('feed', function() {
        var s1 = signal.map(inc)
        var s2 = signal.signal().feed(s1)
        s2.input(2)
        return s1.value() === 3
    })

	test('halt',function() {
		var s = signal.map(function(v){return this.halt()}).map(inc)
		s.input(1)
		return s.value() === undefined
	})

	test('halt - at value',function() {
		var s = signal.map(function(v){return this.halt(123)}).map(inc)
		s.input(1)
		return s.value() === 123
	})

	test('fail',function() {
		var s = signal.map(function(v){return this.fail()}).map(inc)
		s.input(1)
		return s.value() === undefined
	})

	test('halt - next',function(done) {
		function async(v) {
			return this.halt(function(next) {
				setTimeout(function(){
					next(v+1)
				})
			})
		}
		signal.map(async).tap(function(v){done(v===2)}).input(1)
	})

	test('halt - next fail',function(done) {
		function async(v) {
			var fail = this.fail()
			return this.halt(function(next) {
				setTimeout(() => next(fail))
			})
		}
		signal.map(async).fail(function(f){
			done(true)
		}).input(1)
	})

    test('input - fail', function() {
        var s1 = signal.map(inc)
        var s2 = signal.signal().feed(s1)
        s2.input(2)
        return s1.value() === 3
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
		var s = signal.map(dbl)
		s.input(1)
		return s.value() === 2
	})

	test('map - signal',function() {
		var b = new Signal().map(inc)
		signal.map(b).input(1)
		return signal.value() === 2
	})

	test('map - signal flow',function() {
		var a = new Signal().map(inc)
		var b = new Signal().map(dbl)
		signal.map(a).map(b).map(mul3).input(1)
		return signal.value() === 12
	})


	test('map - promise',function(done) {
		function async(v) {
			return this.halt(new Promise(function(resolve){
				setTimeout(function(){
					resolve(v+1)
				})
			}))
		}
		var s = signal.map(async).tap(function(v){
			done(v===2)
		})
		s.input(1)
	})

	test('map - promise reject',function(done) {
		function async(v) {
			return this.halt(new Promise(function(_, reject){
				setTimeout(function(){
					reject('error')
				})
			}))
		}
		var s = signal.map(async).fail(function(f){
			done(true)
		})
		s.input(1)
	})
    test('filter', function(){
        var r=0, s = signal.filter(function(v){
            return v % 2
        }).tap(function(){r++})
        for (var i=0; i<4; i++) s.input(i)
        return r === 2
    })

    test('bind',function() {
        var s = signal.map(inc).map(dbl)
        s.bind(function(next,v){return next(v+1)}).input(0)
        return s.value() === 4
    })

    test('bind - halt',function() {
        var s = signal.map(inc)
        s.bind(function(next,v){}).input(0)
        return s.value() === undefined
    })

    test('bind - composed',function() {
    	var b = function(next,v){return next(v+1)}
        var e = signal.map(inc).bind(b).bind(b)
        e.input(0)
        return e.value() === 3
    })

    test('bind - arity',function() {
    	var r
    	var b = function(next,v){return next(v,'abc')}
        var e = signal.bind(b).tap(function(v1, v2) {r = v2})
        e.input(1)
        return r === 'abc'
    })

	test('prime', function() {
		var s = signal.map(inc).prime(1)
		return s.value() === 1
	})

	test('fail - message', function() {
		var r
		signal.fail(function(v){r = v}).map(function(){return this.fail(123)}).input('x')
		return r.message === 123
	})

	test('fail - fifo', function() {
		var r = [], s = signal.map(function(){return this.fail()})
		s.fail(function(v){r.push(2)})
		s.fail(function(v){r.push(1)})
		s.input('x')
		return r[0] === 2 && r[1] === 1
	})

	test('propagation order', function(){
		var a=new Signal('a').map(seq(1))
		var b=new Signal('b').map(seq(2))
		var c=new Signal('c').map(seq(3))

		var s1=new Signal().map(a).map(b).map(c)
		s1.input([])

		var s2=new Signal().map(a.clone().map(b.clone().map(c.clone())))
		s2.input([])

		return s1.value().toString() === s2.value().toString()
	})

	test('extend', function(){
		var r, ext = function() {return this.map(function(v) {r=v})}
		signal.extend({ext: ext}).ext().input(1)
		return r === 1
	})

	test('extend - inheritance', function(){
		var r, ext = function() {return this.map(function(v) {r=v})}
		signal.extend({ext: ext})
		signal.signal().signal().ext().input(1)
		return r === 1
	})

	test('extend - isolated inheritance', function(){
		var r, ext = function() {return this.map(function(v) {r=v})}
		var s1 = signal.signal().extend({ext: ext})
		var s2 = signal.signal()
		s1.ext().input(1)
		return s2.ext === undefined && r === 1
	})

	test('extend - override', function(){
		var r, ext = function(_this) {
			var _prime = _this.prime.bind(_this)
			return {
				prime: function(v) {
					return _prime(v + 1)
				}
			}
		}
		return signal.extend(ext).prime(1).value() === 2
	})

	test('extend - deep inherit override', function(){
		var ext1 = function(_this) {
			var _prime = _this.prime.bind(_this)
			return {
				prime: function(v) {
					return _prime(v + 1)
				}
			}
		}
		var ext2 = function(_this) {
			var _prime = _this.prime.bind(_this)
			return {
				prime: function(v) {
					return _prime(v + 2)
				}
			}
		}
		return signal.extend(ext1).signal().extend(ext2).signal().prime(1).value() === 4
	})
})
