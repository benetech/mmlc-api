// Utility properties available to all step definitions
var request = require('request');
var env = require('./env');
var { setWorldConstructor } = require('cucumber');

function World() {
	this.lastResponse = null;
	this.lastBody = null;
	this.username = null;
	this.firstname = null;
	this.lastname = null;
	this.password = null;
    this.organization = null;
    this.organizationType = null;
	
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
	
    this.post = function(path, form, callback, formData = {}) {
	  var uri = this.uri(path);
      var options = {
        url: uri,
        headers: {'User-Agent': 'request'},
        json: true
      };
      if (form) {
        options.form = form;
      } else if (formData) {
        options.formData = formData;
      }
      var method = this.method || 'post';
      request[method](options, function(error, response, body) {
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

    this.register = function(userData, callback) {
        var data = {
            username: userData.username || this.username,
            password: userData.password || this.password,
            firstName: userData.firstname || this.firstname,
            lastName: userData.lastname || this.lastname,
            role: userData.role || 'user',
            organization: userData.organization || this.organization,
            organizationType: userData.organizationType || this.organizationType,
            termsOfService: true
        }
        this.post('/user', data, function(error) {
            if (!error) {
                self.access_token = self.lastBody.access_token;
            }
            callback(error);
        });
    };

    this.makeEquation = function(options, callback, method = 'post') {
        var this_ = this;
        this.post('/equation', options, function(error) {
            if (error || this_.lastResponse.statusCode != 200) {
                callback(error || this_.lastResponse.statusMessage);
            } else {
                this_.equationID = this_.lastBody.id;
                callback();
            }
        });
    };

};

setWorldConstructor(World);

module.exports = function() {
	this.World = World;
}
