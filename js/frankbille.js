$(function() {
	/**
	 * Current year
	 */
	$('.current-year').text(new Date().getFullYear());
	
	/**
	 * GitHub projects loading
	 */
	$('.github-projects').each(function() {
		var container = $(this);
		var user = container.data("user");
		
		var repoAdded = false;
		
		$.ajax({
			url: 'https://api.github.com/users/'+user+'/repos',
			dataType: 'jsonp',

			success: function(results){
				if ($.isArray(results.data)) {
					$.each(results.data, function(index, value) {
						if (repoAdded) {
							container.append(" ");
						}
						
						var repoLink = $("<a class='btn btn-mini' style='margin-bottom: 8px'>");
						repoLink.attr("href", value.html_url);
						repoLink.append(value.name);
						
						container.append(repoLink);
						
						repoAdded = true;
					});
				}
			}
		});
	});
});
