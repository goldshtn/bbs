$(function() {
	var socket = io.connect('http://localhost');
	socket.on('newmessage', function (newmessage) {
	    $('#messagetable tr:last').after(
	    	'<tr><td>' + newmessage.user + '</td>' +
	    	'<td>' + newmessage.text + '</td></tr>'
	    );
	});
});