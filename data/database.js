(function(database) {
    'use strict';

	let mongodb = require('mongodb');
    let mongoUrl = "mongodb://localhost:27017/theBoard";
    let theDb = null;

    database.getDb = function(next) {
        if (!theDb) {
            mongodb.MongoClient.connect(mongoUrl, function(err, db) {
               if (err) {
                   next(err, null);
               } else {
                   theDb = {
                       db: db,
                       notes: db.collection('notes'),
                       users: db.collection('users')
                   };
                   next(null, theDb);
               }
            });
        } else {
            next(null, theDb);
        }
    }
}(module.exports));