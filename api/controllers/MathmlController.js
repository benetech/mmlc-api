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
	
	cloud_url: "http://localhost:1337/mathml/",
	
	/** 
	* Convert to svg and get text description.
	* @param req expected param: mathml
	* @param res returns json
	*/
    convert: function(req, res) {
		MathoidService.callMathoid({mathml:req.param('mathml')}, function(mathoidJson) {
			//Create record for callback.
			Mathml.create({
			  altText: mathoidJson['altText'],
			  asciiMath: req.param('asciiMath'),
			  mathML: req.param('mathml')
			}).done(function(err, mathML) {
			  // Error handling
			  if (err) {
			    return console.log(err);
			  } else {
				mathoidJson.mathML = mathML.mathML;
				mathoidJson.cloudUrl = MathmlController.cloud_url + mathML.id;
				res.send(mathoidJson);
			  }
			});
		});
    },

	find: function(req, res) {
		var mathMLId = req.param('id');
		var wantsjson = req.param('json');
		Mathml.find({ _id: mathMLId }).done(function (err, mathML) {
			console.log(mathML[0]);
			// XXX Error handling
			if (err) {
				return console.log(err);
			} else {
				var dbMathML = mathML[0];
				MathoidService.callMathoid({mathml:dbMathML.mathML}, function(mathoidJson) {
					mathoidJson.mathML = dbMathML.mathML;
					mathoidJson.asciiMath = dbMathML.asciiMath;
					mathoidJson.cloudUrl = MathmlController.cloud_url + dbMathML.id;
					console.log(mathoidJson);
					if (wantsjson !== undefined)
						return res.send(mathoidJson)
					else
						return res.view({jsonurl: mathoidJson.cloudUrl + '?json', mathml: dbMathML.mathML, alttext: dbMathML.altText}); //mathoidJson);
				});
			}
		});
	}
}

module.exports =  MathmlController;
