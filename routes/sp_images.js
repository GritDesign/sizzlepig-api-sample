var request = require('request');
var settings = require('./settings');
var config = require('../config.js');

/* GET users listing. */
exports.list = function(req, res) {
	settings._getSettings(function(err, value) {
		if (req.query.projectId && !err) {
			projectId = req.query.projectId;
		}
		else {
			console.log(err);
			res.send([]);
			return;
		}
		// query sizzlepig API for images in a project
		var uri = config.SIZZLEPIG_API + "/v1/project/" + projectId + "/files?username=" + value.username + "&password=" + value.password;
		request.get({uri: uri, json:true}, function(err, response, body) {
			if (err || !body || !body.files) {
				res.send([]);
				return;
			}
			res.send(body.files)
		});
	});
};

exports.listProjects = function(req, res) {
	settings._getSettings(function(err, value) {
		if (err) {
			console.log(err);
			res.send([]);
			return;
		}
		// query sizzlepig API for images in a project
		var uri = config.SIZZLEPIG_API + "/v1/projects?username=" + value.username + "&password=" + value.password;		
		request.get({uri: uri, json:true}, function(err, response, body) {
			if (err || !body || !body.projects) {
				res.send([]);
				return;
			}
			res.send(body.projects);
		});
	});
}

exports.getEditURL = function(req, res) {

	// put together URL with list of files signed with sizzlepig credentials

	/*
		Note.  The scope argument is very important for securing your domain.
		       We suggest you limit sessions to the project the user needs to 
		       work on.  You may supply more than one project in the authorizedProjects array.
		       If you don't supply a scope, the session will be created with FULL access 
		       to your account.  Use this at your own risk.  Projects created, images processed,
		       account upgrades etc, are your responsiblity.
	*/

	//
	// `req.query.files` should have list of files to edit
	//
	var files;
	if (typeof req.query.files === "string") 		{ files = "files=" + req.query.files; }
	else if (typeof req.query.files === "object") 	{ files = "files=" + req.query.files.join("&files="); }

	settings._getSettings(function(err, value) {
		var url = config.SIZZLEPIG_API + "/v1/oauth/token" + '?username=' + value.username + '&password=' + value.password;
		var opts = {
			url: url,
			form: {
				username: value.username,
				password: value.password,
				scope: JSON.stringify({
					"authorizedProjects": [req.query.projectId],
					"redirectURL": "/projects/" + req.query.projectId + "?min=true&" + files
				}),
				"grant_type": "password"
			}
		}
		/*
			This is exchanging your username and password for a 1 time use token a user can use
			to access the project.  The token is exchanged for a cookie that is bound to a session
			with no expiration.
		*/
		request.post(
			opts,
			function(error, response, body){
				if (error) {
					console.log(error)
				}
				var r = JSON.parse(body);
				res.send(config.SIZZLEPIG + "/tokenLogin?accessToken=" + r.access_token);
			}
		);
	});
}
