$('body').ready( function() {
	$("#results").hide();
	window.mmlEdit = {
		input: $('#mml-editor'),
		output: {
			visual: $('#output-visual'),
			mml: $('#output-mathml'),
			svg: $('#output-svg'),
			text: $('#output-text'),
			renderedMML: $("#renderedMathMl")
		},
		render: function(s) {
			var self = this;
			if ($("#mathType").val() == "MathML") {
				this.output.visual.empty();
				this.output.visual.append($(s));
			} else {
				var delim = $("#mathType").val() == "Tex" ? "$$" : "`";
				this.output.visual.text(delim + s + delim);
			}
			MathJax.Callback.Queue(
				["Typeset", MathJax.Hub, this.output.visual[0]],
				[function() { self.jax.visual = MathJax.Hub.getAllJax(self.output.visual[0])[0]; }],
				[function() { self.output.mml.html(sanitizeMathML(self.jax.visual.root.toMathML()));}],
				[function() { self.output.renderedMML.html(self.jax.visual.root.toMathML());}],
				[function() { convert(self.jax.visual.root.toMathML()); }]);
		},
		jax: {}
	};

	// wire up event handler
    window.mmlEdit.input.submit(
    	function(evt) {
    		$("#results").hide();
    		evt.preventDefault();
    		window.mmlEdit.render($("#mml-input").val());
        }
    );

	window.sanitizeMathML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	
	window.convert = function(mathML) {
		console.log("http://localhost:1337/mathml/convert?math=" 
			+ encodeURIComponent(mathML) + "&mathType=" + $("#mathType").val());
		$("#output-text").html('');
		$.ajax({
			type: "GET",
			url: "http://localhost:1337/mathml/convert?math=" 
			+ encodeURIComponent($("#mml-input").val()) + "&mathType=" + $("#mathType").val(),
			dataType: 'json'
		}).done(function(data) {
			$("#results").show();
			onConvertCallback(data);
		});
	};
	
	window.onConvertCallback = function(data) {
		$("#output-svg").find("svg").remove();
		$("#output-svg").append($(data.svg));
		$("#output-svg-markup").html(sanitizeMathML(data.svg));
		$("#output-text").html(data.altText);
		$("#output-url").html(data.cloudUrl);
		$("#output-pngImage").attr("src", data.png);
	}
});
