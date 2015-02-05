/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	users: function(req, res) {
		User.find().exec(function (err, users) {
			if (err) {
				console.log(err);
				return res.badRequest(err);
			}
			return res.send(users);
		});
	},

	signUp: function(req, res) {
		res.view();
	},

	create: function(req, res) {
		//make sure a user with this username/password doesn't already exist.
		User.findOne({username: req.param("username")}).exec(function(err, user) {
			if (user) return res.badRequest("A user with that email address already exists.");
			User.create(req.body).then(function (user) {
	        	return AuthService.logIn(req, res, user);
	        }).catch(function(e) {
	        	return res.badRequest(e);
	        });
		});
		
	},

	sendForgotPassword: function(req, res) {
	    User.findOne({username: req.param("username")}).exec(function (err, user) {
	      if (err || !user) return res.badRequest("No user with that username found.");
	      AuthService.sendForgotPasswordEmail(req, res, user);
	      return res.json({message: "An email has been sent to you with instructions on how to set a new password. Please contact us if you need further assistance."});
	    });
  	},

  	showChangePasswordForm: function(req, res) {
  		return res.redirect("#" + req.url);
  	},

  	changePassword: function(req, res) {
  		User.findOne()
		.where({username: req.param("username")})
		.then(function(user) {
			if (!user) return res.badRequest("Invalid username.");
    		var forgotPassword = ForgotPassword.findOne({user: user.id, token: req.param("token")}).then(function(forgotPassword) {
        		return forgotPassword;
    		});
    		return [user, forgotPassword];
		}).spread(function(user, forgotPassword) {
			if (forgotPassword) {
	    		User.update({username: req.param("username")}, {password: req.param("password")}).exec(function(err, users){
		      		if (err) return badRequest(err);
		      		//delete forgot password.
		      		console.log(forgotPassword);
		      		ForgotPassword.destroy({id: forgotPassword.id}).exec(function(err){
		      			if (err) return res.badRequest(err);
		      		});
		      		return res.json({message: "Your password has been updated."});
		      	});
	    	} else {
	    		return res.badRequest("Invalid token. Please request a new change password email.");
	    	}
		}).catch(function(err){
    		return res.badRequest(err);
		});
  	}
};

