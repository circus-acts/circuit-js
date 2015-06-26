runTests('composables', function(mock) {

    function inc(v) {return v+1}

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

    test('maybe', function(){
        return circus.signal([123]).maybe(function(v){
            return true
        },'nothing').state().just === 123
    })

    test('maybe - nothing', function(){
        var state = circus.signal([123]).maybe(function(v){
            return false
        },'nothing').state();
        return state.nothing === 'nothing'
    })

    test('pluck', function() {
        var s = circus.signal().pluck('a','b')
        s.head({a:1,b:2,c:3})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===2
    })

    test('pluck - deep', function() {
        var s = circus.signal().pluck('a.a1','b.b1[1]')
        s.head({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a.a1,b.b1[1]' &&
                s.value()['a.a1']===1 &&
                s.value()['b.b1[1]']===3
    })

    test('project', function() {
        var s = circus.signal().project({a:'a.a1',b:'b.b1[1]'})
        s.head({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===3
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
        var s1 = circus.signal()
        var s2 = circus.signal().join(s1,circus.signal.allActive).zip().tap(function(v){r.push(v)})
        var a = [0,1,2,3],r = []
        a.map(function(i){
            s2.head(i)
            s1.head(i+1)
        })
        return r.length === 7 && r.toString() === '0,1,1,1,1,2,2,2,2,3,3,3,3,4'
    })

    test('zip - synchronised arrays', function() {
        var s1 = circus.signal().pulse()
        var s2 = circus.signal().keep().join(s1,circus.signal.allActive).zip()
        var a = [0,1,2,3]
        a.map(function(i){
            s2.head(i)
            s1.head(i+1)
        })
        var r = s2.history()
        return r.length === 4 && r.toString() === '0,1,1,2,2,3,3,4'
    })


    test('and', function() {
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).and().head(2)
        return circus.equal(s2.state(), {s1:1,s2:2})
    })

    test('and - filter falsey', function() {
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).and().head(0)
        return circus.equal(s2.state(), {s1:1})
    })

    test('and - mask', function() {
        var mask = {
            s1:true,
            s2:false
        }
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).and(mask).head(1)
        return circus.equal(s2.state(), {s1:1})
    })

    test('and - negative mask', function() {
        var mask = {
            s1:false,
            s2:false
        }
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).and(mask).head(0)
        return circus.equal(s2.state(), {s2:0})
    })

    test('and - value mask', function() {
        var mask = {
            s1:1,
            s2:2
        }
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).and(mask).head(1)
        return circus.equal(s2.state(), {s1:1})
    })

    test('or', function() {
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).or().head(1)
        return circus.equal(s2.state(), {s1:1,s2:1})
    })

    test('or - some', function() {
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).or().head(0)
        return circus.equal(s2.state(), {s1:1})
    })

    test('or - default', function() {
        var mask = {
            s1:2,
            s2:2
        }
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).or(mask).head(0)
        return circus.equal(s2.state(), {s1:1,s2:2})
    })

    test('xor - filter truthy', function() {
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).xor().head(0)
        return circus.equal(s2.state(), {s2:undefined})
    })

    test('xor - exclusive default', function() {
        var mask = {s2:3}
        var s1 = circus.signal('s1').head(1)
        var s2 = circus.signal('s2').join(s1).xor(mask).head(0)
        return circus.equal(s2.state(), {s2:3})
    })

})
