var fs = require("fs");
var SETTINGS_FILE = "./demo-settings.json";

//
//	Render settings page
//
settings = function(req, res) {
	res.render('settings', { title: 'Settings' });
};

//
//	Save settings route.
//
saveSettings = function(req, res) {
	/*
		NOTE: This does not in any way protect your username and password.
			  This is for DEMONSTRATION PURPOSES ONLY!
	*/

	if (req.body.username && req.body.password) {
		var options = {
			username: req.body.username,
			password: req.body.password
		}
		fs.writeFile(SETTINGS_FILE, JSON.stringify(options), function(err) {
			if (err) {
				console.log("Error writing file... ")
				console.log(err);
				res.send({"status": "error"});
				return;
			}
			res.send({"status": "okay"});
		})
	}
}

//
//	Internal function for retrieving settings.
//
_getSettings = function(cb) {
	fs.readFile(SETTINGS_FILE, function(err, file) {
		if (err) {
			if (err.code == "ENOENT") {
				cb(null, {});
				return;
			}
			cb(err);
			return;
		}
		try {
			cb(null, JSON.parse(file));
		}
		catch(e) {
			cb(null, {});
		}
	});
}

//
//	Get settings route.
//
getSettings = function(req, res) {
	_getSettings(function(err, file) {
		if (err) {
			console.log("Error retrieving settings file");
			console.log(err)
			res.send({"status": "error"});
		}
		res.send(file);
	});
}

exports._getSettings = _getSettings;
exports.getSettings = getSettings;
exports.saveSettings = saveSettings;
exports.settings = settings;