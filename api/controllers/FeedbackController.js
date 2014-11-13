/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing feedback on equations and the equation's components.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res) {
		Feedback.create({
			equation: req.param('equation'),
			comments: req.param('comments')
		}).exec(function(err, feedback) {
			if (req.param('components') != undefined) {
				req.param('components').forEach(function(component,index) {
					feedback.components.add(component);
					feedback.save(function(err) {
						if (err) console.log(err);
						Feedback.findOne(feedback.id).populate('components').exec(function(err, newFeedback) {
							res.json(newFeedback);
						});
					});
				});
			} else {
				res.json(feedback);
			}
		});
	},

	/** Allow admins to view comments. */
	feedback: function(req, res) {
		Feedback.find().populate('components').populate('equation').exec(function(err, feedback) {
			if (err) return res.badRequest(err);
			return res.view({"feedback": feedback});
		});
	},

	equation: function(req, res) {
		if (typeof req.param('equationID') != 'undefined') {
			Equation.findOne().where({id: req.param('equationID')}).populate('components').exec(function(err, equation) {
				if (err) return res.badRequest(err);
				Feedback.find().where({equation: equation.id}).populate('components').exec(function(err, feedback) {
					return res.view({"equation": equation, "feedback": feedback});
				});
			});
		} else {
			return res.badRequest('Equation not found.');
		}
	}
};

