module.exports = {

	createComponent: function(format, source, equationId) {
        Component.create({
			format: format,
			source: source,
			equation: equationId	
		}).exec(function(err, c) {
			if (err) {
				console.log(err);
			}
		});
    }
};