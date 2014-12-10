$('body').ready( function() {
	$("#results").hide();

    $('#mml-editor').on("submit", function(evt) {
    	$("#errorMessage").html("");
    	if ($("#downloadPNG").prop("checked") == true) {
    		$('#mml-editor').attr("action", "/equation/png");
    	} else if ($("#json").prop("checked") == true) {
	    	$("#results").hide();
	    	evt.preventDefault();
	    	if ($("#mml-input").val() != "") {
				convert();
			} else {
				alert("Please enter an equation.");
			}
		}
    });

    $("#html5-editor").on("submit", function(evt) {
    	if ($("#html5").val() == "") {
    		alert ("Please select a HTML5 file to upload.");
    		return false;
    	}
    });

    $("#downloadSVG").on("click", function() {
    	$("#outputOptions").hide();
    });

    $("#downloadPNG").on("click", function() {
    	$("#outputOptions").hide();
    });

    $("#json").on("click", function() {
    	$("#outputOptions").show();
    });

    $("#commentForm").on("submit", function(evt) {
    	evt.preventDefault();
    	var url = "/feedback?" + $('#commentForm').serialize(); 
    	$.ajax({
			type: "POST",
			url: url,
			dataType: 'json'
		}).done(function(data) {
			$("#commentsMessaging").html("Thank you for your feedback!");
			setTimeout(function() {
				$("#commentsMessaging").attr('tabindex', '-1').focus();
			}, 500);
		});
    })

	window.sanitizeMathML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	window.convert = function() {
		console.log($('#mml-editor').serialize());
		var url = "/equation?" + $('#mml-editor').serialize(); 
		$("#processing").show();
		$.ajax({
			type: "POST",
			url: url,
			dataType: 'json'
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$("#errorMessage").text("There was an error converting your math: " + jqXHR.responseText);
			$("#processing").hide();
			setTimeout(function() {
				$("#errorMessage").attr('tabindex', '-1').focus();
			}, 500);
		}).success(function(data) {
			$(".component").hide();
			$("#results").show();
			$("#processing").hide();
			onConvertCallback(data);
		});
	};
	
	window.onConvertCallback = function(equation) {
		//iterate over components.
		$.each(equation.components, function(key, component) {
			switch (component.format) {
				case "png": 
					$("#output-pngImage").html(component.source);
					break;
				case "svg":
					$("#output-svg").empty();
					$("#output-svg").append($(component.source));
					$("#output-svg-markup").html(sanitizeMathML(component.source));
					break;
				case "description":
					$("#output-text").html(component.source);
					break;
				default:
					//mathml.
					$("#output-mathml").empty();
					$("#output-mathml").append($(component.source));
					$("#output-mathml-markup").html(sanitizeMathML(component.source));
					break;
			}
			$(".download-" + component.format).attr("href", "/component/" + component.id);
			$("." + component.format).show();
			$("#comment-" + component.format).show();
			$("#comment-" + component.format).prop("disabled", false);
			$("#comment-" + component.format).val(component.id);
		});
		$("#output-url").html(equation.cloudUrl);
		$("#equation").val(equation.id);

	}
});
