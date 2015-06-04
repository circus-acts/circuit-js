//make "use strict" and nodejs happy
var window = this

//test reporting for saucelabs
if (typeof window != "undefined") {
	window.global_test_results = {
		tests: [],
		duration: 0,
		passed: 0,
		failed: 0
	};
}

if (!this.console) {
	var log = function(value) {document.write("<pre>" + value + "</pre>")}
	this.console = {log: log, error: log}
}

var testQueue = [], curTest, inclusiveTests
function xrunTests() {}
function runTests(name,tests) {
	var test = function(){
		this.setup = function(){}
		this.total = 0
		this.title = name
		this.failures = []
		this.tests = []
		var test = curTest = this
		tests(mock.window)
		this.tests.unshift(0)
		this.tests.unshift(testQueue.length)
		Array.prototype.splice.apply(testQueue,this.tests)
		testQueue.push(function(){
			if (!inclusiveTests || test.total > 0) {
				print(test, function(value) {this.console.log(value)})
			}
		})
	}
	new test()
	var len = testQueue.length
	setTimeout(function(){
		if (testQueue.length==len) wait()
	},100)
	//if (testQueue.length==1) wait()
}
var testRunning=0, waitCount=0
function wait(){
	if (!testRunning) {
		if (testQueue.length) {
			waitCount = 0
			var test = testQueue.shift()
			test.apply(test)
		}
		if (testQueue.length){
			setTimeout(wait)
		}
	}
}

function setup(fn){
	curTest.setup = fn
}

function xtest() {}
function itest(name,condition) {
	inclusiveTests=true
	test(name,condition,true)
}
function test(name,condition, inclusive) {
	var test = curTest
	curTest.tests.push(function() {
		
		if (inclusiveTests && !inclusive) return

		test.total++
		var duration = 0
		var start = 0

		if (typeof performance != "undefined" && performance.now) {
			start = performance.now()
		}

		var fn = condition.toString()
		var async = /function\s*\(\s*\)/m.test(fn) === false
		var result = runTest.call(test,name + '\n' + fn, condition, async)

		if (typeof performance != "undefined" && performance.now) {
			duration = performance.now() - start
		}

		if (typeof window != "undefined") {
			window.test_obj = {
				name: "" + test.total,
				result: result,
				duration: duration
			}

			if (!result) {
				window.global_test_results.tests.push(window.test_obj)
			}

			window.global_test_results.duration += duration
			if (result) {
				window.global_test_results.passed++
			} else {
				window.global_test_results.failed++
			}
		}	

	})
}

function runTest(name,condition, async) {

	testRunning++

	var test = this
	var result = true
	var duration = 0
	if (!async) {
		test.setup()
	}

	try {
		if (!condition(function(done){
			testQueue.unshift(runTest.bind(test,name,done))
			return true
		})) {
			throw new Error("failed")
		}
	}
	catch (e) {
		result = false
		console.error(e)
		console.log(name, e.stack)
		test.failures.push(name)
	}

	testRunning--
	return result
}

function print(test, print) {
	try {
		var node = document.createElement('DIV')
		var failures = test.failures.length? "\nfailures: " + test.failures.length : ''
		node.appendChild(document.createTextNode(test.title + " tests: " + test.total + failures))
		document.body.appendChild(node)
		for (var i = 0; i < test.failures.length; i++) {
			print(test.failures[i].toString())
			node = document.createElement('PRE')
			node.appendChild(document.createTextNode(test.failures[i].toString()))
			document.body.appendChild(node)
		}
	}
	catch (e) {}
	print(test.title + " tests: " + test.total + failures)

	if (test.failures.length > 0) {
		throw new Error(test.failures.length + " tests did not pass")
	}
}
