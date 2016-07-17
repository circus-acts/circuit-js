import Circus from '../src'
import Composables from '../src/composables'
import Utils from '../src/utils'

runTests('composables', function(mock) {

    function inc(v) {return v+1}
    function dbl(v) {return v+v}

    var app = new Circus(Composables)

    test('always',function() {
        var s = app.signal()
        var r = s.always(123)
        s.value('xyz')
        return r.value() === 123
    })

    test('batch', function() {
        var s = app.signal().batch(2).tap(function(v){
            r.push(v)
        })
        var r=[]
        for (var i=0; i<4; i++) s.value(i)
        return Utils.deepEqual(r, [[0,1],[2,3]])
    })

    test('compose',function() {
        var e,s = app.signal()
        .compose(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.value(1)
        return e === 5
    })

    test('feed', function() {
        var s1 = app.signal().map(inc)
        var s2 = app.signal().feed(s1).map(inc)
        s2.value(2)
        return s1.value() === 3 & s2.value() === 2
    })

    test('feed - fanout', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var s3 = app.signal().feed(s1,s2)
        s3.value(3)
        return s1.value() === 3 && s2.value() === 3
    })

    test('filter', function(){
        var s = app.signal().filter(function(v){
            return v % 2
        }).keep()
        for (var i=0; i<4; i++) s.value(i)
        return s.toArray().toString() === '1,3'
    })

    test('flatten', function(){
        var s = app.signal().flatten().keep()
        s.value([1,2])
        s.value([3,[4,5]])
        s.value(6)
        return Utils.deepEqual(s.toArray(), [1,2,3,4,5,6])
    })

    test('flatten - flatmap', function(){
        var s = app.signal().flatten(function(v){
            return v+1
        }).keep()
        s.value([1,2])
        s.value(3)
        return Utils.deepEqual(s.toArray(), [2,3,4])
    })

    test('maybe', function(){
        var value = app.signal().maybe(function(v){
            return true
        }).value(123)
        return value.just === 123
    })

    test('maybe - nothing', function(){
        var value = app.signal().maybe(function(v){
            return false
        }).value(123);
        return value.nothing
    })

    test('pluck - 1 key', function() {
        var s = app.signal().pluck('b')
        return s.value({a:1,b:2,c:3}) === 2
    })

    test('pluck - more than one key', function() {
        var s = app.signal().pluck('a','b')
        return Utils.deepEqual(s.value({a:1,b:2,c:3}), [1,2])
    })

    test('pluck - deep', function() {
        var s = app.signal().pluck('a.a1','b.b1[1]')
        return Utils.deepEqual(s.value({a:{a1:1},b:{b1:[2,3]}}), [1,3])
    })

    test('project', function() {
        var s = app.signal().project({a:'a.a1',b:'b.b1[1]'})
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Utils.deepEqual(s.value(), {a:1,b:3})
    })

    test('fold', function() {
        var e = 'xyz'
        var s = app.signal()
        .fold(function(a,v){
            return a+v
        }).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(2)
        s.value(3)
        return e === 6
    })

    test('fold - accum', function() {
        var e = 'xyz'
        var s = app.signal()
        .fold(function(a,v){
            return a+v
        },6).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(2)
        s.value(3)
        return e === 12
    })

    test('keep - depth', function() {
        var s = app.signal().keep(2)
        s.value(1)
        s.value(2)
        s.value(3)
        var v = s.toArray()
        return Utils.deepEqual(v, [2,3])
    })

    test('history - keep', function() {
        var s = app.signal().keep()
        s.value(1)
        s.value(2)
        s.value(3)
        return Utils.deepEqual(s.toArray(),[1,2,3])
    })

    test('skip', function() {
        var r,s = app.signal().skip(2).map(inc).tap(function(v){r=r||v})
        for (var i=0; i<5; i++) s.value(i)
        return r === 3
    })

    test('take',function() {
        var r,s = app.signal().take(2).map(inc).tap(function(v){r=v})
        for (var i=0; i<5; i++) s.value(i)
        return r === 2
    })

    test('window', function() {
        var s = app.signal().window(2)
        for (var i=0; i<4; i++) s.value(i)
        return Utils.deepEqual(s.value(),[2,3])
    })

    test('zip - arrays', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        app.join(s1,s2).zip().tap(function(v){r.push(v)})
        var a = [1,2,3],b = [4,5,6], r = []
        a.map(function(_,i){
            s1.value(a[i])
            s2.value(b[i])
        })
        return Utils.deepEqual(r, [[1,4],[2,5],[3,6]])
    })

})
