runTests('mvi', function(mock) {

    var app,state,model,view,intent,intentions,nested,errors,head, vm

    function logError(v) {
        vm = v
        errors = !!view.error()
        if (v===99) intent.channels.i1.value(v)
    }
    function logState(v) {
        state = v
    }

    setup(function(){
        vm = undefined
        state = undefined
        errors = undefined
        app = Circus.mvi().pure(false)
        model = app.model.tap(logState)
        view = app.view.tap(logError)
        intent = app.intent
        nested = {
            i4:app.signal(),
            i5:app.signal()
        }
        intentions = {
            i1:app.signal(),
            i2:app.signal(),
            i3:nested
        }
        intent.join(intentions)
        head = Circus.map(intent,function(s){
            return s.name})
    })

    test('initial state', function(){
        return errors === undefined && state === undefined && vm === undefined
    })

    test('M -> V', function(){
        model.value(1)
        return vm !== undefined
    })

    test('M -> V -> I -> M', function(){
        model.value(99)
        return state.i1 === 99
    })

    test('prime -> I', function() {
        app.prime(head)
        return intentions.i1.head === 'i1'
    })

    test('prime -> V', function() {
        app.prime(head)
        return vm.i1 === 'i1'
    })

    test('prime -> NOT M', function() {
        app.prime(head)
        return state === undefined
    })

    test('error - set / get', function(){
        var s = app.signal().error(function(v){return true})
        s.value(1)
        return s.error() === true
    })

    test('error - message', function(){
        var s = app.signal().error(function(v){return v==1 && 'msg'})
        s.value(1)
        return s.error() === 'msg'
    })

    test('error - not set', function(){
        var s = app.signal().error(function(v){return false})
        s.value(1)
        return s.error() === ''
    })

    test('error - first', function(){
        var i=0, test=function(v){return ++i}
        var s = app.signal().error(test).error(test)
        s.value(1)
        return s.error() === 1
    })

    test('error - next', function(){
        var i=0, test = function() {return i++}
        var s = app.signal().error(test).error(test)
        s.value(1)
        return s.error() === 1
    })

    test('cta - validate all', function(){
        var r=0
        app.prime(head)
        intent.channels.i3.channels.i4.error(function(v){r++; return false})
        intent.channels.i3.channels.i5.error(function(v){r++; return false})
        intent.cta(intent.channels.i3).value(true)
        return r===2 && state && !errors
    })

    test('cta - some errors', function(){
        app.prime(head)
        intent.channels.i3.channels.i4.error(function(v){return false})
        intent.channels.i3.channels.i5.error(function(v){return true})
        intent.cta(intent.channels.i3).value(true)
        return !state && errors
    })

    test('cta - reset', function(){
        var i=1, e1, test = function(v) {return v===i}
        intent.channels.i1.error(test).value(1)
        intent.channels.i2.error(test).value(2)
        e1 = intent.channels.i1.error()
        i=2
        intent.cta().value(true)
        return e1 && !intent.channels.i1.error() && intent.channels.i2.error() === true
    })


})
