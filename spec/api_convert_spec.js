// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

// Local testing
var base_url = 'http://localhost:1337';
//var base_url = 'https://mathmlcloud.azure-api.net';
//var base_url = 'https://104.40.56.172'; // mathmlcloud.azure-api.net
//var base_url = 'http://23.101.204.234'; // mathml-cloud.cloudapp.net

var subscription_key = '6b442c2169084711afdd43ad5ba1dfeb';

describe("Simple math conversion", function() {

	//---- GET /component/{id}
	frisby.create("Get component")
		.get(base_url + '/component/' + '54874e6562848a90ab0d79bc', 
			{
				"subscription-key" : subscription_key
			}
		)
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "description",
			id : '54874e6562848a90ab0d79bc'
		})
		.toss();

	//---- GET /html5/{id}
	frisby.create("Get HTML5 resource")
		.get(base_url + '/html5/5488c31ffe04afd5269505aa', 
			{
				"subscription-key" : subscription_key
			}
		)
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("equations.components.?", {
			format : "svg",
		})
		.toss();

	//---- GET /html5/{id}/output
	frisby.create("Get HTML5 output")
		.get(base_url + '/html5/5488c31ffe04afd5269505aa/output', 
			{
				"subscription-key" : subscription_key
			}
		)
		.expectStatus(200)
		.expectHeaderContains("content-type", "text/html")
		.toss();

	//---- GET /html5/{id}/source
	frisby.create("Get HTML5 source")
		.get(base_url + '/html5/5488c31ffe04afd5269505aa/source', 
			{
				"subscription-key" : subscription_key
			}
		)
		.expectStatus(200)
		.expectHeaderContains("content-type", "text/html")
		.toss();

	//---- POST /feedback
	frisby.create("Post feedback")
		.post(base_url + '/feedback', {
			equation : '548f485768ac0ce559cab52f', 
			comments : 'Testing API call',
			"subscription-key" : subscription_key
		})
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "description",
			source : 'a squared plus b squared equals c squared'
		})
		.toss();

	//**** NOT YET WORKING ****
	
	//---- GET /equation/{id}
	frisby.create("Get equation")
		.get(base_url + '/equation/' + '548f485768ac0ce559cab52f', 
			{
				"subscription-key" : subscription_key
			}
		)
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "svg",
			id : '548f485768ac0ce559cab53b'
		})
		.toss();
		
	//---- POST /equation
	frisby.create("Convert ASCII math")
		.post(base_url + '/equation', {
			mathType : 'AsciiMath', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			"subscription-key" : subscription_key
		})
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "description",
			source : 'a squared plus b squared equals c squared'
		})
		.toss();
	
	//---- POST /equation/svg
	frisby.create("Convert ASCII math to SVG")
		.post(base_url + '/equation/svg', {
			mathType : 'AsciiMath', 
			math : 'a^2+b^2=c^2',
			description : 'true',
			"subscription-key" : subscription_key
		})
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON("components.?", {
			format : "description",
			source : 'a squared plus b squared equals c squared'
		})
		.toss();
	
	//---- POST /html5
	// TODO: submit form data
	frisby.create("Post HTML5")
		.post(base_url + '/html5', {
			"subscription-key" : subscription_key
		})
		.expectStatus(200)
		.expectHeaderContains("content-type", "application/json")
		.expectJSON({
			outputFormat : "svg",
			"status" : 'accepted'
		})
		.toss();

});
