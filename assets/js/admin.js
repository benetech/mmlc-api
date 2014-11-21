$(function() {
	//bind pagination.
	$(".page").unbind().click(function(evt) {
		evt.preventDefault();
		var href = $(this).attr("href");
		var dataType = $(this).data("type");
		$(this).parent("li").siblings().removeClass("active");
		$(this).parent("li").addClass("active");
		$("#" + dataType + "Results").load(href + " #resultsTable", function(data) {
			bindEquations();	
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		});
	});	

	bindEquations = function() {
		//Bind equations
		$(".equation").unbind().click(function(evt) {
			evt.preventDefault();
			var href = $(this).attr("href");
			$("#equation").load(href, function(data) {
				$("#equationModal").appendTo("body").modal('show');
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
				bindPagination();
			});
		});	
	}
	bindEquations();
});