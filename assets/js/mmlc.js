$('body').ready( function() {
	window.mmlEdit = {
		input: $('#mml-editor'),
		output: {
			visual: $('#output-visual'),
			mml: $('#output-mathml'),
			svg: $('#output-svg'),
			text: $('#output-text'),
		},
		render: function(s) {
			var self = this;
			this.output.visual.text("`" + s + "`");
		        if ($("#mml-type").val()=='latex') {
			  MathJax.Callback.Queue(
			    ["Typeset", MathJax.Hub, this.output.visual[0]],
	        	    [function() { self.jax.visual = MathJax.Hub.getAllJax(self.output.visual[0])[0]; }],
			    [function() { self.output.mml.html(sanitizeMathML(self.jax.visual.root.toMathML()));}],
		            [function() { callMathoid('latex'); }]);
			} else {
			  MathJax.Callback.Queue(
			    [function() { self.output.mml.html(sanitizeMathML($("#mml-input").val()));}],
			    [function() { callMathoid('mathml'); }]);
			}
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
	
	window.callMathoid = function(type) {
		$("#output-text").html('');
		$.ajax({
		  	  type: "GET",
			  url: "http://localhost:1337/mathml/convert?"+type+"=" 
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
		$("#output-pngImage").attr("src", data.dataUri);
		//var DataURI=oCanvas.toDataURL('image/png');
		//document.getElementById("output-pngImage").src=DataURI; 
	}
});
