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
		waterfall([
			function (callback) {
				Feedback.count(function (err, numFeedback) {
					callback(err, numFeedback);
				});
			},
			function (numFeedback, callback) {
				Equation.count(function(err, numEquations) {
					callback(err, numFeedback, numEquations);
				});
			},
			function (numFeedback, numEquations, callback) {
				User.count(function(err, numUsers) {
					callback(err, numFeedback, numEquations, numUsers);
				});
			},
			function (numFeedback, numEquations, numUsers, callback) {
				Html5.count(function(err, numHtml5){
					callback(err, numFeedback, numEquations, numUsers, numHtml5);
				});
			}
		], function(err, numFeedback, numEquations, numUsers, numHtml5) {
			if (err) return res.badRequest(err);
			return res.json({
				"numFeedback": numFeedback, 
				"numEquations": numEquations, 
				"numUsers": numUsers,
				"numHtml5": numHtml5
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
				return res.json({"equation": equation, "feedback": feedback});
			});
		} else {
			return res.badRequest('ID is required.');
		}
	},

	equations: function(req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;
		waterfall([
			function (callback) {
				Equation.count({submittedBy: {'!': null}}).exec(function (err, num) {
					callback(err, num);
				});
			},
			function(num, callback) {
				Equation.find({sort: 'createdAt DESC', submittedBy: {'!': null} }).paginate({page: page, limit: limit}).populate('submittedBy').populate('components').exec(function(err, equations) {
					callback(err, num, equations);
				});
			}
		], function(err, num, equations) {
			if (err) return res.badRequest(err);
			return res.json({"equations": equations, "numEquations": num});
		});
	},

	feedback: function (req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;
		waterfall([
			function(callback) {
				Feedback.count(function (err, num) {
					callback(err, num);
				});
			},
			function (num, callback) {
    			Feedback.find({sort: 'createdAt DESC' }).paginate({page: page, limit: limit}).populate('submittedBy').populate('components').populate('equation').exec(function(err, feedback) {	
    				callback(err, num, feedback);
    			});
			}
		], function (err, num, feedback) {
			if (err) return res.badRequest(err);
			return res.json({"feedback": feedback, "numFeedback": num});
		});
	},

	html5uploads: function (req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;
		waterfall([
			function(callback) {
				Html5.count(function (err, num) {
					callback(err, num);
				});
			},
			function (num, callback) {
    			Html5.find({sort: 'createdAt DESC' }, {fields: ["id", "createdAt", "equations", "outputFormat", "filename", "submittedBy"]}).paginate({page: page, limit: limit}).populate('submittedBy').populate('equations').exec(function(err, html5s) {	
    				callback(err, num, html5s);
    			});
			}
		], function (err, num, html5s) {
			if (err) return res.badRequest(err);
			return res.json({"html5s": html5s, "numHtml5": num});
		});
	},

	html5: function(req, res) {
		var id = req.param('id');
		waterfall([
			function(callback) {
				Html5.findOne({ id: id }).exec(function (err, html5) {
					callback(err, html5);
				});
			},
			function (html5, callback) {
				Equation.find({ html5: html5.id }).populate('components').exec(function(err, equations) {	
    				callback(err, html5, equations);
    			});
			}
		], function (err, html5, equations) {
			if (err) return res.badRequest(err);
			return res.json({"html5": html5, equations: equations});
		});
	},

	users: function (req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;
		waterfall([
			function(callback) {
				User.count(function (err, num) {
					callback(err, num);
				});
			},
			function (num, callback) {
    			User.find({sort: 'createdAt DESC' }).paginate({page: page, limit: limit}).exec(function(err, users) {	
    				callback(err, num, users);
    			});
			}
		], function (err, num, users) {
			if (err) return res.badRequest(err);
			return res.json({"users": users, "numUsers": num});
		});
	}

};

