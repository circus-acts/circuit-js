runTests('issues', function(mock) {
	
    test ('deep model retains previous values', function(){
        var m = circus.model([{x:{y:1}}])
        return true
    })
})
