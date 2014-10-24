/**
 * MathMLController
 *
 * @description :: Server-side logic for managing MathML
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MathmlController = {

	mathjaxNode: require("../../node_modules/MathJax-node/lib/mj-single.js"),
	mathjaxNodePage: require("../../node_modules/MathJax-node/lib/mj-page.js"),
	mathJaxNodeOptions: {svg:true, img:false, mml:true, png:true, speakText:true, timeout: 10 * 1000},
	
	/** 
	* Convert to svg and get text description.
	* @param req expected param: mathml/tex
	* @param res returns json
	*/
	convert: function(req, res) {
		var options = MathmlController.mathJaxNodeOptions;
		options.math = req.param('math');
		options.format = req.param('mathType');
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
					data.cloudUrl = "http://" + req.headers.host + "/mathml/" + mathML.id;
					res.send(data);
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
	        MathmlController.mathjaxNodePage.typeset(options, function (data) {
        	  res.attachment(html5.filename);
              res.end(data.html, 'UTF-8');
	        });
	    });
  	},

	find: function(req, res) {
		var mathMLId = req.param('id');
		var wantsjson = req.param('json');
		Mathml.find({ _id: mathMLId }).exec(function (err, mathML) {
			// XXX Error handling
			if (err) {
				return console.log(err);
			} else {
				var dbMathML = mathML[0];
				var options = MathmlController.mathJaxNodeOptions;
				options.math = dbMathML.mathML;
				options.format = "MathML";
				MathmlController.mathjaxNode.typeset(options, function (data) {
					data.mathML = dbMathML.mathML;
					data.asciiMath = dbMathML.asciiMath;
					data.cloudUrl = "http://" + req.headers.host + "/mathml/" + dbMathML.id;
					if (wantsjson !== undefined)
						return res.send(data)
					else
						return res.view({jsonurl: data.cloudUrl + '?json', mathml: dbMathML.mathML, alttext: dbMathML.altText}); 
				});
			}
		});
	}
}

module.exports =  MathmlController;
