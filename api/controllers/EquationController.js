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
		options.speakText = req.param('description');
		
		ConversionService.convert(options, function(data) {
			if (data.errors !== "undefined") {
				//Create record for callback.
				Equation.create({
				  math: req.param("math"),
				  mathType: req.param("mathType")
				}).exec(function(err, equation) {
					// Error handling
				  	if (err) {
				  		console.log(err);
					  	res.send({errors: err});
				    } else {
						//Save all components.
						if (options.mml) EquationService.createComponent("mml", data.mml, equation.id);
						if (options.svg) EquationService.createComponent("svg", data.svg, equation.id);
						if (options.png) EquationService.createComponent("png", data.png, equation.id);
						if (options.description) EquationService.createComponent("description", data.description, equation.id);
						data.cloudUrl = "http://" + req.headers.host + "/equation/" + equation.id;
						res.send(data);
					}
				  
				});
			} else {
				console.log(data.errors);
				res.send(data.errors);
			}
			
		});
	},

	svg: function(req, res) {
		var options = {};
		options.math = req.param('math');
		options.format = req.param('mathType');
		options.svg = true;
		options.speakText = true;
		MathmlController.mathjaxNode.typeset(options, function (data) {
			if (data.errors !== "undefined") {
				//Create record for callback.
				Mathml.create({
				  //altText: "Placeholder until we get chromevox work",
				  asciiMath: req.param("mathType") == "AsciiMath" ? req.param("math") : null,
				  tex: req.param("mathType") === "inline-TeX" ? req.param("math") : null,
				  mathML: data.mml
				}).exec(function(err, mathML) {
				  // Error handling
				  if (err) {
				  	console.log(err);
				  	res.send({errors: err});
				  } else {
					res.attachment("math.svg");
              		res.end(data.svg, 'UTF-8');
				  }
				});
			} else {
				console.log(data.errors);
				res.send(data.errors);
			}
			
		});
	},

	/**
	* Upload HTML5 and convert all equations to mathml.
	*/
	upload: function  (req, res) {
		var options = MathmlController.mathJaxNodeOptions;
		req.file('html5').upload(function (err, files) {
	    	if (err)
	        	return res.serverError(err);
	        var html5 = files[0];

	        var fs = require("fs");
	        options.html = fs.readFileSync(html5.fd);
	        options.speakText = true;
	        options.timeout = 10 * 5000;
	        MathmlController.mathjaxNodePage.typeset(options, function (data) {
	          if (data.errors !== "undefined") {
        	  	res.attachment(html5.filename);
              	res.end(data.html, 'UTF-8');
              } else {
				console.log(data.errors);
				res.send(data.errors);
			  }
	        });
	    });
  	},

	find: function(req, res) {
		var equationId = req.param('id');
		var wantsjson = req.param('json');
		Equation.find({ _id: equationId }).populate('components').exec(function (err, equation) {
			// XXX Error handling
			if (err) {
				return console.log(err);
			} else {
				
				if (wantsjson !== undefined)
					return res.send(equation)
				else
					return res.view(data); 
			}
		});
	},

	createComponent: function(format, source, equationId) {

	}
	
};

