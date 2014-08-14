var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookie = require('cookie');
var connect = require('connect');


app.get('/', function(req, res) {
	app.use(express.static(__dirname));
	res.sendFile(__dirname + '/index.html');
});


var storeEachSocket = {};


io.set('authorization', function(handshake, accept){
	var cookie = handshake.headers.cookie
	if(cookie in storeEachSocket)
		accept('User already connected', false);
	else
		accept(null, true);
});

io.on('connection', function(socket){
    var cookie = socket.handshake.headers.cookie;
    storeEachSocket[cookie] = socket;

    socket.on('join', function() {
    	io.emit('join', {'name': cookie});
    });

    socket.on('chat message', function(msg) {
    	io.emit('chat message', {'name': cookie, 'message': msg});
    });
});

io.on('disconnect', function(socket){
   var cookie = socket.handshake.headers.cookie;
   delete storeEachSocket[user_id]
});

server.listen(3000, function() {
	console.log('Listening on *:3000');
});




/*
io.on('connection', function(socket) {
	express_sid = cookie.parse(socket.handshake.headers.cookie)['express.sid'];
	console.log(socket.user);
	if (express_sid == null) {
		//console.log(socket.handshake.headers.cookie);
		return;
	}
	var id = 0;
	if(contains(sockets, express_sid)) {
		id = sockets.indexOf(express_sid);
	} else {
		sockets.push(express_sid);
		id = sockets.indexOf(express_sid);
	}
	console.log('User-' + id + ' connected');
	console.log(sockets);
	console.log("**********");
	//If a user leaves the chat room
	socket.on('disconnect', function() {
		express_sid = cookie.parse(socket.handshake.headers.cookie)['express.sid'];
		var to_remove = sockets.indexOf(express_sid);
		sockets.splice(to_remove, 1);
		console.log('User-' + to_remove + ' disconnected');
	});

	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	})
});
*/




function contains(array, item) {
	for(var i = 0; i < array.length; i ++) {
		if(array[i] === item) {
			return true;
		}
	}
	return false;
}


/*
1. Make each user given a number. user1, user2.
	a. if user1 leaeves, user2 becomes user1, user3 becomes user2, etc
2. handshakeData isn't updated in 'authorization' CHECK
*/