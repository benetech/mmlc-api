// Step definitions for the registration scenarios

module.exports = function() {
	// Given steps
	this.Given(/^a random username and password$/, function(callback) {
		callback.pending();
	});
	
	this.Given(/^a standard firstname and lastname$/, function(callback) {
		callback.pending();
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
		callback.pending();
	});
	
	this.When(/^I register with the same username$/, function(callback) {
		callback.pending();
	});
	
	// Then steps
	this.Then(/^I should get a successful response$/, function(callback) {
		callback.pending();
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
