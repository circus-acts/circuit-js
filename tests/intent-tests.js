runTests('intent', function(mock) {

    var intent,intentions,nested

    setup(function(){
        intent = circus.intent()
        nested = {
            i4:intent.add(),
            i5:intent.add(5)
        }
        intentions = {
            i1:intent.add(),
            i2:intent.add(),
            i3:intent.add().join(nested)
        }
        intent.join(intentions)
    })

    test('intent - valid', function(){
        intent = circus.intent().error(function(v){return false}).head(1)
        return circus.deepEqual(intent.state(),{model:1,error:{model:false}})
    })

    test('intent - error', function(){
        intent = circus.intent().error(function(v){return true}).head(1)
        return circus.deepEqual(intent.state(),{model:1,error:{model:true}})
    })

    test('intent - error then valid', function(){
        intent = circus.intent().error(function(v){return true}).head(1)
        intent = circus.intent().error(function(v){return false}).head(2)
        return circus.deepEqual(intent.state(),{model:2,error:{model:false}})
    })

    test('intent - error message', function(){
        intent = circus.intent().error(function(v){return 'err'}).head(1)
        return circus.equal(intent.state().error,{model:'err'})
    })

    test('chain - 1st error', function(){
        intent = circus.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).head(1)
        return circus.equal(intent.state().error,{model:'e1'})
    })

    test('chain - 2nd error', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return 'e2'}).head(1)
        return circus.equal(intent.state().error,{model:'e2'})
    })

    test('chain - skip 2nd error', function(){
        var first, second
        intent = circus.intent().error(function(v){return first ='e1'}).error(function(v){return second = 'e2'}).head(1)
        return first === 'e1' && second === undefined
    })

    test('chain - valid', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return false}).head(1)
        return circus.equal(intent.state().error,{model:{}})
    })

    test('add - seed', function(){
        return nested.i5.value() === 5
    })

    test('add - aggregate', function(){
        intentions.i1.error(function(v){return true}).head(1)
        return circus.deepEqual(intent.state(),{model:{
                                                    i1:1,
                                                    i2: undefined,
                                                    i3: {
                                                        i4: undefined,
                                                        i5: 5
                                                    }
                                                },error:{i1:true}})
    })

})
