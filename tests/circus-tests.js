runTests('Circus', function(mock) {

    var app, channels, sigBlock, valBlock
    setup(function(){

        app = new Circuit()

        sigBlock = {
            i1:app.signal(),
            i2:app.signal(),
            i3: {
                i4:app.signal(),
                i5:app.signal()
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

        channels = app.join(sigBlock);
    })

    test('new signal', function(){
        return Circus.isSignal(app.signal())
    })

    test('new signal - ctx', function(){
        var s = app.asSignal(app)
        return Circus.isSignal(s)
    })

    test('existing signal', function(){
        var s = app.signal()
        var n = s.asSignal()
        return n===s
    })

    test('extend - Circus', function(){
        Circus.extend({a:true})
        Circus.extend({b:true})
        var ctx = new Circus()
        return ctx.signal().a && ctx.signal().b
    })

    test('extend - app ctx', function(){
        var ctx = new Circus()
        ctx.extend({c:true})

        return ctx.signal().c && !app.signal().c
    })

    test('extend - signal', function(){
        var s1 = app.signal().extend({s:true}),
            s2 = app.signal()

        return s1.s && !s2.s
    })

    test('extend - signal ctx', function(){
        var r,s = app.signal().extend(function(ctx) {
            r=ctx
            return {s:true}
        })
        return s.s && r===s
    })

    test('extend - app ctx + signal ctx', function(){
        var r1,r2,ctx = new Circus()
        ctx.extend(function(c1){r1=c1;return {b:true}})
        ctx.extend(function(c2){r2=c2;return {c:true}})
        var s = ctx.signal()
        return r1===s && r2===s
    })


    test('lens', function(){
        return Circus.lens(sigBlock, 'i1')
    })

    test('lens - namespace', function(){
        return Circus.lens(sigBlock, 'i4', 'i3')
    })

    test('lens - traverse', function(){
        return Circus.lens(sigBlock, 'i5')
    })

    test('map', function(){
        function id(s){return s.name}
        return Circus.deepEqual(Circus.map(channels, id),{
                                                    i1:'i1',
                                                    i2: 'i2',
                                                    i3: {
                                                        i4: 'i4',
                                                        i5: 'i5'
                                                    }
                                                })
    })

    test('map - copy', function(){
        return Circus.deepEqual(Circus.map(valBlock),valBlock)
    })

    test('map - prime', function(){
        function prime(s,v){return v}
        return Circus.deepEqual(Circus.map(channels,prime,valBlock),valBlock)
    })

    test('reduce', function(){
        function error(err,s){
            return err || s.name==='i4'}
        return Circus.reduce(channels, error) === true
    })

    test('typeof - Array', function(){
        return Circus.typeOf([]) === Circus.typeOf.ARRAY
    })

    test('typeof - Object', function(){
        return Circus.typeOf({}) === Circus.typeOf.OBJECT
    })

    test('typeof - Date', function(){
        return Circus.typeOf(new Date()) === Circus.typeOf.LITERAL
    })

    test('typeof - String', function(){
        return Circus.typeOf('') === Circus.typeOf.LITERAL
    })

    test('typeof - Number', function(){
        return Circus.typeOf(1) === Circus.typeOf.LITERAL
    })

    test('typeof - Boolean', function(){
        return Circus.typeOf(true) === Circus.typeOf.LITERAL
    })

    test('typeof - Regex', function(){
        return Circus.typeOf(/a/) === Circus.typeOf.LITERAL
    })

})
