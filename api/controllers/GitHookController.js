/**
 * GitHookController
 *
 * @description :: Server-side logic for managing Git hooks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
module.exports = {
	push: function(req, res) {
		GitHookService.verify_signature(req.body, req.headers['x-hub-signature'], function(err) {
			if (err != null) {
				return res.badRequest(err);
			} else {
				var git = spawn('git', ['-C', '/home/mmlc/mathml-cloud', 'pull']);
				var output = '';
				git.stdout.on('data', function (data) {
					output += data;
				});
				git.stderr.on('data', function (data) {
					output += data;
				});
				git.on('close', function (code) {
					output += 'Git exited with code ' + code;
					if (code == 0) {
						
						//do any installs.
						npm_install = exec('npm -y install --no-bin-links', {cwd: '/home/mmlc/mathml-cloud'},
  							function (error, stdout, stderr) {
  								output += "npm install exited\n";
  								output += stdout;
  								output += stderr;
  								if (error !== null) {
      								output += "npm install exited with code " + error.code;
    							}
  								
  								res.send(output);
  								//finally restart forever. Logs not included in response since
  								//this will stop this app. :/
  								var forever_restart = exec('SECRET_TOKEN=${SECRET_TOKEN} forever restartall', {cwd: '/home/mmlc/mathml-cloud'});
							});
					} else {
						res.send(output);	
					}
				});
			}
		});
	},

	assets: function(req, res) {
		GitHookService.verify_signature(req.body, req.headers['x-hub-signature'], function(err) {
			if (err != null) {
				return res.badRequest(err);
			} else {
				var git = spawn('git', ['-C', '/home/mmlc/mathml-cloud/assets', 'pull']);
				var output = '';
				git.stdout.on('data', function (data) {
					output += data;
				});
				git.stderr.on('data', function (data) {
					output += data;
				});
				git.on('close', function (code) {
					output += 'Git exited with code ' + code;
					res.json(output);
				});
			}
		});
	}
};