import Circus from '../src'
import Utils, {Error} from '../src/utils'

var inc = function(v){return v+1}

runTests('utils', function(mock) {

    var app, channels, sigBlock, valBlock
    setup(function(){

        app = new Circus(Error)

        sigBlock = {
            i1:app.signal(),
            i2:app.signal(),
            i3: {
                i4:app.signal(),
                i5:app.signal()
            }
        }

        valBlock = {
            i1:1,
            i2:new Date(),
            i3:{
                i4:1,
                i5:2
            }
        }

        channels = app.join(sigBlock);
    })

    test('test - true', function() {
        var m = Utils.test(function(v){return true})(1)
        return m === 1
    })

    test('test - value', function() {
        var m = Utils.test(function(v){return v+1})(1)
        return m === 2
    })

    test('test - fail', function() {
        var m = Utils.test(function(v){return !!v})(0)
        return m instanceof Circus.fail
    })

    test('test - fail with reason', function() {
        var m = Utils.test(function(v){return !!v},'xyz')(0)
        return m.error === 'xyz'
    })

    test('error - circuit valid', function() {
        var m = Utils.test(function(v){return !!v},'error!')
        var s = app.merge({m:m}).map(inc)
        s.channels.m.value(1)
        return s.error() === '' && s.value() === 2
    })

    test('error - circuit error', function() {
        var m = Utils.test(function(v){return !!v})
        var s = app.merge({m:m}).map(inc)
        s.channels.m.value(0)
        return s.error() === true
    })

    test('error - circuit error msg', function() {
        var m = Utils.test(function(v){return !!v},'error!')
        var s = app.merge({m:m}).map(inc)
        s.channels.m.value(0)
        return s.error() === 'error!'
    })

    test('error - first error only', function() {
        var m1 = Utils.test(function(v){return !!v},1)
        var m2 = Utils.test(function(v){return !!v},2)
        var s = app.merge({m1:m1,m2:m2}).map(inc)
        s.channels.m1.value(0)
        s.channels.m2.value(0)
        return s.error() === 1 && s.value() === undefined
    })

    test('error - circuit error clear', function() {
        var m = Utils.test(function(v){return !!v})
        var s = app.merge({m:m}).map(inc)
        s.channels.m.value(0)
        return s.error() === true && s.error() === ''
    })

    test('lens', function(){
        return Utils.lens(sigBlock, 'i1')
    })

    test('lens - namespace', function(){
        return Utils.lens(sigBlock, 'i4', 'i3')
    })

    test('lens - traverse', function(){
        return Utils.lens(sigBlock, 'i5')
    })

    test('map', function(){
        function id(s){
            return s.name}
        return Utils.deepEqual(Utils.map(channels, id),{
                                                    i1:'i1',
                                                    i2: 'i2',
                                                    i3: {
                                                        i4: 'i4',
                                                        i5: 'i5'
                                                    }
                                                })
    })

    test('map - copy', function(){
        return Utils.deepEqual(Utils.map(valBlock),valBlock)
    })

    test('map - prime', function(){
        function prime(s,v){return v}
        return Utils.deepEqual(Utils.map(channels,prime,valBlock),valBlock)
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return Utils.reduce(channels, error) === true
    })
})
