runTests('circus', function(mock) {

	var app, Signal

	function doubleUp(v) {
		return v<8? v + v : v
	}

    function render(model) {
        return app.intent.head(model)
    }

	setup(function(){
		app = circus.stage(
			circus.model(),
			circus.view(render),
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
		app.model.head('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	test('view state change', function(){
		app.view.head('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	test('intent state change', function(){
		app.intent.head('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	test('composition', function(){
		app.model.map(doubleUp)
		app.view.map(doubleUp)
		app.intent.map(doubleUp)
		app.model.head(1)
		return app.model.value() === 8 && 
			   app.view.value() === 8 && 
			   app.intent.value() === 8
	})


})
