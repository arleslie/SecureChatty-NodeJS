var server = require('http').createServer(),
	io = require('socket.io')(server);

var clients = {};


io.use(function(socket, next) {
	if (socket.handshake.query !== undefined && socket.handshake.query.username !== undefined) {
		// Authenication will end up here.

		var username = socket.handshake.query.username;
		clients[username] = socket;
	}
	next();
});


io.on('connection', function(socket) {
	socket.on('getClients', function (data) {
		socket.emit('event', Object.keys(clients));
	});

	socket.on('message', function(data) {
		if (clients[data.username] !== undefined) {
			clients[data.username].emit('message', data.message);
		}

		// insert into database here.
	});

	socket.on('disconnect', function () {
		delete clients[socket.handshake.query.username]
	});
});

server.listen(9000);