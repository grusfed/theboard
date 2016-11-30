// auth/index.js
(function(auth) {
    'use strict';

	let data = require("../data");
	let hasher = require("./hasher");

	let passport = require("passport");
	let localStrategy = require("passport-local").Strategy;

	function userVerify(username, password, next) {
		data.getUser(username, (err, user) => {
			if (!err && user) {
				let testHash = hasher.computeHash(password, user.salt)
				//if (username === 'admin' && password == 'admin') {
				//	next(null, user);
				//	return;
				//}
				if (testHash === user.passwordHash) {
					next(null, user);
					return;
				}
			}

			next(null, false, { message: "Invalid Credentials."});
		});
	}

	auth.ensureAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/login');
		}
	};

	auth.ensureApiAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.send(401, "Not authorized");
		}
	};

    auth.init = (app) => {

	    passport.use(new localStrategy(userVerify));
	    passport.serializeUser((user, next) => {
		   next(null, user.username);
	    });
	    passport.deserializeUser((key, next) => {
		   data.getUser(key, (err, user) => {
			   if (err) {
				   next(null, false, { message: "Failed to retrieve user"});
			   } else {
				   next(null, user);
			   }
		   }) ;
	    });
	    //finish setup
	    app.use(passport.initialize());
	    app.use(passport.session());

	    app.get('/login', (req, res) => {
		   res.render('login', { title: "Login to The Board", message: req.flash("loginError") });
	    });

	    app.post('/login', (req, res, next) => {
		    let authFunction = passport.authenticate("local", (err, user, info) => {
				if (err) {
					next(err);
				} else {
					req.logIn(user, (err) => {
						if (err) {
							next(err);
						} else {
							res.redirect('/');
						}
					});
				}
		    });
		    authFunction(req, res, next);
	    });

		app.get('/register', (req, res) => {
			res.render("register", {
				title: "Register for The Board",
				message: req.flash("registrationError")
			});
		});

	    app.post('/register', (req, res) => {
		    let salt = hasher.createSalt();
		    
		    let user = {
			    name: req.body.name,
			    email: req.body.email,
			    username: req.body.username,
			    passwordHash: hasher.computeHash(req.body.password, salt),
			    salt: salt
		    };

		    data.addUser(user, (err) => {
			    if (err) {
					req.flash("registrationError", "Could note save user to database.")
				    res.redirect("/register");
			    } else {
					res.redirect('/login');
			    }
		    });
	    });
    };
}(module.exports));