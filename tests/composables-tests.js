runTests('composables', function(mock) {

    function inc(v) {return v+1}

    test('always',function() {
        var s = circus.signal()
        var r = s.always(123)
        s.value('xyz')
        return r.value() === 123
    })


    test('batch', function() {
        var s = circus.signal().batch(2).tap(function(v){
            r.push(v)
        })
        var r=[]
        for (var i=0; i<4; i++) s.value(i)
        return r.length === 2 &&
                r[0].toString() === '0,1' &&
                r[1].toString() === '2,3' 
    })

    test('compact', function() {
        var s = circus.signal().keep().compact()
        s.value(1)
        s.value(circus.UNDEFINED)
        s.value('')
        s.value(0)
        s.value(3)
        return s.history().toString() === '1,3' 
    })

    test('filter', function(){
        var s = circus.signal().keep().filter(function(v){
            return v % 2
        })
        for (var i=0; i<4; i++) s.value(i)
        return s.history().toString() === '1,3'
    })

    test('flatten', function(done){
        var s = circus.signal([1,2]).keep().flatten()
        return done(function(){
            s.value([3,[4,5]])
            s.value(6)
            return s.history().toString() === '1,2,3,4,5,6'
        })
    })

    test('flatten - flatmap', function(done){
        var s = circus.signal([1,2]).keep().flatten(function(v){
            return v+1
        })
        return done(function(){
            s.value(3)
            return s.history().toString() === '2,3,4'
        })
    })

    test('maybe', function(){
        return circus.signal([123]).maybe(function(v){
            return true
        },'nothing').value().just === 123
    })

    test('maybe - nothing', function(){
        var value = circus.signal([123]).maybe(function(v){
            return false
        },'nothing').value();
        return value.nothing === 'nothing'
    })

    test('pluck', function() {
        var s = circus.signal().pluck('a','b')
        s.value({a:1,b:2,c:3})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===2
    })

    test('pluck - deep', function() {
        var s = circus.signal().pluck('a.a1','b.b1[1]')
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a.a1,b.b1[1]' &&
                s.value()['a.a1']===1 &&
                s.value()['b.b1[1]']===3
    })

    test('project', function() {
        var s = circus.signal().project({a:'a.a1',b:'b.b1[1]'})
        s.value({a:{a1:1},b:{b1:[2,3]}})
        return Object.keys(s.value()).toString() === 'a,b' &&
                s.value().a===1 &&
                s.value().b===3
    })

    test('reduce', function() {
        var e = 'xyz'
        var s = circus.signal()
        .reduce(function(a,v){
            return a+v
        }).tap(function(v){
            e = v           
        })
        s.value(1)
        s.value(1)
        s.value(1)
        return e === 3
    })

    test('reduce - accum', function() {
        var e = 'xyz'
        var s = circus.signal()
        .reduce(function(a,v){
            return a+v
        },1).tap(function(v){
            e = v           
        })
        s.value(1)
        s.value(1)
        s.value(1)
        return e === 4
    })

    test('skip, take - keep', function() {
        var s = circus.signal().keep(2).skip(2).take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.history().toString() === '2,3'
    })

    test('take',function() {
        var s = circus.signal().take(2)
        for (var i=0; i<5; i++) s.value(i)
        return s.value() === 1
    })

    test('then', function() {
        var c = function(s) {
            return s.map(inc).map(inc)
        }
        return circus.signal([1]).then(c).value() === 3
    })

    test('window', function() {
        var s = circus.signal().window(2)
        for (var i=0; i<4; i++) s.value(i)
        return s.value().toString() === '2,3'
    })

    test('zip - arrays', function() {
        var s1 = circus.signal()
        var s2 = circus.signal().join(s1,circus.signal.allActive).zip().tap(function(v){r.push(v)})
        var a = [0,1,2,3],r = []
        a.map(function(i){
            s2.value(i)
            s1.value(i+1)
        })
        return r.length === 7 && r.toString() === '0,1,1,1,1,2,2,2,2,3,3,3,3,4'
    })

    test('zip - synchronised arrays', function() {
        var s1 = circus.signal().pulse()
        var s2 = circus.signal().keep().join(s1,circus.signal.allActive).zip()
        var a = [0,1,2,3]
        a.map(function(i){
            s2.value(i)
            s1.value(i+1)
        })
        var r = s2.history()
        return r.length === 4 && r.toString() === '0,1,1,2,2,3,3,4'
    })


    test('and', function() {
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).and().value(2)
        return circus.equal(s2.value(), {s1:1,s2:2})
    })

    test('and - filter falsey', function() {
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).and().value(0)
        return circus.equal(s2.value(), {s1:1})
    })

    test('and - mask', function() {
        var mask = {
            s1:true,
            s2:false
        }
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).and(mask).value(1)
        return circus.equal(s2.value(), {s1:1})
    })

    test('and - negative mask', function() {
        var mask = {
            s1:false,
            s2:false
        }
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).and(mask).value(0)
        return circus.equal(s2.value(), {s2:0})
    })

    test('and - value mask', function() {
        var mask = {
            s1:1,
            s2:2
        }
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).and(mask).value(1)
        return circus.equal(s2.value(), {s1:1})
    })

    test('or', function() {
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).or().value(1)
        return circus.equal(s2.value(), {s1:1,s2:1})
    })

    test('or - some', function() {
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).or().value(0)
        return circus.equal(s2.value(), {s1:1})
    })

    test('or - default', function() {
        var mask = {
            s1:2,
            s2:2
        }
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).or(mask).value(0)
        return circus.equal(s2.value(), {s1:1,s2:2})
    })

    test('xor - filter truthy', function() {
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).xor().value(0)
        return circus.equal(s2.value(), {s2:undefined})
    })

    test('xor - exclusive default', function() {
        var mask = {s2:3}
        var s1 = circus.signal('s1').value(1)
        var s2 = circus.signal('s2').join(s1).xor(mask).value(0)
        return circus.equal(s2.value(), {s2:3})
    })

})
