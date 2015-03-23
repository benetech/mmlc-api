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
				//update assets. 
				var git_assets = spawn('git', ['-C', '/home/mmlc/mathml-cloud/assets', 'pull']);
				git_assets.stdout.on('data', function (data) {
					output += data;
				});
				git_assets.stderr.on('data', function (data) {
					output += data;
				});
				git_assets.on('close', function (code) {
					output += 'Git Assets exited with code ' + code;
					if (code == 0) {
						//do any installs.
						npm_install = exec('npm -y install --no-bin-links', {cwd: '/home/mmlc/mathml-cloud'},
  							function (error, stdout, stderr) {
  								output += "npm install exited";
  								output += stdout;
  								output += stderr;
  								if (error !== null) {
      								output += "npm install exited with code " + error.code;
    							}
  								
  								res.send(output);
  								//finally restart forever. Logs not included in response since
  								//this will stop this app, preventing a response. :/
  								var forever_restart = spawn('forever', ['-C', '/home/mmlc/mathml-cloud', 'restartall']);
							});
					} else {
						res.send(output);	
					}
				});	
			} else {
				res.send(output);	
			}
		});
	}
};