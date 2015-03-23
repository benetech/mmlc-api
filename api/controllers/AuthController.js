/**
 * AuthControllerController
 *
 * @description :: Server-side logic for managing Authcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var error_responses = {
  "login_failed" : { errorCode: "92", message: "Login Failed"},
  "invalid_token" : { errorCode: "93", message: "Invalid Token"}
};
var passport = require('passport');
module.exports = {

	login: function (req, res) {
  	res.view();
	},

	process: function(req, res) {
  	passport.authenticate('local', function(err, user, info) {
  		if ((err) || (!user)) {
    		return res.badRequest(error_responses["login_failed"]);
  		}
  		return AuthService.logIn(req, res, user);
  	}) (req, res);
	},
    
	logout: function (req, res) {
    User.findOne({access_token: req.param("access_token") }).exec(function (err, user) {
      if (err || !user) {
        if (err) {
          console.log(err);
          return res.serverError(err);
        } else {
          return res.badRequest(error_responses["invalid_token"]);
        }
      } else {
        return AuthService.logOut(req, res, user);
      }
    });
	},

  loggedInUser: function(req, res) {
    return res.send(typeof(req.user) != "undefined" ? req.user.toJSON() : "");
  }
};
