runTests('model', function() {

    var model, state

    setup(function(){
        model = circus.model()
        newstate = function(){
            return {
                a:123,
                b:[1,2,3],
                c:{
                    a:123,
                    b:[1,2,3],
                    c:{
                        a:123,
                        b:[1,2,3],
                        c:{}
                    }
                }
            }
        }
        state = newstate()
    })  

    test('initially dirty', function(){
        return model.dirty()
    })

    test('dirty', function(){
        model.value(state)
        return model.dirty()
    })

    test('dirty - ref', function(){
        model.value(state)
             .value(newstate())
        return model.dirty()
    })

    test('clean - ref', function(){
        model.value(state)
             .value(state)
        return !model.dirty()
    })
    
    test('clean - same ref', function(){
        model.value(state)
        state.a=456
        model.value(state)
        return !model.dirty()
    })
    
    test('dirty path', function(){
        model.value(state)
        return model.dirty('a') &&
                model.dirty('b') && 
                model.dirty('b[0]') && 
                model.dirty('c') && 
                    model.dirty('c.a') && 
                    model.dirty('c.b') && 
                    model.dirty('c.b[0]') && 
                    model.dirty('c.c') && 
                        model.dirty('c.c.a') && 
                        model.dirty('c.c.b') && 
                        model.dirty('c.c.b[0]') && 
                        model.dirty('c.c.c')
    })

    test('clean path', function(){
        model.value(state)
             .value(newstate())
        return !model.dirty('a') &&
                !model.dirty('b') && 
                !model.dirty('b[0]') && 
                !model.dirty('c') && 
                    !model.dirty('c.a') && 
                    !model.dirty('c.b') && 
                    !model.dirty('c.b[0]') && 
                    !model.dirty('c.c') && 
                        !model.dirty('c.c.a') && 
                        !model.dirty('c.c.b') && 
                        !model.dirty('c.c.b[0]') && 
                        !model.dirty('c.c.c')
    })

    test('dirty a', function(){
        model.value(state)
        state = newstate()
        state.a=456
        model.value(state)
        return model.dirty('.a')
    })

    test('dirty b', function(){
        model.value(state)
        state = newstate()
        state.b[0]=456
        model.value(state)
        return model.dirty('b')
    })

    test('clean b - ref', function(){
        model.value(state)
        state = newstate()
        state.b = [1,2,3]
        model.value(state)
        return !model.dirty('b')
    })

    
})
