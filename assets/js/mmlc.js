$('body').ready( function() {
	$("#results").hide();

    $('#mml-editor').submit(
    	function(evt) {
    		$("#results").hide();
    		evt.preventDefault();
    		convert();
        }
    );

	window.sanitizeMathML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	window.convert = function() {
		var url = "/mathml/convert?math=" + encodeURIComponent($("#mml-input").val()) + "&mathType=" + $("#mathType").val();
		$("#processing").show();
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'json'
		}).done(function(data) {
			$("#results").show();
			$("#processing").hide();
			onConvertCallback(data);
		});
	};
	
	window.onConvertCallback = function(data) {
		$("#output-svg").empty();
		$("#output-svg").append($(data.svg));
		$("#output-svg-markup").html(sanitizeMathML(data.svg));
		$("#output-text").html(data.description);
		$("#output-url").html(data.cloudUrl);
		$("#output-pngImage").attr("src", data.png);
		$("#output-mathml").empty();
		$("#output-mathml").append($(data.mml));
		$("#output-mathml-markup").html(sanitizeMathML(data.mml));
	}
});
