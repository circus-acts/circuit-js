runTests('circus', function(mock) {

	var app, Signal

	function add1(v) { 
		return {data:v.data+1}
	}
	function add2(v) { 
		return {data:v.data+2} 
	}
	function sub3(v) { 
		return v-3
	}

	var once
    function render(model) {
    	if (once) {
    		once = false;
	        app.intent.value(model.data)
	        return model
    	}
        return circus.FALSE
    }

    var channels = circus.signal().join({
        i1:circus.signal(),
        i2:circus.signal(),
        i3: {
            i4:circus.signal(),
            i5:circus.signal([5])
        }
	});

	setup(function(){
		once = true;
		app = circus.fold(
			circus.model().keep(),
			circus.view().map(render),
			circus.intent()
		)
		
		Signal = circus.signal().__proto__
	})	

	test('app',function(){
		return app.model.__proto__ === Signal &&
				app.view.__proto__ === Signal &&
				app.intent.__proto__ === Signal;
	})

	test('model state change', function(){
		app.model.value({data:'x'})
		return app.model.value().data === 'x' && 
				app.view.value().data === 'x' && 
				app.intent.value().data === 'x'
	})

	test('view state change', function(){
		app.view.value({data:'x'})
		return app.model.value().data === 'x' && 
				app.view.value().data === 'x' && 
				app.intent.value().data === 'x'
	})

	test('intent state change', function(){
		app.intent.value('x')
		return app.model.value().data === 'x' && 
				app.view.value().data === 'x' && 
				app.intent.value().data === 'x'
	})

	test('composition', function(){
		app.model.map(add1)
		app.view.map(add2)
		app.intent.map(sub3)
		app.model.value({data:1})
		return app.model.value().data === 0 && 
			   app.view.value().data === 4 && 
			   app.intent.value().data === -1
	})


    test('stamp - default', function(){
        return circus.deepEqual(circus.stamp(channels),{
                                                    i1:'',
                                                    i2: '',
                                                    i3: {
                                                        i4: '',
                                                        i5: ''
                                                    }
                                                })
    })


    test('stamp - fn', function(){
        function set(k){return k==='i4'}
        return circus.deepEqual(circus.stamp(channels, set),{
                                                    i1:false,
                                                    i2: false,
                                                    i3: {
                                                        i4: true,
                                                        i5: false
                                                    }
                                                })
    })

})
