$(document).ready(function() {

	//
	// Find all checked images and then request the URL from the server
	// 	for the sizzlepig fine-tune page.	
	//
	$("#editImages").on('click', function() {
		$selectedImages = $($("#images").find(".imageSelected"));
		var args = [];
		for (var i = 0; i < $selectedImages.length; i++) {
			args.push($($selectedImages[i]).data("image-name"));
		}

		$.get("/editURL?projectId=" + projectId + "&files=" + args.join("&files="), function(body, status) {
			window.open(body, 'Mini Viewer', 'window settings');		
		});
		return false;
	});

	//
	//	Get content list from server
	//
	$.getJSON("/images" + window.location.search, function(json, status) {
		$imageList = $("#images");
		for (var i = 0; i < json.length; i++) {
			$imageList.append("<a href='#' data-image-name='" + json[i] + "'' class='list-group-item toggleSelected imageSelected'><span class='glyphicon glyphicon-ok'></span>" + json[i] +"</a>");
		}
	});

	//
	//	Handle selection of images.
	//
	$(document).on('click', ".toggleSelected", function(event) {
		$(this).find('span').toggle();
		$(this).toggleClass("imageSelected")
		return false;
	});
});