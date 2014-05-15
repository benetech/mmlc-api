$('body').ready( function() {
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
			this.output.visual.text("`" + s + "`");
			MathJax.Callback.Queue(
				["Typeset", MathJax.Hub, this.output.visual[0]],
				[function() { self.jax.visual = MathJax.Hub.getAllJax(self.output.visual[0])[0]; }],
				[function() { self.output.mml.html(sanitizeMathML(self.jax.visual.root.toMathML()));}],
				[function() { self.output.renderedMML.html(self.jax.visual.root.toMathML());}],
				[function() { callMathoid(self.jax.visual.root.toMathML()); }]);
		},
		jax: {}
	};

	// wire up event handler
    window.mmlEdit.input.submit(
    	function(evt) {
			evt.preventDefault();
    		window.mmlEdit.render($("#mml-input").val());
        }
    );

	window.sanitizeMathML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	
	window.callMathoid = function(mathML) {
		$("#output-text").html('');
		$.ajax({
			type: "GET",
			url: "http://localhost:1337/mathml/convert?mathml=" + encodeURIComponent(mathML) + "&asciiMath=" 
				+ encodeURIComponent($("#mml-input").val()),
			dataType: 'json'
		}).done(function(data) {
			onMathoidCallback(data);
		});
	};
	
	window.onMathoidCallback = function(data) {
		$("#output-svg").find("svg").remove();
		$("#output-svg").append($(data.svg));
		$("#output-svg-markup").html(sanitizeMathML(data.svg));
		$("#output-text").html(data.altText);
		$("#output-url").html(data.cloudUrl);
		var oCanvas=document.getElementById('output-svgImage');
		var ctx = oCanvas.getContext('2d');
		ctx.drawSvg(data.svg, 50 , 50 , 50, 50);
		var DataURI=oCanvas.toDataURL('image/png');
		document.getElementById("output-pngImage").src=DataURI;
	}
	
	
});
