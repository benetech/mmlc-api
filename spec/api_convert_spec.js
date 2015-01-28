/**
 * Frisby spec tests for the MathML Cloud API.
 *
 * TODO:
 * - test variety of output formats
 * - test failure conditions
 */
var frisby = require('frisby');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');

// Local testing
var base_url = 'http://localhost:1337';

describe("MathML Cloud API features", function() {
	
	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json'},
	    inspectOnFailure: true,
        baseUri: base_url
	  }
	});

	//---- POST /feedback
	// First create an equation that can be given feedback
	frisby.create("Set up equation for feedback")
		.post('/equation', {
			mathType : 'AsciiMath', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			svg : 'true'
		})
		.afterJSON(function(json) {
			frisby.create("Post feedback")
				.post('/feedback', {
					equation : json.id,
					comments : 'Testing API call',
				})
				.expectStatus(200)
				.expectHeaderContains("content-type", "application/json")
				.expectJSON({
					comments : 'Testing API call',
					equation : json.id,
				})
				.toss();
		})
		.toss();

	//---- POST /equation
	frisby.create("Convert ASCII math")
		.post('/equation', {
			mathType : 'AsciiMath',
			math : 'a^2+b^2=c^2',
			description : 'true'
		})
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "description",
			source : 'a squared plus b squared equals c squared'
		})
		.afterJSON(function(json) {
			//---- GET /equation/{id}
			frisby.create("Get equation")
				.get('/equation/' + json.id)
				.expectStatus(200)
				.expectHeaderContains("content-type", "application/json")
				.expectJSON("components.?", {
					format : "description",
				})
				.toss();
		})
		.afterJSON(function(json) {
			//---- GET /component/{id}
			frisby.create("Get component")
				.get('/component/' + json.components[0].id)
				.expectStatus(200)
				.expectHeaderContains("content-type", "text/html")
				.expectBodyContains('a squared plus b squared equals c squared')
				.toss();
		})
		.toss();

	// Set up the HTML5 file posting
	var html5Path = path.resolve(__dirname, './data/sample-math.html');
	var form = new FormData();
	form.append('outputFormat', 'svg');
	form.append('html5', fs.createReadStream(html5Path), {
		// we need to set the knownLength so we can call  form.getLengthSync()
		knownLength: fs.statSync(html5Path).size
	});

	//---- POST /html5
	frisby.create("Post HTML5")
		.post('/html5',
			form,
			{
			    json: false,
			    headers: {
			      'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
			      'content-length': form.getLengthSync()
			    },
			}
		)
		.expectStatus(202)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON({
			outputFormat : 'svg',
			"status" : 'accepted'
		})
		.afterJSON(function(json) {
			//---- GET /html5/{id}
			frisby.create("Get HTML5 resource")
				.get('/html5/' + json.id)
				.expectStatus(200)
				.expectHeaderContains("content-type", "application/json")
				.expectJSON( {
					filename : "sample-math.html",
					outputFormat : "svg",
				})
				.toss();
		})
		.afterJSON(function(json) {
			//---- GET /html5/{id}/output
			frisby.create("Get HTML5 output")
				.get('/html5/' + json.id + '/output')
				.expectStatus(200)
				.expectHeaderContains("content-type", "text/html")
				.toss();
		})
		.afterJSON(function(json) {
			//---- GET /html5/{id}/source
			frisby.create("Get HTML5 source")
				.get('/html5/' + json.id + '/source')
				.expectStatus(200)
				.expectHeaderContains("content-type", "text/html")
				.toss();
		})
		.toss();
});
