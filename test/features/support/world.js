// Utility properties available to all step definitions
var request = require('request');
var env = require('./env');

function World() {
	this.lastResponse = null;
	this.lastBody = null;
	this.username = null;
	this.firstname = null;
	this.lastname = null;
	this.password = null;
	
	self = this;
	
    this.get = function(path, callback) {
		var uri = this.uri(path);
		request.get({uri: uri, headers: {'User-Agent': 'request'}},
          function(error, response, body) {
			  if (error) {
				  return callback(new Error('Error on GET request to ' + uri +
				  ': ' + error.message));
			  }
			  self.lastResponse = response;
			  self.lastBody = body;
			  callback(null);
		  });
    };
	
    this.post = function(path, formData, callback) {
	  var uri = this.uri(path);
      request.post({url: uri, form: formData,
            headers: {'User-Agent': 'request'}, json: true},
          function(error, response, body) {
			  if (error) {
				  return callback(new Error('Error on POST request to ' + uri + 
				  ': ' + error.message));
			  }
			  self.lastResponse = response;
			  self.lastBody = body;
			  callback(null);
		  });
    };
	
    this.uri = function(path) {
      return env.BASE_URL + path
    };
	
};

module.exports = function() {
	this.World = World;
}