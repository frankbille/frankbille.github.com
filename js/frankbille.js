function frankbille_log(obj) {
	if (console && console.log) {
		console.log(obj);
	}
}

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
	
	/**
	 * GitHub activity feed
	 */
	$('.github-activity').each(function() {
		var container = $(this);
		var user = container.data("user");
		
		$.ajax({
			url: 'https://api.github.com/users/'+user+'/events/public?page=1&per_page=10',
			dataType: 'jsonp',

			success: function(results){
				if ($.isArray(results.data)) {
					// /events api doesn't seem to support per_page
					// definition, so we always get 30, even though we
					// only want 10
					var data = results.data.slice(0, 9);
					
					$.each(data, function(index, value) {
						var repoUrl = "https://github.com/"+value.repo.name;

						var item = $("<div style='margin-bottom:20px'>");
						var createdAt = moment(value.created_at);
						item.append($("<time class='muted'>").attr("datetime", value.created_at).livestamp(createdAt));
						item.append("<br>");
						
						if (value.type == "CreateEvent") {
							if (value.payload.ref_type == "tag") {
								var strong = $("<strong>");
								strong.append(value.actor.login + " created tag ");
								strong.append($("<a>").attr("href", repoUrl+"/tree/"+value.payload.ref).text(value.payload.ref));
								strong.append(" at ");
								strong.append($("<a>").attr("href", repoUrl).text(value.repo.name));
								item.append(strong);
							} else {
								frankbille_log("Unsupported create event ref type: "+value.payload.ref_type);
								item = "";
							}
						} else if (value.type == "PublicEvent") {
							var strong = $("<strong>");
							strong.append(value.actor.login + " open sources ");
							strong.append($("<a>").attr("href", repoUrl).text(value.repo.name));
							item.append(strong);
						} else if (value.type == "PushEvent") {
							var strong = $("<strong>");
							strong.append(value.actor.login + " pushed to ");
							strong.append($("<a>").attr("href", repoUrl).text(value.repo.name));
							item.append(strong);
							var maxCommits = value.payload.commits.length < 3 ? value.payload.commits.length : 3;
							for (i = 0; i < maxCommits; i++) {
								var commit = value.payload.commits[i];
								var c = $("<div class='row'>");
								c.append($("<div class='span1'>").append($("<small>").append($("<a>").attr("href", repoUrl+"/commit/"+commit.sha).text(commit.sha.substring(0, 8)))));
								var msg = commit.message;
								if (msg.indexOf("\n") > -1) {
									msg = msg.substring(0, msg.indexOf("\n"));
								}
								c.append($("<div class='span7'>").append($("<small>").text(msg)));
								item.append(c);
							}
							if (value.payload.commits.length > maxCommits) {
								item.append($("<a>").attr("href", repoUrl+"/compare/"+value.payload.before+"..."+value.payload.head).text("See all "+value.payload.size+" commits"));
							}
						} else if (value.type == "WatchEvent") {
							var strong = $("<strong>");
							strong.append(value.actor.login + " starred ");
							strong.append($("<a>").attr("href", repoUrl).text(value.repo.name));
							item.append(strong);
						} else {
							frankbille_log("Unsupported value type: "+value.type);
							item = "";
						}
						
						container.append(item);
					});
					
					container.append("<br>");
					container.append($("<a class='btn btn-small'>").attr("href", "https://github.com/frankbille?tab=activity").text("See more on Github Profile"));
				}
			}
		});
	});
});
