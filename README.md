[![Build Status](https://travis-ci.org/philtoms/circus.svg?branch=master)](https://travis-ci.org/philtoms/circus)

# circus

A fake XHR handler for testing Mithril apps

## Installation
 ```shell
npm install --save-dev circus
```

## Use cases
```javascript

  // pass the window context into the fake
  var fakeXHR = require('circus')(mock || window);
  
	// Mocking

	// expected
	test(function() {
		var response = fakeXHR('get','/test1');
		m.request({method:'GET', url:'/test1'});
		return response.count==1;
	});

	// unexpected
	test(function() {
		m.request({method:'GET', url:'/test/xxx'});
		return fakeXHR.unexpectedRequests !== 0;
	});

	// unexpected payload
	test(function() {
		fakeXHR('post','/test4', {p1:1,p2:2});
		m.request({method:'POST', url:'/test4', data:{p1:'xx',p2:'yyy'}})
		return fakeXHR.unexpectedRequests !== 0;
	});


	// unresolved
	test(function() {
		var response = fakeXHR('get','/test1/yyy');
		return response.count === 0;
	});

	// Stubbing

	// GET
	test(function() {
		var data;
		fakeXHR('get','/test2').respondWith('abc');
		m.request({method:'GET', url:'/test2'}).then(function(response){
			data = response;
		});
		return data=='abc';
	});

	// params
	test(function() {
		var data;
		fakeXHR('get','/test3\\?p1=1&p2=2').respondWith({p1:'one',p2:'two'});
		m.request({method:'GET', url:'/test3?p1=1&p2=2'}).then(function(response){
			data = response;
		});
		return data.p1==='one' && data.p2==='two';
	});

	// regex params
	test(function() {
		var data;
		fakeXHR('get','/test3\\?p1=.+&p2=\\d+').respondWith({p1:'ABC',p2:'onetwothree'});
		m.request({method:'GET', url:'/test3?p1=abc&p2=123'}).then(function(response){
			data = response;
		});
		return data.p1==='ABC' && data.p2==='onetwothree';
	});

	// POST
	test(function() {
		var data;
		fakeXHR('post','/test4').respondWith({p1:'one',p2:'two'});
		m.request({method:'POST', url:'/test4', data:{p1:1,p2:2}}).then(function(response){
			data = response;
		});
		return data.p1==='one' && data.p2==='two';
	});

	// errors
	test(function() {
		var data;
		fakeXHR('get','/test6').respondWith(404,'file not found');
		m.request({method:'GET', url:'/test6'}).then(undefined, function(response){
			data=response;
		});
		return data==='file not found';
	});

	// reset
	test(function() {
		fakeXHR('get','/test/7');
		fakeXHR.reset();
		m.request({method:'GET', url:'/test/7'});
		return fakeXHR.unexpectedRequests !== 0;
	});

	// passthrough
	test(function() {
		var data;
		var response = fakeXHR('get','/test5').passthrough();
		m.request({method:'GET', url:'/test5'}).then(function(response){
			data = response;
		});
		return data === 'ABC';
	});

	// modify response data
	test(function() {
		var data;
		var response = fakeXHR('get','/test5').passthrough(function(status,data){
			return {status:status,data:'DEF'}
		});
		m.request({method:'GET', url:'/test5'}).then(function(response){
			data = response;
		});
		return data === 'DEF';
	});

	// modify response status
	test(function() {
		var data;
		var response = fakeXHR('get','/test5').passthrough(function(status,data){
			return {status:403,data:'Forbidden'}
		});
		m.request({method:'GET', url:'/test5'}).then(null,function(response){
			data = response;
		});
		return data=='Forbidden';
	});

	// errors
	test(function() {
		var data;
		fakeXHR('get','/test6').respondWith(404,'file not found');
		m.request({method:'GET', url:'/test6'}).then(undefined, function(response){
			data=response;
		});
		return data==='file not found';
	});

	// reset
	test(function() {
		fakeXHR('get','/test/7');
		fakeXHR.reset();
		m.request({method:'GET', url:'/test/7'});
		return fakeXHR.unexpectedRequests !== 0;
	});

```

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. 


