var connect = require('connect');
var express = require('express');
var uuid = require('node-uuid');

//This will only work on Windows, and only after installing the node-sqlserver package
//and pushing the node_modules directory along with the application ...
var sql = require('msnodesql');
var conn_str = '<CONNECTION_STRING>';

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

app.get('/', function (req, res) {
	sql.query(conn_str, 'SELECT [User] as [user], [Text] as [text] FROM bbs.Message', function (err, results) {
		if (err) {
			console.log(JSON.stringify(err));
			res.render('error.jade', {pagetitle: 'Error', error: err});
			return;
		}
		res.render('messages.jade', {
			pagetitle:'Messages', messages: results
		});
	});
});

app.post('/newmessage', function (req, res) {
	//NOTE: This is subject to horrible SQL injection
	var newmessage = {
		user: req.body.user,
		text: req.body.text
	};
	var values = "'" + newmessage.user + "', '" + newmessage.text + "'";
	sql.queryRaw(
		conn_str, 'INSERT INTO bbs.Message ([User], [Text]) VALUES (' + values + ')', function (err) {
		if (err) {
			console.log('Error: ' + err);
			res.render('error.jade', {pagetitle: 'Error', error: err});
			return;
		}
		io.sockets.emit('newmessage', newmessage);
		res.redirect('/');
	});
});

var port = process.env.port || 8080;
app.listen(port);