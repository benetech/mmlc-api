/**
 * EquationController
 *
 * @description :: Server-side logic for managing Equations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var waterfall = require('async-waterfall');
module.exports = {
	
	/** 
	* Convert to svg and get text description.
	* @param req expected param: mathml/tex
	* @param res returns json
	*/
	convert: function(req, res) {
		var equationController = this;
		var options = {};
		options.math = req.param('math');
		options.format = req.param('mathType');
		options.svg = req.param('svg');
		options.png = req.param('png');
		options.mml = req.param('mml');
		options.speakText = req.param('description');

		//Do some basic checking on mathml input.
		if (options.format == "MathML" && !options.math.indexOf("<math") == 0) 
			return res.badRequest({ errorCode: "23", message: "MathML must start with <math" });

		//Create db record first so that we can make use of waterline's
		//validation rules.
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		Equation.create({
		  math: options.math,
		  mathType: options.format,
		  submittedBy: req.user,
		  ip_address: ip
		}).exec(function(err, equation) {
		  	if (err) {
		  		console.log(err);
			  	return res.badRequest(err);
		    } 
		    ConversionService.convertEquation(options, equation, req.headers.host, function(err, newEquation) {
		    	if (err) return res.serverError("Error converting equation.");
		    	return res.json(newEquation);	
		    });
		});
	},

	update: function(req, res) {
		Equation.findOne({id: req.param("id")}).populate("components").exec(function(err, equation) {
			if (err) return res.serverError("Equation Not Found");
			if(typeof(equation) == "undefined") {
				return res.notFound({ errorCode: "30", message: "Equation not found: " + equationId });
			}
			var options = {};
			options.math = req.param('math');
			options.format = equation.mathType;
			equation.components.forEach(function(component, index) {
				switch (component.format) {
					case "description":
						options.speakText = true;
						break;
					case "mml":
						options.mml = true;
						break;
					case "svg":
						options.svg = true;
						break;
					case "png":
						options.png = true;
						break;
					default: 
						//do nothing.
						break;		
				} 
			});
			var params = {math: req.param("math")};
			if (typeof req.user != "undefined") params.submittedBy = req.user.id;

			Equation.update({id: equation.id}, params).exec(function(err, equations) {
				ConversionService.convertEquation(options, equations[0], req.headers.host, function(err, newEquation) {
			    	if (err) return res.serverError("Error converting equation.");
			    	return res.json(newEquation);	
			    });
			});
		});
	},

	svg: function(req, res) {
		var options = {};
		options.math = req.param('math');
		options.format = req.param('mathType');
		options.svg = true;
		options.speakText = true;
		ConversionService.convert(options, function(data) {
			if (data.errors !== "undefined") {
				//Create record for callback.
				Equation.create({
				  math: options.math,
				  mathType: options.format
				}).exec(function(err, equation) {
				  // Error handling
				  if (err) {
				  	console.log(err);
				  	return res.badRequest(err);
				  } else {
				  	//Create component.
				  	EquationService.createComponent("svg", data.svg, equation.id);
					res.attachment("math.svg");
              		res.end(data.svg, 'UTF-8');
				  }
				});
			} else {
				console.log(data.errors);
				return res.badRequest(data.errors);
			}
			
		});
	},

	png: function(req, res) {
		var options = {};
		options.math = req.param('math');
		options.format = req.param('mathType');
		options.png = true;
		options.speakText = true;
		ConversionService.convert(options, function(data) {
			if (typeof(data.errors) == "undefined") {
				//Create record for callback.
				Equation.create({
				  math: options.math,
				  mathType: options.format
				}).exec(function(err, equation) {
				  // Error handling
				  if (err) {
				  	console.log(err);
				  	return res.badRequest(err);
				  } else {
				  	//Create component.
				  	EquationService.createComponent("png", data.png, equation.id);
					res.send('<img src="' + data.png + '" alt="' + data.speakText + '" />');
				  }
				});
			} else {
				console.log(data.errors);
				return res.badRequest(data.errors);
			}
			
		});
	},

	find: function(req, res) {
		var equationId = req.param('id');
		var preview = req.param('preview');
		Equation.findOne({ id: equationId }).populate('components').populate('html5').exec(function (err, equation) {
			if (err) {
				console.log(err);
				return res.serverError(err);
			} else if (typeof(equation) == "undefined") {
				res.notFound({ errorCode: "30", message: "Equation not found: " + equationId });
			} else {
				if (req.wantsJSON) {
					return res.json(equation); 
				} else {
					return res.redirect("#/equation/" + equation.id);
				}
			}
		});
	},

	myEquations: function(req, res) {
		var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
		var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;
		
		waterfall([
			function (callback) {
				Equation.count({submittedBy: req.user.id}).exec(function(err, numEquations) {
					callback(err, numEquations);
				});
			},
			function (numEquations, callback) {
				Equation.find({submittedBy: req.user.id, sort: 'createdAt DESC' }).paginate({page: page, limit: limit}).populate('components').exec(function(err, equations) {
					callback(err, numEquations, equations);
				});
			}
		], function (err, numEquations, equations) {
			if (err) return res.serverError(err);
			return res.json({"equations": equations, "numEquations": numEquations});
		});
	},

	setUser: function(req, res) {
		Equation.update({id: req.param("id")}, {submittedBy: req.user.id}).exec(function(err, equations) {
			if (err) return res.serverError("Error updating user.");
	    	return res.json(equations[0]);	
		});
	}
};

