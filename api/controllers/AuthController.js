/**
 * AuthControllerController
 *
 * @description :: Server-side logic for managing Authcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport'), jwt = require('jwt-simple');
var secret = 'm@th3l^7@ud';
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
        //Update user with new token.
        var token = jwt.encode(user.id, secret);
        User.update({id: user.id}, {access_token: token}).exec(function(err, users) {
          if (req.wantsJSON) {
            return res.json(users[0]);
          } else {
      		  return res.redirect("/");
          }
        });
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
