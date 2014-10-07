/**
 * GitHookController
 *
 * @description :: Server-side logic for managing Git hooks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	push: function(req, res) {
		var git = require('child_process').spawn('git', ['-C', '~mmlc/mathml-cloud', 'pull']);
		var output = '';
		git.stdout.on('data', function (data) {
			output += data;
		});
		git.stderr.on('data', function (data) {
			output += data;
		});
		git.on('close', function (code) {
			output += 'Git exited with code ' + code;
			res.send(output);
		});
	}
};
