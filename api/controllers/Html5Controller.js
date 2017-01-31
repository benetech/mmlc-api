/**
 * EquationController
 *
 * @description :: Server-side logic for managing Equations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var waterfall = require('async-waterfall');
var error_responses = {
	"missing_format" : { errorCode: "21", message: "Please specify output format."},
	"missing_file" : { errorCode: "24", message: "Please specify HTML5 file."},
	"invalid_format" : { errorCode: "24", message: "Only HTML5 files are supported."}
};
module.exports = {

	/**
	* Upload HTML5 and convert all equations to mathml.
	*/
	upload: function  (req, res) {
		//We need to know what kind of output you want.
		// Check both body and query params for the value since it might show
		// up in either. See MMLC-132 and MMLC-231.
    console.log("UPLOAD: Before outputFormat... ");
        var outputFormat = req.body.outputFormat || req.query.outputFormat;
		if (typeof(outputFormat) == "undefined" || !outputFormat in ['svg', 'png', 'description', 'mml']) {
			return res.badRequest(error_responses["missing_format"]);
		}
		var options = {};
		req.file('html5').upload(function (err, files) {

            if (err) {
	        	console.log(err);
			  	return res.serverError(err);
		    }
			if (typeof(files[0]) == "undefined") {
				return res.badRequest(error_responses["missing_file"]);
			}
            var html5 = files[0];
            var fs = require("fs");
            var path = require("path");
            if (path.extname(html5.filename) != ".html") {
                return res.badRequest(error_responses["invalid_format"]);
            }


	        //Save HTML5.
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Html5.create({
            			source: fs.readFileSync(html5.fd, {encoding: "utf8"}),
            			filename: html5.filename,
            			outputFormat: outputFormat,
            			status: 'accepted',
                        submittedBy: req.user,
                        ip_address: ip}).exec(function(err, dbHtml5) {
                if (err) {
                    console.log(err);
                    return res.badRequest(err);
                }
                //Submit job request.
              console.log("UPLOAD: Before QueueService... ");
              QueueService.submitHTML5ConversionJob(dbHtml5, function(err) {
                	if (typeof(err) != "undefined") {
                		console.log(err);
                		return res.serverError(err);
                	}
                	res.accepted(dbHtml5);
                });
            });
	    });
  	},

    //Right now, the only thing editable for html5 is the submittedBy attribute.
    update: function(req, res) {
        Html5.update({id: req.param("id")}, {submittedBy: req.user.id}).exec(function(err, uploads) {
            if (err) return res.serverError("Error updating html5.");
            return res.json(uploads[0]);
        });
    },

  	find: function(req, res) {
		var html5Id = req.param('id');
		Html5.findOne({ id: html5Id }).exec(function (err, html5) {
			if (err) {
				console.log(err);
				return res.serverError(err);
			}
			if (typeof(html5) != "undefined") {
                if (req.wantsJSON) {
                    res.json(html5);
                } else {
                    return res.redirect("#/html5/" + html5.id);
                }
			} else {
				res.notFound({ errorCode: "30", message: "HTML file not found: " + html5Id });
			}
		});
	},

	equations: function(req, res) {
		var html5Id = req.param('id');
		Equation.find({ html5: html5Id }).populate('components').exec(function(err, equations) {
			if (err) return res.serverError(err);
			res.json(equations);
		});
	},

	downloadSource: function(req, res) {
		Html5Service.download(req, res, true);
	},

	downloadOutput: function(req, res) {
		Html5Service.download(req, res, false);
	},

    myUploads: function(req, res) {
        var limit = typeof req.param('per_page') != 'undefined' ? req.param('per_page') : 50;
        var page = typeof req.param('page') != 'undefined' ? req.param('page') : 1;

        waterfall([
            function (callback) {
                Html5.count({submittedBy: req.user.id}).exec(function(err, numHtml5s) {
                    callback(err, numHtml5s);
                });
            },
            function (numHtml5s, callback) {
                Html5.find({ submittedBy: req.user.id, sort: 'createdAt DESC' }, {fields: ["id", "createdAt", "equations", "outputFormat", "filename"]}).paginate({page: page, limit: limit}).populate("equations").exec(function(err, html5s) {
                    callback(err, numHtml5s, html5s);
                });
            }
        ], function (err, numHtml5s, html5s) {
            if (err) return res.serverError(err);
            return res.json({"html5s": html5s, "numHtml5s": numHtml5s});
        });
    }

};

