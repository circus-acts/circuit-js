runTests('mvi', function(mock) {

    var app,state,model,view,intent,intentions,nested,errors

    function log(v) {
        errors = v && !!v.error
    }

    setup(function(){
        state = false
        app = circus.mvi()
        model = app.model.tap(function(v){state=v})
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

    test('cta - validate all', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return false})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return state !== false && !errors
    })

    test('cta - validate some', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return true})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return state === false && errors
    })

    test('cta - validate all - errors to view', function(){
        intentions.i3.i4.error(function(v){return false})
        intentions.i3.i5.error(function(v){return 'msg'})
        var cta = intent.cta(intentions.i3)
        cta.value(true)
        return model.value().error === 'msg'
    })

    test('cta - reset', function(){
        var i=1, msg = function(v) {return v===i}
        intentions.i1.error(msg).value(1)
        intentions.i2.error(msg).value(2)
        i=2
        intent.cta().value(true)
        return !intentions.i1.error() && intentions.i2.error() === true
    })


})
