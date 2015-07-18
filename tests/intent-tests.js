runTests('intent', function(mock) {

    var intent,intentions,nested

    setup(function(){
        intent = circus.intent()
        nested = {
            i4:intent.signal(),
            i5:intent.signal([5])
        }
        intentions = {
            i1:intent.signal(),
            i2:intent.signal(),
            i3:nested
        }
        intent.join(intentions)
    })

    test('error', function(){
        intent = circus.intent().error(function(v){return true}).value(1)
        return circus.deepEqual(intent.value(),{data:1,error:{data:true}})
    })

    test('error - valid', function(){
        intent = circus.intent().error(function(v){return false}).value(1)
        return circus.deepEqual(intent.value(),{data:1,error:{data:false}})
    })

    test('error then valid', function(){
        intent = circus.intent().error(function(v){
            return v!==2}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(intent.value(),{data:2,error:{data:false}})
    })

    test('valid then error', function(){
        intent = circus.intent().error(function(v){
            return v!==1}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(intent.value(),{data:2,error:{data:true}})
    })

    test('error - message', function(){
        intent = circus.intent().error(function(v){return 'err'}).value(1)
        return circus.equal(intent.value().error,{data:'err'})
    })

    test('error chain - 1st error', function(){
        intent = circus.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return circus.equal(intent.value().error,{data:'e1'})
    })

    test('error chain - 2nd error', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return 'e2'}).value(1)
        return intent.value().error.data === 'e2'
    })

    test('error chain - skip 2nd error', function(){
        intent = circus.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return intent.value().error.data === 'e1'
    })

    test('error chain - valid', function(){
        intent = circus.intent().error(function(v){return false}).error(function(v){return false}).value(1)
        return intent.value().error.data === false
    })

    test('error - immediate', function(){
        intent = circus.intent().error('err').value(1)
        return circus.deepEqual(intent.value(),{data:1,error:{data:'err'}})
    })

    test('aggregate - seed', function(){
        return nested.i5.value() === 5
    })

    test('aggregate', function(){
        intentions.i1.error(function(v){return true}).value(1)
        nested.i4.error(function(v){return true}).value(4)
        return circus.deepEqual(intent.value(),{data:{
                                                    i1:1,
                                                    i2: undefined,
                                                    i3: {
                                                        i4: 4,
                                                        i5: 5
                                                    }
                                                },error:{
                                                    i1:true,
                                                    i4:true
                                                }})
    })

})
