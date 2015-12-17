runTests('circus', function(mock) {

    var graph = circus.join({
        i1:circus.signal(),
        i2:circus.signal(),
        i3: {
            i4:circus.signal(),
            i5:circus.signal([5])
        }
	});

    test('map', function(){
        function id(s){return s.name}
        return circus.deepEqual(circus.map(graph, id),{
                                                    i1:'i1',
                                                    i2: 'i2',
                                                    i3: {
                                                        i4: 'i4',
                                                        i5: 'i5'
                                                    }
                                                })
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return circus.reduce(graph, error) === true
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
