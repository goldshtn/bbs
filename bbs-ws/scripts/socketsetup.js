$(function() {
	var socket = io.connect('http://bbs.azurewebsites.net');
	socket.on('newmessage', function (newmessage) {
	    $('#messagetable tr:last').after(
	    	'<tr><td>' + newmessage.user + '</td>' +
	    	'<td>' + newmessage.text + '</td></tr>'
	    );
	});
});