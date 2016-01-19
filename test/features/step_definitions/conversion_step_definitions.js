// Step definitions for the registration scenarios
var assert = require('assert');

module.exports = function() {
	// Given steps
	this.Given(/^a converted equation$/, function(callback) {
		// TODO: Either run a conversion, or use a reliable equation ID
		this.equationID = "56158caa86b7070100e6f0b8";
		callback();
	});
	
	// When steps
	this.When(/^I ask for the equation by ID$/, function(callback) {
		var equationID = this.equationID;
		var url = '/equation/' + equationID;
		
		this.get(url, function(error) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	});
	
	// Then steps
	this.Then(/^I should get back a full conversion description$/, function(callback) {
		var body = JSON.parse(this.lastBody);
		assert(body.components, "Components of equation missing");
		assert(body.id, "ID of equation missing");
		assert(body.math, "Math of equation missing");
		assert(body.mathType, "MathType of math missing");
		callback();
	});
};
