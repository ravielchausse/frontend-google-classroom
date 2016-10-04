'use strict';
$scripts.users.listing = {
	events: function () {
		$('#listing-users').click(function () {
			// var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingUserClassroom',
				data: {}
			});
		});
	}
}

$socket.on('listingUserClassroom', function (data) {
	console.log(data);
	var users = data.users;
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	var listing = $('#div-listing-users');
	var tpl = '';

	for (var i = 0; i < users.length; i++) {
		tpl += `<tr>
		<td>${users[i].name.fullName}</td>
		<td>${users[i].primaryEmail}</td>
		<td><a data-id="${users[i].id}"> X </a></td>
		</tr>`;
	}
	listing.html('<table><tr><th>Name</th><th>E-mail</th><th></th></tr>' + tpl + '</table>').find('a').click(function () {
		console.log({id: $(this).data('id')});
		// $socket.emit('execute', {
		// 	cls: 'googleClassroom',
		// 	action: 'deleteUserClassroomById',
		// 	data: {id: $(this).data('id')}
		// });
	});
	console.log(users);
});