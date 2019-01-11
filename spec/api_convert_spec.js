/**
 * Frisby spec tests for the MathML Cloud API.
 *
 * TODO:
 * - test variety of output formats
 */
var frisby = require('frisby');
var fs = require('fs');
var Joi = require('joi');
var path = require('path');

// Local testing
var baseUrl = 'http://localhost:1337';

var randomUsername = function() {
    return Math.random() * (100 - 0);
}

describe("MathML Cloud API features", function() {
    beforeEach(function() {
        this.users = [];
    });

    afterEach(function(done) {
        User.destroy({username: this.users}, done);
    });

	// Global setup for all tests
	frisby.globalSetup({
	  request: {
	    headers:{'Accept': 'application/json'},
	    inspectOnFailure: true
	  }
	});

	//---- POST /user
	it("Valid User", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(baseUrl + '/user', {
            username: username,
            password: '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            termsOfService: true,
            role: 'user'
        }).
        then(function(res) {
            let json = res.json;
            //---- GET /myFeedback
            //Verify that the newly created user has no feedback.
            frisby.get(baseUrl + "/myFeedback?access_token=" + json.access_token)
                .expect('status', 200)
                .expect('json', {})
                .done(doneFn);
        });
    });

	//---- POST /feedback
	// First create an equation that can be given feedback
    it("Set up equation for feedback", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(baseUrl + '/equation', {
			mathType : 'AsciiMath',
			math : 'a^2+b^2=c^2',
			description : 'true',
			svg : 'true'
		})
		//Then, create a user feedback is from.
            .then(function(res) {
            let equation = res.json;
            // valid user for feedback
                frisby.post(baseUrl + '/user', {
                    username: username,
                    password: '123456',
            	firstName: 'Spec',
            	lastName: 'Valid',
                    termsOfService: true,
                    role: 'user'
        	})
                .then(function(res) {
                let user = res.json;
                // post feedback
                frisby.post(baseUrl + '/equation/' + equation.id + '/feedback', {
                    comments : 'Testing API call',
                    access_token: user.access_token
                })
                    .expect('status', 200)
                    .expect('header', "content-type", "application/json; charset=utf-8")
                    .expect('json', {
                        comments : 'Testing API call',
                        equation : equation.id,
                    })
                    .then(function(res) {
                        let json = res.json;
                        //Verify we have some feedback for the user.
                        frisby.get(baseUrl + '/myFeedback?access_token=' + user.access_token)
                            .expect('status', 200)
                            .expect('jsonTypes', 'feedback.?', {
                                components: Joi.array().required(),
                                equation: Joi.object().required(),
                                submittedBy: Joi.string().required()
                            })
                            .done(doneFn);
                    });
            })
        })
	});

	//---- POST /equation
    it("Convert ASCII math", function(doneFn) {
        frisby.post(baseUrl + '/equation', {
			mathType : 'AsciiMath',
			math : 'a^2+b^2=c^2',
			description : 'true'
		})
            .expect('status', 200)
            .expect('header', "content-type", "application/json; charset=utf-8")
            .then(function(res) {
                let json = res.json;
                expect(json.components[0]['format']).toEqual('description');
                expect(json.components[0]['source']).toEqual(
                    'a squared plus b squared equals c squared');
            })
            .then(function(res) {
                let json = res.json;
                //---- GET /equation/{id}
                frisby.get(baseUrl + '/equation/' + json.id)
                    .expect('status', 200)
                    .expect('header', "content-type", "application/json; charset=utf-8")
                    .expect('json', "components.?", {
                        format : "description"
                    });
            })
            .then(function(res) {
                let json = res.json;
                //---- GET /component/{id}
                frisby.get(baseUrl + '/component/' + json.components[0].id)
                    .expect('status', 200)
                    .expect('header', "content-type", "text/html; charset=utf-8")
                    .expect('bodyContains', 'a squared plus b squared equals c squared')
            })
    .done(doneFn);
    });

    it("converts MathML to PNG", function(doneFn) {
        frisby.post(baseUrl + '/equation', {
            mathType: 'MathML',
            math: '<math><mi>&pi;</mi><mo>&InvisibleTimes;</mo><msup><mi>r</mi><mn>2</mn></msup></math>',
            png: 'true'
        })
        .expect('status', 200)
        .expect('header', 'content-type', 'application/json; charset=utf-8')
        .then(function(res) {
            let equation = res.json;
            expect(equation.components[0].format).toEqual('png');
            expect(equation.components[0].source).toMatch(/^<img src="data:image\/png;[^"]+" alt="pi times r squared"/);
        })
        .done(doneFn);
    });

	// Set up the HTML5 file posting
	var html5Path = path.resolve(__dirname, './data/sample-math.html');
    var form = frisby.formData();
	form.append('outputFormat', 'svg');
    form.append('html5', fs.createReadStream(html5Path));
    var contentType = form.getHeaders()['content-type'];

	//---- POST /html5
    it("Post HTML5", function(doneFn) {
        frisby.post(baseUrl + '/html5', {
            body: form,
            headers: {
                'Content-Type': contentType
            }

        })
        .expect('status', 202)
        .expect('header', "content-type", "application/json; charset=utf-8")
        .expect('json', {
			outputFormat : 'svg',
			"status" : 'accepted'
		})
        .then(function(res) {
            let json = res.json;
			//---- GET /html5/{id}
            frisby.get(baseUrl + '/html5/' + json.id)
                .expect('status', 200)
                .expect('header', "content-type", "application/json; charset=utf-8")
                .expect('json', {
					filename : "sample-math.html",
					outputFormat : "svg",
                });
		})
        .then(function(res) {
            let json = res.json;
			//---- GET /html5/{id}/output
            frisby.get(baseUrl + '/html5/' + json.id + '/output')
                .expect('status', 200)
                .expect('header', "content-type", "text/html; charset=utf-8");
		})
        .then(function(res) {
            let json = res.json;
			//---- GET /html5/{id}/source
            frisby.get(baseUrl + '/html5/' + json.id + '/source')
                .expect('status', 200)
                .expect('header', "content-type", "text/html; charset=utf-8")
                .done(doneFn);
        });
    });
});
