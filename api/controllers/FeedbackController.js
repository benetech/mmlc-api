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
			if (typeof req.param('components') != "undefined") {
				var components = typeof req.param('components') == 'string' ? [req.param('components')] : req.param('components'); 
				components.forEach(function(component,index) {
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
	}
};

