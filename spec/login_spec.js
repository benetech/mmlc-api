// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

// For whatever reason, the DNS lookup in my VM isn't finding the host name
// so using the IP address for now. 
//var base_url = 'http://mathml-cloud.cloudapp.net';
//var base_url = 'http://23.101.204.234';
// Local testing
var base_url = 'http://localhost:1337';

describe("User login", function() {
	
	it("handles an admin user", function() {
		frisby.create("Admin login")
			.post(base_url + '/auth/process', {
				username : 'johnbrugge@benetech.org', 
				password : '123456'
			})
			.expectStatus(302)
			.expectHeaderContains("Location", "/admin")
	.toss();
	});
});
