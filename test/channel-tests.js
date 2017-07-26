import Channel from '../src/channel'
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

runTests('channel', function(mock) {

    var channel
    setup(function(){
        channel = new Channel()
    })

    test('new channel', function(){
        return channel.signal
    })

    test('new channel - from channel', function(){
        return channel.channel().signal
    })

    test('as channel', function(){
        var s = channel.asSignal()
        return s.signal
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

    test('signal - propagate',function() {
        var r, s = channel.tap(function(){r=true})
        s.signal(1)
        return r
    })

    test('signal - dont propagate ',function() {
        var r, s = channel.tap(function(){r=true})
        s.signal()
        return !r
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

    test('feed - empty signal', function() {
        var r, s2 = channel.channel().feed(function() {r=true})
        s2.signal()
        return r
    })

    test('feed - empty signal, state value', function() {
        var r, s2 = channel.channel().prime(1).feed(function(v) {r=v})
        s2.signal()
        return r === 1
    })

    test('feed - empty signal, nested signal', function() {
        var r, s1 = channel.prime(1).feed(function(v) {r=v})
        var s2 = channel.channel().map(s1)
        s2.signal()
        return r === 1
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

    test('fail',function() {
        var r
        channel.fail(function(v){r = v}).bind(function(ctx){return function(){return ctx.fail()}}).signal('x')
        return r
    })

    test('fail - message', function() {
        var r
        channel.fail(function(v){r = v}).bind(function(ctx){return function(){return ctx.fail(123)}}).signal('x')
        return r === 123
    })

    test('fail - fifo', function() {
        var r = [], s = channel.bind(function(ctx){return function(){return ctx.fail()}})
        s.fail(function(v){r.push(2)})
        s.fail(function(v){r.push(1)})
        s.signal('x')
        return r[0] === 2 && r[1] === 1
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
        s.signal(1)
        s.signal(1)
        return r=== 2
    })

    test('import', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        channel.import(ext).ext().signal(1)
        return r === 1
    })

    test('import - inheritance', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        channel.import(ext)
        channel.channel().channel().ext().signal(1)
        return r === 1
    })

    test('import - isolated inheritance', function(){
        var r, ext = function(sig) {
            return {
                ext: function() {
                    return sig.map(function(v) {r = v})
                }
            }
        }
        var s1 = channel.channel().import(ext)
        var s2 = channel.channel()
        s1.ext().signal(1)
        return s2.ext === undefined && r === 1
    })

    test('import - override', function(){
        var r, ext = function(sig) {
            var _prime = sig.prime.bind(sig)
            return {
                prime: function(v) {
                    return _prime(v + 1)
                }
            }
        }
        return channel.import(ext).prime(1).value() === 2
    })

    test('import - deep inherit override', function(){
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
        return channel.import(ext1).channel().import(ext2).prime(1).value() === 4
    })
})
