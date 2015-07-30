runTests('intent', function(mock) {

    var app,intent,intentions,nested

    setup(function(){
        app = circus.mvi()
        intent = app.intent()
        nested = {
            i4:app.signal(),
            i5:app.signal([5])
        }
        intentions = {
            i1:app.signal(),
            i2:app.signal(),
            i3:nested
        }
        intent.join(intentions)
    })

    test('error', function(){
        intent = app.intent().error(function(v){return true}).value(1)
        return circus.deepEqual(app.error,{value:true})
    })

    test('error - valid', function(){
        intent = app.intent().error(function(v){return false}).value(1)
        return circus.deepEqual(app.error,{value:false})
    })

    test('error then valid', function(){
        intent = app.intent().error(function(v){
            return v!==2}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(app.error,{value:false})
    })

    test('valid then error', function(){
        intent = app.intent().error(function(v){
            return v!==1}
        ).value(1)
        intent.value(2)
        return circus.deepEqual(app.error,{value:true})
    })

    test('error - message', function(){
        intent = app.intent().error(function(v){return 'err'}).value(1)
        return circus.deepEqual(app.error,{value:'err'})
    })

    test('error chain - 1st error', function(){
        intent = app.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return circus.deepEqual(app.error,{value:'e1'})
    })

    test('error chain - 2nd error', function(){
        intent = app.intent().error(function(v){return false}).error(function(v){return 'e2'}).value(1)
        return circus.deepEqual(app.error,{value:'e2'})
    })

    test('error chain - skip 2nd error', function(){
        intent = app.intent().error(function(v){return 'e1'}).error(function(v){return 'e2'}).value(1)
        return circus.deepEqual(app.error,{value:'e1'})
    })

    test('error chain - valid', function(){
        intent = app.intent().error(function(v){return false}).error(function(v){return false}).value(1)
        return circus.deepEqual(app.error,{value:false})
    })

    test('error - immediate', function(){
        intent = app.intent().error('err').value(1)
        return circus.deepEqual(app.error,{value:'err'})
    })

    test('aggregate', function(){
        intentions.i1.error(function(v){return true}).value(1)
        nested.i4.error(function(v){return true}).value(4)
        return circus.deepEqual(app.error,{i1:true, i4:true})
    })

})
