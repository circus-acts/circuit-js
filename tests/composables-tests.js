runTests('composables', function(mock) {

    function inc(v) {return v+1}
    function dbl(v) {return v+v}

    var app = new Circuit()

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
        return r.length === 2 &&
                r[0].toString() === '0,1' &&
                r[1].toString() === '2,3'
    })

    test('compact', function() {
        var s = app.signal().keep().compact()
        s.value(1)
        s.value(undefined)
        s.value('')
        s.value(0)
        s.value(3)
        return s.toArray().toString() === '1,,0,3'
    })

    test('compose',function() {
        var e,s = app.signal()
        .compose(inc,dbl,dbl).tap(function(v){
            e = v
        })
        s.value(1)
        return e === 5
    })

    test('filter', function(){
        var s = app.signal().keep().filter(function(v){
            return v % 2
        })
        for (var i=0; i<4; i++) s.value(i)
        return s.toArray().toString() === '1,3'
    })

    test('flatten', function(){
        var s = app.signal().keep().flatten()
        s.value([1,2])
        s.value([3,[4,5]])
        s.value(6)
        return s.toArray().toString() === '1,2,3,4,5,6'
    })

    test('flatten - flatmap', function(){
        var s = app.signal().keep().flatten(function(v){
            return v+1
        })
        s.value([1,2])
        s.value(3)
        return s.toArray().toString() === '2,3,4'
    })

    test('maybe', function(){
        var value = app.signal().maybe(function(v){
            return true
        },'nothing').value(123)
        return value.just === 123
    })

    test('maybe - nothing', function(){
        var value = app.signal().maybe(function(v){
            return false
        },'nothing').value(123);
        return value.nothing === 'nothing'
    })

    test('pluck', function() {
        var s = app.signal().pluck('a','b')
        s.value({a:1,b:2,c:3})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===2
    })

    test('pluck - deep', function() {
        var s = app.signal().pluck('a.a1','b.b1[1]')
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a.a1,b.b1[1]' &&
                s.value()['a.a1']===1 &&
                s.value()['b.b1[1]']===3
    })

    test('project', function() {
        var s = app.signal().project({a:'a.a1',b:'b.b1[1]'})
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===3
    })

    test('reduce', function() {
        var e = 'xyz'
        var s = app.signal()
        .reduce(function(a,v){
            return a+v
        }).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(2)
        s.value(3)
        return e === 6
    })

    test('reduce - accum', function() {
        var e = 'xyz'
        var s = app.signal()
        .reduce(function(a,v){
            return a+v
        },6).tap(function(v){
            e = v
        })
        s.value(1)
        s.value(2)
        s.value(3)
        return e === 12
    })

    test('skip, take - keep', function() {
        var s = app.signal().keep(2).skip(2).take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.toArray().toString() === '2,3'
    })

    test('take',function() {
        var s = app.signal().take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.value() === 1
    })

    test('window', function() {
        var s = app.signal().window(2)
        for (var i=0; i<4; i++) s.value(i)
        return s.value().toString() === '2,3'
    })

    test('zip - arrays', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        app.join(s1,s2,true).zip().tap(function(v){r.push(v)})
        var a = [1,2,3],b = [4,5,6], r = []
        a.map(function(x,i){
            s1.value(x)
            s2.value(b[i])
        })
        return r.length === 3 && Circus.deepEqual(r, [[1,4],[2,5],[3,6]])
    })

})
