var connect = require('connect');
var express = require('express');
var uuid = require('node-uuid');
var nstore = require('nstore');
nstore = nstore.extend(require('nstore/query')());

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('transports', ['xhr-polling']);
io.set('log level', 1);

app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

var messages = nstore.new('messages.db', function () {
	console.log('*** Messages database has been initialized');
});

app.get('/', function (req, res) {
	messages.all(function (err, results) {
		if (err) {
			res.render('error.jade', {pagetitle: 'Error', error: err});
			return;
		}
		res.render('messages.jade', {
			pagetitle:'Messages', messages: results
		});
	});
});

app.post('/newmessage', function (req, res) {
	var newmessage = {
		id: uuid.v1(),
		user: req.body.user,
		text: req.body.text
	};
	messages.save(newmessage.id, newmessage, function (err, key) {
		res.redirect('/');
		io.sockets.emit('newmessage', newmessage);
	});
});

var port = process.env.port || 8080;
app.listen(port);