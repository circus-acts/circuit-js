import Circuit, {Channel} from '../src'
import Utils from '../src/utils'

var inc = function(v){return v+1}

runTests('utils', function(mock) {

    var app, signals, sigBlock, valBlock
    setup(function(){

        app = new Circuit()

        sigBlock = {
            i1:app.channel(),
            i2:app.channel(),
            i3: {
                i4:app.channel(),
                i5:app.channel()
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

        signals = app.join(sigBlock);
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
        return Utils.deepEqual(Utils.map(signals, id),{
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
        return Utils.deepEqual(Utils.map(signals,prime,valBlock),valBlock)
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return Utils.reduce(signals, error) === true
    })

    test('typeof - Array', function(){
        return Utils.typeOf([]) === Utils.type.ARRAY
    })

    test('typeof - Object', function(){
        return Utils.typeOf({}) === Utils.type.OBJECT
    })

    test('typeof - Date', function(){
        return Utils.typeOf(new Date()) === Utils.type.LITERAL
    })

    test('typeof - String', function(){
        return Utils.typeOf('') === Utils.type.LITERAL
    })

    test('typeof - Number', function(){
        return Utils.typeOf(1) === Utils.type.LITERAL
    })

    test('typeof - Boolean', function(){
        return Utils.typeOf(true) === Utils.type.LITERAL
    })

    test('typeof - Regex', function(){
        return Utils.typeOf(/a/) === Utils.type.LITERAL
    })

})
