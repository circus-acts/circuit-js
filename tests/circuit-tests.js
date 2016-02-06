runTests('circuit', function(mock) {

	var inc = function(v){return v+1}
	var dbl = function(v){return v+v}
	var sqr = function(v){return v*v}

	var app
	setup(function(){
		app = new Circuit({a:'abc'})
	})

	test('new circuit - prime', function() {
		return new Circuit(123).getState()===123
	})

	test('new circuit - prime channels', function() {
		return new Circuit({a:123}).getState().a===123
	})

	test('new circuit - prime channels', function() {
		return new Circuit({a:123}).getState().a===123
	})

	test('new circuit - is signal', function() {
		return Circus.isSignal(app.join())
	})

	test('channels - key signal', function() {
		var a = app.signal(), b=app.signal()
		var c = app.join({
			n: {
				a:a,
				b:b
			}
		}).channels
		return Circus.isSignal(c.n)
	})

	test('fold - pass channel value and change state', function() {
		var r = app.signal().fold(function(acc,v){
			return acc.a+v
		}).value(123)
		return r === 123 && app.getState() === 'abc123'
	})

	test('fold - app', function() {
		app.fold(function(acc,v){
			return {a:acc.a+v}
		}).value(123)
		return app.getState().a === 'abc123'
	})

	test('channel key -> value flow', function(){
		var r,a = app.join({
			a: function(v) {
				return r = v+1
			}
		}).channels.a.map(inc).value(123)

		return a === 124, r === 125
	})

	test('channel value - implied map', function(){
		var r,a = app.join({
			a: function(v) {
				return r = v+1
			}
		}).channels.a.map(inc).value(123)

		return a === 124, r === 125
	})

	test('channel key -> value compose', function(){
		var b=app.signal().map(inc)
		var a=app.join({
			a: b
		}).channels.a.map(inc)
		a.value(123)

		return a.value()===124 && b.value()===125
	})

	test('channel value', function(){
		var a=app.signal().map(inc)
		var r = app.join({
			a: a
		})
		r.value({a:123})

		return a.value()===124 && r.channels.a.value()===123
	})

	test('channel value - literal (always)', function(){
		var r = app.join({
			a: 'a'
		})
		r.channels.a.value(123)
		return r.value().a==='a'
	})

	test('channel value - deep', function(){
		var a=app.signal().map(inc)
		var r = app.join({
			b: {
				a: a
			}
		})
		r.value({b:{a:123}})

		return a.value()===124
	})

	test('circuit value - prime', function(){
		var a=app.signal().map(inc)
		var r = app.join({
			a: a
		})
		r.prime({a:123})

		return a.value()===123 && r.channels.a.value()===undefined
	})

	test('circuit value - join state', function(){
		var a,r = app.join({
			a: app.signal().map(function(v,sv) {
				a=sv
				return v
			})
		})
		r.value('abc')
		r.channels.a.value(123)

		return a==='abc' && r.value().a===123
	})


	test('circuit value - merge state', function(){
		var a,r = app.merge({
			a: app.signal().map(function(v,sv) {
				a=sv
				return v
			})
		})
		r.value('abc')
		r.channels.a.value(123)

		return a==='abc' && r.value()===123
	})

})
