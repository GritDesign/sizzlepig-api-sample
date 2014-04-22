projectImages = function(req, res) {
	res.render('project', { title: 'Project Files', projectId: req.query.projectId, projectTitle: "N" });
};

exports.projectImages = projectImages;