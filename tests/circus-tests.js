runTests('circus', function(mock) {

    var sigGraph = {
        i1:circus.signal(),
        i2:circus.signal(),
        i3: {
            i4:circus.signal(),
            i5:circus.signal([5])
        }
	}

    var vGraph = {
        i1:1,
        i2:new Date(),
        i3:{
            i4:1,
            i5:2
        }
    }

    var channels = circus.join(sigGraph);

    test('lens', function(){
        return circus.lens(sigGraph, 'i1')
    })

    test('lens - ns', function(){
        return circus.lens(sigGraph, 'i4', 'i3')
    })

    test('lens - traverse', function(){
        return circus.lens(sigGraph, 'i5')
    })

    test('map', function(){
        function id(s){return s.name}
        return circus.deepEqual(circus.map(channels, id),{
                                                    i1:'i1',
                                                    i2: 'i2',
                                                    i3: {
                                                        i4: 'i4',
                                                        i5: 'i5'
                                                    }
                                                })
    })

    test('map - copy', function(){
        return circus.deepEqual(circus.map(vGraph),vGraph)
    })

    test('map - prime', function(){
        function prime(s,v){return v}
        return circus.deepEqual(circus.map(channels,prime,vGraph),vGraph)
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return circus.reduce(channels, error) === true
    })

    test('typeof - Array', function(){
        return circus.typeOf([]) === circus.typeOf.ARRAY
    })

    test('typeof - Object', function(){
        return circus.typeOf({}) === circus.typeOf.OBJECT
    })

    test('typeof - Date', function(){
        return circus.typeOf(new Date()) === circus.typeOf.LITERAL
    })

    test('typeof - String', function(){
        return circus.typeOf('') === circus.typeOf.LITERAL
    })

    test('typeof - Number', function(){
        return circus.typeOf(1) === circus.typeOf.LITERAL
    })

    test('typeof - Boolean', function(){
        return circus.typeOf(true) === circus.typeOf.LITERAL
    })

    test('typeof - Regex', function(){
        return circus.typeOf(/a/) === circus.typeOf.LITERAL
    })

})
