runTests('circus', function(mock) {

	var app, Signal

	function add1(v) { return v+1 }
	function add2(v) { return v+2 }
	function sub3(v) { return v-3 }

	var isDirty
    function render(model) {
    	if (isDirty) {
    		isDirty = false;
	        app.intent.value(model)
	        return model
    	}
        return circus.FALSE
    }

	setup(function(){
		isDirty = true;
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
		app.model.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().data === 'x'
	})

	test('view state change', function(){
		app.view.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().data === 'x'
	})

	test('intent state change', function(){
		app.intent.value('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value().data === 'x'
	})

	test('composition', function(){
		app.model.map(add1)
		app.view.map(add2)
		app.intent.map(sub3)
		app.model.value(1)
		return 	app.model.history().toString() === '2,0'
				app.model.value() === 0 && 
			   	app.view.value() === 4 && 
			   	app.intent.value().data === -1
	})

})
