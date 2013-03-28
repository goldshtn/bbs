var connect = require('connect');
var express = require('express');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

var Message;
var db = mongoose.createConnection('localhost', 'test');
db.once('open', function() {
	var messageSchema = new mongoose.Schema({
		id: String,
		user: String,
		text: String
	});
	Message = db.model('Message', messageSchema);
	console.log('*** Mongoose message DB initialized');
});

app.get('/', function (req, res) {
	Message.find(function (err, results) {
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
	var newmessage = new Message({
		id: uuid.v1(),
		user: req.body.user,
		text: req.body.text
	});
	newmessage.save(function (err) {
		if (err) {
			res.render('error.jade', {pagetitle: 'Error', error: err});
			return;
		}
		io.sockets.emit('newmessage', newmessage);
		res.redirect('/');
	});
});

var port = process.env.port || 8080;
app.listen(port);