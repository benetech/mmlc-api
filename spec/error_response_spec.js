var frisby = require('frisby');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');

var base_url = 'http://localhost:1337';

describe("MathML Cloud Error Responses", function() {
	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json', 'Content-Type': 'json'},
	    inspectOnFailure: true,
        baseUri: base_url
	  }
	});

	// Set up the HTML5 file posting
	var html5Path = path.resolve(__dirname, './data/sample-math.zip');
	var form = new FormData();
	form.append('outputFormat', 'svg');
	form.append('html5', fs.createReadStream(html5Path), {
		// we need to set the knownLength so we can call  form.getLengthSync()
		knownLength: fs.statSync(html5Path).size
	});
	
	frisby.create("Invalid file upload type")
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
		.expectStatus(400)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON({
			errorCode: "24",
			message: "Only HTML5 files are supported."
		})
		.toss();
	
	frisby.create("Unsupported media type")
		.toss();
	
	frisby.create("HTTP method not supported")
		.toss();
	
	frisby.create("Unsuported encoding")
		.toss();
	
	frisby.create("Unsupported math type")
		.toss();
	
	frisby.create("Unsupported output format")
		.toss();
	
	frisby.create("Invalid HTML")
		.toss();
	
	frisby.create("Equation ID not found")
		.toss();
});
