(function(data) {
    'use strict';

	let seedData =  require('./seedData');
	let database =  require('./database');

    data.getNodeCategories = (next) => {
		database.getDb((err, db) => {
           if (err) {
               next(err, null);
           } else {
               db.notes.find().sort({name: -1}).toArray((err, results) => {
                   if (err) {
                       next(err, null);
                   } else {
                       next(null, results);
                   }
               });
           }
        });
    };

    data.getNotes = (categoryName, next) => {
        database.getDb((err, db) => {
            if (err) {
                next(err);
            } else {
                db.notes.findOne({name: categoryName}, next);
            }
        });
    };

    data.addNote = (categoryName, noteToInsert, next) => {
        database.getDb((err, db) => {
            if (err) {
                next(err);
            } else {
                db.notes.update(
                    { name: categoryName },
                    { $push: { notes: noteToInsert }},
                    next
                );
            }
        });
    };

    data.createNewCategory = (categoryName, next) => {
        database.getDb((err, db) => {
            if (err) {
                next(err);
            } else {
                db.notes.find({name: categoryName}).count((err, count) => {
                    if (err) {
                        next(err);
                    } else {
                        if (count !== 0) {
                            next("Category already exists");
                        } else {
                            let cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, (err) => {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };

    data.addUser = (user, next) => {
        database.getDb(function(err, db) {
            if (err) {
                console.log('Failed to seed database: ' + err);
            } else {
                db.users.insert(user, next);
            }
        });
    };

    data.getUser = (username, next) => {
        database.getDb(function(err, db) {
            if (err) {
               next(err);
            } else {
                db.users.findOne({ username: username }, next);
            }
        });
    };

    function seedDatabase() {
        database.getDb(function(err, db) {
            if (err) {
                console.log('Failed to seed database: ' + err);
            } else {
                // test to see if data exists
                db.notes.count(function(err, count) {
                   if (err) {
                       console.log('Failed to retrieve database count');
                   } else {
                       if (count === 0) {
                           console.log('Seeding the Database...');
                           seedData.initialNotes.forEach(function(item) {
                               db.notes.insert(item, function(err) {
                                   if (err) {
                                       console.log('Failed to insert note into database');
                                   } else {
                                       console.log("Database already seeded");
                                   }
                               });
                           });
                       }
                   }
                });

            }
        });
    }

    seedDatabase();
    
}(module.exports));