runTests('mvi', function(mock) {

    var app,state,model,view,intent,intentions,nested,errors

    function log() {
        errors = true
    }

    setup(function(){
        errors = false
        app = circus.mvi()
        model = app.model.xor()
        view = app.view.tap(log)
        intent = app.intent
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

    test('error - graph', function(){
        intentions.i1.error(function(v){return true}).value(1)
        intentions.i3.i4.error(function(v){return true}).value(4)
        return circus.deepEqual(app.error,{i1:true, i2:false, i3:{i4:true,i5:false}})
    })

    test('error - message', function(){
        intentions.i1.error(function(v){return 'true'}).value(1)
        return app.error.i1==='true'
    })

    test('error - first', function(){
        var i=0, msg = function(v) {return ++i}
        intentions.i1.error(msg).error(msg).value(1)
        return app.error.i1===1
    })

    test('error - next', function(){
        var i=0, msg = function() {return ++i===2 && 2}
        intentions.i1.error(msg).error(msg).value(1)
        return app.error.i1===2
    })

    test('cta - validate all', function(){
        intentions.i1.error(function(v){return false})
        intentions.i3.i4.error(function(v){return false})
        var cta = intent.cta()
        cta.value(true)
        return cta.value() === true
    })

    test('cta - validate some', function(){
        intentions.i1.error(function(v){return true})
        intentions.i3.i4.error(function(v){return false})
        var cta = intent.cta()
        cta.value(true)
        return cta.value() === undefined
    })

    test('cta - validate all - errors to view', function(){
        intentions.i1.error(function(v){return true})
        intentions.i3.i4.error(function(v){return true})
        intentions.cta = intent.cta()
        intentions.cta.value(true)
        return errors
    })

    test('cta - block valid channel', function(){
        intentions.i2.error(function(){
            nested.i4.value(4)
            return true
        })
        var cta = intent.cta()
        cta.value(true)
        return cta.value() === undefined
    })


})
