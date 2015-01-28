var frisby = require('frisby');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');

var base_url = 'http://localhost:1337';

// Set up an HTML5 file posting
var create_form = function(filePath, format) {
	var html5Path = path.resolve(__dirname, filePath);
	var form = new FormData();
	form.append('outputFormat', format);
	form.append('html5', fs.createReadStream(html5Path), {
		// we need to set the knownLength so we can call  form.getLengthSync()
		knownLength: fs.statSync(html5Path).size
	});
    return form;
};

describe("MathML Cloud Error Responses", function() {
	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json', 'Content-Type': 'json'},
	    inspectOnFailure: true,
        baseUri: base_url
	  }
	});

	var invalid_form = create_form('./data/sample-math.zip', 'svg');
	
	frisby.create("Invalid file upload type")
		.post('/html5',
			invalid_form,
			{
			    json: false,
			    headers: {
			      'content-type': 'multipart/form-data; boundary=' + invalid_form.getBoundary(),
			      'content-length': invalid_form.getLengthSync()
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
        .get('/equation/12345', {
            headers: {
                "Accept": "application/xml"
            }
        })
        .expectStatus(400)
        .expectJSON({
            errorCode: "41",
            message: "Unsupported media type request. Only JSON is supported."
        })
		.toss();
	
	frisby.create("HTTP method not supported")
        .put('/equation/12345')
        .expectStatus(400)
        .expectJSON({
            errorCode: "40",
            message: "HTTP method not supported. See 'Allows' header for possible values."
        })
        .expectHeader('Allows', 'GET')
		.toss();
	
	frisby.create("Unsupported math type")
		.post('/equation', {
			mathType : 'English', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			svg : 'true'
		})
        .expectStatus(400)
        .expectJSON({
            errorCode: "20",
            message: "Unsupported math type specified. Must be one of AsciiMath, LaTeX or MathML."
        })
		.toss();
	
	frisby.create("Equation ID not found")
        .get('/equation/12345')
        .expectStatus(400)
        .expectJSON({
            errorCode: "30",
            message: "MathML ID not found."
        })
		.toss();

    var invalid_html = create_form('./data/invalid-html-math.html', 'svg');

    frisby.create("Invalid HTML")
            .post('/html5',
                invalid_html,
                {
                    json: false,
                    headers: {
                      'content-type': 'multipart/form-data; boundary=' + invalid_html.getBoundary(),
                      'content-length': invalid_html.getLengthSync()
                    },
                }
            )
            .expectStatus(400)
            .expectHeaderContains("content-type", "application/json")
            .expectJSON({
                errorCode: "23",
                message: "Invalid HTML."
            })
        .toss();

    var invalid_encoding = create_form('./data/invalid-encoding-math.html', 'svg');

    frisby.create("Unsupported encoding")
            .post('/html5',
                invalid_encoding,
                {
                    json: false,
                    headers: {
                      'content-type': 'multipart/form-data; boundary=' + invalid_encoding.getBoundary(),
                      'content-length': invalid_encoding.getLengthSync()
                    },
                }
            )
            .expectStatus(400)
            .expectHeaderContains("content-type", "application/json")
            .expectJSON({
                errorCode: "22",
                message: "Unsupported text encoding. Must be UTF-8."
            })
        .toss();
	
    var invalid_output = create_form('./data/sample-math.html', 'jpg');

    frisby.create("Unsupported encoding")
            .post('/html5',
                invalid_output,
                {
                    json: false,
                    headers: {
                      'content-type': 'multipart/form-data; boundary=' + invalid_output.getBoundary(),
                      'content-length': invalid_output.getLengthSync()
                    },
                }
            )
            .expectStatus(400)
            .expectHeaderContains("content-type", "application/json")
            .expectJSON({
                errorCode: "21",
                message: "Unsupported output format requested. Must be one of svg, png, description, mml."
            })
        .toss();

});
