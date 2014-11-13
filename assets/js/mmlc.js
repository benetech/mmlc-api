$('body').ready( function() {
	$("#results").hide();

    $('#mml-editor').on("submit", function(evt) {
    	$("#errorMessage").html("");
    	if ($("#json").prop("checked") == true) {
	    	$("#results").hide();
	    	evt.preventDefault();
	    	if ($("#mml-input").val() != "") {
				convert();
			} else {
				alert("Please enter an equation.");
			}
		}
    });

    $("#svgFile").on("click", function() {
    	$("#outputOptions").hide();
    });

    $("#json").on("click", function() {
    	$("#outputOptions").show();
    });

    $("#commentForm").on("submit", function(evt) {
    	evt.preventDefault();
    	var url = "/feedback/create?" + $('#commentForm').serialize(); 
    	$.ajax({
			type: "GET",
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
		var url = "/equation/convert?" + $('#mml-editor').serialize(); 
		$("#processing").show();
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'json'
		}).fail(function() {
			$("#errorMessage").html("There was an error converting your math.");
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
					$("#output-pngImage").attr("src", component.source);
					$("#output-pngImage").attr("alt", "PNG Component");
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
			$("." + component.format).show();
			$("#comment-" + component.format).show();
			$("#comment-" + component.format).prop("disabled", false);
			$("#comment-" + component.format).val(component.id);
		});
		$("#output-url").html(equation.cloudUrl);
		$("#equation").val(equation.id);

	}
});
