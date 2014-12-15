// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

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
