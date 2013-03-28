$(function() {
	$('.buttonstyle').button({icons:{primary: "ui-icon-plusthick"}});
	$('#newmessage').click(function(e) {
		var data = {
			user: $('#username').val(),
			text: $('#message').val()
		};
		$.ajax({ 
			url: '/newmessage',
			type: 'post',
			data: data
		});
		e.preventDefault();
	});
});