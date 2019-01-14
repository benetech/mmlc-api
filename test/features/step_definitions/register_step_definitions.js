// Step definitions for the registration scenarios
var assert = require('assert');
const { Given, When, Then } = require('cucumber');

// Given steps
Given('a random username and password', function() {
    this.username = 'foo' + Math.floor(Math.random() * 10000) + '@bar.com';
    this.password = '123456';
});

Given('a standard firstname and lastname', function() {
    this.firstname = 'Testing';
    this.lastname = 'User';
});

Given('a user registered with a random username', function(callback) {
    this.username = 'foo' + Math.floor(Math.random() * 10000) + '@bar.com';
    this.password = '123456';
    this.register({ firstname: 'Test', lastname: 'User' }, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

Given(/^an organization name of '(.*)'$/, function(orgName) {
    this.organization = orgName;
});

Given(/^an organization type of '(.*)'$/, function(orgType) {
    this.organizationType = orgType;
});

// When steps
When('I register as a new user', function(callback) {
    this.register({}, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

When('I register with the same username', function(callback) {
    this.register({}, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

// Then steps
Then('I should get a successful response', function() {
    assert.equal(this.lastResponse.statusCode, 200);
});

Then('the response should contain the organization name', function() {
    assert.equal(this.lastBody.organization, this.organization);
});

Then('the response should contain the organization type', function() {
    assert.equal(this.lastBody.organizationType, this.organizationType);
});

Then(/^the response should indicate missing fields$/, function() {
    assert.equal(this.lastBody.details,
        'Could not use specified `username`.  Cannot set "" (empty string) for a required attribute.');
});

Then(/^the response should indicate that username is taken$/, function() {
    assert.equal(this.lastBody.message,
        'A user with that email address already exists.');
});
