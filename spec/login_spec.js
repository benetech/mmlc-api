// With Frisby installed globally, we need the full path to find it
var frisby = require('frisby');

// Local testing
var base_url = 'http://localhost:1337';
// Server testing
//var base_url = 'https://staging.mathmlcloud.org';

describe("User login", function() {
	// TODO: Need to ensure that this user already exists
	frisby.create("Admin login")
		.post(base_url + '/login', {
			username : 'admin@benetech.org', 
			password : '123456'
		})
		.expectStatus(200)
		.expectJSONTypes({access_token: String})
		.toss();
	
	// TODO: Need to ensure that this user already exists
	frisby.create("User login")
		.post(base_url + '/login', {
			username : 'user@benetech.org', 
			password : '123456'
		})
		.expectStatus(200)
		.expectJSONTypes({access_token: String})
		.toss();
	
	frisby.create("Bad login")
		.post(base_url + '/auth/process', {
			username : 'foo@bar.com', 
			password : 'abcde'
		})
		.expectStatus(400)
		.expectJSON({
			message : "Login Failed",
			errorCode: "92"
		})
		.toss();

	frisby.create("User login and logout")
		.post(base_url + '/login', {
			username : 'user@benetech.org', 
			password : '123456'
		})
		.expectStatus(200)
		.expectJSONTypes({access_token: String})
		.afterJSON(function(user) {
			frisby.create("Logout")
			.get(base_url + '/logout?access_token=' + user.access_token)
			.expectJSON({
				message : "logout successful"
			})
			.toss()
		})
		.toss()
});
