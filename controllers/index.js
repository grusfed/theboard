(function(controllers) {
    'use strict';

	let homeController = require('./homeController');
	let notesController = require('./notesController');

	controllers.init = function(app) {
		homeController.init(app);
		notesController.init(app);
	};

}(module.exports));