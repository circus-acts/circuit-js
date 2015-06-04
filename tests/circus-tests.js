runTests('circus', function(mock) {

	var app, Signal

	function doubleUp(v) {
		return v<8? v + v : v
	}

	function add1(v) { return v+1 }
	function add2(v) { return v+2 }
	function sub3(v) { return v-3 }

	var isDirty
    function render(model) {
    	if (isDirty) {
    		isDirty = false;
	        app.intent.head(model)
	        return model
    	}
        return circus.FALSE
    }

	setup(function(){
		isDirty = true;
		app = circus.stage(
			circus.model(),
			circus.view().finally().map(render),
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
		return app.model.state() === 'x' && 
				app.view.state() === 'x' && 
				app.intent.state().model === 'x'
	})

	test('view state change', function(){
		app.view.head('x')
		return app.model.state() === 'x' && 
				app.view.state() === 'x' && 
				app.intent.state().model === 'x'
	})

	test('intent state change', function(){
		app.intent.head('x')
		return app.model.state() === 'x' && 
				app.view.state() === 'x' && 
				app.intent.state().model === 'x'
	})

	test('composition', function(){
		app.model.map(add1)
		app.view.map(add2)
		app.intent.map(sub3)
		app.model.head(1)
		return app.model.state() === 2 && 
			   app.view.state() === 4 && 
			   app.intent.state().model === 1
	})

})
