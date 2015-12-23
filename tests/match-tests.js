irunTests('logic', function(mock) {

    test('match - pass truthy', function() {
        var r=0, v=1
        circus.match().tap(function(v){r=v}).value(v)
        return r === v
    })

    test('match - pass undefined', function() {
        var r=0, v=undefined
        circus.match().tap(function(v){r=v}).value(v)
        return r === v
    })

    test('match - block falsey', function() {
        var r=1, v=0
        circus.match().tap(function(v){r=v}).value(v)
        return r !== v
    })

    test('match - pass mask', function() {
        var r, v = {c1:undefined,c2:2}
        circus.match({c1:false,c2:true}).tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - block mask', function() {
        var r, v = {c1:undefined,c2:2}
        circus.match({c1:1,c2:1}).tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - pass default mask', function() {
        var r, v = {c1:1,c2:0}
        circus.match({c1:undefined}).tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - pass fn', function() {
        var r,v = {c1:1,c2:2,c3:3}
        circus.match(function(v,m){return v===m}).tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - pass fn + mask', function() {
        var r,v = {c1:1,c2:0,c3:3}
        circus.match({c1:0},function(v,m){return v===m+1}).tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - pass wildcard', function() {
        var r,v = {c1:1,c2:2,c3:3}
        circus.match({'*':true}).tap(function(v){r=v}).tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - pass leading wildcard', function() {
        var r, v = {c1:1,c2:2,c3:3}
        circus.match({'*1':true}).tap(function(v){r=v}).value(v)
        return circus.equal(r,v)
    })

    test('match - block leading wildcard', function() {
        var r, v = {c11:1,c21:0}
        circus.match({'*1':true}).tap(function(v){r=v}).value(v)
        return r===undefined
    })

    test('match - trailing wildcard', function() {
        var r,v = {ca1:1,cb2:2,cc3:3}
        circus.match({'ca*':true}).tap(function(v){r=v}).value(v)
        return circus.equal(r,v)
    })

    test('match - mixed wildcard block', function() {
        var r,v = {ca1:1,cb2:2,cc3:3}
        circus.match({'*1':false,'*':true}).tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - pass list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        circus.match('ca1','cc3').tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('match - block list', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        circus.match('ca1','cc3').tap(function(v){r=v}).value(v)
        return r===undefined
    })

    test('all - take all truthy', function() {
        var r, v = {c1:1,c2:2}
        circus.all().tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('all - block falsey', function() {
        var r, v = {c1:1,c2:0}
        circus.all().tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('all - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('all - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s1.value(1)
        return circus.equal(r, {s2:undefined})
    })

    test('all - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s1.value(1)
        s2.value(0)
        return circus.equal(r, undefined)
    })

    test('all - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('all - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, undefined)
    })

    test('all - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).all(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, {s1:1,s2:1})
    })

    test('any - signal values', function() {
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        var jp = circus.join(s1,s2).any()
        s1.value(1)
        s2.value(1)
        return circus.equal(jp.value(), {s1:1,s2:1})
    })

    test('any - block on no values', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).any().tap(function(v){r=v})
        s1.value(0)
        s2.value(0)
        return r === undefined
    })

    test('any - restore and signal dropped value', function() {
        var r,s1 = circus.signal('s1').any()
        s1.value(1)
        r = s1.value(0)
        return circus.equal(r, 1)
    })

    test('any - signal active (same as match()', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).any().tap(function(v){r=v})
        s2.value(0)
        s1.value(1)
        return assert(r,{s1:1},circus.equal)
    })

    test('any - default to mask value', function() {
        var mask = {
            s1:2,
            '*':true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        var jp = circus.join(s1,s2).any(mask)
        s1.value(0)
        s2.value(2)
        return circus.equal(jp.value(), {s1:2,s2:2})
    })

    test('xor - pass on 1 value', function() {
        var r, v = {s1:1, s2:0}
        circus.xor().tap(function(v){r=v}).value(v)
        return circus.equal(r, v)
    })

    test('xor - block all values', function() {
        var r, v = {s1:1, s2:2}
        circus.xor().tap(function(v){r=v}).value(v)
        return r===undefined
    })

    test('not - signal on all falsey, take nothing (mask==all channels)', function() {
        var r=false
        circus.and(not).tap(function(v){r=true}).value({s1:0,s2:0})
        return r === true
    })

    test('not - block on any truthy (not all falsey)', function() {
        var r=false
        circus.not().tap(function(v){r=true}).value({s1:1,s2:0})
        return r === false
    })

})
