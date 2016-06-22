runTests('match', function(mock) {

    var inc = function(v){return v+1}
    var app = new Circuit()

    test('match - pass truthy literal', function() {
        var r, v=1
        app.match().tap(function(v){r=v}).value(v)
        return r === v
    })

    test('match - block falsey literal', function() {
        var r, v=0
        app.match().tap(function(v){r=v}).value(v)
        return r !== v
    })

    test('match - pass truthy object', function() {
        var r, v={a:1,b:2}
        app.match().tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - pass object with some', function() {
        var r, v={a:false,b:2}
        app.match().tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - block object with every', function() {
        var r, v={a:false,b:2}
        app.match(-1,-1).tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - pass mask', function() {
        var r, v = {c1:undefined,c2:2}
        var s = app.match({c1:false,c2:true}).tap(function(v){r=v})
        s.value(v)
        return Circus.equal(r, v)
    })

    test('match - block mask', function() {
        var r, v = {c1:undefined,c2:2}
        app.match({c1:1,c2:1}).tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - pass channel mask', function() {
        var r, v = {c1:1,c2:3}
        app.match({c1:1}).tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - pass default mask', function() {
        var r, v = {c1:1,c2:3}
        app.match({c1:undefined}).tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - pass mask + fn', function() {
        var r,v = {c1:1,c2:0,c3:3}
        app.match({c1:0},function(v,m){return v===m+1}).tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - fn mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match({ca1:function(v,m){return v===1}}).tap(function(v){r=v}).value(v)
        return Circus.equal(r,v)
    })

    test('match - fn (boolean) mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        var s =app.match({ca1:function(v,m){return r=m}})
        s.value(v)
        s.value(v)
        return r===1
    })

    test('match - fn mask + fn', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match({ca1:function(v){
            return v===1 && 2}},function(v,m){
            return m===2})
        .tap(function(v){r=v}).value(v)
        return assert(r,v,Circus.equal)
    })

    test('match - pass wildcard', function() {
        var r,v = {c1:1,c2:2,c3:3}
        app.match({'*':true}).tap(function(v){r=v}).tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('match - pass leading wildcard', function() {
        var r, v = {a1:1,b2:0,c1:3}
        app.match({'*1':true}).tap(function(v){r=v}).value(v)
        return Circus.equal(r,v)
    })

    test('match - block leading wildcard', function() {
        var r, v = {c11:1,c21:0}
        app.match({'*1':true},-1,-1).tap(function(v){r=v}).value(v)
        return r===undefined
    })

    test('match - trailing wildcard', function() {
        var r,v = {ca1:1,cb2:false,ca3:3}
        app.match({'ca*':true}).tap(function(v){r=v}).value(v)
        return Circus.equal(r,v)
    })

    test('match - mixed wildcard', function() {
        var r,v = {ca1:1,cb2:2,cc3:3}
        app.match({'*1':1,'*':true}).tap(function(v){r=v}).value(v)
        return Circus.equal(r,v)
    })

    test('match - pass list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        app.match('ca1','cc3').tap(function(v){r=v}).value(v)
        return assert(r,v,Circus.equal)
    })

    test('match - block list', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match('ca1','cc3', -1, -1).tap(function(v){r=v}).value(v)
        return r===undefined
    })

    test('every - take all truthy', function() {
        var r, v = {c1:1,c2:2}
        app.every().tap(function(v){r=v}).value(v)
        return Circus.equal(r, v)
    })

    test('every - block some falsey', function() {
        var r, v = {c1:1,c2:0}
        app.every().tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('every - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s1.value(1)
        return Circus.equal(r, {s1:1, s2:undefined})
    })

    test('every - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s1.value(1)
        return Circus.equal(r, {s1:1,s2:undefined})
    })

    test('every - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s1.value(1)
        s2.value(0)
        return Circus.equal(r, undefined)
    })

    test('every - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return Circus.equal(r, {s1:1, s2:1})
    })

    test('every - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return Circus.equal(r, undefined)
    })

    test('every - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).every(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return Circus.equal(r, {s1:1,s2:1})
    })

    test('some - signal values', function() {
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        var jp = app.join(s1,s2).some()
        s1.value(1)
        s2.value(1)
        return Circus.equal(jp.value(), {s1:1,s2:1})
    })

    test('some - some signal values', function() {
        var s1 = app.signal('s1')
        var s2 = app.signal('s2')
        var jp = app.join(s1,s2).some()
        s2.value(1)
        return Circus.equal(jp.value(), {s1:undefined,s2:1})
    })

    test('some - block on no values', function() {
        var r, s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).some().tap(function(v){r=v})
        s1.value(0)
        s2.value(0)
        return r === undefined
    })

    test('one - pass on only one', function() {
        var r, s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).one().tap(function(v){r=v}).value({s1:0,s2:2})
        return Circus.equal(r, {s1:0,s2:2})
    })

    test('one - block on more than one', function() {
        var r, s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).one().tap(function(v){r=v}).value({s1:1,s2:2})
        return r === undefined
    })

    test('none - block on any value', function() {
        var r, s1 = app.signal('s1')
        var s2 = app.signal('s2')
        app.join(s1,s2).none().tap(function(v){r=v}).value({s1:1})
        return r === undefined
    })

    // boolean masks - mutate to boolean result

    test('or - restore dropped value', function() {
        var r,s1 = app.some({a:Circus.or(function(v){r=v})})
        s1.value({a:1})
        s1.value({a:0})
        return r===1
    })

    test('or - default to mask value', function() {
        var r,mask = {
            a:Circus.or(2,function(v){r=v})
        }
        app.some(mask).value({a:0})
        return r===2
    })

    test('xor - pass new value', function() {
        var p=0, s = app.some({a:Circus.xor}).tap(function(){p++})
        s.value({a:1})
        s.value({a:2})
        return p==2
    })

    test('xor - block same value', function() {
        var p=0, s = app.some({a:Circus.xor}).tap(function(){p++})
        s.value({a:1})
        s.value({a:1})
        return p===1
    })

    test('not - pass on falsey', function() {
        var r, p, s = app.some({a:Circus.not}).tap(function(){p=true})
        r = s.value({a:0})
        return p && Circus.equal(r, {a:0})
    })

    test('not - block on truthy', function() {
        var p, s = app.some({a:Circus.not}).tap(function(){p=true})
        s.value({a:1})
        return p !== true && Circus.equal(s.value(),{a:1})
    })

    // switch:: fn(channel value -> signal)

    test('switch - match channel', function(){
        var sig=app.signal().map(inc)
        var a = app.some({a:Circus.and(1,sig)})
        a.value({a:1})
        return sig.value()===2
    })

    test('switch - block channel', function(){
        var sig=app.signal().map(inc)
        var a = app.some({a:Circus.and(1,sig)})
        a.value({a:0})
        return sig.value() === undefined
    })

    // joinpoint - all

    test('join - all active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var r,j = app.join(s1,s2).every().tap(function(){r=true})
        app.join(s1,s2).every()
        s1.value(1)
        s2.value(2)
        return r
    })

    test('join - not all active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var r,j = app.join(s1,s2).every().tap(function(){r=true})
        app.join(s1,s2).every()
        s1.value(1)
        s2.active(false)
        s2.value(2)
        return r === undefined
    })

    test('join - already active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        s2.value(2)
        var r,j = app.join(s1,s2).every().tap(function(){r=true})
        s1.value(1)
        return r
    })

    test('sample - all', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var s3 = app.signal()
        var allSigs = app.signal().join(s2,s3).every()
        var s = s1.sample(allSigs).map(inc)
        s1.value(1)
        var r1 = s.value() // blocked
        s2.value(2)
        var r2 = s.value() // blocked
        s3.value(3)
        var r3 = s.value()
        return r1 === 1 && r2 === 1 && r3 === 2
    })

})
