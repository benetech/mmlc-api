/**
 * EquationController
 *
 * @description :: Server-side logic for managing Equations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/** 
	* Convert to svg and get text description.
	* @param req expected param: mathml/tex
	* @param res returns json
	*/
	convert: function(req, res) {
		var options = {};
		options.math = req.param('math');
		options.format = req.param('mathType');
		options.svg = req.param('svg');
		options.png = req.param('png');
		options.mml = req.param('mml');
		options.speakText = req.param('description');

		//Create db record first so that we can make use of waterline's
		//validation rules.
		Equation.create({
		  math: options.math,
		  mathType: options.format
		}).exec(function(err, equation) {
		  	if (err) {
		  		console.log(err);
			  	return res.badRequest(err);
		    } 
		    ConversionService.convert(options, function(data) {
				if (typeof(data.errors) == 'undefined') {
					//Save all components.
					if (options.mml) EquationService.createComponent("mml", data.mml, equation.id);
					if (options.svg) EquationService.createComponent("svg", data.svg, equation.id);
					if (options.png) EquationService.createComponent("png", data.png, equation.id);
					if (options.speakText) EquationService.createComponent("description", data.speakText, equation.id);
					//Look up equation so that we have all created info.
					Equation.findOne(equation.id).populate('components').exec(function(err, newEquation) {
						newEquation.cloudUrl = "http://" + req.headers.host + "/equation/" + equation.id;
						res.send(newEquation);
					});
				} else {
					console.log(data.errors);
					return res.badRequest(data.errors);
				}
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

	/**
	* Upload HTML5 and convert all equations to mathml.
	*/
	upload: function  (req, res) {
		//We need to know what kind of output you want.
		if (typeof(req.param('outputFormat')) == "undefined" || !req.param('outputFormat') in ["SVG", "NativeMML", "IMG", "PNG", "None"]) {
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
	        options.html = fs.readFileSync(html5.fd);
	        options.speakText = true;
	        options.timeout = 10 * 5000;
	        options.renderer = req.param('outputFormat');
	        options.equations = true;
	        options.filename = html5.filename;
	        ConversionService.convertHTML5(options, function (data) {
	          if (typeof(data.errors) == "undefined") {
	          	if (typeof(req.param('preview')) == "undefined" || req.param('preview') == "false") {
	          		res.attachment(html5.filename);
          			res.end(data.output, 'UTF-8');	
	          	} else {
	          		Equation.find({html5: data.id}).populate('components').exec(function(err, equations) {
						res.view({html5: data, equations: equations});
					});
	          	}
              } else {
				console.log(data.errors);
				return res.badRequest(data.errors);
			  }
	        });
	    });
  	},

	find: function(req, res) {
		var equationId = req.param('id');
		var wantsjson = req.param('json');
		Equation.findOne({ id: equationId }).populate('components').exec(function (err, equation) {
			if (err) {
				console.log(err);
				return res.badRequest(err);
			} else {
				if (typeof(wantsjson) != 'undefined')
					return res.send(equation)
				else
					return res.view({"equation": equation}); 
			}
		});
	}
	
};

