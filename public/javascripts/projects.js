$(document).ready(function() {
	$.getJSON("/projects", function(json, status) {
		$projectList = $("#projects");
		for (var i = 0; i < json.length; i++) {
			$projectList.append("<a href='/projectImages?projectId=" + json[i].id + "' class='list-group-item'>" + json[i].name +"</a>");
		}
	});
});