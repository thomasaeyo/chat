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

var users = [];
var missing = -1;

io.set('authorization', function(handshake, accept){
	var cookie = handshake.headers.cookie
	if(cookie in users)
		accept('User already connected', false);
	else
		accept(null, true);
});

io.on('connection', function(socket){
    var cookie = socket.handshake.headers.cookie;
    add(users, cookie);
    console.log("************************");
    console.log("users: ")
    console.log(users);
	console.log("length: " + users.length);
    console.log("************************");

    socket.on('join', function() {
    	console.log(users.indexOf(cookie));
    	io.emit('join', {'name': users.indexOf(cookie)+1});
    });

    socket.on('chat message', function(msg) {
    	console.log(users);
    	io.emit('chat message', {'name': users[cookie], 'message': msg});
    });
    
    socket.on('disconnect', function() {
    	console.log("\n");
		var cookie = socket.handshake.headers.cookie;
		missing = remove(users, cookie);
    });
});

server.listen(3000, function() {
	console.log('Listening on *:3000');
});


function remove(array, item) {
	var index = 0;
	var found = false;
	for(var i = 0; i < array.length; i ++) {
		if(array[i] == item) {
			index = i;
			found = true;
		}
	}
	if(true) {
		if(index == array.length) {
			array.splice(index,1);
		} else {
			array[index] = 0;
			missing = index;
		}
	}
	return missing;
}

function add(array, item) {
	if(missing == -1) {
		array.push(item);
	} else {
		array[missing] = item;
	}

}


/*
1. Make each user given a number. user1, user2.
	a. if user1 leaeves, user2 becomes user1, user3 becomes user2, etc
2. handshakeData isn't updated in 'authorization' CHECK
*/