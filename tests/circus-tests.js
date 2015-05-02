runTests(function(mock) {

	var app, Signal, Model, View, Intent

	function double(v) {
		return v==='xxxxxxxx'? v : v + v
	}

	setup(function(){
		app = circus(
			circus.model(),
			circus.view(),
			circus.intent()
		)
		
		Signal = circus.signal().__proto__
	})	

	// app
	test(function(){
		return app.model.__proto__ === Signal &&
				app.view.__proto__ === Signal &&
				app.intent.__proto__ === Signal;
	})

	// model state change
	test(function(){
		app.model.push('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	// view state change
	test(function(){
		app.view.push('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	// intent state change
	test(function(){
		app.intent.push('x')
		return app.model.value() === 'x' && 
				app.view.value() === 'x' && 
				app.intent.value() === 'x'
	})

	// model channel extension
	test(function(){
		var model = app.model.map(double)
		var view = app.view.map(double)
		var intent = app.intent.map(double)
		model.push('x')
		return model.value() === 'xxxxxxxx' && 
				view.value() === 'xxxxxxxx' && 
				intent.value() === 'xxxxxxxx'
	})


})


test.print('circus', function(value) {console.log(value)})
