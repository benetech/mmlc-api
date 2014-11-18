/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing feedback on equations and the equation's components.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var waterfall = require('async-waterfall');
module.exports = {

	/** Allow admins a quick overview of MMLC. */
	index: function(req, res) {
		var limit = 10;
		waterfall([
			function (callback) {
				Feedback.count(function (err, numFeedback) {
					callback(err, numFeedback);
				});
			},
			function (numFeedback, callback) {
				Feedback.find({ skip: 0, limit: limit, sort: 'createdAt DESC' }).populate('equation').exec(function(err, feedback) {
					callback(err, numFeedback, feedback);
				});
			},
			function (numFeedback, feedback, callback) {
				Equation.count(function(err, numEquations) {
					callback(err, numFeedback, feedback, numEquations);
				});
			},
			function (numFeedback, feedback, numEquations, callback) {
				Equation.find({ skip: 0, limit: limit, sort: 'createdAt DESC' }).populate('components').exec(function(err, equations) {
					callback(err, numFeedback, feedback, numEquations, equations);
				});
			},
			function (numFeedback, feedback, numEquations, equations, callback) {
				User.count(function(err, numUsers) {
					callback(err, numFeedback, feedback, numEquations, equations, numUsers);
				});
			},
			function (numFeedback, feedback, numEquations, equations, numUsers, callback) {
				User.find({ skip: 0, limit: limit, sort: 'createdAt DESC' }).exec(function(err, users) {
					callback(err, numFeedback, feedback, numEquations, equations, numUsers, users);
				});
			},
		], function(err, numFeedback, feedback, numEquations, equations, numUsers, users) {
			if (err) return res.badRequest(err);
			return res.view({
				"numFeedback": numFeedback, 
				"numEquations": numEquations, 
				"feedback": feedback, 
				"equations": equations,
				"numUsers": numUsers,
				"users": users
			});
		});
	},

	equation: function(req, res) {
		if (typeof req.param('id') != 'undefined') {
			waterfall([
				function (callback) {
					Equation.findOne().where({id: req.param('id')}).populate('components').exec(function(err, equation) {
						callback(err, equation);
					});
				},
				function (equation, callback) {
					Feedback.find().where({equation: equation.id}).populate('components').exec(function(err, feedback) {
						callback(err, equation, feedback);
					});
				}
			], function(err, equation, feedback) {
				if (err) return res.badRequest(err);
				return res.view({"equation": equation, "feedback": feedback});
			});
		} else {
			return res.badRequest('ID is required.');
		}
	},

	equations: function(req, res) {
		waterfall([
			function (callback) {
				Equation.count(function (err, num) {
					callback(err, num);
				});
			},
			function(num, callback) {
				var offset = typeof req.param('offset') != 'undefined' ? req.param('offset') : 0;
				Equation.find({ skip: offset, limit: 10, sort: 'createdAt DESC' }).exec(function(err, equations) {
					callback(err, num, offset, equations);
				});
			}
		], function(err, num, offset, equations) {
			if (err) return res.badRequest(err);
			return res.view({"equations": equations, "numEquations": num, "offset": offset});

		});
	},

	feedback: function (req, res) {
		waterfall([
			function(callback) {
				Feedback.count(function (err, num) {
					callback(err, num);
				});
			},
			function (num, callback) {
				var offset = typeof req.param('offset') != 'undefined' ? req.param('offset') : 0;
    			Feedback.find({ skip: offset, limit: 10, sort: 'createdAt DESC' }).populate('components').populate('equation').exec(function(err, feedback) {	
    				callback(err, num, offset, feedback);
    			});
			}
		], function (err, num, offset, feedback) {
			if (err) return res.badRequest(err);
			return res.view({"feedback": feedback, "numFeedback": num, "offset": offset});
		});
	}


};

