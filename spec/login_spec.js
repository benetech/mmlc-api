// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

// Local testing
var base_url = 'http://localhost:1337';

describe("User login", function() {
	// TODO: Need to ensure that this user already exists
	it("handles an admin user", function() {
		frisby.create("Admin login")
			.post(base_url + '/auth/process', {
				username : 'admin@benetech.org', 
				password : '123456'
			})
			.expectStatus(302)
			.expectHeaderContains("Location", "/admin")
	.toss();
	});
	
	// TODO: Need to ensure that this user already exists
	it("handles a normal user", function() {
		frisby.create("User login")
			.post(base_url + '/auth/process', {
				username : 'user@benetech.org', 
				password : '123456'
			})
			.expectStatus(302)
			.expectHeaderContains("Location", "/")
	.toss();
	});
	
	it("handles a login failure", function() {
		frisby.create("Bad login")
			.post(base_url + '/auth/process', {
				username : 'foo@bar.com', 
				password : 'abcde'
			})
			.expectStatus(200)
			.expectHeaderContains("Location", "/login")
			expectJSON({
				message : "login failed"
			})
	.toss();
	});
});
