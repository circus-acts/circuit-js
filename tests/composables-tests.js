runTests('composables', function(mock) {

   test('always',function() {
        var s = circus.signal()
        var r = s.always(123)
        s.head('xyz')
        return r.value() === 123
    })


    test('batch', function() {
        var s = circus.signal().batch(2).tap(function(v){
            r.push(v)
        })
        var r=[]
        for (var i=0; i<4; i++) s.head(i)
        return r.length === 2 &&
                r[0].toString() === '0,1' &&
                r[1].toString() === '2,3' 
    })

    test('compact', function() {
        var s = circus.signal().keep().compact()
        s.head(1)
        s.head(undefined)
        s.head('')
        s.head(0)
        s.head(3)
        return s.history().toString() === '1,3' 
    })

    test('filter', function(){
        var s = circus.signal().keep().filter(function(v){
            return v % 2
        })
        for (var i=0; i<4; i++) s.head(i)
        return s.history().toString() === '1,3'
    })

    test('flatten', function(done){
        var s = circus.signal([1,2]).keep().flatten()
        return done(function(){
            s.head([3,[4,5]])
            s.head(6)
            return s.history().toString() === '1,2,3,4,5,6'
        })
    })

    test('flatten - flatmap', function(done){
        var s = circus.signal([1,2]).keep().flatten(function(v){
            return v+1
        })
        return done(function(){
            s.head(3)
            return s.history().toString() === '2,3,4'
        })
    })

    test('project', function() {
        var s = circus.signal().project('a','b')
        s.head({a:1,b:2,c:3})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===2
    })

    test('skip, take - keep', function() {
        var s = circus.signal().keep(2).skip(2).take(2)
        for (var i=0; i<5; i++) s.head(i)
        return s.history().toString() === '2,3'
    })

    test('take',function() {
        var s = circus.signal().take(2)
        for (var i=0; i<5; i++) s.head(i)
        return s.value() === 1
    })

    test('window', function() {
        var s = circus.signal().window(2)
        for (var i=0; i<4; i++) s.head(i)
        return s.value().toString() === '2,3'
    })

    test('zip - arrays', function() {
        var s1 = circus.signal().pulse()
        var s2 = circus.signal().keep().joinAll(s1).zip()
        var a = [0,1,2,3]
        a.map(function(i){
            s2.head(i)
            s1.head(i+1)
        })
        var r = s2.history()
        return r.length === 4 && r.toString() === '0,1,1,2,2,3,3,4'
    })

})
