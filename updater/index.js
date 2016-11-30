// updater/index.js
(function(updater) {
    'use strict';

	let socketio = require("socket.io");

    updater.init = (server) => {
		var io = socketio.listen(server);

	    io.sockets.on("connection", (socket) => {
		    console.log('socket was connected');
		    //socket.emit("showThis", "this is from the server");

		    socket.on("join category", (category) => {
			    socket.join(category);
		    });

		    socket.on("newNote", (data) => {
			   socket.broadcast.to(data.category).emit("broadcast note", data.note);
		    });
	    });
	};

}(module.exports));