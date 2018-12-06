/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing feedback on equations and the equation's components.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var waterfall = require('async-waterfall');
var ObjectId = require('mongodb').ObjectID || require('mongodb').ObjectId;
module.exports = {
	create: function(req, res) {
    if (typeof req.param('equation') === 'undefined') {
    if (ObjectId.isValid(req.param("equation_id")) === false) {
      return res.badRequest('Invalid equation id.');
    } else {
        Equation.findOne(req.param('equation_id')).exec(function(err, eqrecord) {
          if (err) {
            console.log(err);
            res.badRequest(err);
          } else if (typeof eqrecord === 'undefined') {
            return res.badRequest('Equation does not exist');
          } else {
            Feedback.create({
              equation: req.param('equation_id'),
              comments: req.param('comments'),
              submittedBy: req.user
            }).exec(function (err, feedback) {
              if (typeof req.param('components') != "undefined" && req.param('components').length > 0) {

                var components = typeof req.param('components') == 'string' ? [req.param('components')] : req.param('components');
                components.forEach(function (component, index) {

                  feedback.components.add(component);
                  feedback.save(function (err) {
                    if (err) console.log(err);
                    Feedback.findOne(feedback.id).populate('components').exec(function (err, newFeedback) {
                      res.json(newFeedback);
                    });
                  });

                });

              } else {
                res.json(feedback);
              }
            });
          }
        });
      }
    } else {
      if (ObjectId.isValid(req.param("equation")) === false) {
        return res.badRequest('Invalid equation id.');
      } else {
        Equation.findOne(req.param('equation')).exec(function(err, eqrecord) {
          if (err) {
            console.log(err);
            res.badRequest(err);
          } else if (typeof eqrecord === 'undefined') {
            return res.badRequest('Equation does not exist');
          } else {
            Feedback.create({
              equation: req.param('equation'),
              comments: req.param('comments'),
              submittedBy: req.user
            }).exec(function (err, feedback) {
              if (typeof req.param('components') != "undefined" && req.param('components').length > 0) {

                var components = typeof req.param('components') == 'string' ? [req.param('components')] : req.param('components');
                components.forEach(function (component, index) {

                  feedback.components.add(component);
                  feedback.save(function (err) {
                    if (err) console.log(err);
                    Feedback.findOne(feedback.id).populate('components').exec(function (err, newFeedback) {
                      res.json(newFeedback);
                    });
                  });

                });

              } else {
                res.json(feedback);
              }
            });
          }
        });
      }

    }
	},

	myFeedback: function(req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;

		waterfall([
			function (callback) {
				Feedback.count({submittedBy: req.user.id}).exec(function(err, numFeedback) {
					callback(err, numFeedback);
				});
			},
			function (numFeedback, callback) {
				Feedback.find({submittedBy: req.user.id, sort: 'createdAt DESC' }).paginate({page: page, limit: limit}).populate('equation').populate('components').exec(function(err, feedback) {
					callback(err, numFeedback, feedback);
				});
			}
		], function (err, numFeedback, feedback) {
			if (err) return res.badRequest(err);
			return res.json({"feedback": feedback, "numFeedback": numFeedback});
		});
	}
};

