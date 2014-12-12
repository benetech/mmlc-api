// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

// For whatever reason, the DNS lookup in my VM isn't finding the host name
// so using the IP address for now. 
//var base_url = 'http://mathml-cloud.cloudapp.net';
//var base_url = 'http://23.101.204.234';
// Local testing
var base_url = 'http://localhost:1337';

describe("Simple math conversion", function() {
	
	it("handles algebra AsciiMath", function() {
		frisby.create("Simple ASCII math")
			.post(base_url + '/equation', {
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
	.toss();
	});
});
