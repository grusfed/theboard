// hasher.js
(function(hasher) {
    'use strict';

	let bcrypt = require('bcrypt');
	let saltRounds = 10;
	
	hasher.computeHash = (password, salt) => {
		//var hash = null;
		//bcrypt.hash(password, salt, function(err, hash) {
		//	if (err) {
		//		// TODO
		//	} else {
		//		hash = hash;
		//	}
		//});
		//return hash;
		return bcrypt.hashSync(password, salt);
	};

	hasher.createSalt = () => {
		//var salt = null;
		//bcrypt.genSalt(saltRounds, function(err, salt) {
		//	if (err) {
		//		// TODO
		//	} else {
		//		salt = salt;
		//	}
		//});
		
		//return salt;
		return bcrypt.genSaltSync(saltRounds);
	};

}(module.exports));