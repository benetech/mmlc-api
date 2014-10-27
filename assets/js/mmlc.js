$('body').ready( function() {
	$("#results").hide();

    $('#mml-editor').on("submit", function(evt) {
    	if ($("#json").prop("checked") == true) {
	    	$("#results").hide();
			evt.preventDefault();
			convert();
		}
    });

    $("#svgFile").on("click", function() {
    	$("#outputOptions").hide();
    });

    $("#json").on("click", function() {
    	$("#outputOptions").show();
    });

	window.sanitizeMathML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	window.convert = function() {
		console.log($('#mml-editor').serialize());
		var url = "/mathml/convert?" + $('#mml-editor').serialize(); //encodeURIComponent($("#mml-input").val()) + "&mathType=" + $("#mathType").val();
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
		if ($("#svg").prop("checked") == true) {
			$("#output-svg").empty();
			$("#output-svg").append($(data.svg));
			$("#output-svg-markup").html(sanitizeMathML(data.svg));
			$(".svg").show();
		} else {
			$(".svg").hide();
		}
		if ($("#description").prop("checked") == true) {
			$("#output-text").html(data.description);
			$(".description").show();
		} else {
			$(".description").hide();
		}
		$("#output-url").html(data.cloudUrl);
		if ($("#png").prop("checked") == true) {
			$("#output-pngImage").attr("src", data.png);
			$("#output-pngImage").attr("alt", data.description);
			$(".png").show();
		} else {
			$(".png").hide();
		}
		$("#output-mathml").empty();
		$("#output-mathml").append($(data.mml));
		$("#output-mathml-markup").html(sanitizeMathML(data.mml));
	}
});
