/**
 * EquationController
 *
 * @description :: Server-side logic for managing Equations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	* Upload HTML5 and convert all equations to mathml.
	*/
	upload: function  (req, res) {
		//We need to know what kind of output you want.
		if (typeof(req.param('outputFormat')) == "undefined" || !req.param('outputFormat') in ['svg', 'png', 'description', 'mml']) {
			return res.badRequest("Please specify output format.");	
		}
		var options = {};
		req.file('html5').upload(function (err, files) {
			if (err) {
	        	console.log(err);
			  	return res.badRequest(err);
		    }
			if (typeof(files[0]) == "undefined") {
				return res.badRequest("Please specify HTML5 file.");
			}
	        var html5 = files[0];
	        var fs = require("fs");
	        
	        //Save HTML5. 
            Html5.create({
            			source: fs.readFileSync(html5.fd), 
            			filename: html5.filename, 
            			outputFormat: req.param('outputFormat'),
            			status: 'accepted'}).exec(function(err, dbHtml5) {
                if (err) {
                    console.log(err);
                    return res.badRequest(err);
                }
                //Submit job request.
                ConversionService.submitHTML5Conversion(dbHtml5, function(err) {
                	if (typeof(err) != "undefined") {
                		console.log(err);
                		return res.badRequest(err);
                	}
                	if (req.wantsJSON) {
		          		res.accepted(dbHtml5);	
		          	} else {
		          		res.redirect("/html5/" + dbHtml5.id);
		          	}
                });
            });
	    });
  	},

  	find: function(req, res) {
		var html5Id = req.param('id');
		Html5.findOne({ id: html5Id }).exec(function (err, html5) {
			if (err) {
				console.log(err);
				return res.badRequest(err);
			} 
			if (typeof(html5) != "undefined") {
				//load up equations.
				Equation.find({ html5: html5.id }).populate('components').exec(function(err, equations) {	
					if (err) return res.badRequest(err);
					if (req.wantsJSON) {
						res.json({html5: html5, equations: equations});
					} else {
						res.view({html5: html5, equations: equations});
					}
				});
			} else {
				res.notFound();
			}
		});
	},

	equations: function(req, res) {
		var html5Id = req.param('id');
		Equation.find({ html5: html5Id }).populate('components').exec(function(err, equations) {	
			if (err) return res.badRequest(err);
			res.view({equations: equations});
		});
	},

	downloadSource: function(req, res) {
		Html5Service.download(req, res, true);	
	},

	downloadOutput: function(req, res) {
		Html5Service.download(req, res, false);
	}
	
};

