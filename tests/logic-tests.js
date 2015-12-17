runTests('logic', function(mock) {

    test('match - take active', function() {
        var r, v = {c1:1,c2:0,c3:undefined}
        circus.signal().match().tap(function(v){r=v}).value(v)
        return circus.equal(r, {c1:1,c2:0})
    })

    test('match - block all inactive', function() {
        var r, v = {c1:undefined,c2:undefined}
        circus.signal().match().tap(function(v){r=v}).value(v)
        return r === undefined
    })

    test('match - mask', function() {
        var r, v = {c1:undefined,c2:2,c3:3}
        circus.signal().match({c1:false,c2:true}).tap(function(v){r=v}).value(v)
        return circus.equal(r, {c1:undefined,c2:2})
    })

    test('match - fn', function() {
        var v = {c1:1,c2:0,c3:3}
        var v1 = circus.signal().match(function(v){return v===0}).value(v)
        return circus.equal(v1, {c2:0})
    })

    test('match - fn + mask', function() {
        var v = {c1:1,c2:0,c3:3}
        var v1 = circus.signal().match({c1:0},function(v,m){return v===m+1}).value(v)
        return circus.equal(v1, {c1:1})
    })

    test('match - wildcard', function() {
        var v = {c1:1,c2:2,c3:3}
        var v1 = circus.signal().match({'*':true}).value(v)
        return circus.equal(v1, v)
    })

    test('match - leading wildcard', function() {
        var v = {c1:1,c2:2,c3:3}
        var v1 = circus.signal().match({'*1':true}).value(v)
        return circus.equal(v1, {c1:1})
    })

    test('match - trailing wildcard', function() {
        var v = {ca1:1,cb2:2,cc3:3}
        var v1 = circus.signal().match({'ca*':true}).value(v)
        return circus.equal(v1, {ca1:1})
    })

    test('match - mixed wildcard', function() {
        var v = {ca1:1,cb2:2,cc3:3}
        var v1 = circus.signal().match({'*1':false,'*':true}).value(v)
        return circus.equal(v1, {cb2:2,cc3:3})
    })

    test('match - progressive join', function() {
        var s1 = circus.signal('c1')
        var s2 = circus.signal('c2')
        var pj = circus.join(s1,s2).and()
        s1.value(1)
        var v1 = circus.equal(pj.value(), undefined)
        s2.value(2)
        var v2 = circus.equal(pj.value(), {c1:1,c2:2})

        return v1 && v2
    })

    test('match - progressive wildcard join', function() {
        var s1 = circus.signal('c1')
        var s2 = circus.signal('c2')
        var pj = circus.join(s1,s2).and({'*':true})
        s1.value(1)
        var v1 = circus.equal(pj.value(), undefined)
        s2.value(2)
        var v2 = circus.equal(pj.value(), {c1:1,c2:2})

        return v1 && v2
    })

    test('and - take all truthy', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and().tap(function(v){r=v})
        s2.value(2)
        s1.value(1)
        return circus.equal(r, {s1:1,s2:2})
    })

    test('and - block on any falsey', function() {
        var r,s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and().tap(function(v){r=v})
        s1.value(1)
        s2.value(0)
        return circus.equal(r, undefined)
    })

    test('and - list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        circus.signal().and('ca1','cc3').tap(function(v){r=v}).value(v)
        return circus.equal(r, {ca1:1,cc3:3})
    })

    test('and - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v}).value(1)
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('and - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v}).value(0)
        s1.value(1)
        return circus.equal(r, {s2:0})
    })

    test('and - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v})
        s1.value(1)
        s2.value(0)
        return circus.equal(r, undefined)
    })

    test('and - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, {s1:1})
    })

    test('and - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, undefined)
    })

    test('and - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).and(mask).tap(function(v){r=v})
        s2.value(1)
        s1.value(1)
        return circus.equal(r, {s1:1,s2:1})
    })

    test('or - signal values', function() {
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        var jp = circus.join(s1,s2).or()
        s1.value(1)
        s2.value(1)
        return circus.equal(jp.value(), {s1:1,s2:1})
    })

    test('or - block on no values', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).or().tap(function(v){r=v})
        s1.value(0)
        s2.value(0)
        return r === undefined
    })

    test('or - restore and signal dropped value', function() {
        var r,s1 = circus.signal('s1').or()
        s1.value(1)
        r = s1.value(0)
        return circus.equal(r, 1)
    })

    test('or - signal active (same as match()', function() {
        var r, s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        circus.join(s1,s2).or().tap(function(v){r=v})
        s2.value(0)
        s1.value(1)
        return assert(r,{s1:1},circus.equal)
    })

    test('or - default to mask value', function() {
        var mask = {
            s1:2,
            '*':true
        }
        var s1 = circus.signal('s1')
        var s2 = circus.signal('s2')
        var jp = circus.join(s1,s2).or(mask)
        s1.value(0)
        s2.value(2)
        return circus.equal(jp.value(), {s1:2,s2:2})
    })

    test('xor - signal change', function() {
        var r=0
        var s1 = circus.signal().xor().tap(function(v){r++})
        s1.value(1)
        s1.value(1)
        s1.value(2)
        return r===2
    })

    test('xor - take value', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal().xor(mask).tap(function(v){r=v})
        s1.value({s1:1})
        return circus.equal(r, {s1:1})
    })

    test('xor - take mask', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal('s1').xor(mask).tap(function(v){r=v})
        s1.value(0)
        return circus.equal(r, {s1:3})
    })

    test('xor - block on equal', function() {
        var r, mask = {s1:3}
        var s1 = circus.signal().xor(mask).tap(function(v){r=v})
        s1.value({s1:3})
        return circus.equal(r, undefined)
    })

    test('not - signal on all falsey, take nothing (mask==all channels)', function() {
        var r=false
        var s = circus.signal().not().tap(function(v){r=true})
        s.value({s1:0,s2:0})
        return r === true && s.value() === undefined
    })

    test('not - block on any truthy', function() {
        var r=false
        var s = circus.signal().not().tap(function(v){r=true})
        s.value({s1:1,s2:0})
        return r === false
    })

    test('not - signal on falsey keys, take all but mask', function() {
        var r=false
        var s = circus.signal().not('s2').tap(function(v){r=true})
        s.value({s1:1,s2:0,s3:0})
        return r === true && circus.equal(s.value(), {s1:1, s3:0})
    })

    test('not - block on truthy keys', function() {
        var r=false
        var s = circus.signal().not('s2').tap(function(v){r=true})
        s.value({s1:1,s2:1,s3:0})
        return r === false
    })

})
