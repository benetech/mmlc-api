var frisby = require('frisby');
var fs = require('fs');
var path = require('path');

var baseUrl = 'http://localhost:1337';

// Set up an HTML5 file posting
var create_form = function(filePath, format) {
	var html5Path = path.resolve(__dirname, filePath);
    var form = frisby.formData();
	form.append('outputFormat', format);
    form.append('html5', fs.createReadStream(html5Path));
    return form;
};

describe("MathML Cloud Error Responses", function() {
	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json', 'Content-Type': 'json'},
	    inspectOnFailure: true,
	  }
	});

    //---- Invalid file upload
	var invalid_form = create_form('./data/sample-math.zip', 'svg');
	
    it("Invalid file upload type", function(doneFn) {
        frisby.post(baseUrl + '/html5',
			{
                body: invalid_form,
			    headers: {
                    'Content-Type': invalid_form.getHeaders()['content-type']
			    }
			}
		)
            .expect('status', 400)
            .expect('header', "content-type", "application/json; charset=utf-8")
            .expect('json', {
			errorCode: "24",
			message: "Only HTML5 files are supported."
		})
            .done(doneFn);
    });

    //---- Requesting response in something other than JSON
		// TODO: It doesn't seem like Sails is easily set up to return anything
		// other than JSON.
    xit("Set up equation for test", function(doneFn) {
		// .post('/equation', {
		// 	mathType : 'AsciiMath',
		// 	math : 'a^2+b^2=c^2',
		// 	svg : 'true'
		// })
		//         .afterJSON(function(json) {
		//             frisby.create("Unsupported media type")
		//                 .get('/equation/' + json.id, {
		//                     headers: {
		//                         "Accept": "application/xml"
		//                     }
		//                 })
		//                 .expectStatus(415)
		//                 .expectJSON({
		//                     errorCode: "41",
		//                     message: "Unsupported media type request. Only JSON is supported."
		//                 })
		//                 .toss();
		//         })
		// .toss();
    });

    //---- Using an unsupported HTTP method
    // Sails doesn't provide an easy way to detect these, and just returns
    // a 404 when a match isn't found in routes.js
    it("HTTP method not supported", function(doneFn) {
        frisby.put(baseUrl + '/equation', {
			mathType : 'AsciiMath', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			svg : 'true'
		})
        .expect('status', 404)
        .done(doneFn);
    });

    //---- Using an unsupported math input type
    it("Unsupported math type", function(doneFn) {
        frisby.post(baseUrl + '/equation', {
			mathType : 'English', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			svg : 'true'
		})
        .expect('status', 400)
        .expect('json', {
            code: "E_INVALID_NEW_RECORD",
        })
        .done(doneFn);
    });

    //---- Asking for an unknown equation
    it("Equation ID not found", function(doneFn) {
        frisby.get(baseUrl + '/equation/12345')
        .expect('status', 404)
        .expect('json', {
            errorCode: "30",
            message: "Equation not found: 12345"
        })
        .done(doneFn);
    });

    //---- Uploading a file with bad HTML
		// TODO: How bad does the HTML have to be before MathJax complains?
    var invalid_html = create_form('./data/invalid-html-math.html', 'svg');

    xit("Invalid HTML", function(doneFn) {
        // .post('/html5',
        //     invalid_html,
        //     {
        //         json: false,
        //         headers: {
        //           'content-type': 'multipart/form-data; boundary=' + invalid_html.getBoundary(),
        //           'content-length': invalid_html.getLengthSync()
        //         },
        //     }
        // )
        // .expectStatus(400)
        // .expectHeaderContains("content-type", "application/json")
        // .expectJSON({
        //     errorCode: "23",
        //     message: "Invalid HTML."
        // })
        // .toss();
    });

    //---- Uploading a file encoded other than UTF-8
		// TODO: How much does MathJax really care about the encoding?
    var invalid_encoding = create_form('./data/invalid-encoding-math.html', 'svg');

    xit("Unsupported encoding", function(doneFn) {
        // .post('/html5',
        //     invalid_encoding,
        //     {
        //         json: false,
        //         headers: {
        //           'content-type': 'multipart/form-data; boundary=' + invalid_encoding.getBoundary(),
        //           'content-length': invalid_encoding.getLengthSync()
        //         },
        //     }
        // )
        // .expectStatus(400)
        // .expectHeaderContains("content-type", "application/json")
        // .expectJSON({
        //     errorCode: "22",
        //     message: "Unsupported text encoding. Must be UTF-8."
        // })
        // .toss();
    });

    //---- Asking for an unsupported output format
    var invalid_output = create_form('./data/sample-math.html', 'jpg');
    var contentType = invalid_output.getHeaders()['content-type'];

    it("Unsupported output format", function(doneFn) {
        frisby.post(baseUrl + '/html5', {
            body: invalid_output,
            headers: { 'Content-Type': contentType }
        })
        .expect('status', 400)
        .expect('header', "content-type", "application/json; charset=utf-8")
        .expect('json', {
            code: "E_INVALID_NEW_RECORD",
        })
        .done(doneFn);
    });

});
