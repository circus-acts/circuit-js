import Circus from '../src'
import Signal from '../src/signal'
import Match from '../src/match'
import Utils from '../src/utils'

runTests('match', function(mock) {

    var app, inc = function(v){return v+1}
    setup(function(){
        app = new Circus().bind(Match)
    })

    test('match - pass truthy literal', function() {
        var r, v=1
        app.match().tap(function(v){r=v}).input(v)
        return r === v
    })

    test('match - block falsey literal', function() {
        var r, v=0
        app.match().tap(function(v){r=v}).input(v)
        return r !== v
    })

    test('match - pass truthy object', function() {
        var r, v={a:1,b:2}
        app.match().tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - pass object with some', function() {
        var r, v={a:false,b:2}
        app.match().tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - block object with every', function() {
        var r, v={a:false,b:2}
        app.match(-1,-1).tap(function(v){r=v}).input(v)
        return r === undefined
    })

    test('match - pass mask', function() {
        var r, v = {c1:undefined,c2:2}
        var s = app.match({c1:false,c2:true}).tap(function(v){r=v})
        s.input(v)
        return Utils.equal(r, v)
    })

    test('match - block mask', function() {
        var r, v = {c1:undefined,c2:2}
        app.match({c1:1,c2:1}).tap(function(v){r=v}).input(v)
        return r === undefined
    })

    test('match - pass channel mask', function() {
        var r, v = {c1:1,c2:3}
        app.match({c1:1}).tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - pass default mask', function() {
        var r, v = {c1:1,c2:3}
        app.match({c1:undefined}).tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - pass mask + fn', function() {
        var r,v = {c1:1,c2:0,c3:3}
        app.match({c1:0},function(v,m){return v===m+1}).tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - fn mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match({ca1:function(v,m){return v===1}}).tap(function(v){r=v}).input(v)
        return Utils.equal(r,v)
    })

    test('match - fn (boolean) mask', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        var s =app.match({ca1:function(v,m){return r=m}})
        s.input(v)
        s.input(v)
        return r===1
    })

    test('match - fn mask + fn', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match({ca1:function(v){
            return v===1 && 2}},function(v,m){
            return m===2})
        .tap(function(v){r=v}).input(v)
        return assert(r,v,Utils.equal)
    })

    test('match - pass wildcard', function() {
        var r,v = {c1:1,c2:2,c3:3}
        app.match({'*':true}).tap(function(v){r=v}).tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('match - pass leading wildcard', function() {
        var r, v = {a1:1,b2:0,c1:3}
        app.match({'*1':true}).tap(function(v){r=v}).input(v)
        return Utils.equal(r,v)
    })

    test('match - block leading wildcard', function() {
        var r, v = {c11:1,c21:0}
        app.match({'*1':true},-1,-1).tap(function(v){r=v}).input(v)
        return r===undefined
    })

    test('match - trailing wildcard', function() {
        var r,v = {ca1:1,cb2:false,ca3:3}
        app.match({'ca*':true}).tap(function(v){r=v}).input(v)
        return Utils.equal(r,v)
    })

    test('match - mixed wildcard', function() {
        var r,v = {ca1:1,cb2:2,cc3:3}
        app.match({'*1':1,'*':true}).tap(function(v){r=v}).input(v)
        return Utils.equal(r,v)
    })

    test('match - pass list', function() {
        var r, v = {ca1:1,cb2:2,cc3:3}
        app.match('ca1','cc3').tap(function(v){r=v}).input(v)
        return assert(r,v,Utils.equal)
    })

    test('match - block list', function() {
        var r, v = {ca1:1,cb2:2,cc3:0}
        app.match('ca1','cc3', -1, -1).tap(function(v){r=v}).input(v)
        return r===undefined
    })

    test('all - take all truthy', function() {
        var r, v = {c1:1,c2:2}
        app.all().tap(function(v){r=v}).input(v)
        return Utils.equal(r, v)
    })

    test('all - block some falsey', function() {
        var r, v = {c1:1,c2:0}
        app.all().tap(function(v){r=v}).input(v)
        return r === undefined
    })

    test('all - mask', function() {
        var r,mask = {
            s1:true
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s1.input(1)
        return Utils.equal(r, {s1:1, s2:undefined})
    })

    test('all - negative mask', function() {
        var r, mask = {
            s2:false
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s1.input(1)
        return Utils.equal(r, {s1:1,s2:undefined})
    })

    test('all - blocked mask', function() {
        var r,mask = {
            s1:true,
            s2:true
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s1.input(1)
        s2.input(0)
        return Utils.equal(r, undefined)
    })

    test('all - value mask', function() {
        var r,mask = {
            s1:1
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s2.input(1)
        s1.input(1)
        return Utils.equal(r, {s1:1, s2:1})
    })

    test('all - blocked value mask', function() {
        var r,mask = {
            s1:1,
            s2:2
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s2.input(1)
        s1.input(1)
        return Utils.equal(r, undefined)
    })

    test('all - undefined value mask', function() {
        var r,mask = {
            s1:1,
            s2:undefined
        }
        var s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).all(mask).tap(function(v){r=v})
        s2.input(1)
        s1.input(1)
        return Utils.equal(r, {s1:1,s2:1})
    })

    test('any - signal values', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var jp = app.join({s1,s2}).any()
        s1.input(1)
        s2.input(1)
        return Utils.equal(jp.value(), {s1:1,s2:1})
    })

    test('any - any signal values', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var jp = app.join({s1,s2}).any()
        s2.input(1)
        return Utils.equal(jp.value(), {s1:undefined,s2:1})
    })

    test('any - block on no values', function() {
        var r, s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).any().tap(function(v){r=v})
        s1.input(0)
        s2.input(0)
        return r === undefined
    })

    test('one - pass on only one', function() {
        var r, s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).one().tap(function(v){r=v}).input({s1:0,s2:2})
        return Utils.equal(r, {s1:0,s2:2})
    })

    test('one - block on more than one', function() {
        var r, s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).one().tap(function(v){r=v}).input({s1:1,s2:2})
        return r === undefined
    })

    test('none - block on any value', function() {
        var r, s1 = app.signal()
        var s2 = app.signal()
        app.join({s1,s2}).none().tap(function(v){r=v}).input({s1:1})
        return r === undefined
    })

    // boolean masks - mutate to boolean result

    test('or - restore dropped value', function() {
        var r,s1 = app.any({a:Match.or(function(v){r=v})})
        s1.input({a:1})
        s1.input({a:0})
        return r===1
    })

    test('or - default to mask value', function() {
        var r,mask = {
            a:Match.or(2,function(v){r=v})
        }
        app.any(mask).input({a:0})
        return r===2
    })

    test('xor - pass new value', function() {
        var p=0, s = app.any({a:Match.xor}).tap(function(){p++})
        s.input({a:1})
        s.input({a:2})
        return p==2
    })

    test('xor - block same value', function() {
        var p=0, s = app.any({a:Match.xor}).tap(function(){p++})
        s.input({a:1})
        s.input({a:1})
        return p===1
    })

    test('not - pass on falsey', function() {
        var r, p, s = app.any({a:Match.not}).tap(function(v){p=v})
        s.input({a:0})
        return Utils.equal(p, {a:0})
    })

    test('not - block on truthy', function() {
        var p, s = app.any({a:Match.not}).tap(function(v){p=v})
        s.input({a:1})
        return p === undefined
    })

    // switch:: fn(channel value -> signal)

    test('switch - match channel', function(){
        var sig=app.signal().map(inc)
        var a = app.any({a:Match.and(1,sig)})
        a.input({a:1})
        return sig.value()===2
    })

    test('switch - block channel', function(){
        var sig=app.signal().map(inc)
        var a = app.any({a:Match.and(1,sig)})
        a.input({a:0})
        return sig.value() === undefined
    })

    // joinpoint - all

    test('join - all active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var r,j = app.jp.join({s1,s2}).all().tap(function(){r=true})
        app.join({s1,s2}).all()
        s1.input(1)
        s2.input(2)
        return r
    })

    test('join - not all active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var r,j = app.jp.join({s1,s2}).all().tap(function(){r=true})
        app.join({s1,s2}).all()
        s1.input(1)
        return r === undefined
    })

    test('join - already active', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        s2.input(2)
        var r,j = app.join({s1,s2}).all().tap(function(){r=true})
        s1.input(1)
        return r
    })

    test('sample - all', function() {
        var s1 = app.signal()
        var s2 = app.signal()
        var s3 = app.signal()
        var allSigs = app.signal().join({s2,s3}).all()
        var s = s1.sample({allSigs}).map(inc)
        s1.input(1)
        var r1 = s.value() // blocked
        s2.input(2)
        var r2 = s.value() // blocked
        s3.input(3)
        var r3 = s.value()
        return r1 === undefined && r2 === undefined && r3 === 2
    })

})
