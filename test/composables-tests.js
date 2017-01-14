import Circuit from '../src'
import Composables from '../src/composables'
import Utils from '../src/utils'

runTests('composables', function(mock) {

    function inc(v) {return v+1}
    function dbl(v) {return v+v}

    var app
    setup(function(){
        app = new Circuit().extend(Composables)
    })

    test('always',function() {
        var s = app.channel()
        var r = s.always(123)
        s.signal('xyz')
        return r.value() === 123
    })

    test('batch', function() {
        var s = app.channel().batch(2).tap(function(v){
            r.push(v)
        })
        var r=[]
        for (var i=0; i<4; i++) s.signal(i)
        return Utils.deepEqual(r, [[0,1],[2,3]])
    })

    test('compose',function() {
        var e,s = app.channel()
        .compose(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.signal(1)
        return e === 5
    })


    test('pipe',function() {
        var e,s = app.channel()
        .pipe(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.signal(1)
        return e === 8
    })

    test('pipe - signals',function() {
        var s1 = app.channel().map(inc)
        var s2 = app.channel().map(inc)
        var p = app.channel().pipe(s1,s2)
        p.signal(1)
        return p.value() === 3
    })

    test('flatten', function(){
        var s = app.channel().flatten().keep()
        s.signal([1,2])
        s.signal([3,[4,5]])
        s.signal(6)
        return Utils.deepEqual(s.keep.value(), [1,2,3,4,5,6])
    })

    test('flatten - flatmap', function(){
        var s = app.channel().flatten(function(v){
            return v+1
        }).keep()
        s.signal([1,2])
        s.signal(3)
        return Utils.deepEqual(s.keep.value(), [2,3,4])
    })

    test('pluck - 1 key', function() {
        var s = app.channel().pluck('b')
        s.signal({a:1,b:2,c:3})
        return s.value() === 2
    })

    test('pluck - more than one key', function() {
        var s = app.channel().pluck('a','b')
        s.signal({a:1,b:2,c:3})
        return Utils.deepEqual(s.value(), [1,2])
    })

    test('pluck - deep', function() {
        var s = app.channel().pluck('a.a1','b.b1[1]')
        s.signal({a:{a1:1},b:{b1:[2,3]}})
        return Utils.deepEqual(s.value(), [1,3])
    })

    test('project', function() {
        var s = app.channel().project({x:'a.a1',y:'b.b1[1]'})
        s.signal({a:{a1:1},b:{b1:[2,3]}})
        return Utils.deepEqual(s.value(), {x:1,y:3})
    })

    test('keep - depth', function() {
        var s = app.channel().keep(2)
        s.signal(1)
        s.signal(2)
        s.signal(3)
        var v = s.keep.value()
        return Utils.deepEqual(v, [2,3])
    })

    test('history - keep', function() {
        var s = app.channel().keep()
        s.signal(1)
        s.signal(2)
        s.signal(3)
        return Utils.deepEqual(s.keep.value(),[1,2,3])
    })

    test('skip', function() {
        var r,s = app.channel().skip(2).map(inc).tap(function(v){r=r||v})
        for (var i=0; i<5; i++) s.signal(i)
        return r === 3
    })

    test('take',function() {
        var r,s = app.channel().take(2).map(inc).tap(function(v){r=v})
        for (var i=0; i<5; i++) s.signal(i)
        return r === 2
    })

    test('window', function() {
        var s = app.channel().window(2)
        for (var i=0; i<4; i++) s.signal(i)
        return Utils.deepEqual(s.value(),[2,3])
    })

    test('zip - arrays', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        app.join({s1,s2}).zip().tap(function(v){r.push(v)})
        var a = [1,2,3],b = [4,5,6], r = []
        a.map(function(_,i){
            s1.signal(a[i])
            s2.signal(b[i])
        })
        return Utils.deepEqual(r, [[1,4],[2,5],[3,6]])
    })

})
