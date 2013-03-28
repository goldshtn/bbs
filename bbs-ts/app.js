var connect = require('connect');
var express = require('express');
var uuid = require('node-uuid');
var azure = require('azure');

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));

var accountName = '<ACCOUNT_NAME>';
var accountKey = '<ACCOUNT_KEY>';
var tableService = azure.createTableService(accountName, accountKey);

tableService.createTableIfNotExists('messages', function (err) {
	if (err) {
		console.log('*** Error initializing table storage');
		process.exit(1);
	} else {
		console.log('*** Table storage initialized');
	}
});

app.get('/', function (req, res) {
	var query = azure.TableQuery.select().from('messages');
	tableService.queryEntities(query, function (err, results) {
		if (err) {
			res.render('error.jade', {pagetitle: 'Error', error: err});
			return;
		}
		for (var i = 0; i < results.length; ++i)
			results[i].id = results[i].RowKey;
		res.render('messages.jade', {
			pagetitle:'Messages', messages: results
		});
	});
});

app.post('/newmessage', function (req, res) {
	var newmessage = {
		PartitionKey: 'partition',
		RowKey: uuid.v1(),
		user: req.body.user,
		text: req.body.text
	};
	tableService.insertEntity('messages', newmessage, function (err) {
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