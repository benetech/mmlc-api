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
  		req.logIn(user, function(err) {
    		if (err) res.send(err);
        if (req.wantsJSON) {
          return res.json(true);
        } else {
    		  return res.redirect("/");
        }
  		});
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
