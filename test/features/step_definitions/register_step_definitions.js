// Step definitions for the registration scenarios

module.exports = function() {
	// Given steps
	this.Given(/^a random username and password$/, function(callback) {
		this.username = 'foo@bar.com';
		this.password = '123456';
		callback();
	});
	
	this.Given(/^a standard firstname and lastname$/, function(callback) {
		this.firstname = 'Testing';
		this.lastname = 'User';
		callback();
	});

	this.Given(/^a user registered with a random username$/, function(callback) {
		callback.pending();
	});
	
	this.Given(/^an organization name of '(.*)'$/, function(orgName, callback) {
		callback.pending();
	});
	
	this.Given(/^an organization type of '(.*)'$/, function(orgType, callback) {
		callback.pending();
	});
	
	// When steps
	this.When(/^I register as a new user$/, function(callback) {
		var userRequest = [];
		userRequest.push({parameter: 'username', value: this.username});
		userRequest.push({parameter: 'password', value: this.password});
		userRequest.push({parameter: 'firstName', value: this.firstname});
		userRequest.push({parameter: 'lastName', value: this.lastname});
		userRequest.push({parameter: 'termsOfService', value: true});
		
		this.apickli.setQueryParameters(userRequest);
		this.apickli.post('/user', function(error, response) {
			if (error) {
				callback(new Error(error));
			}
		});
		callback();
	});
	
	this.When(/^I register with the same username$/, function(callback) {
		callback.pending();
	});
	
	// Then steps
	this.Then(/^I should get a successful response$/, function(callback) {
	    if (this.apickli.assertResponseCode(200)) {
            callback();
        } else {
            callback(new Error('response code expected: 200' + ', actual: ' 
				+ this.apickli.getResponseObject().statusCode));
        }
	});
	
	this.Then(/^the response should contain the organization name$/, function(callback) {
		callback.pending();
	});
	
	this.Then(/^the response should contain the organization type$/, function(callback) {
		callback.pending();
	});
	
	this.Then(/^I should get an error response$/, function(callback) {
		callback.pending();
	});
	
	this.Then(/^the response should indicate missing fields$/, function(callback) {
		callback.pending();
	});
	
	this.Then(/^the response should indicate that username is taken$/, function(callback) {
		callback.pending();
	});
	
};
