var room = {},
	users = {},
	uuid = require('uuid-v4'),
	io = require('socket.io').listen(4000);

io.sockets.on('connection', function (socket) {
	var thisUser;

	socket.on('setRoom', function (pass) {
		room[pass] = 0;
	});

	socket.on('setUser', function (newUser) {
		var user = {
			id: uuid(),
			name: newUser.name,
			room: newUser.room
		}

		if(room[user.room] == null){
			socket.emit('error', "NotFoundRoom");
		} else {
			t = user;
			room[user.room]++;
			users[user.id] = user;
			socket.join('room-' + user.room);
		}
	});

	socket.on('message', function (msg) {
		io.sockets.in('room-'+msg.room).emit('message', msg);
	});

	socket.on('disconnect', function () {
		if(thisUser != undefined){
			delete users[thisUser.id];
			room[thisUser.room] = room[thisUser.room] - 1;
			if(room[thisUser.room] == 0){
				delete room[thisUser.room];
			}
		}
	});
});