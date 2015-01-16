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
  }
};
