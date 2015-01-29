module.exports = {

	download: function(req, res, source) {
		var html5Id = req.param("id");
		if (typeof(html5Id) == "undefined") return res.badRequest("Please specify html5 record id.");
		Html5.findOne({id: html5Id}).exec(function(err, html5) {
			if (err) 
				return res.badRequest(err);
			if (typeof(html5) == "undefined") 
				return res.notFound({ errorCode: "30", message: "HTML file not found: ", html5Id });
			res.attachment(html5.filename);
          	res.end(source ? html5.source : html5.output, 'UTF-8');
		});
	}
};