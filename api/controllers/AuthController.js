/**
 * AuthControllerController
 *
 * @description :: Server-side logic for managing Authcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
module.exports = {

	login: function (req, res) {
  	res.view();
	},

	process: function(req, res) {
  	passport.authenticate('local', function(err, user, info) {
  		if ((err) || (!user)) {
    		return res.send({
    			message: 'login failed'
    		});
  		}
  		return AuthService.logIn(req, res, user);
  	}) (req, res);
	},
    
	logout: function (req,res) {
	  req.logout();
	  res.send('logout successful');
	},

  loggedInUser: function(req, res) {
    return res.send(typeof(req.user) != "undefined" ? req.user.toJSON() : "");
  },

  sendForgotPassword: function(req, res) {
    User.findOne({username: req.param("username")}).exec(function (err, user) {
      if (err || !user) return res.badRequest("No user with that username found.");
      AuthService.sendForgotPasswordEmail(req, res, user);
      return res.json({message: "An email has been sent to you with instructions on how to set a new password. Please contact us if you need further assistance."});
    });
  }
};
