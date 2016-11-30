(function(notesController) {
    'use strict';

	let data = require('../data');
	let auth = require('../auth');

	notesController.init = function(app) {
		app.get("/api/notes/:categoryName",
			auth.ensureApiAuthenticated,
			(req, res) => {
				let categoryName = req.params.categoryName;
				data.getNotes(categoryName, (err, notes) => {
					if (err) {
						res.send(400, err);
					} else {
						res.set("Content-type", "application/json");
						res.send(notes.notes);
					}

				});
		});

		app.post("/api/notes/:categoryName",
			auth.ensureApiAuthenticated,
			(req, res) => {
				let categoryName = req.params.categoryName;
				let noteToInsert = {
					note: req.body.note,
					color: req.body.color,
					author: "Ruslan"
				};
				data.addNote(categoryName, noteToInsert, (err) => {
					if (err) {
						res.send(400, "Failed to add note to data store");
					} else {
						res.set("Content-type", "application/json");
						res.send(201, noteToInsert);
					}

				});
		});
	};
}(module.exports));