/*
	test.js - originally https://github.com/lhorie/mithril.js/blob/70b24895394b314da45e3a4d27ee24fa90a3fd2c/tests/test.js

	usage:

	runTests('suite name', function(){

		test('test name', function(){
			return 'test'.length === 4
		})

		test('test name with assert', function(){
			return assert('test'.length,0) // Assert failure 4 -> 0
		})

		test('test name with circuit assert', function(){
			return assert({x:y:z:1}}},{x:y:z:2}}}, circuit.deepEqual) // Assert failure {x:y:z:1}}} -> {x:y:z:2}}}
		})

		test('test name with custom assert', function(){
			return assert('test','x', function(v1,v2){return ~v1.indexOf(v2)}) // Assert test failure -> 'x'
		})

		test('async test name', function(done){
			setTimeout(function(){
				done(function() {
					return false
				})
			})
		})

		itest('include test', function(){ // include test
			return true
		})

		xtest('exclude test', function(){ // exclude test
			return false
		})
	})

	irunTests('include suite name'), function(){}) // include suite
	xrunTests('exclude suite name'), function(){}) // exclude suite
*/
try {
	var _global = global
}
catch(e){
	_global = window
	_global.process = {exit: function(){}}
}

var testQueue = [], curSuite, inclusiveTests

_global.setup = function(fn){
	curSuite.setup = fn
}

_global.xrunTests = function() {}

_global.irunTests = function(name,tests) {
	inclusiveTests = true
	startRun(name,tests,true)
}

_global.runTests = function(name,tests){
	startRun(name,tests,false)
}

function startRun(name,registerTests, inclusive) {
	new (function(){
		this.setup = function(){}
		this.total = 0
		this.inclusive = inclusive
		this.title = name
		this.failures = []
		this.tests = []
		var suite = curSuite = this
		registerTests()
		this.tests.unshift(0)
		this.tests.unshift(testQueue.length)
		Array.prototype.splice.apply(testQueue,this.tests)
		testQueue.push(function(){
			if (!inclusiveTests || suite.total > 0) {
				print(suite, function(value) {console.log(value)})
			}
		})
	})()
	var len = testQueue.length
	setTimeout(function(){
		if (testQueue.length==len) wait()
	},100)
}
var testRunning=0,timeout=500,tid=0,rtest
var testsComplete=0, testsSucceeded=0
function wait(){
	if (!testRunning) {
		if (testQueue.length) {
			var test = testQueue.shift()
			test.apply(test)
		}
		if (tid) clearTimeout(tid)
	}
	else {
		tid = setTimeout(function(){
			if (testRunning) {
				testRunning--
			}
			tid=0
		},timeout)
	}
	if (testQueue.length){
		setTimeout(wait)
	}
	else {
		console.log('all tests done. Total ' + testsSucceeded + ' out of ' + testsComplete)
		_global.process.exit(testsComplete - testsSucceeded)
	}
}

_global.xtest = function() {}
_global.itest = function(name,condition) {
	inclusiveTests=true
	startTest(curSuite,name,condition,true)
}

_global.test = function(name,condition) {
	startTest(curSuite,name,condition,false)
}

function startTest(suite, name, condition, inclusive) {
	var fn = condition.toString()

	inclusive = inclusive || suite.inclusive
	suite.tests.push(function() {
		if (inclusiveTests && !inclusive) return

		suite.total++

		var async = /\(\s*done\s*\)/.test(fn)
		runTest.call(suite, name, condition, async)

		return test
	})
}

function runTest(name, condition, async) {

	testsComplete++
	testRunning++
	if (async) testRunning++

	var test = this
	test.setup()

	try {
		test.failures.push(name)
		var result = condition(function(result){
			if (typeof result === 'function') {
				testQueue.unshift(runTest.bind(test,name,result))
				test.failures.pop()
				return
			}
			if (testRunning) {
				testRunning--
				if (result) {
					testsSucceeded++
					test.failures.pop()
				}
			}
		})
		if (!result) {
			return
		}
		testsSucceeded++
		test.failures.pop()
		if (result instanceof assert && result.fail) {
			test.failures.push(name + result.fail)
		}
	}
	catch (e) {
		console.error(e)
		console.log(name, e.stack)
	}
	finally {
		testRunning--
	}

}

_global.assert = function(v1,v2, comp){
	if (this instanceof assert) {
		this.fail = comp(v1,v2)? false : '\nAssert Failure '+JSON.stringify(v1)+' -> '+JSON.stringify(v2)
	}
	else return new assert(v1,v2, comp || function(v1,v2){return v1 === v2})
}

function print(test, print) {
	var failures = test.failures.length? "\nfailures: " + test.failures.length : ''
	try {
		var node = document.createElement('DIV')
		node.appendChild(document.createTextNode(test.title + " tests: " + test.total))
		document.body.appendChild(node)
		for (var i = 0; i < test.failures.length; i++) {
			var pre = document.createElement('PRE')
			pre.style.color='red'
			pre.appendChild(document.createTextNode(test.failures[i].toString()))
			document.body.appendChild(pre)
		}
		var node = document.createElement('DIV')
		node.appendChild(document.createTextNode(failures))
		document.body.appendChild(node)
	}
	catch (e) {
		print(test.title + " tests: " + test.total + failures)
		for (var i = 0; i < test.failures.length; i++) {
			print(test.failures[i].toString())
		}
		if (test.failures.length > 0) {
			print(test.failures.length + " tests did not pass")
		}

	}
}

