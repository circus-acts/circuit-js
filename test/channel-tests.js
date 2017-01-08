import Channel, {halt, fail} from '../src/channel'
import Utils from '../src/utils'

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
//  var thenR, thenF,
//      resolve = function(v) {thenR(v)},
//      reject = function(v) {thenF(v)}
//  cb(resolve,reject)
//  return {
//      then: function(r,f) {thenR=r,thenF=f}
//  }
// }

runTests('channel', function(mock) {

    var channel
    setup(function(){
        channel = new Channel()
    })

    test('new channel', function(){
        return channel.isSignal
    })

    test('new channel - from channel', function(){
        return channel.channel().isSignal
    })

    test('new channel - from name', function(){
        var s = channel.channel('xxx')
        return s.name() === 'xxx'
    })

    test('as channel', function(){
        var s = channel.asSignal()
        return s.isSignal
    })

    test('as channel - from this', function(){
        var s1 = channel
        var s2 = s1.asSignal(s1)
        return s1 === s2
    })

    test('as channel - from map', function(){
        var s = channel.asSignal(inc)
        s.signal(1)
        return s.value() === 2
    })

    test('clone', function(){
        var c = channel.map(inc).clone()
        c.signal(1)
        return c.value() === 2
    })

    test('signal ',function() {
        var s = channel
        s.signal(2)
        return s.value() === 2
    })

    test('signal - arity',function() {
        var s = channel, r
        s.tap(function(x,y,z){
            r = x===1 && y===2 && z===3
        }).signal(1,2,3)
        return r
    })

    test('signal - args',function() {
        var a,s = channel.tap(function(){a=arguments})
        s.signal(1,2,3)
        return a.length===3
    })

    test('signal - undefined',function() {
        var s = channel
        s.signal(undefined)
        return s.value() === undefined
    })

    test('signal - impure',function() {
        var r=0, s = channel.tap(function(){r++})
        s.signal(1)
        s.signal(1)
        return r===2
    })

    test('signal - natural bind',function() {
        var bv = channel.signal
        bv(2)
        return channel.value()===2
    })

    test('feed', function() {
        var s1 = channel.map(inc)
        var s2 = channel.channel().feed(s1)
        s2.signal(2)
        return s1.value() === 3
    })

    test('halt',function() {
        var s = channel.map(function(v){return halt()}).map(inc)
        s.signal(1)
        return s.value() === undefined
    })

    test('halt - at value',function() {
        var s = channel.map(function(v){return halt(123)}).map(inc)
        s.signal(1)
        return s.value() === 123
    })

    test('fail',function() {
        var s = channel.map(function(v){return fail()}).map(inc)
        s.signal(1)
        return s.value() === undefined
    })

    test('halt - next',function(done) {
        function async(v) {
            return halt(function(next) {
                setTimeout(function(){
                    next(v+1)
                })
            })
        }
        channel.map(async).tap(function(v){done(v===2)}).signal(1)
    })

    test('halt - next flow',function(done) {
        function async(v) {
            return halt(function(next) {
                setTimeout(function(){
                    next(v+1)
                })
            })
        }
        channel.map(inc).map(async).map(async).tap(function(v){done(v===4)}).signal(1)
    })

    test('halt - next fail',function(done) {
        function async(v) {
            return halt(function(next) {
                setTimeout(() => next(fail()))
            })
        }
        channel.map(async).fail(function(f){
            done(true)
        }).signal(1)
    })

    test('signal - fail', function() {
        var s1 = channel.map(inc)
        var s2 = channel.channel().feed(s1)
        s2.signal(2)
        return s1.value() === 3
    })

    test('tap',function() {
        var e = 'xyz'
        var s = channel.tap(function(v){
            e=v
        })
        s.signal(123)
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
        var s = channel.map(inc).tap(t1).map(inc).tap(t2)
        s.signal(e)
        return e1 === 1 && e2 === 2
    })

    test('map',function() {
        var s = channel.map(dbl)
        s.signal(1)
        return s.value() === 2
    })

    test('map - signal',function() {
        var b = new Channel().map(inc)
        channel.map(b).signal(1)
        return channel.value() === 2
    })

    test('map - signal flow',function() {
        var a = new Channel().map(inc)
        var b = new Channel().map(dbl)
        channel.map(a).map(b).map(mul3).signal(1)
        return channel.value() === 12
    })


    test('map - promise',function(done) {
        function async(v) {
            return halt(new Promise(function(resolve){
                setTimeout(function(){
                    resolve(v+1)
                })
            }))
        }
        var s = channel.map(async).tap(function(v){
            done(v===2)
        })
        s.signal(1)
    })

    test('map - promise reject',function(done) {
        function async(v) {
            return halt(new Promise(function(_, reject){
                setTimeout(function(){
                    reject('error')
                })
            }))
        }
        var s = channel.map(async).fail(function(f){
            done(true)
        })
        s.signal(1)
    })

    test('filter', function(){
        var r=0, s = channel.filter(function(v){
            return v % 2
        }).tap(function(){r++})
        for (var i=0; i<4; i++) s.signal(i)
        return r === 2
    })

    test('fold', function() {
        var e = 'xyz'
        var s = channel.fold(function(a, v){
            return a+v
        },6).tap(function(v){
            e = v
        })
        s.signal(1)
        s.signal(2)
        s.signal(3)
        return e === 12
    })

    test('pulse', function() {
        var e, s = channel.pulse().tap(function(v){
            e = v
        })
        s.signal(1)
        return e === 1 && s.value() === undefined
    })

    test('pulse - reset', function() {
        var e, s = channel.pulse('x').tap(function(v){
            e = v
        })
        s.signal(1)
        return e === 1 && s.value() === 'x'
    })

    test('set state', function() {
        var s = channel.map(inc).setState({$value: 1})
        return s.value() === 1
    })

    test('prime', function() {
        var s = channel.map(inc).prime(1)
        return s.value() === 1
    })

    test('fail - message', function() {
        var r
        channel.fail(function(v){r = v}).map(function(){return fail(123)}).signal('x')
        return r.message === 123
    })

    test('fail - fifo', function() {
        var r = [], s = channel.map(function(){return fail()})
        s.fail(function(v){r.push(2)})
        s.fail(function(v){r.push(1)})
        s.signal('x')
        return r[0] === 2 && r[1] === 1
    })

    test('propagation order', function(){
        var a=new Channel().map(seq(1))
        var b=new Channel().map(seq(2))
        var c=new Channel().map(seq(3))

        var s1=new Channel().map(a).map(b).map(c)
        s1.signal([])

        var s2=new Channel().map(a.clone().map(b.clone().map(c.clone())))
        s2.signal([])

        return s1.value().toString() === s2.value().toString()
    })

    test('getState', function() {
        var s = channel.prime(123).getState()
        return Utils.deepEqual(s, channel.$state)
    })

    test('bind', function(){
        var r, b = function() {
            return function(v) {
                r = v
            }
        }
        channel.bind(b).signal(1)
        return r === 1
    })

    test('bind - block return ', function(){
        var b = function() {
            return function() {return 123}
        }
        return channel.bind(b).signal(1) === undefined
    })

    test('bind - context', function(){
        var r, b = function(ctx) {
            ctx.x = 0
            return function(v) {
                return ctx.next(++ctx.x)
            }
        }
        var s = channel.bind(b).tap(v => r=v)
        s.signal()
        s.signal()
        return r=== 2
    })

    test('extend', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        channel.extend(ext).ext().signal(1)
        return r === 1
    })

    test('extend - inheritance', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        channel.extend(ext)
        channel.channel().channel().ext().signal(1)
        return r === 1
    })

    test('extend - isolated inheritance', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        var s1 = channel.channel().extend(ext)
        var s2 = channel.channel()
        s1.ext().signal(1)
        return s2.ext === undefined && r === 1
    })

    test('extend - override', function(){
        var r, ext = function(sig) {
            var _prime = sig.prime.bind(sig)
            return {
                prime: function(v) {
                    return _prime(v + 1)
                }
            }
        }
        return channel.extend(ext).prime(1).value() === 2
    })

    test('extend - deep inherit override', function(){
        var ext1 = function(sig) {
            var _prime = sig.prime.bind(sig)
            return {
                prime: function(v) {
                    return _prime(v + 1)
                }
            }
        }
        var ext2 = function(sig) {
            var _prime = sig.prime.bind(sig)
            return {
                prime: function(v) {
                    return _prime(v + 2)
                }
            }
        }
        return channel.extend(ext1).channel().extend(ext2).prime(1).value() === 4
    })
})
