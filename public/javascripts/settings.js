$(document).ready(function() {
	$.getJSON("/getSettings", function(body, status) {
		$("#username").val(body.username);
		$("#password").val(body.password);
	});

	$("#saveSettings").on('click', function() {
		$.post("/saveSettings", {password: $("#password").val(), username: $("#username").val()}, function(response) {
			if (response && response.status == "okay") {
				$("#statusSaved").show(200);
				setTimeout(function() { $("#statusSaved").hide(400); }, 2000);
			}
			else {
				$("#statusErrorSaving").show(200);
				setTimeout(function() { $("#statusErrorSaving").hide(400); }, 2000);
			}
		}, 'json');
		return false;
	});
});
