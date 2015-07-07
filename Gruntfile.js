module.exports = function(grunt) {
	_ = require('lodash');

	var inputFolder = "./docs";
	var tempFolder = "./temp";
	var archiveFolder = "./archive";
	var outputFolder = "../circus";


	var sauceBrowsers =[
		{ browserName: 'firefox', version: '19', platform: 'XP' },
		{ browserName: "internet explorer", platform: "XP", version: "6"},
		{ browserName: "safari", platform: "OS X 10.9", version: "7"},
		{ browserName: "iPad", platform: "OS X 10.9", version: "7.1"},
		{ browserName: "opera", platform: "Linux", version: "12"},
		{ browserName: "chrome", platform: "XP", version: "26"},
		{ browserName: "chrome", platform: "Windows 8", version: "26"}
	];

	var sauceOnTestComplete = function(result, callback) {
		var request = require('request');

		var user = process.env.SAUCE_USERNAME;
		var pass = process.env.SAUCE_ACCESS_KEY;

		request.put({
			url: ['https://saucelabs.com/rest/v1', user, 'jobs', result.job_id].join('/'),
			auth: { user: user, pass: pass },
			json: { passed: result.passed }
		}, function (error, response, body) {
			if (error) {
				callback(error);
			} else if (response.statusCode !== 200) {
				callback(new Error('Unexpected response status: '
					+ response.statusCode + "\n "));
			} else {
				callback(null, result.passed);
			}
		});
	};

	var sauceBaseOptions = {
		username: process.env.SAUCE_USERNAME,
		key: process.env.SAUCE_ACCESS_KEY,
		testname: "Mithril Fake Xhr Tests " + new Date().toJSON(),
		browsers: sauceBrowsers,
		sauceConfig: {
			"record-video": false,
			"record-screenshots": false,
		},
		build: process.env.TRAVIS_JOB_ID,
		onTestComplete: sauceOnTestComplete,
		tunnelTimeout: 5,
	};
	var sauceCustomOptions = {
		testname: "Mithril Fake Xhr Custom Tests "+ new Date().toJSON(),
		urls: ["http://127.0.0.1:8000/tests/index.html"],
	};
	_.assign(sauceCustomOptions, sauceBaseOptions);
	var sauceQunitOptions = {
		testname: "qUnit Tests "+ new Date().toJSON(),
		urls: ["http://127.0.0.1:8000/tests/e2e/test.html"],
	};
	_.assign(sauceQunitOptions, sauceBaseOptions);

	var pkg = grunt.file.readJSON("package.json");
	var version = pkg.version
	console.log(version)
	var currentVersionArchiveFolder = archiveFolder + "/v" + version;
	grunt.initConfig({
		uglify: {
			options: {banner: "/*\nCircus.js v" + version + "\nhttp://github.com/philtoms/circus.js\n(c) Phil Toms\nLicense: MIT\n*/", sourceMap: true},
			circus: {src: currentVersionArchiveFolder+"/circus.js", dest: "circus.min.js"}
		},
		concat: {
			uglify: {
				src: [
				"./src/circus.js", 
				"./src/signal.js", 
				"./src/model.js",
				"./src/view.js", 
				"./src/intent.js", 
				], 
				dest: currentVersionArchiveFolder + "/circus.js"},

			test: {
				src: [
				"./tests/test.js", "./tests/mock.js", 
				"./src/circus.js", 
				"./src/signal.js", 
				"./src/model.js",
				"./src/view.js", 
				"./src/intent.js", 
				"./tests/signal-tests.js",
				"./tests/model-tests.js",
				"./tests/view-tests.js",
				"./tests/intent-tests.js",
				"./tests/circus-tests.js"
				], 
				dest: currentVersionArchiveFolder + "/circus-tests.js"}
		},
		replace: {
			options: {force: true, patterns: [{match: /\.md/g, replacement: ".html"}, {match: /\$version/g, replacement: version}]},
			links: {expand: true, flatten: true, src: [tempFolder + "/**/*.html"], dest: currentVersionArchiveFolder + "/"},
			index: {src: inputFolder + "/layout/index.html", dest: currentVersionArchiveFolder + "/index.html"},
			commonjs: {expand: true, flatten: true, src: [inputFolder + "/layout/*.json"], dest: currentVersionArchiveFolder},
			cdnjs: {src: "deploy/cdnjs-package.json", dest: "../cdnjs/ajax/libs/circus/package.json"}
		},
		copy: {
			unminified: {src: "circus.js", dest: currentVersionArchiveFolder + "/circus.js"},
			publish: {expand: true, cwd: currentVersionArchiveFolder, src: "./**", dest: outputFolder},
			archive: {expand: true, cwd: currentVersionArchiveFolder, src: "./**", dest: outputFolder + "/archive/v" + version},
		},
		execute: {
			tests: {src: [currentVersionArchiveFolder + "/circus-tests.js"]}
		},
		qunit: {
			all: ['tests/e2e/**/*.html']
		},
		"saucelabs-custom": {
			all:{
				options: sauceCustomOptions
			}
		},
		"saucelabs-qunit": {
			all:{
				options: sauceQunitOptions
			}
		},
		watch: {},

		connect: {
			server: {
				options: {
					port: 8888,
					base: '.'
				}
			}
		},
		clean: {
			options: {force: true},
			generated: [tempFolder]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-saucelabs');

	grunt.registerTask("build", ["test", "uglify", "replace", "copy", "clean"]);
	grunt.registerTask("test", ["concat", "execute"]);
	grunt.registerTask("default", ["build"]);

	grunt.registerTask("sauce-qunit", ["connect", "saucelabs-qunit"]);
	grunt.registerTask("sauce-custom", ["connect", "saucelabs-custom"]);
	grunt.registerTask("sauce-all", ["connect", "saucelabs-qunit", "saucelabs-custom"]);
};
