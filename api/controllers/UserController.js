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
		User.create(req.body).then(function (user) {
        	req.logIn(user, function(err) {
	    		if (err) res.send(err);
		        return res.json(user);
	  		});
        }).catch(function(e) {
        	return res.badRequest(e);
        });
	}
};

