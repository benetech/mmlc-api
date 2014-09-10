/**
 * MathmlController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
// Comment controller with generated actions.
var MathmlController = {
	
	mathjaxNode: require("../../node_modules/MathJax-node/lib/mj-single.js"),
	mathJaxNodeOptions: {svg:true, img:false, mml:true, png:true},
	
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
			console.log(data.errors);
			//Create record for callback.
			Mathml.create({
			  altText: "Placeholder until we get chromevox work",
			  asciiMath: req.param("mathType") == "AsciiMath" ? req.param("math") : null,
			  tex: req.param("mathType") === "inline-TeX" ? req.param("math") : null,
			  mathML: data.mml
			}).done(function(err, mathML) {
			  // Error handling
			  if (err) {
			    return console.log(err);
			  } else {
				data.cloudUrl = req.baseUrl + "/mathml/" + mathML.id;
				res.send(data);
			  }
			});
		});
	},

	find: function(req, res) {
		var mathMLId = req.param('id');
		var wantsjson = req.param('json');
		Mathml.find({ _id: mathMLId }).done(function (err, mathML) {
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
					data.cloudUrl = MathmlController.cloud_url + dbMathML.id;
					console.log(data);
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
