var frisby = require('frisby');

var base_url = 'http://localhost:1337';

describe("MathML Cloud Error Responses", function() {
	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json'},
	    inspectOnFailure: true,
        baseUri: base_url
	  }
	});

	frisby.create("Invalid file upload type")
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
