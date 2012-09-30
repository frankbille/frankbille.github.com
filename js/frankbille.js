/**

You can now create a spinner using any of the variants below:

$("#el").spin(); // Produces default Spinner using the text color of #el.
$("#el").spin("small"); // Produces a 'small' Spinner using the text color of #el.
$("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
$("#el").spin({ ... }); // Produces a Spinner using your custom settings.

$("#el").spin(false); // Kills the spinner.

*/
(function($) {
	$.fn.spin = function(opts, color) {
		var presets = {
			"tiny": { lines: 8, length: 2, width: 2, radius: 3 },
			"small": { lines: 8, length: 4, width: 3, radius: 5 },
			"large": { lines: 10, length: 8, width: 4, radius: 8 }
		};
		if (Spinner) {
			return this.each(function() {
				var $this = $(this),
					data = $this.data();

				if (data.spinner) {
					data.spinner.stop();
					delete data.spinner;
				}
				if (opts !== false) {
					if (typeof opts === "string") {
						if (opts in presets) {
							opts = presets[opts];
						} else {
							opts = {};
						}
						if (color) {
							opts.color = color;
						}
					}
					data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
				}
			});
		} else {
			throw "Spinner class not available.";
		}
	};
})(jQuery);

$(function() {
	/**
	 * Tooltips
	 */
	$('[data-placement]').tooltip();
	
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
		
		var spinner = $("<div style='margin-left: 14px'>");
		spinner.spin("small", "black");
		container.append(spinner);
		
		var repoAdded = false;
		
		$.ajax({
			url: 'https://api.github.com/users/'+user+'/repos',
			dataType: 'jsonp',

			success: function(results){
				spinner.spin(false);
				spinner.remove();
				
				if ($.isArray(results.data)) {
					$.each(results.data, function(index, value) {
						if (repoAdded) {
							container.append(" ");
						}
						
						var repoLink = $("<a class='btn btn-mini' style='margin-bottom: 8px'>");
						repoLink.attr("href", value.html_url);
						if (value.description != "") {
							repoLink.attr("title", value.name);
							repoLink.attr("data-content", value.description);
							repoLink.attr("data-placement", "top");
							repoLink.attr("data-trigger", "hover");
							repoLink.popover();
						}
						repoLink.append(value.name);
						
						container.append(repoLink);
						
						repoAdded = true;
					});
				}
			}
		});
	});
});
