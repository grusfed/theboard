(function(homeController) {
    'use strict';

	let data = require('../data');
	let auth = require('../auth');

	homeController.init = function(app) {
		app.get("/", (req, res) => {
			data.getNodeCategories((err, results) => {
				res.render("index", {
					title: "Express + Vash",
					error: err,
					categories: results,
					newCatError: req.flash('newCatName'),
					user: req.user
				});
			});
		});

		app.get('/notes/:categoryName',
			auth.ensureAuthenticated,
			(req, res) => {
				let categoryName = req.params.categoryName;
				res.render("notes", { title: categoryName, user: req.user });
		});

		app.post('/newCategory', (req, res) => {
			let categoryName = req.body.categoryName;
			data.createNewCategory(categoryName, (err) => {
				if (err) {
					// Handle Error
					console.log(err);
					req.flash('newCatName', err);
					res.redirect("/");
				} else {
					res.redirect("/notes/" + categoryName);
				}
			});
		});
	};
}(module.exports));