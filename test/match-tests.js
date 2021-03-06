import Circuit from '../src'
import Match from '../src/match'
import Utils from '../src/utils'

runTests('match', function(mock) {

    var app, sig, inc = function(v){return v+1}
    setup(function(){
        app = new Circuit().import(Match)
        sig = app.channel()
    })

    test('match - block truthy literal', function() {
        var r, v=1
        sig.match().tap(function(v){r=v}).signal(v)
        return r !== v
    })

    test('match - block falsey literal', function() {
        var r, v=0
        sig.match().tap(function(v){r=v}).signal(v)
        return r !== v
    })

    test('match - pass truthy object', function() {
        var r, v={a:1,b:2}
        sig.match().tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - block falsey object', function() {
        var r, v={a:false,b:2}
        sig.match().tap(function(v){r=v}).signal(v)
        return r === undefined
    })

    test('match - pass truthy key value', function() {
        var r, kv=function(k, v) {
            return k === 'a' && v
        }
        sig.match({a:1}, kv).tap(function(v){r=1}).signal(1)
        return r === 1
    })

    test('match - block falsey key value', function() {
        var r, kv=function(k, v) {
            return k === 'a' && v
        }
        sig.match({a:2}, kv).tap(function(v){r=1}).signal(1)
        return r === undefined
    })

    test('match - pass object with some', function() {
        var r, v={a:false,b:2}
        sig.match(1, -1).tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - pass mask', function() {
        var r, v = {c1:undefined,c2:2}
        var s = sig.match({c1:false,c2:true}).tap(function(v){r=v})
        s.signal(v)
        return Utils.equal(r, v)
    })

    test('match - block mask', function() {
        var r, v = {c1:undefined,c2:2}
        sig.match({c1:1,c2:1}).tap(function(v){r=v}).signal(v)
        return r === undefined
    })

    test('match - pass channel mask', function() {
        var r, v = {c1:1,c2:3}
        sig.match({c1:1}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - pass default mask', function() {
        var r, v = {c1:1,c2:3}
        sig.match({c1:undefined}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - fn mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        sig.match({ca1:function(a, v, k){return v===1}}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r,v)
    })

    test('match - fn (boolean) mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        var s =sig.match({ca1:function(v,m){return r=m}})
        s.signal(v)
        s.signal(v)
        return r===1
    })

    test('match - signal mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        var sm = app.channel()
        sig.match({ca1: sm}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r,v)
    })

    test('match - pass wildcard', function() {
        var r,v = {c1:1,c2:2,c3:3}
        sig.match({'*':true}).tap(function(v){r=v}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - pass leading wildcard', function() {
        var r, v = {a1:1,b2:0,c1:3}
        sig.match({'*1':true}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r,v)
    })

    test('match - block leading wildcard', function() {
        var r, v = {c11:1,c21:0}
        sig.match({'*1':true},-1,-1).tap(function(v){r=v}).signal(v)
        return r===undefined
    })

    test('match - trailing wildcard', function() {
        var r,v = {ca1:1,cb2:false,ca3:3}
        sig.match({'ca*':true}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r,v)
    })

    test('match - mixed wildcard', function() {
        var r,v = {ca1:1,cb2:2,cc3:3}
        sig.match({'*1':1,'*':true}).tap(function(v){r=v}).signal(v)
        return Utils.equal(r,v)
    })

    test('match - fn key match', function() {
        var r,v = {c1:1,c2:2,c3:0}
        var kmatch = function(k, mv) {
            return k==='x' && mv.c1 || k==='y' && mv.c3
        }
        sig.match({'x':true, 'y': false}, kmatch).tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('match - fn key match + fn mask', function() {
        var r, v = {c1:1,c2:2,c3:0}
        sig.match({x:function(a, c){
            return a === v && c===1 && 2
        }},
        function(k, mv){
            return k==='x' && mv.c1
        })
        .tap(function(v){r=v}).signal(v)
        return assert(r,v,Utils.equal)
    })

    test('match - pass list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        sig.match('ca1','cc3').tap(function(v){r=v}).signal(v)
        return assert(r,v,Utils.equal)
    })

    test('match - block list', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        sig.match('ca1','cc3', -1, -1).tap(function(v){r=v}).signal(v)
        return r===undefined
    })

    test('all - take all truthy', function() {
        var r, v = {c1:1,c2:2}
        sig.all().tap(function(v){r=v}).signal(v)
        return Utils.equal(r, v)
    })

    test('all - block some falsey', function() {
        var r, v = {c1:1,c2:0}
        sig.all().tap(function(v){r=v}).signal(v)
        return r === undefined
    })

    test('all - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s1.signal(1)
        return Utils.equal(r, {s1:1, s2:undefined})
    })

    test('all - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s1.signal(1)
        return Utils.equal(r, {s1:1,s2:undefined})
    })

    test('all - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s1.signal(1)
        s2.signal(0)
        return Utils.equal(r, undefined)
    })

    test('all - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s2.signal(1)
        s1.signal(1)
        return Utils.equal(r, {s1:1, s2:1})
    })

    test('all - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = app.channel()
        var s2 = app.channel()
        sig.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s2.signal(1)
        s1.signal(1)
        return Utils.equal(r, undefined)
    })

    test('all - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).all(mask).tap(function(v){r=v})
        s2.signal(1)
        s1.signal(1)
        return Utils.equal(r, {s1:1,s2:1})
    })

    test('any - signal values', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        var jp = app.assign({s1,s2}).any()
        s1.signal(1)
        s2.signal(1)
        return Utils.equal(jp.value(), {s1:1,s2:1})
    })

    test('any - any signal values', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        var jp = app.assign({s1,s2}).any()
        s2.signal(1)
        return Utils.equal(jp.value(), {s1:undefined,s2:1})
    })

    test('any - block on no values', function() {
        var r, s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).any().tap(function(v){r=v})
        s1.signal(0)
        s2.signal(0)
        return r === undefined
    })

    test('any - pass on first value', function() {
        var r, a = () => r = 0, b = () => r = 1, c = () => r = 2
        app.any({a,b,c}).signal({a: true, b: true, c: true})
        return r === 1
    })

    test('some - pass on matched values', function() {
        var r, a = () => r = 0, b = () => r = 1, c = () => r = 2
        app.some({a,b,c}).signal({a: true, b: true, c: true})
        return r === 2
    })

    test('switch - block on matched key value', function() {
        var r, a = () => r = 0, b = () => r = 1, c = () => r = 2
        app.switch({a,b,c}).tap(() => r = 3).signal({c:true})
        return r === 2
    })

    test('switch - pass on unmatched key value', function() {
        var r, a = () => r = 0, b = () => r = 0, c = () => r = 0
        app.switch({a,b,c}).tap(() => r = 3).signal({c:false})
        return r === 3
    })

    test('one - pass on only one', function() {
        var r, s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).one().tap(function(v){r=v}).signal({s1:0,s2:2})
        return Utils.equal(r, {s1:0,s2:2})
    })

    test('one - block on more than one', function() {
        var r, s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).one().tap(function(v){r=v}).signal({s1:1,s2:2})
        return r === undefined
    })

    test('none - block on any value', function() {
        var r, s1 = app.channel()
        var s2 = app.channel()
        app.assign({s1,s2}).none().tap(function(v){r=v}).signal({s1:1})
        return r === undefined
    })

    // boolean masks

    test('boolean - function mask', function() {
        var fn = function(v) {return v === 1}
        var r=0, s1 = sig.any({a:Match.and(fn)}).tap(()=> r++)
        s1.signal({a:1})
        s1.signal({a:2})
        return s1.value().a === 1 && r === 1
    })

    test('or - pass on dropped value', function() {
        var r=0, s1 = sig.any({a:Match.or}).tap(()=> r++)
        s1.signal({a:1})
        s1.signal({a:0})
        return s1.value().a === 0 && r === 2
    })

    test('or - block on successive dropped value', function() {
        var r=0, s1 = sig.any({a:Match.or}).tap(()=> r++)
        s1.signal({a:1})
        s1.signal({a:0})
        s1.signal({a:0})
        return r === 2
    })

    test('or - block on mask value', function() {
        var s1 = sig.any({a:Match.or(false)})
        s1.signal({a:1})
        s1.signal({a:0})
        return s1.value().a === 1
    })

    test('or - pass on mask value', function() {
        var mask = {
            a:Match.or(true)
        }
        sig.any(mask).signal({a:2})
        return sig.value().a === 2
    })

    test('xor - pass new value', function() {
        var p=0, s = sig.any({a:Match.xor}).tap(function(){p++})
        s.signal({a:1})
        s.signal({a:2})
        return p==2
    })

    test('xor - block same value', function() {
        var p=0, s = sig.any({a:Match.xor}).tap(function(){p++})
        s.signal({a:1})
        s.signal({a:1})
        return p===1
    })

    test('not - pass on falsey', function() {
        var r, p, s = sig.any({a:Match.not}).tap(function(v){p=v})
        s.signal({a:0})
        return Utils.equal(p, {a:0})
    })

    test('not - block on truthy', function() {
        var p, s = sig.any({a:Match.not}).tap(function(v){p=v})
        s.signal({a:1})
        return p === undefined
    })

    // joinpoint - all

    test('assign - all active', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        var r,j = app.assign({s1,s2}).all().tap(function(){r=true})
        s1.signal(1)
        s2.signal(2)
        return r
    })

    test('assign - not all active', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        var r,j = app.assign({s1,s2}).all().tap(function(){r=true})
        s1.signal(1)
        return r === undefined
    })

    test('assign - already active', function() {
        var s1 = app.channel()
        var s2 = app.channel()
        s2.signal(2)
        var r,j = app.assign({s1,s2}).all().tap(function(){r=true})
        s1.signal(1)
        return r
    })

    test('sample - all', function() {
        var s1 = app.assign({inc})
        var s2 = app.channel()
        var s3 = app.channel()
        var allSigs = app.channel().assign({s2,s3}).all()
        var s = s1.sample({allSigs})
        s1.signals.inc(1)
        var r1 = s.value() // blocked
        s2.signal(2)
        var r2 = s.value() // blocked
        s3.signal(3)
        var r3 = s.value()
        return r1 === undefined && r2 === undefined && r3.inc === 2
    })

})
