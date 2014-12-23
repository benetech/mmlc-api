$(function() {
	//bind pagination.
	bindPagination = function() {
		$(".page").unbind().click(function(evt) {
			evt.preventDefault();
			var href = $(this).attr("href");
			var dataType = $(this).data("type");
			$(this).parent("li").siblings().removeClass("active");
			$(this).parent("li").addClass("active");
			$("#" + dataType + "Results").load(href + " #resultsTable", function(data) {
				bindPagination();	
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			});
		});	
	}
	bindPagination();
	
});