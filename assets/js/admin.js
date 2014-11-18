$(function() {
	//bind pagination.
	$(".page").unbind().click(function(evt) {
		evt.preventDefault();
		var href = $(this).attr("href");
		var dataType = $(this).data("type");
		console.log($(this).parent());
		$(this).parent("li").siblings().removeClass("active");
		$(this).parent("li").addClass("active");
		$("#" + dataType + "Results").load(href + " #resultsTable");
	});
	//Bind equations
	$(".equation").unbind().click(function(evt) {
		evt.preventDefault();
		var href = $(this).attr("href");
		$("#equation").load(href, function(data) {
			$("#equationModal").appendTo("body").modal('show');
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		});
	});
});