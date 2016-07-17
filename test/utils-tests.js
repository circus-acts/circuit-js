import Circus from '../src'
import Utils from '../src/utils'

var inc = function(v){return v+1}

runTests('utils', function(mock) {

    var app, channels, sigBlock, valBlock
    setup(function(){

        app = new Circus()

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
